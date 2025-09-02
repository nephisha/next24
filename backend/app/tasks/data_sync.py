from celery import Celery
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..services.destination_service import DestinationService
from ..models.destinations import Destination
import requests
from datetime import datetime, timedelta
import logging

# Configure Celery for Railway + Redis
from ..config.railway import railway_settings
import redis

celery_app = Celery("travel_app")
celery_app.conf.update(
    broker_url=railway_settings.internal_redis_url,
    result_backend=railway_settings.internal_redis_url,
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    # Railway-specific optimizations
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    worker_max_tasks_per_child=1000,
)

# Redis client for cache invalidation
redis_client = redis.from_url(
    railway_settings.internal_redis_url, decode_responses=True
)

logger = logging.getLogger(__name__)


@celery_app.task
def update_flight_prices():
    """Scheduled task to update flight prices"""
    db = SessionLocal()
    try:
        service = DestinationService(db)
        # This would be an async function, but Celery tasks are sync
        # You'd need to adapt this for your async setup
        logger.info("Starting flight price update")

        destinations = db.query(Destination).filter(Destination.is_active == True).all()
        updated_count = 0

        for dest in destinations:
            try:
                # Integrate with real flight APIs
                new_price = fetch_flight_price_sync(dest.city_code)
                if new_price and abs(new_price - (dest.avg_flight_price or 0)) > 10:
                    dest.avg_flight_price = new_price
                    dest.updated_at = datetime.utcnow()
                    updated_count += 1
            except Exception as e:
                logger.error(f"Error updating price for {dest.name}: {e}")

        db.commit()
        logger.info(f"Updated prices for {updated_count} destinations")

    except Exception as e:
        logger.error(f"Flight price update failed: {e}")
        db.rollback()
    finally:
        db.close()


@celery_app.task
def sync_destination_images():
    """Sync destination images from external sources"""
    db = SessionLocal()
    try:
        destinations = (
            db.query(Destination)
            .filter(Destination.hero_image.is_(None))
            .limit(10)
            .all()
        )

        for dest in destinations:
            try:
                # Use Unsplash API or similar for high-quality images
                image_url = fetch_destination_image(dest.name, dest.country)
                if image_url:
                    dest.hero_image = image_url
                    dest.updated_at = datetime.utcnow()
            except Exception as e:
                logger.error(f"Error fetching image for {dest.name}: {e}")

        db.commit()

    except Exception as e:
        logger.error(f"Image sync failed: {e}")
        db.rollback()
    finally:
        db.close()


@celery_app.task
def update_destination_ratings():
    """Update destination ratings from review APIs"""
    db = SessionLocal()
    try:
        destinations = db.query(Destination).filter(Destination.is_active == True).all()

        for dest in destinations:
            try:
                # Integrate with TripAdvisor, Google Places, etc.
                rating_data = fetch_destination_rating(dest.name, dest.country)
                if rating_data:
                    dest.rating = rating_data["rating"]
                    dest.total_reviews = rating_data["review_count"]
                    dest.updated_at = datetime.utcnow()
            except Exception as e:
                logger.error(f"Error updating rating for {dest.name}: {e}")

        db.commit()

    except Exception as e:
        logger.error(f"Rating update failed: {e}")
        db.rollback()
    finally:
        db.close()


def fetch_flight_price_sync(city_code: str) -> float:
    """Fetch current flight price from external API (sync version)"""
    try:
        # Example integration with Amadeus, Skyscanner, etc.
        # This is a mock implementation
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
        variation = random.uniform(0.85, 1.15)  # ±15% variation
        return round(base_price * variation, 2)
    except Exception as e:
        logger.error(f"Error fetching flight price for {city_code}: {e}")
        return None


def fetch_destination_image(city: str, country: str) -> str:
    """Fetch high-quality destination image from Unsplash"""
    try:
        # Unsplash API integration
        query = f"{city} {country} travel"
        # This would use your Unsplash API key
        # For now, return a placeholder
        return f"https://images.unsplash.com/photo-1500000000000-000000000000?w=800&h=600&fit=crop&q=80"
    except Exception as e:
        logger.error(f"Error fetching image for {city}, {country}: {e}")
        return None


def fetch_destination_rating(city: str, country: str) -> dict:
    """Fetch destination rating from review APIs"""
    try:
        # Integration with Google Places, TripAdvisor, etc.
        # Mock implementation
        import random

        return {
            "rating": round(random.uniform(4.0, 4.9), 1),
            "review_count": random.randint(100, 5000),
        }
    except Exception as e:
        logger.error(f"Error fetching rating for {city}, {country}: {e}")
        return None


# Schedule tasks
celery_app.conf.beat_schedule = {
    "update-flight-prices": {
        "task": "app.tasks.data_sync.update_flight_prices",
        "schedule": 3600.0,  # Every hour
    },
    "sync-destination-images": {
        "task": "app.tasks.data_sync.sync_destination_images",
        "schedule": 86400.0,  # Daily
    },
    "update-destination-ratings": {
        "task": "app.tasks.data_sync.update_destination_ratings",
        "schedule": 43200.0,  # Every 12 hours
    },
}
