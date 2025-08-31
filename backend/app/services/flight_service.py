import asyncio
import time
import uuid
from typing import List, Set
from app.models.flights import FlightSearchRequest, FlightSearchResponse, Flight
from app.integrations import KiwiAPI, SkyscannerAPI, AviasalesAPI
from app.integrations.amadeus_api import AmadeusAPI
from app.integrations.mock_flight_api import MockFlightAPI
from app.integrations.serpapi_flights import SerpAPIFlights
from app.integrations.travelpayouts_api import TravelpayoutsAPI
from app.config import settings
from app.services.cache_service import CacheService
from app.database import supabase
import logging

logger = logging.getLogger(__name__)


class FlightService:
    def __init__(self):
        self.kiwi_api = KiwiAPI()
        self.skyscanner_api = SkyscannerAPI()
        self.aviasales_api = AviasalesAPI()
        self.amadeus_api = AmadeusAPI()
        self.serpapi_flights = SerpAPIFlights()
        self.travelpayouts_api = TravelpayoutsAPI()
        self.mock_api = MockFlightAPI()
        self.cache_service = CacheService()

    async def search_flights(
        self, search_request: FlightSearchRequest
    ) -> FlightSearchResponse:
        """Search for flights across multiple providers with caching"""
        start_time = time.time()
        search_id = str(uuid.uuid4())

        # Normalize airport codes to uppercase for case-insensitive handling
        search_request.origin = search_request.origin.upper()
        search_request.destination = search_request.destination.upper()

        # Check cache first
        cached_response = await self.cache_service.get_flight_results(search_request)
        if cached_response:
            cached_response.cache_hit = True
            cached_response.search_time_ms = int((time.time() - start_time) * 1000)
            logger.info(
                f"Flight search cache hit for {search_request.origin}-{search_request.destination}"
            )

            # Log search to database
            await self._log_search(search_request, cached_response, True)
            return cached_response

        # Search across providers concurrently
        providers_used = []
        all_flights = []

        try:
            # Only use SerpAPI for clean, real flight data
            tasks = []
            providers_used = []

            # SerpAPI Google Flights (primary source)
            if settings.serpapi_key:
                tasks.append(self._search_serpapi(search_request))
                providers_used.append("Google Flights")
            else:
                logger.warning(
                    "SerpAPI key not configured, no flight results available"
                )
                # Return empty results if no SerpAPI key
                return FlightSearchResponse(
                    flights=[],
                    search_id=search_id,
                    total_results=0,
                    search_params=search_request,
                    providers=["No API configured"],
                    cache_hit=False,
                    search_time_ms=int((time.time() - start_time) * 1000),
                )

            # Execute SerpAPI search with timeout
            if tasks:
                try:
                    results = await asyncio.wait_for(
                        asyncio.gather(*tasks, return_exceptions=True),
                        timeout=15.0,  # 15 second timeout for SerpAPI
                    )
                except asyncio.TimeoutError:
                    logger.warning("SerpAPI search timed out after 15s")
                    return FlightSearchResponse(
                        flights=[],
                        search_id=search_id,
                        total_results=0,
                        search_params=search_request,
                        providers=["Search timeout"],
                        cache_hit=False,
                        search_time_ms=int((time.time() - start_time) * 1000),
                    )

                # Collect results from SerpAPI
                for i, result in enumerate(results):
                    if isinstance(result, list):
                        all_flights.extend(result)
                        logger.info(f"SerpAPI returned {len(result)} flights")
                    else:
                        logger.error(f"SerpAPI search failed: {result}")
                        return FlightSearchResponse(
                            flights=[],
                            search_id=search_id,
                            total_results=0,
                            search_params=search_request,
                            providers=["Search failed"],
                            cache_hit=False,
                            search_time_ms=int((time.time() - start_time) * 1000),
                        )

            # Remove duplicates and sort by price
            unique_flights = self._deduplicate_flights(all_flights)
            sorted_flights = sorted(unique_flights, key=lambda x: x.price)

            # Apply filters
            filtered_flights = self._apply_filters(sorted_flights, search_request)

            # Create response
            response = FlightSearchResponse(
                flights=filtered_flights[:50],  # Limit to top 50 results
                search_id=search_id,
                total_results=len(filtered_flights),
                search_params=search_request,
                providers=providers_used,
                cache_hit=False,
                search_time_ms=int((time.time() - start_time) * 1000),
            )

            # Cache results for 5 minutes (search results change frequently)
            await self.cache_service.cache_flight_results(
                search_request, response, ttl=300
            )

            # Log search to database
            await self._log_search(search_request, response, False)

            logger.info(
                f"Flight search completed: {len(filtered_flights)} results in {response.search_time_ms}ms"
            )
            return response

        except Exception as e:
            logger.error(f"Flight search error: {e}")
            # Return empty response on error
            return FlightSearchResponse(
                flights=[],
                search_id=search_id,
                total_results=0,
                search_params=search_request,
                providers=providers_used,
                cache_hit=False,
                search_time_ms=int((time.time() - start_time) * 1000),
            )

    async def _search_kiwi(self, search_request: FlightSearchRequest) -> List[Flight]:
        """Search flights using Kiwi API"""
        try:
            return await self.kiwi_api.search_flights(search_request)
        except Exception as e:
            logger.error(f"Kiwi API search failed: {e}")
            return []

    async def _search_skyscanner(
        self, search_request: FlightSearchRequest
    ) -> List[Flight]:
        """Search flights using Skyscanner API"""
        try:
            return await self.skyscanner_api.search_flights(search_request)
        except Exception as e:
            logger.error(f"Skyscanner API search failed: {e}")
            return []

    async def _search_aviasales(
        self, search_request: FlightSearchRequest
    ) -> List[Flight]:
        """Search flights using Aviasales API"""
        try:
            return await self.aviasales_api.search_flights(search_request)
        except Exception as e:
            logger.error(f"Aviasales API search failed: {e}")
            return []

    async def _search_amadeus(
        self, search_request: FlightSearchRequest
    ) -> List[Flight]:
        """Search flights using Amadeus API"""
        try:
            return await self.amadeus_api.search_flights(search_request)
        except Exception as e:
            logger.error(f"Amadeus API search failed: {e}")
            return []

    async def _search_serpapi(
        self, search_request: FlightSearchRequest
    ) -> List[Flight]:
        """Search flights using SerpAPI Google Flights"""
        try:
            return await self.serpapi_flights.search_flights(search_request)
        except Exception as e:
            logger.error(f"SerpAPI Google Flights search failed: {e}")
            return []

    async def _search_travelpayouts(
        self, search_request: FlightSearchRequest
    ) -> List[Flight]:
        """Search flights using Travelpayouts API"""
        try:
            return await self.travelpayouts_api.search_flights(search_request)
        except Exception as e:
            logger.error(f"Travelpayouts API search failed: {e}")
            return []

    async def _search_mock(self, search_request: FlightSearchRequest) -> List[Flight]:
        """Search flights using Mock API (fallback)"""
        try:
            return await self.mock_api.search_flights(search_request)
        except Exception as e:
            logger.error(f"Mock API search failed: {e}")
            return []

    def _deduplicate_flights(self, flights: List[Flight]) -> List[Flight]:
        """Remove duplicate flights based on route and time"""
        seen_flights = set()
        unique_flights = []

        for flight in flights:
            # Create a signature for deduplication
            signature = self._create_flight_signature(flight)

            if signature not in seen_flights:
                seen_flights.add(signature)
                unique_flights.append(flight)

        return unique_flights

    def _create_flight_signature(self, flight: Flight) -> str:
        """Create a unique signature for flight deduplication"""
        # Use first and last segment details + departure time
        first_segment = flight.segments[0]
        last_segment = flight.segments[-1]

        return f"{first_segment.origin.code}_{last_segment.destination.code}_{first_segment.departure_time.isoformat()}_{flight.price}"

    def _apply_filters(
        self, flights: List[Flight], search_request: FlightSearchRequest
    ) -> List[Flight]:
        """Apply search filters to flights"""
        filtered_flights = flights

        # Price filter
        if search_request.max_price:
            filtered_flights = [
                f for f in filtered_flights if f.price <= search_request.max_price
            ]

        # Direct flights only filter
        if search_request.direct_flights_only:
            filtered_flights = [f for f in filtered_flights if f.is_direct]

        return filtered_flights

    async def _log_search(
        self,
        search_request: FlightSearchRequest,
        response: FlightSearchResponse,
        cache_hit: bool,
    ):
        """Log search to database for analytics"""
        try:
            search_log = {
                "search_id": response.search_id,
                "search_type": "flights",
                "origin": search_request.origin,
                "destination": search_request.destination,
                "departure_date": search_request.departure_date.isoformat(),
                "return_date": search_request.return_date.isoformat()
                if search_request.return_date
                else None,
                "adults": search_request.adults,
                "children": search_request.children,
                "results_count": response.total_results,
                "cache_hit": cache_hit,
                "search_time_ms": response.search_time_ms,
                "providers": response.providers,
                "created_at": "now()",
            }

            if supabase:
                await supabase.table("search_logs").insert(search_log).execute()
            else:
                logger.info("Database not configured - search logging disabled")

        except Exception as e:
            logger.error(f"Failed to log search: {e}")
