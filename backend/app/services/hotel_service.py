import asyncio
import time
import uuid
from typing import List
from app.models.hotels import HotelSearchRequest, HotelSearchResponse, Hotel
from app.integrations.serpapi_hotels import (
    search_hotels_serpapi,
    HotelSearchParams as SerpHotelSearchParams,
)
from app.services.cache_service import CacheService
from app.database import supabase
import logging

logger = logging.getLogger(__name__)


class HotelService:
    def __init__(self):
        self.cache_service = CacheService()

    async def search_hotels(
        self, search_request: HotelSearchRequest
    ) -> HotelSearchResponse:
        """Search for hotels with caching"""
        start_time = time.time()
        search_id = str(uuid.uuid4())

        # Check cache first
        cached_response = await self.cache_service.get_hotel_results(search_request)
        if cached_response:
            cached_response.cache_hit = True
            cached_response.search_time_ms = int((time.time() - start_time) * 1000)
            logger.info(f"Hotel search cache hit for {search_request.destination}")

            # Log search to database
            await self._log_search(search_request, cached_response, True)
            return cached_response

        # Search hotels
        providers_used = ["Google Hotels"]
        all_hotels = []

        try:
            # Search using SerpAPI Google Hotels
            serpapi_hotels = await self._search_serpapi(search_request)
            all_hotels.extend(serpapi_hotels)

            # Apply filters and sort
            filtered_hotels = self._apply_filters(all_hotels, search_request)
            sorted_hotels = sorted(filtered_hotels, key=lambda x: x.price_per_night)

            # Create response
            response = HotelSearchResponse(
                hotels=sorted_hotels[:50],  # Limit to top 50 results
                search_id=search_id,
                total_results=len(filtered_hotels),
                search_params=search_request,
                providers=providers_used,
                cache_hit=False,
                search_time_ms=int((time.time() - start_time) * 1000),
            )

            # Cache results for 10 minutes (hotel prices change less frequently)
            await self.cache_service.cache_hotel_results(
                search_request, response, ttl=600
            )

            # Log search to database
            await self._log_search(search_request, response, False)

            logger.info(
                f"Hotel search completed: {len(filtered_hotels)} results in {response.search_time_ms}ms"
            )
            return response

        except Exception as e:
            logger.error(f"Hotel search error: {e}")
            # Return empty response on error
            return HotelSearchResponse(
                hotels=[],
                search_id=search_id,
                total_results=0,
                search_params=search_request,
                providers=providers_used,
                cache_hit=False,
                search_time_ms=int((time.time() - start_time) * 1000),
            )

    async def _search_serpapi(self, search_request: HotelSearchRequest) -> List[Hotel]:
        """Search hotels using SerpAPI Google Hotels"""
        try:
            # Convert to SerpAPI format
            serpapi_params = SerpHotelSearchParams(
                destination=search_request.destination,
                latitude=search_request.latitude,
                longitude=search_request.longitude,
                check_in=search_request.check_in.isoformat(),
                check_out=search_request.check_out.isoformat(),
                adults=search_request.adults,
                children=search_request.children,
                rooms=search_request.rooms,
            )

            # Search using SerpAPI (run in thread pool since it's synchronous)
            loop = asyncio.get_event_loop()
            serpapi_response = await loop.run_in_executor(
                None, search_hotels_serpapi, serpapi_params
            )

            # Convert SerpAPI hotels to our Hotel model
            hotels = []
            for serpapi_hotel in serpapi_response.hotels:
                hotel = Hotel(
                    id=serpapi_hotel.id,
                    name=serpapi_hotel.name,
                    location=serpapi_hotel.location,
                    rating=serpapi_hotel.rating,
                    review_score=serpapi_hotel.review_score,
                    review_count=serpapi_hotel.review_count,
                    price_per_night=serpapi_hotel.price_per_night,
                    total_price=serpapi_hotel.total_price,
                    currency=serpapi_hotel.currency,
                    room_type=serpapi_hotel.room_type,
                    amenities=serpapi_hotel.amenities,
                    images=serpapi_hotel.images,
                    deep_link=serpapi_hotel.deep_link,
                    provider=serpapi_hotel.provider,
                    cancellation_policy=serpapi_hotel.cancellation_policy,
                    breakfast_included=serpapi_hotel.breakfast_included,
                    last_updated=serpapi_hotel.last_updated,
                )
                hotels.append(hotel)

            return hotels

        except Exception as e:
            logger.error(f"SerpAPI search failed: {e}")
            return []

    def _apply_filters(
        self, hotels: List[Hotel], search_request: HotelSearchRequest
    ) -> List[Hotel]:
        """Apply search filters to hotels"""
        filtered_hotels = hotels

        # Filter out hotels with invalid prices (0 or negative)
        filtered_hotels = [
            h
            for h in filtered_hotels
            if h.price_per_night > 0 and h.currency and h.currency.strip() != ""
        ]

        return filtered_hotels

    async def _log_search(
        self,
        search_request: HotelSearchRequest,
        response: HotelSearchResponse,
        cache_hit: bool,
    ):
        """Log search to database for analytics"""
        try:
            search_log = {
                "search_id": response.search_id,
                "search_type": "hotels",
                "destination": search_request.destination,
                "check_in": search_request.check_in.isoformat(),
                "check_out": search_request.check_out.isoformat(),
                "adults": search_request.adults,
                "children": search_request.children,
                "rooms": search_request.rooms,
                "results_count": response.total_results,
                "cache_hit": cache_hit,
                "search_time_ms": response.search_time_ms,
                "providers": response.providers,
                "created_at": "now()",
            }

            await supabase.table("search_logs").insert(search_log).execute()

        except Exception as e:
            logger.error(f"Failed to log search: {e}")
