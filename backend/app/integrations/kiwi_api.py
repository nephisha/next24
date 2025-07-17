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


class KiwiAPI:
    def __init__(self):
        self.base_url = "https://api.tequila.kiwi.com"
        self.api_key = settings.kiwi_api_key
        self.headers = {"accept": "application/json", "apikey": self.api_key}

    async def search_flights(self, search_request: FlightSearchRequest) -> List[Flight]:
        """Search for flights using Kiwi.com API"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                params = self._build_search_params(search_request)

                response = await client.get(
                    f"{self.base_url}/v2/search", params=params, headers=self.headers
                )
                response.raise_for_status()
                data = response.json()

                return self._parse_flights(data, search_request)

        except httpx.RequestError as e:
            logger.error(f"Kiwi API request error: {e}")
            return []
        except Exception as e:
            logger.error(f"Kiwi API error: {e}")
            return []

    def _build_search_params(
        self, search_request: FlightSearchRequest
    ) -> Dict[str, Any]:
        params = {
            "fly_from": search_request.origin,
            "fly_to": search_request.destination,
            "date_from": search_request.departure_date.strftime("%d/%m/%Y"),
            "date_to": search_request.departure_date.strftime("%d/%m/%Y"),
            "adults": search_request.adults,
            "children": search_request.children,
            "infants": search_request.infants,
            "selected_cabins": search_request.cabin_class.value,
            "curr": "USD",
            "sort": "price",
            "limit": 50,
            "partner": "picky",
        }

        if search_request.return_date:
            params.update(
                {
                    "return_from": search_request.return_date.strftime("%d/%m/%Y"),
                    "return_to": search_request.return_date.strftime("%d/%m/%Y"),
                }
            )

        if search_request.max_price:
            params["price_to"] = int(search_request.max_price)

        if search_request.direct_flights_only:
            params["max_stopovers"] = 0

        return params

    def _parse_flights(
        self, data: Dict[str, Any], search_request: FlightSearchRequest
    ) -> List[Flight]:
        flights = []

        for flight_data in data.get("data", []):
            try:
                flight = self._parse_single_flight(flight_data, search_request)
                if flight:
                    flights.append(flight)
            except Exception as e:
                logger.warning(f"Failed to parse flight: {e}")
                continue

        return flights

    def _parse_single_flight(
        self, flight_data: Dict[str, Any], search_request: FlightSearchRequest
    ) -> Optional[Flight]:
        route = flight_data.get("route", [])
        if not route:
            return None

        segments = []
        total_duration = 0

        for segment_data in route:
            segment = FlightSegment(
                origin=Airport(
                    code=segment_data["flyFrom"],
                    name=segment_data.get("cityFrom", ""),
                    city=segment_data.get("cityFrom", ""),
                    country="",
                ),
                destination=Airport(
                    code=segment_data["flyTo"],
                    name=segment_data.get("cityTo", ""),
                    city=segment_data.get("cityTo", ""),
                    country="",
                ),
                departure_time=datetime.fromtimestamp(segment_data["dTimeUTC"]),
                arrival_time=datetime.fromtimestamp(segment_data["aTimeUTC"]),
                duration_minutes=segment_data.get("duration", {}).get("total", 0) // 60,
                flight_number=f"{segment_data.get('airline', '')}{segment_data.get('flight_no', '')}",
                airline=Airline(
                    code=segment_data.get("airline", ""),
                    name=segment_data.get("airline", ""),
                ),
                cabin_class=search_request.cabin_class,
                booking_class=segment_data.get("fare_category", ""),
            )
            segments.append(segment)
            total_duration += segment.duration_minutes

        return Flight(
            id=flight_data["id"],
            segments=segments,
            total_duration_minutes=total_duration,
            stops=len(segments) - 1,
            price=float(flight_data["price"]),
            currency="USD",
            deep_link=flight_data.get("deep_link", ""),
            provider="Kiwi",
        )
