import httpx
import asyncio
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from app.config import settings
from app.models.hotels import (
    Hotel,
    HotelLocation,
    RoomType,
    HotelAmenity,
    HotelImage,
    HotelSearchRequest,
)
import logging

logger = logging.getLogger(__name__)


class BookingAPI:
    def __init__(self):
        self.base_url = "https://distribution-xml.booking.com"
        self.api_key = settings.booking_api_key
        self.headers = {
            "accept": "application/json",
            "User-Agent": "Next24-Platform/1.0",
        }

    async def search_hotels(self, search_request: HotelSearchRequest) -> List[Hotel]:
        """Search for hotels using Booking.com API"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                params = self._build_search_params(search_request)

                response = await client.get(
                    f"{self.base_url}/json/bookings.getHotels",
                    params=params,
                    headers=self.headers,
                )

                if response.status_code == 200:
                    data = response.json()
                    return self._parse_hotels(data, search_request)

                return []

        except Exception as e:
            logger.error(f"Booking API error: {e}")
            return []

    def _build_search_params(
        self, search_request: HotelSearchRequest
    ) -> Dict[str, Any]:
        params = {
            "checkin": search_request.check_in.strftime("%Y-%m-%d"),
            "checkout": search_request.check_out.strftime("%Y-%m-%d"),
            "adults": search_request.adults,
            "children": search_request.children,
            "room1": f"A,A" if search_request.adults >= 2 else "A",
            "currency": "USD",
            "language": "en",
            "order": "price",
        }

        if search_request.latitude and search_request.longitude:
            params.update(
                {
                    "latitude": search_request.latitude,
                    "longitude": search_request.longitude,
                    "radius": "10",  # 10km radius
                }
            )
        else:
            params["dest_id"] = search_request.destination

        if search_request.max_price:
            params["price_filter_max"] = int(search_request.max_price)

        if search_request.min_rating:
            params["review_score"] = int(
                search_request.min_rating * 2
            )  # Convert to 0-10 scale

        return params

    def _parse_hotels(
        self, data: Dict[str, Any], search_request: HotelSearchRequest
    ) -> List[Hotel]:
        hotels = []

        for hotel_data in data.get("result", []):
            try:
                hotel = self._parse_single_hotel(hotel_data, search_request)
                if hotel:
                    hotels.append(hotel)
            except Exception as e:
                logger.warning(f"Failed to parse hotel: {e}")
                continue

        return hotels

    def _parse_single_hotel(
        self, hotel_data: Dict[str, Any], search_request: HotelSearchRequest
    ) -> Optional[Hotel]:
        # Calculate total price
        nights = (search_request.check_out - search_request.check_in).days
        price_per_night = float(hotel_data.get("price", 0))
        total_price = price_per_night * nights

        return Hotel(
            id=str(hotel_data.get("hotel_id", "")),
            name=hotel_data.get("hotel_name", ""),
            location=HotelLocation(
                address=hotel_data.get("address", ""),
                city=hotel_data.get("city", ""),
                country=hotel_data.get("country", ""),
                latitude=hotel_data.get("latitude"),
                longitude=hotel_data.get("longitude"),
                distance_to_center_km=hotel_data.get("distance", {}).get("text"),
            ),
            rating=hotel_data.get("class"),
            review_score=hotel_data.get("review_score"),
            review_count=hotel_data.get("review_nr"),
            price_per_night=price_per_night,
            total_price=total_price,
            currency="USD",
            room_type=RoomType(
                name=hotel_data.get("room_name", "Standard Room"),
                max_occupancy=search_request.adults + search_request.children,
            ),
            amenities=[
                HotelAmenity(name=amenity)
                for amenity in hotel_data.get("facilities", [])
            ],
            images=[
                HotelImage(url=img["url_max300"])
                for img in hotel_data.get("photos", [])[:5]  # Limit to 5 images
            ],
            deep_link=hotel_data.get("url", ""),
            provider="Booking.com",
            breakfast_included="breakfast" in hotel_data.get("facilities", []),
        )
