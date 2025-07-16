import asyncio
import time
import uuid
from typing import List
from app.models.hotels import HotelSearchRequest, HotelSearchResponse, Hotel
from app.integrations import BookingAPI
from app.services.cache_service import CacheService
from app.database import supabase
import logging

logger = logging.getLogger(__name__)


class HotelService:
    def __init__(self):
        self.booking_api = BookingAPI()
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
        providers_used = ["Booking.com"]
        all_hotels = []

        try:
            # Search using Booking.com API
            booking_hotels = await self._search_booking(search_request)
            all_hotels.extend(booking_hotels)

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

    async def _search_booking(self, search_request: HotelSearchRequest) -> List[Hotel]:
        """Search hotels using Booking.com API"""
        try:
            return await self.booking_api.search_hotels(search_request)
        except Exception as e:
            logger.error(f"Booking API search failed: {e}")
            return []

    def _apply_filters(
        self, hotels: List[Hotel], search_request: HotelSearchRequest
    ) -> List[Hotel]:
        """Apply search filters to hotels"""
        filtered_hotels = hotels

        # Price filter
        if search_request.max_price:
            filtered_hotels = [
                h
                for h in filtered_hotels
                if h.price_per_night <= search_request.max_price
            ]

        # Rating filter
        if search_request.min_rating:
            filtered_hotels = [
                h
                for h in filtered_hotels
                if h.rating and h.rating >= search_request.min_rating
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
