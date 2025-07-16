import httpx
import asyncio
from typing import List, Optional, Dict, Any
from datetime import datetime, date
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


class SkyscannerAPI:
    def __init__(self):
        self.base_url = "https://partners.api.skyscanner.net"
        self.api_key = settings.skyscanner_api_key
        self.headers = {"accept": "application/json", "x-api-key": self.api_key}

    async def search_flights(self, search_request: FlightSearchRequest) -> List[Flight]:
        """Search for flights using Skyscanner API"""
        try:
            # Create search session
            session_token = await self._create_search_session(search_request)
            if not session_token:
                return []

            # Poll for results
            flights = await self._poll_search_results(session_token, search_request)
            return flights

        except Exception as e:
            logger.error(f"Skyscanner API error: {e}")
            return []

    async def _create_search_session(
        self, search_request: FlightSearchRequest
    ) -> Optional[str]:
        async with httpx.AsyncClient(timeout=30.0) as client:
            payload = self._build_search_payload(search_request)

            response = await client.post(
                f"{self.base_url}/apiservices/v3/flights/live/search/create",
                json=payload,
                headers=self.headers,
            )

            if response.status_code == 201:
                return response.headers.get("location", "").split("/")[-1]
            return None

    async def _poll_search_results(
        self, session_token: str, search_request: FlightSearchRequest
    ) -> List[Flight]:
        async with httpx.AsyncClient(timeout=30.0) as client:
            for _ in range(10):  # Poll up to 10 times
                response = await client.get(
                    f"{self.base_url}/apiservices/v3/flights/live/search/poll/{session_token}",
                    headers=self.headers,
                )

                if response.status_code == 200:
                    data = response.json()
                    if data.get("status") == "RESULT_STATUS_COMPLETE":
                        return self._parse_flights(data, search_request)

                await asyncio.sleep(1)  # Wait 1 second before next poll

        return []

    def _build_search_payload(
        self, search_request: FlightSearchRequest
    ) -> Dict[str, Any]:
        payload = {
            "query": {
                "market": "US",
                "locale": "en-US",
                "currency": "USD",
                "queryLegs": [
                    {
                        "originPlaceId": {"iata": search_request.origin},
                        "destinationPlaceId": {"iata": search_request.destination},
                        "date": {
                            "year": search_request.departure_date.year,
                            "month": search_request.departure_date.month,
                            "day": search_request.departure_date.day,
                        },
                    }
                ],
                "adults": search_request.adults,
                "children": search_request.children,
                "infants": search_request.infants,
                "cabinClass": search_request.cabin_class.value.upper(),
                "includedCarriers": [],
                "excludedCarriers": [],
                "includedAgents": [],
                "excludedAgents": [],
            }
        }

        if search_request.return_date:
            payload["query"]["queryLegs"].append(
                {
                    "originPlaceId": {"iata": search_request.destination},
                    "destinationPlaceId": {"iata": search_request.origin},
                    "date": {
                        "year": search_request.return_date.year,
                        "month": search_request.return_date.month,
                        "day": search_request.return_date.day,
                    },
                }
            )

        return payload

    def _parse_flights(
        self, data: Dict[str, Any], search_request: FlightSearchRequest
    ) -> List[Flight]:
        flights = []
        itineraries = data.get("content", {}).get("results", {}).get("itineraries", {})

        for itinerary_id, itinerary in itineraries.items():
            try:
                flight = self._parse_single_itinerary(itinerary, data, search_request)
                if flight:
                    flights.append(flight)
            except Exception as e:
                logger.warning(f"Failed to parse itinerary: {e}")
                continue

        return flights

    def _parse_single_itinerary(
        self,
        itinerary: Dict[str, Any],
        full_data: Dict[str, Any],
        search_request: FlightSearchRequest,
    ) -> Optional[Flight]:
        # This is a simplified parser - the actual Skyscanner response is complex
        pricing = itinerary.get("pricingOptions", [{}])[0]
        price = pricing.get("price", {}).get("amount", 0) / 1000  # Convert from cents

        # Parse legs and segments (simplified)
        segments = []
        total_duration = 0
        stops = 0

        for leg in itinerary.get("legs", []):
            # Simplified segment parsing
            segment = FlightSegment(
                origin=Airport(
                    code=search_request.origin, name="", city="", country=""
                ),
                destination=Airport(
                    code=search_request.destination, name="", city="", country=""
                ),
                departure_time=datetime.now(),
                arrival_time=datetime.now(),
                duration_minutes=leg.get("duration", 0),
                flight_number="",
                airline=Airline(code="", name=""),
                cabin_class=search_request.cabin_class,
                booking_class="",
            )
            segments.append(segment)
            total_duration += segment.duration_minutes
            stops += leg.get("stopCount", 0)

        return Flight(
            id=itinerary.get("id", ""),
            segments=segments,
            total_duration_minutes=total_duration,
            stops=stops,
            price=price,
            currency="USD",
            deep_link=pricing.get("url", ""),
            provider="Skyscanner",
        )
