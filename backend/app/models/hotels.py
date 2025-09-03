from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from enum import Enum


class HotelSearchRequest(BaseModel):
    destination: str = Field(..., description="City name or location")
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    check_in: date = Field(..., description="Check-in date")
    check_out: date = Field(..., description="Check-out date")
    adults: int = Field(1, ge=1, le=30, description="Number of adult guests")
    children: int = Field(0, ge=0, le=30, description="Number of child guests")
    rooms: int = Field(1, ge=1, le=30, description="Number of rooms")

    @validator("check_in")
    def check_in_must_be_future(cls, v):
        today = date.today()
        if v < today:
            raise ValueError("Check-in date cannot be in the past")
        return v

    @validator("check_out")
    def check_out_must_be_after_check_in(cls, v, values):
        if "check_in" in values and v <= values["check_in"]:
            raise ValueError("Check-out date must be after check-in date")
        return v


class HotelAmenity(BaseModel):
    name: str
    icon: Optional[str] = None


class HotelImage(BaseModel):
    url: str
    thumbnail_url: Optional[str] = None
    caption: Optional[str] = None


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


class Hotel(BaseModel):
    id: str = Field(..., description="Unique hotel identifier")
    name: str = Field(..., description="Hotel name")
    location: HotelLocation
    rating: Optional[float] = Field(None, ge=0, le=5, description="Hotel star rating")
    review_score: Optional[float] = Field(
        None, ge=0, le=10, description="Guest review score"
    )
    review_count: Optional[int] = Field(None, ge=0, description="Number of reviews")
    price_per_night: float = Field(..., description="Price per night in USD")
    total_price: float = Field(..., description="Total price for stay in USD")
    currency: str = Field("USD", description="Price currency")
    room_type: RoomType
    amenities: List[HotelAmenity] = []
    images: List[HotelImage] = []
    deep_link: str = Field(..., description="Booking URL")
    provider: str = Field(..., description="Data provider")
    cancellation_policy: Optional[str] = None
    breakfast_included: bool = False
    last_updated: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class HotelSearchResponse(BaseModel):
    hotels: List[Hotel]
    search_id: str = Field(..., description="Unique search identifier")
    total_results: int
    search_params: HotelSearchRequest
    providers: List[str] = Field(..., description="Data providers used")
    cache_hit: bool = Field(False, description="Whether results came from cache")
    search_time_ms: int = Field(..., description="Search duration in milliseconds")
