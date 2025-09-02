from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, func
from ..models.destinations import Destination, DestinationPricing, TravelGuide
from ..database import get_db
from ..config.railway import railway_settings
import requests
import redis
import json
from datetime import datetime, timedelta
import hashlib

# Redis client for Railway
redis_client = redis.from_url(
    railway_settings.internal_redis_url,
    decode_responses=True,
    socket_connect_timeout=5,
    socket_timeout=5,
    retry_on_timeout=True,
    health_check_interval=30,
)


class DestinationService:
    def __init__(self, db: Session):
        self.db = db
        self.cache_ttl = {
            "featured": 3600,  # 1 hour
            "destinations": 1800,  # 30 minutes
            "detail": 7200,  # 2 hours
            "prices": 900,  # 15 minutes
        }

    def _get_cache_key(self, prefix: str, **kwargs) -> str:
        """Generate cache key with parameters"""
        key_parts = [prefix]
        for k, v in sorted(kwargs.items()):
            key_parts.append(f"{k}:{v}")
        return ":".join(key_parts)

    def _get_cached_data(self, cache_key: str) -> Optional[Dict[str, Any]]:
        """Get data from Redis cache"""
        try:
            cached = redis_client.get(cache_key)
            return json.loads(cached) if cached else None
        except Exception as e:
            print(f"Cache get error: {e}")
            return None

    def _set_cached_data(self, cache_key: str, data: Dict[str, Any], ttl: int):
        """Set data in Redis cache"""
        try:
            redis_client.setex(cache_key, ttl, json.dumps(data, default=str))
        except Exception as e:
            print(f"Cache set error: {e}")

    async def get_featured_destinations(self, limit: int = 6) -> List[Dict[str, Any]]:
        """Get featured destinations for homepage with Redis caching"""
        cache_key = self._get_cache_key("featured_destinations", limit=limit)

        # Try cache first
        cached_data = self._get_cached_data(cache_key)
        if cached_data:
            return cached_data

        # Query database
        destinations = (
            self.db.query(Destination)
            .filter(Destination.is_active == True, Destination.is_featured == True)
            .order_by(desc(Destination.popularity_score))
            .limit(limit)
            .all()
        )

        result = [self._format_destination(dest) for dest in destinations]

        # Cache the result
        self._set_cached_data(cache_key, result, self.cache_ttl["featured"])

        return result

    async def get_all_destinations(
        self, page: int = 1, limit: int = 20, sort_by: str = "popularity"
    ) -> Dict[str, Any]:
        """Get paginated destinations with sorting"""
        offset = (page - 1) * limit

        query = self.db.query(Destination).filter(Destination.is_active == True)

        # Apply sorting
        if sort_by == "popularity":
            query = query.order_by(desc(Destination.popularity_score))
        elif sort_by == "rating":
            query = query.order_by(desc(Destination.rating))
        elif sort_by == "price_low":
            query = query.order_by(asc(Destination.avg_flight_price))
        elif sort_by == "price_high":
            query = query.order_by(desc(Destination.avg_flight_price))

        total = query.count()
        destinations = query.offset(offset).limit(limit).all()

        return {
            "destinations": [self._format_destination(dest) for dest in destinations],
            "total": total,
            "page": page,
            "pages": (total + limit - 1) // limit,
        }

    async def get_destination_by_slug(
        self, country: str, city: str
    ) -> Optional[Dict[str, Any]]:
        """Get destination by country and city slug"""
        slug = f"{country}-{city}"
        destination = (
            self.db.query(Destination)
            .filter(Destination.slug == slug, Destination.is_active == True)
            .first()
        )

        if not destination:
            return None

        # Get pricing data
        pricing = (
            self.db.query(DestinationPricing)
            .filter(DestinationPricing.destination_id == destination.id)
            .first()
        )

        result = self._format_destination(destination)
        if pricing:
            result.update(
                {
                    "avgHotelPrice": pricing.avg_hotel_price,
                    "avgMealPrice": pricing.avg_meal_price,
                    "avgTransportPrice": pricing.avg_transport_price,
                    "budgetRange": pricing.budget_range,
                }
            )

        return result

    async def update_flight_prices(self):
        """Update flight prices from external APIs"""
        destinations = (
            self.db.query(Destination).filter(Destination.is_active == True).all()
        )

        for dest in destinations:
            try:
                # Call flight API to get current prices
                new_price = await self._fetch_current_flight_price(dest.city_code)
                if new_price:
                    dest.avg_flight_price = new_price
                    dest.updated_at = datetime.utcnow()
            except Exception as e:
                print(f"Error updating price for {dest.name}: {e}")

        self.db.commit()

    async def _fetch_current_flight_price(self, city_code: str) -> Optional[float]:
        """Fetch current flight price from external API"""
        # This would integrate with your flight API
        # For now, return a mock price with some variation
        import random

        base_prices = {
            "paris": 650,
            "london": 550,
            "rome": 580,
            "barcelona": 520,
            "berlin": 480,
            "amsterdam": 520,
            "athens": 590,
            "istanbul": 650,
        }
        base_price = base_prices.get(city_code.lower(), 600)
        # Add 10% random variation
        variation = random.uniform(0.9, 1.1)
        return round(base_price * variation, 2)

    def _format_destination(self, dest: Destination) -> Dict[str, Any]:
        """Format destination for API response"""
        return {
            "id": str(dest.id),
            "name": dest.name,
            "country": dest.country,
            "cityCode": dest.city_code,
            "description": dest.description,
            "image": dest.hero_image,
            "galleryImages": dest.gallery_images or [],
            "highlights": dest.highlights or [],
            "bestTime": dest.best_time_to_visit,
            "avgFlightPrice": f"${dest.avg_flight_price:.0f}"
            if dest.avg_flight_price
            else "N/A",
            "rating": dest.rating,
            "totalReviews": dest.total_reviews,
            "tags": dest.tags or [],
            "slug": dest.slug,
            "currency": dest.currency or "USD",
        }


class GuideService:
    def __init__(self, db: Session):
        self.db = db

    async def get_featured_guides(self, limit: int = 6) -> List[Dict[str, Any]]:
        """Get featured travel guides"""
        guides = (
            self.db.query(TravelGuide)
            .filter(TravelGuide.is_published == True, TravelGuide.is_featured == True)
            .order_by(desc(TravelGuide.published_at))
            .limit(limit)
            .all()
        )

        return [self._format_guide(guide) for guide in guides]

    async def get_guides_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Get guides by category"""
        guides = (
            self.db.query(TravelGuide)
            .filter(TravelGuide.category == category, TravelGuide.is_published == True)
            .order_by(desc(TravelGuide.published_at))
            .all()
        )

        return [self._format_guide(guide) for guide in guides]

    def _format_guide(self, guide: TravelGuide) -> Dict[str, Any]:
        """Format guide for API response"""
        return {
            "id": str(guide.id),
            "title": guide.title,
            "category": guide.category,
            "excerpt": guide.excerpt,
            "content": guide.content,
            "image": guide.featured_image,
            "author": guide.author,
            "readTime": f"{guide.read_time} min read"
            if guide.read_time
            else "5 min read",
            "tags": guide.tags or [],
            "slug": guide.slug,
            "publishedAt": guide.published_at.isoformat()
            if guide.published_at
            else None,
        }
