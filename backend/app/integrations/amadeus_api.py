import httpx
import asyncio
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
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


class AmadeusAPI:
    """Amadeus for Developers API - More reliable than aggregators"""

    def __init__(self):
        self.base_url = "https://api.amadeus.com"
        self.client_id = getattr(settings, "amadeus_client_id", None)
        self.client_secret = getattr(settings, "amadeus_client_secret", None)
        self.access_token = None
        self.token_expires_at = None

    async def search_flights(self, search_request: FlightSearchRequest) -> List[Flight]:
        """Search flights using Amadeus API"""
        if not self.client_id or not self.client_secret:
            logger.warning("Amadeus API credentials not configured")
            return []

        try:
            # Ensure we have a valid access token
            await self._ensure_access_token()

            async with httpx.AsyncClient(timeout=30.0) as client:
                params = self._build_search_params(search_request)
                headers = {
                    "Authorization": f"Bearer {self.access_token}",
                    "Accept": "application/json",
                }

                response = await client.get(
                    f"{self.base_url}/v2/shopping/flight-offers",
                    params=params,
                    headers=headers,
                )
                response.raise_for_status()
                data = response.json()

                return self._parse_flights(data, search_request)

        except httpx.RequestError as e:
            logger.error(f"Amadeus API request error: {e}")
            return []
        except Exception as e:
            logger.error(f"Amadeus API error: {e}")
            return []

    async def _ensure_access_token(self):
        """Get or refresh access token"""
        if (
            self.access_token
            and self.token_expires_at
            and datetime.now() < self.token_expires_at
        ):
            return

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v1/security/oauth2/token",
                data={
                    "grant_type": "client_credentials",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            response.raise_for_status()
            token_data = response.json()

            self.access_token = token_data["access_token"]
            expires_in = token_data.get("expires_in", 3600)
            self.token_expires_at = datetime.now() + timedelta(seconds=expires_in - 60)

    def _build_search_params(
        self, search_request: FlightSearchRequest
    ) -> Dict[str, Any]:
        params = {
            "originLocationCode": search_request.origin,
            "destinationLocationCode": search_request.destination,
            "departureDate": search_request.departure_date.isoformat(),
            "adults": search_request.adults,
            "children": search_request.children,
            "infants": search_request.infants,
            "travelClass": self._map_cabin_class(search_request.cabin_class),
            "currencyCode": "USD",
            "max": 50,
        }

        if search_request.return_date:
            params["returnDate"] = search_request.return_date.isoformat()

        if search_request.max_price:
            params["maxPrice"] = int(search_request.max_price)

        if search_request.direct_flights_only:
            params["nonStop"] = "true"

        return params

    def _map_cabin_class(self, cabin_class: CabinClass) -> str:
        mapping = {
            CabinClass.ECONOMY: "ECONOMY",
            CabinClass.PREMIUM_ECONOMY: "PREMIUM_ECONOMY",
            CabinClass.BUSINESS: "BUSINESS",
            CabinClass.FIRST: "FIRST",
        }
        return mapping.get(cabin_class, "ECONOMY")

    def _parse_flights(
        self, data: Dict[str, Any], search_request: FlightSearchRequest
    ) -> List[Flight]:
        flights = []

        for offer in data.get("data", []):
            try:
                flight = self._parse_flight_offer(offer, search_request)
                if flight:
                    flights.append(flight)
            except Exception as e:
                logger.warning(f"Failed to parse Amadeus flight offer: {e}")
                continue

        return flights

    def _parse_flight_offer(
        self, offer: Dict[str, Any], search_request: FlightSearchRequest
    ) -> Optional[Flight]:
        try:
            # Extract price
            price_info = offer.get("price", {})
            price = float(price_info.get("total", 0))
            currency = price_info.get("currency", "USD")

            # Extract itineraries
            itineraries = offer.get("itineraries", [])
            if not itineraries:
                return None

            # Parse segments from first itinerary (outbound)
            segments = []
            total_duration_minutes = 0

            for itinerary in itineraries:
                for segment_data in itinerary.get("segments", []):
                    segment = self._parse_segment(
                        segment_data, search_request.cabin_class
                    )
                    if segment:
                        segments.append(segment)
                        total_duration_minutes += segment.duration_minutes

            if not segments:
                return None

            # Calculate stops
            stops = len(segments) - len(itineraries)

            return Flight(
                id=offer.get("id", f"amadeus_{datetime.now().timestamp()}"),
                segments=segments,
                total_duration_minutes=total_duration_minutes,
                stops=stops,
                price=price,
                currency=currency,
                deep_link=f"https://amadeus.com/book/{offer.get('id', '')}",
                provider="Amadeus",
            )

        except Exception as e:
            logger.warning(f"Error parsing Amadeus flight offer: {e}")
            return None

    def _parse_segment(
        self, segment_data: Dict[str, Any], cabin_class: CabinClass
    ) -> Optional[FlightSegment]:
        try:
            departure = segment_data.get("departure", {})
            arrival = segment_data.get("arrival", {})

            # Parse times
            dep_time = datetime.fromisoformat(
                departure.get("at", "").replace("Z", "+00:00")
            )
            arr_time = datetime.fromisoformat(
                arrival.get("at", "").replace("Z", "+00:00")
            )

            # Calculate duration
            duration_minutes = int((arr_time - dep_time).total_seconds() / 60)

            # Extract airport info
            origin_code = departure.get("iataCode", "")
            dest_code = arrival.get("iataCode", "")

            # Extract airline info
            operating = segment_data.get("operating", {})
            airline_code = operating.get("carrierCode", "")
            flight_number = f"{airline_code}{segment_data.get('number', '')}"

            return FlightSegment(
                origin=Airport(
                    code=origin_code,
                    name=departure.get("terminal", ""),
                    city="",
                    country="",
                ),
                destination=Airport(
                    code=dest_code,
                    name=arrival.get("terminal", ""),
                    city="",
                    country="",
                ),
                departure_time=dep_time,
                arrival_time=arr_time,
                duration_minutes=duration_minutes,
                flight_number=flight_number,
                airline=Airline(
                    code=airline_code,
                    name=airline_code,  # Would need airline lookup for full name
                ),
                cabin_class=cabin_class,
                booking_class=segment_data.get("pricingDetailPerAdult", {}).get(
                    "fareClass", ""
                ),
            )

        except Exception as e:
            logger.warning(f"Error parsing Amadeus segment: {e}")
            return None
