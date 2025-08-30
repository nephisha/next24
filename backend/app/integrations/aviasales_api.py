import httpx
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

class AviasalesAPI:
    def __init__(self):
        self.base_url = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates"
        self.api_token = settings.aviasales_api_token
        self.partner_id = settings.aviasales_partner_id
        self.headers = {
            "Accept-Encoding": "gzip, deflate",
            "Accept": "application/json",
        }

    async def search_flights(self, search_request: FlightSearchRequest) -> List[Flight]:
        params = self._build_search_params(search_request)
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(self.base_url, params=params, headers=self.headers)
                response.raise_for_status()
                data = response.json()
                return self._parse_flights(data, search_request)
        except httpx.RequestError as e:
            logger.error(f"Aviasales API request error: {e}")
            return []
        except Exception as e:
            logger.error(f"Aviasales API error: {e}")
            return []

    def _build_search_params(self, search_request: FlightSearchRequest) -> Dict[str, Any]:
        params = {
            "origin": search_request.origin,
            "destination": search_request.destination,
            "departure_at": search_request.departure_date.strftime("%Y-%m-%d"),
            "currency": "usd",
            "limit": 30,
            "one_way": str(search_request.return_date is None).lower(),
            "direct": str(search_request.direct_flights_only).lower(),
            "token": self.api_token,
        }
        if search_request.return_date:
            params["return_at"] = search_request.return_date.strftime("%Y-%m-%d")
        return params

    def _parse_flights(self, data: Dict[str, Any], search_request: FlightSearchRequest) -> List[Flight]:
        flights = []
        for item in data.get("data", []):
            try:
                flight = self._parse_single_flight(item, search_request)
                if flight:
                    flights.append(flight)
            except Exception as e:
                logger.warning(f"Failed to parse Aviasales flight: {e}")
                continue
        return flights

    def _parse_single_flight(self, item: Dict[str, Any], search_request: FlightSearchRequest) -> Optional[Flight]:
        # Map Aviasales response to internal Flight model
        try:
            origin_code = item.get("origin_airport") or item.get("origin")
            dest_code = item.get("destination_airport") or item.get("destination")
            airline_code = item.get("airline")
            flight_number = item.get("flight_number", "")
            departure_at = item.get("departure_at")
            return_at = item.get("return_at")
            price = float(item.get("price", 0))
            currency = item.get("currency", "USD").upper()
            deep_link = f"https://www.aviasales.com{item.get('link', '')}"
            stops = int(item.get("transfers", 0))
            duration = int(item.get("duration", 0))
            duration_to = int(item.get("duration_to", 0))
            duration_back = int(item.get("duration_back", 0))

            # Minimal Airport/Airline info (expand as needed)
            origin_airport = Airport(code=origin_code, name=origin_code, city="", country="")
            dest_airport = Airport(code=dest_code, name=dest_code, city="", country="")
            airline = Airline(code=airline_code, name=airline_code, logo_url=None)

            # Outbound segment
            segments = [
                FlightSegment(
                    origin=origin_airport,
                    destination=dest_airport,
                    departure_time=datetime.fromisoformat(departure_at) if departure_at else datetime.utcnow(),
                    arrival_time=datetime.fromisoformat(departure_at) if departure_at else datetime.utcnow(),  # No arrival in API
                    duration_minutes=duration_to or duration,
                    flight_number=flight_number,
                    airline=airline,
                    aircraft_type=None,
                    cabin_class=search_request.cabin_class,
                    booking_class=""
                )
            ]
            # Return segment if round trip
            if return_at:
                segments.append(
                    FlightSegment(
                        origin=dest_airport,
                        destination=origin_airport,
                        departure_time=datetime.fromisoformat(return_at),
                        arrival_time=datetime.fromisoformat(return_at),  # No arrival in API
                        duration_minutes=duration_back,
                        flight_number=flight_number,
                        airline=airline,
                        aircraft_type=None,
                        cabin_class=search_request.cabin_class,
                        booking_class=""
                    )
                )
            return Flight(
                id=f"aviasales_{flight_number}_{departure_at}",
                segments=segments,
                total_duration_minutes=duration,
                stops=stops,
                price=price,
                currency=currency,
                deep_link=deep_link,
                provider="Aviasales",
                last_updated=datetime.utcnow(),
            )
        except Exception as e:
            logger.warning(f"Error mapping Aviasales flight: {e}")
            return None 