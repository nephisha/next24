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


class TravelpayoutsAPI:
    """
    Travelpayouts API integration
    Official partner with airlines, provides real flight data

    Sign up at: https://www.travelpayouts.com/
    Free tier: 100 requests/day
    Paid: $0.001 per request
    """

    def __init__(self):
        self.base_url = "https://api.travelpayouts.com"
        self.api_token = getattr(settings, "travelpayouts_token", None)
        self.marker = getattr(settings, "travelpayouts_marker", None)

    async def search_flights(self, search_request: FlightSearchRequest) -> List[Flight]:
        """Search flights using Travelpayouts API"""
        if not self.api_token:
            logger.warning("Travelpayouts token not configured")
            return []

        try:
            # Use different endpoints based on search type
            if search_request.return_date:
                return await self._search_round_trip(search_request)
            else:
                return await self._search_one_way(search_request)

        except Exception as e:
            logger.error(f"Travelpayouts API error: {e}")
            return []

    async def _search_one_way(
        self, search_request: FlightSearchRequest
    ) -> List[Flight]:
        """Search one-way flights"""
        async with httpx.AsyncClient(timeout=30.0) as client:
            params = {
                "origin": search_request.origin,
                "destination": search_request.destination,
                "depart_date": search_request.departure_date.strftime("%Y-%m-%d"),
                "currency": "usd",
                "token": self.api_token,
            }

            if self.marker:
                params["marker"] = self.marker

            response = await client.get(
                f"{self.base_url}/aviasales/v3/prices_for_dates", params=params
            )
            response.raise_for_status()
            data = response.json()

            return self._parse_flights(data, search_request)

    async def _search_round_trip(
        self, search_request: FlightSearchRequest
    ) -> List[Flight]:
        """Search round-trip flights"""
        async with httpx.AsyncClient(timeout=30.0) as client:
            params = {
                "origin": search_request.origin,
                "destination": search_request.destination,
                "depart_date": search_request.departure_date.strftime("%Y-%m-%d"),
                "return_date": search_request.return_date.strftime("%Y-%m-%d"),
                "currency": "usd",
                "token": self.api_token,
            }

            if self.marker:
                params["marker"] = self.marker

            response = await client.get(
                f"{self.base_url}/aviasales/v3/prices_for_dates", params=params
            )
            response.raise_for_status()
            data = response.json()

            return self._parse_flights(data, search_request)

    def _parse_flights(
        self, data: Dict[str, Any], search_request: FlightSearchRequest
    ) -> List[Flight]:
        """Parse Travelpayouts API response"""
        flights = []

        flight_data_list = data.get("data", [])
        if isinstance(flight_data_list, dict):
            flight_data_list = list(flight_data_list.values())

        for flight_data in flight_data_list:
            try:
                flight = self._parse_single_flight(flight_data, search_request)
                if flight:
                    flights.append(flight)
            except Exception as e:
                logger.warning(f"Failed to parse Travelpayouts flight: {e}")
                continue

        return flights

    def _parse_single_flight(
        self, flight_data: Dict[str, Any], search_request: FlightSearchRequest
    ) -> Optional[Flight]:
        """Parse a single flight from Travelpayouts response"""
        try:
            # Extract basic info
            price = float(flight_data.get("price", 0))
            currency = flight_data.get("currency", "USD").upper()

            # Extract route info
            origin = flight_data.get("origin")
            destination = flight_data.get("destination")

            # Extract dates
            depart_date = flight_data.get("depart_date")
            return_date = flight_data.get("return_date")

            # Extract airline
            airline_code = flight_data.get("airline")

            # Extract other info
            transfers = flight_data.get("transfers", 0)
            flight_number = flight_data.get("flight_number", f"{airline_code}XXX")

            # Create segments
            segments = []

            # Outbound segment
            if depart_date:
                dep_time = datetime.strptime(depart_date, "%Y-%m-%d")
                # Add estimated time (Travelpayouts doesn't provide exact times)
                dep_time = dep_time.replace(hour=10, minute=0)  # Default 10:00 AM

                # Estimate arrival time (rough calculation)
                duration_hours = self._estimate_flight_duration(origin, destination)
                arr_time = dep_time.replace(hour=dep_time.hour + duration_hours)

                outbound_segment = FlightSegment(
                    origin=Airport(
                        code=origin,
                        name=self._get_airport_name(origin),
                        city=self._get_city_name(origin),
                        country="",
                    ),
                    destination=Airport(
                        code=destination,
                        name=self._get_airport_name(destination),
                        city=self._get_city_name(destination),
                        country="",
                    ),
                    departure_time=dep_time,
                    arrival_time=arr_time,
                    duration_minutes=duration_hours * 60,
                    flight_number=flight_number,
                    airline=Airline(
                        code=airline_code, name=self._get_airline_name(airline_code)
                    ),
                    cabin_class=search_request.cabin_class,
                    booking_class="",
                )
                segments.append(outbound_segment)

            # Return segment (if round trip)
            if return_date:
                ret_time = datetime.strptime(return_date, "%Y-%m-%d")
                ret_time = ret_time.replace(hour=15, minute=0)  # Default 3:00 PM

                duration_hours = self._estimate_flight_duration(destination, origin)
                ret_arr_time = ret_time.replace(hour=ret_time.hour + duration_hours)

                return_segment = FlightSegment(
                    origin=Airport(
                        code=destination,
                        name=self._get_airport_name(destination),
                        city=self._get_city_name(destination),
                        country="",
                    ),
                    destination=Airport(
                        code=origin,
                        name=self._get_airport_name(origin),
                        city=self._get_city_name(origin),
                        country="",
                    ),
                    departure_time=ret_time,
                    arrival_time=ret_arr_time,
                    duration_minutes=duration_hours * 60,
                    flight_number=f"{airline_code}{int(flight_number[-3:]) + 1}",
                    airline=Airline(
                        code=airline_code, name=self._get_airline_name(airline_code)
                    ),
                    cabin_class=search_request.cabin_class,
                    booking_class="",
                )
                segments.append(return_segment)

            if not segments:
                return None

            total_duration = sum(seg.duration_minutes for seg in segments)

            # Generate deep link
            deep_link = flight_data.get("link", "")
            if deep_link and not deep_link.startswith("http"):
                deep_link = f"https://www.aviasales.com{deep_link}"

            return Flight(
                id=f"travelpayouts_{flight_number}_{depart_date}",
                segments=segments,
                total_duration_minutes=total_duration,
                stops=transfers,
                price=price,
                currency=currency,
                deep_link=deep_link,
                provider="Travelpayouts",
            )

        except Exception as e:
            logger.warning(f"Error parsing Travelpayouts flight: {e}")
            return None

    def _estimate_flight_duration(self, origin: str, destination: str) -> int:
        """Estimate flight duration in hours based on route"""
        # Simple duration estimates for common routes
        duration_map = {
            ("NYC", "LAX"): 6,
            ("LAX", "NYC"): 5,
            ("NYC", "MIA"): 3,
            ("MIA", "NYC"): 3,
            ("NYC", "CHI"): 2,
            ("CHI", "NYC"): 2,
            ("LAX", "SFO"): 1,
            ("SFO", "LAX"): 1,
            ("NYC", "LAS"): 5,
            ("LAS", "NYC"): 4,
        }

        return duration_map.get((origin, destination), 4)  # Default 4 hours

    def _get_airport_name(self, code: str) -> str:
        """Get airport name from code"""
        airport_names = {
            "NYC": "New York Area Airports",
            "LAX": "Los Angeles International",
            "MIA": "Miami International",
            "CHI": "Chicago Area Airports",
            "SFO": "San Francisco International",
            "LAS": "Las Vegas McCarran",
            "SEA": "Seattle-Tacoma International",
            "DEN": "Denver International",
        }
        return airport_names.get(code, code)

    def _get_city_name(self, code: str) -> str:
        """Get city name from airport code"""
        city_names = {
            "NYC": "New York",
            "LAX": "Los Angeles",
            "MIA": "Miami",
            "CHI": "Chicago",
            "SFO": "San Francisco",
            "LAS": "Las Vegas",
            "SEA": "Seattle",
            "DEN": "Denver",
        }
        return city_names.get(code, code)

    def _get_airline_name(self, code: str) -> str:
        """Get airline name from code"""
        airline_names = {
            "AA": "American Airlines",
            "DL": "Delta Air Lines",
            "UA": "United Airlines",
            "SW": "Southwest Airlines",
            "B6": "JetBlue Airways",
            "AS": "Alaska Airlines",
            "F9": "Frontier Airlines",
            "NK": "Spirit Airlines",
        }
        return airline_names.get(code, code)
