from typing import Any, Optional, List
from app.cache import cache
from app.models.flights import FlightSearchRequest, FlightSearchResponse
from app.models.hotels import HotelSearchRequest, HotelSearchResponse
import hashlib
import json
import logging

logger = logging.getLogger(__name__)


class CacheService:
    @staticmethod
    def _generate_cache_key(prefix: str, search_request: Any) -> str:
        """Generate a consistent cache key from search parameters"""
        # Convert Pydantic model to dict and sort for consistency
        request_dict = search_request.model_dump()
        request_str = json.dumps(request_dict, sort_keys=True, default=str)
        hash_object = hashlib.md5(request_str.encode())
        return f"{prefix}:{hash_object.hexdigest()}"

    @staticmethod
    async def get_flight_results(
        search_request: FlightSearchRequest,
    ) -> Optional[FlightSearchResponse]:
        """Get cached flight search results"""
        cache_key = CacheService._generate_cache_key("flights", search_request)
        cached_data = await cache.get(cache_key)

        if cached_data:
            try:
                return FlightSearchResponse(**cached_data)
            except Exception as e:
                logger.error(f"Failed to deserialize cached flight data: {e}")
                await cache.delete(cache_key)

        return None

    @staticmethod
    async def cache_flight_results(
        search_request: FlightSearchRequest,
        response: FlightSearchResponse,
        ttl: int = None,
    ) -> bool:
        """Cache flight search results"""
        cache_key = CacheService._generate_cache_key("flights", search_request)
        response_dict = response.model_dump()

        return await cache.set(cache_key, response_dict, ttl)

    @staticmethod
    async def get_hotel_results(
        search_request: HotelSearchRequest,
    ) -> Optional[HotelSearchResponse]:
        """Get cached hotel search results"""
        cache_key = CacheService._generate_cache_key("hotels", search_request)
        cached_data = await cache.get(cache_key)

        if cached_data:
            try:
                return HotelSearchResponse(**cached_data)
            except Exception as e:
                logger.error(f"Failed to deserialize cached hotel data: {e}")
                await cache.delete(cache_key)

        return None

    @staticmethod
    async def cache_hotel_results(
        search_request: HotelSearchRequest,
        response: HotelSearchResponse,
        ttl: int = None,
    ) -> bool:
        """Cache hotel search results"""
        cache_key = CacheService._generate_cache_key("hotels", search_request)
        response_dict = response.model_dump()

        return await cache.set(cache_key, response_dict, ttl)
