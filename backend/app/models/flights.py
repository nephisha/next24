from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from enum import Enum


class CabinClass(str, Enum):
    ECONOMY = "economy"
    PREMIUM_ECONOMY = "premium_economy"
    BUSINESS = "business"
    FIRST = "first"


class FlightSearchRequest(BaseModel):
    origin: str = Field(
        ..., description="IATA airport code", min_length=3, max_length=3
    )
    destination: str = Field(
        ..., description="IATA airport code", min_length=3, max_length=3
    )
    departure_date: date = Field(..., description="Departure date")
    return_date: Optional[date] = Field(None, description="Return date for round trip")
    adults: int = Field(1, ge=1, le=9, description="Number of adult passengers")
    children: int = Field(0, ge=0, le=9, description="Number of child passengers")
    infants: int = Field(0, ge=0, le=9, description="Number of infant passengers")
    cabin_class: CabinClass = Field(
        CabinClass.ECONOMY, description="Cabin class preference"
    )
    max_price: Optional[float] = Field(None, gt=0, description="Maximum price filter")
    direct_flights_only: bool = Field(
        False, description="Search for direct flights only"
    )

    @validator("departure_date")
    def departure_date_must_be_valid(cls, v):
        from datetime import timedelta

        today = date.today()
        # Allow booking up to 11 months in advance (same as Google Flights)
        max_date = today + timedelta(days=330)  # ~11 months

        if v < today:
            raise ValueError("Departure date cannot be in the past")
        if v > max_date:
            raise ValueError("Departure date cannot be more than 11 months in advance")
        return v

    @validator("return_date")
    def return_date_must_be_after_departure(cls, v, values):
        if v and "departure_date" in values:
            if v <= values["departure_date"]:
                raise ValueError("Return date must be after departure date")

            # Also validate return date is not too far in future
            from datetime import timedelta

            today = date.today()
            max_date = today + timedelta(days=330)  # ~11 months
            if v > max_date:
                raise ValueError("Return date cannot be more than 11 months in advance")
        return v


class Airport(BaseModel):
    code: str = Field(..., description="IATA airport code")
    name: str = Field(..., description="Airport name")
    city: str = Field(..., description="City name")
    country: str = Field(..., description="Country name")


class Airline(BaseModel):
    code: str = Field(..., description="IATA airline code")
    name: str = Field(..., description="Airline name")
    logo_url: Optional[str] = Field(None, description="Airline logo URL")


class FlightSegment(BaseModel):
    origin: Airport
    destination: Airport
    departure_time: datetime
    arrival_time: datetime
    duration_minutes: int
    flight_number: str
    airline: Airline
    aircraft_type: Optional[str] = None
    cabin_class: CabinClass
    booking_class: str


class Flight(BaseModel):
    id: str = Field(..., description="Unique flight identifier")
    segments: List[FlightSegment] = Field(..., description="Flight segments")
    total_duration_minutes: int
    stops: int = Field(..., description="Number of stops")
    price: float = Field(..., description="Price in USD")
    currency: str = Field("USD", description="Price currency")
    deep_link: str = Field(..., description="Booking URL")
    provider: str = Field(..., description="Data provider (Kiwi, Skyscanner)")
    last_updated: datetime = Field(default_factory=datetime.utcnow)

    @property
    def is_direct(self) -> bool:
        return self.stops == 0


class FlightSearchResponse(BaseModel):
    flights: List[Flight]
    search_id: str = Field(..., description="Unique search identifier")
    total_results: int
    search_params: FlightSearchRequest
    providers: List[str] = Field(..., description="Data providers used")
    cache_hit: bool = Field(False, description="Whether results came from cache")
    search_time_ms: int = Field(..., description="Search duration in milliseconds")
