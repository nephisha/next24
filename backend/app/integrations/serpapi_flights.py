import httpx
import asyncio
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.config import settings
from app.models.flights import (
    Flight,
    FlightSegment,
    Airport,
    Airline,
    CabinClass,
    FlightSearchRequest,
)
import logging

logger = logging.getLogger(__name__)


class SerpAPIFlights:
    """
    SerpAPI Google Flights integration
    Scrapes Google Flights results through SerpAPI

    Sign up at: https://serpapi.com/
    Pricing: $50/month for 5,000 searches
    """

    def __init__(self):
        self.base_url = "https://serpapi.com/search"
        self.api_key = getattr(settings, "serpapi_key", None)

    async def search_flights(self, search_request: FlightSearchRequest) -> List[Flight]:
        """Search flights using SerpAPI Google Flights"""
        if not self.api_key:
            logger.warning("SerpAPI key not configured")
            return []

        try:
            # Use shorter timeout to allow for response processing
            async with httpx.AsyncClient(timeout=20.0) as client:
                params = self._build_search_params(search_request)
                logger.info(f"SerpAPI request params: {params}")

                response = await client.get(self.base_url, params=params)
                logger.info(f"SerpAPI response status: {response.status_code}")

                if response.status_code != 200:
                    logger.error(
                        f"SerpAPI error {response.status_code}: {response.text}"
                    )
                    return []

                data = response.json()
                logger.info(f"SerpAPI response keys: {list(data.keys())}")

                if "error" in data:
                    logger.error(f"SerpAPI returned error: {data['error']}")
                    return []

                return self._parse_flights(data, search_request)

        except httpx.TimeoutException as e:
            logger.warning(f"SerpAPI timeout after 20s: {e}")
            return []
        except httpx.HTTPStatusError as e:
            logger.error(
                f"SerpAPI HTTP error {e.response.status_code}: {e.response.text}"
            )
            return []
        except httpx.RequestError as e:
            logger.error(f"SerpAPI request error: {e}")
            return []
        except Exception as e:
            logger.error(f"SerpAPI error: {e}")
            return []

    def _build_search_params(
        self, search_request: FlightSearchRequest
    ) -> Dict[str, Any]:
        """Build SerpAPI parameters for Google Flights search"""
        # Map common city codes to specific airport codes for SerpAPI
        airport_mapping = {
            "NYC": "JFK",  # Use JFK for New York
            "LAX": "LAX",  # LAX is fine
            "CHI": "ORD",  # Use ORD for Chicago
            "MIA": "MIA",  # MIA is fine
            "SFO": "SFO",  # SFO is fine
            "LAS": "LAS",  # LAS is fine
            "SEA": "SEA",  # SEA is fine
            "DEN": "DEN",  # DEN is fine
        }

        origin = airport_mapping.get(search_request.origin, search_request.origin)
        destination = airport_mapping.get(
            search_request.destination, search_request.destination
        )

        params = {
            "engine": "google_flights",
            "departure_id": origin,
            "arrival_id": destination,
            "outbound_date": search_request.departure_date.strftime("%Y-%m-%d"),
            "adults": str(search_request.adults),  # Convert to string
            "currency": "USD",
            "hl": "en",
            "api_key": self.api_key,
        }

        # Only add children and infants if > 0
        if search_request.children > 0:
            params["children"] = str(search_request.children)
        if search_request.infants > 0:
            params["infants"] = str(search_request.infants)

        if search_request.return_date:
            params["return_date"] = search_request.return_date.strftime("%Y-%m-%d")
            params["type"] = "1"  # Round trip
        else:
            params["type"] = "2"  # One way

        if search_request.direct_flights_only:
            params["stops"] = "0"

        # Add travel class
        params["travel_class"] = self._map_cabin_class(search_request.cabin_class)

        return params

    def _map_cabin_class(self, cabin_class: CabinClass) -> str:
        """Map internal cabin class to Google Flights format"""
        mapping = {
            CabinClass.ECONOMY: "1",
            CabinClass.PREMIUM_ECONOMY: "2",
            CabinClass.BUSINESS: "3",
            CabinClass.FIRST: "4",
        }
        return mapping.get(cabin_class, "1")

    def _parse_flights(
        self, data: Dict[str, Any], search_request: FlightSearchRequest
    ) -> List[Flight]:
        """Parse SerpAPI Google Flights response"""
        flights = []

        # SerpAPI returns flights in 'best_flights' and 'other_flights'
        all_flights = []
        all_flights.extend(data.get("best_flights", []))
        all_flights.extend(data.get("other_flights", []))

        for flight_data in all_flights:
            try:
                flight = self._parse_single_flight(flight_data, search_request)
                if flight:
                    flights.append(flight)
            except Exception as e:
                logger.warning(f"Failed to parse SerpAPI flight: {e}")
                continue

        return flights

    def _parse_single_flight(
        self, flight_data: Dict[str, Any], search_request: FlightSearchRequest
    ) -> Optional[Flight]:
        """Parse a single flight from SerpAPI response"""
        try:
            # Extract basic flight info
            price = flight_data.get("price", 0)
            currency = "USD"

            # Extract total duration
            total_duration = flight_data.get("total_duration", 0)

            # Extract flights (segments)
            flight_segments = flight_data.get("flights", [])
            if not flight_segments:
                return None

            segments = []

            for segment_data in flight_segments:
                segment = self._parse_segment(segment_data, search_request.cabin_class)
                if segment:
                    segments.append(segment)

            if not segments:
                return None

            # Calculate stops
            stops = len(segments) - 1

            # Generate flight ID using first segment's flight number
            first_segment = segments[0]
            flight_id = f"serpapi_{first_segment.flight_number.replace(' ', '_')}_{search_request.departure_date}"

            return Flight(
                id=flight_id,
                segments=segments,
                total_duration_minutes=total_duration,
                stops=stops,
                price=float(price),
                currency=currency,
                deep_link=flight_data.get("booking_token", ""),
                provider="Google Flights",
            )

        except Exception as e:
            logger.warning(f"Error parsing SerpAPI flight: {e}")
            return None

    def _parse_segment(
        self, segment_data: Dict[str, Any], cabin_class: CabinClass
    ) -> Optional[FlightSegment]:
        """Parse a flight segment from SerpAPI data"""
        try:
            # Extract departure info
            departure = segment_data.get("departure_airport", {})
            arrival = segment_data.get("arrival_airport", {})

            # Extract times (SerpAPI format: "2025-08-31 11:30")
            dep_time_str = departure.get("time")
            arr_time_str = arrival.get("time")

            if not dep_time_str or not arr_time_str:
                return None

            # Parse times - SerpAPI uses format "2025-08-31 11:30"
            dep_time = datetime.strptime(dep_time_str, "%Y-%m-%d %H:%M")
            arr_time = datetime.strptime(arr_time_str, "%Y-%m-%d %H:%M")

            # Calculate duration
            duration_minutes = segment_data.get("duration", 0)

            # Extract airline info
            airline_name = segment_data.get("airline", "")

            # Extract flight number
            flight_number = segment_data.get("flight_number", "")

            # Extract airline code from flight number (e.g., "F9 2503" -> "F9")
            airline_code = flight_number.split()[0] if flight_number else ""

            return FlightSegment(
                origin=Airport(
                    code=departure.get("id", ""),
                    name=departure.get("name", ""),
                    city="",  # Not provided in this format
                    country="",
                ),
                destination=Airport(
                    code=arrival.get("id", ""),
                    name=arrival.get("name", ""),
                    city="",  # Not provided in this format
                    country="",
                ),
                departure_time=dep_time,
                arrival_time=arr_time,
                duration_minutes=duration_minutes,
                flight_number=flight_number,
                airline=Airline(code=airline_code, name=airline_name),
                cabin_class=cabin_class,
                booking_class="",
            )

        except Exception as e:
            logger.warning(f"Error parsing SerpAPI segment: {e}")
            return None
