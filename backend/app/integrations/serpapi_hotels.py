"""
SerpAPI Google Hotels integration for hotel search functionality.
"""

import os
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import requests
from pydantic import BaseModel

logger = logging.getLogger(__name__)


class HotelLocation(BaseModel):
    address: str
    city: str
    country: str
    postal_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    distance_to_center_km: Optional[float] = None


class RoomType(BaseModel):
    name: str
    description: Optional[str] = None
    max_occupancy: int
    amenities: List[str] = []


class HotelAmenity(BaseModel):
    name: str
    icon: Optional[str] = None


class HotelImage(BaseModel):
    url: str
    thumbnail_url: Optional[str] = None
    caption: Optional[str] = None


class Hotel(BaseModel):
    id: str
    name: str
    location: HotelLocation
    rating: Optional[float] = None
    review_score: Optional[float] = None
    review_count: Optional[int] = None
    price_per_night: float
    total_price: float
    currency: str
    room_type: RoomType
    amenities: List[HotelAmenity] = []
    images: List[HotelImage] = []
    deep_link: str
    provider: str
    cancellation_policy: Optional[str] = None
    breakfast_included: bool = False
    last_updated: str


class HotelSearchParams(BaseModel):
    destination: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    check_in: str
    check_out: str
    adults: int = 2
    children: int = 0
    rooms: int = 1


class HotelSearchResponse(BaseModel):
    hotels: List[Hotel]
    search_id: str
    total_results: int
    search_params: HotelSearchParams
    providers: List[str]
    cache_hit: bool = False
    search_time_ms: int


class SerpAPIHotelsClient:
    """Client for SerpAPI Google Hotels search."""

    def __init__(self):
        self.api_key = None
        self.base_url = "https://serpapi.com/search.json"
        self.session = requests.Session()

    def _ensure_api_key(self):
        """Ensure API key is available."""
        if not self.api_key:
            self.api_key = os.getenv("SERPAPI_KEY")
            if not self.api_key:
                raise ValueError("SERPAPI_KEY environment variable is required")

    def search_hotels(self, params: HotelSearchParams) -> HotelSearchResponse:
        """
        Search for hotels using SerpAPI Google Hotels engine.

        Args:
            params: Hotel search parameters

        Returns:
            HotelSearchResponse with hotel results
        """
        start_time = datetime.now()

        try:
            # Ensure API key is available
            self._ensure_api_key()

            # Build SerpAPI query parameters
            query_params = self._build_query_params(params)

            logger.info(f"Searching hotels with SerpAPI: {query_params}")

            # Make API request
            response = self.session.get(self.base_url, params=query_params, timeout=30)
            response.raise_for_status()

            data = response.json()

            # Parse response
            hotels = self._parse_hotels_response(data, params)

            search_time_ms = int((datetime.now() - start_time).total_seconds() * 1000)

            return HotelSearchResponse(
                hotels=hotels,
                search_id=data.get("search_metadata", {}).get("id", ""),
                total_results=len(hotels),
                search_params=params,
                providers=["Google Hotels"],
                cache_hit=False,
                search_time_ms=search_time_ms,
            )

        except requests.RequestException as e:
            logger.error(f"SerpAPI request failed: {e}")
            raise Exception(f"Hotel search failed: {str(e)}")
        except Exception as e:
            logger.error(f"Hotel search error: {e}")
            raise Exception(f"Hotel search error: {str(e)}")

    def _build_query_params(self, params: HotelSearchParams) -> Dict[str, Any]:
        """Build query parameters for SerpAPI request."""

        # Format destination query
        destination_query = params.destination
        if not destination_query.lower().endswith(("hotels", "resorts")):
            destination_query += " hotels"

        query_params = {
            "engine": "google_hotels",
            "q": destination_query,
            "check_in_date": params.check_in,
            "check_out_date": params.check_out,
            "adults": params.adults,
            "currency": "USD",
            "gl": "us",
            "hl": "en",
            "api_key": self.api_key,
        }

        # Add optional parameters
        if params.children > 0:
            query_params["children"] = params.children

        return query_params

    def _parse_hotels_response(
        self, data: Dict[str, Any], params: HotelSearchParams
    ) -> List[Hotel]:
        """Parse SerpAPI response into Hotel objects."""
        hotels = []

        properties = data.get("properties", [])

        for idx, prop in enumerate(properties):
            try:
                hotel = self._parse_single_hotel(prop, idx, params)
                if hotel:
                    hotels.append(hotel)
            except Exception as e:
                logger.warning(f"Failed to parse hotel property: {e}")
                continue

        return hotels

    def _parse_single_hotel(
        self, prop: Dict[str, Any], idx: int, params: HotelSearchParams
    ) -> Optional[Hotel]:
        """Parse a single hotel property from SerpAPI response."""

        # Extract basic info
        name = prop.get("name", "Unknown Hotel")
        hotel_id = prop.get("property_token", f"hotel_{idx}")

        # Extract location
        location_data = prop.get("location", {})
        location = HotelLocation(
            address=location_data.get("address", ""),
            city=params.destination.split(",")[0].strip(),
            country="US",  # Default, could be enhanced
            latitude=location_data.get("latitude"),
            longitude=location_data.get("longitude"),
        )

        # Extract pricing
        rate_info = prop.get("rate_per_night", {})
        price_per_night = 0.0
        currency = "USD"

        if rate_info:
            # Try to extract price from various formats
            if "lowest" in rate_info:
                price_per_night = float(
                    rate_info["lowest"].replace("$", "").replace(",", "")
                )
            elif "extracted_lowest" in rate_info:
                price_per_night = float(rate_info["extracted_lowest"])

        # Calculate total price
        check_in = datetime.strptime(params.check_in, "%Y-%m-%d")
        check_out = datetime.strptime(params.check_out, "%Y-%m-%d")
        nights = (check_out - check_in).days
        total_price = price_per_night * nights

        # Extract rating
        rating = None
        review_score = None
        review_count = None

        if "overall_rating" in prop:
            rating = float(prop["overall_rating"])
            review_score = rating

        if "reviews" in prop:
            review_count = int(prop["reviews"])

        # Extract images
        images = []
        if "images" in prop and prop["images"]:
            for img in prop["images"][:5]:  # Limit to 5 images
                if isinstance(img, dict) and "thumbnail" in img:
                    images.append(
                        {
                            "url": img.get("original", img["thumbnail"]),
                            "thumbnail_url": img["thumbnail"],
                            "caption": img.get("caption", ""),
                        }
                    )

        # Extract amenities
        amenities = []
        if "amenities" in prop:
            for amenity in prop["amenities"]:
                if isinstance(amenity, str):
                    amenities.append({"name": amenity})
                elif isinstance(amenity, dict):
                    amenities.append({"name": amenity.get("name", str(amenity))})

        # Room type (simplified)
        room_type = RoomType(
            name="Standard Room",
            max_occupancy=params.adults + params.children,
            amenities=[a.name for a in amenities],
        )

        # Deep link
        deep_link = prop.get("link", f"https://www.google.com/travel/hotels")

        return Hotel(
            id=hotel_id,
            name=name,
            location=location,
            rating=rating,
            review_score=review_score,
            review_count=review_count,
            price_per_night=price_per_night,
            total_price=total_price,
            currency=currency,
            room_type=room_type,
            amenities=amenities,
            images=images,
            deep_link=deep_link,
            provider="Google Hotels",
            breakfast_included=False,  # Could be enhanced
            last_updated=datetime.now().isoformat(),
        )


# Global client instance
serpapi_hotels_client = SerpAPIHotelsClient()


def search_hotels_serpapi(params: HotelSearchParams) -> HotelSearchResponse:
    """
    Search for hotels using SerpAPI.

    Args:
        params: Hotel search parameters

    Returns:
        HotelSearchResponse with results
    """
    return serpapi_hotels_client.search_hotels(params)
