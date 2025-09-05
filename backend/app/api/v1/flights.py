from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional, List
from app.models.flights import FlightSearchRequest, FlightSearchResponse, Flight
from app.services.flight_service import FlightService
from app.api.deps import validate_search_params
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
flight_service = FlightService()


@router.post("/search", response_model=FlightSearchResponse)
async def search_flights(
    search_request: FlightSearchRequest, _: dict = Depends(validate_search_params)
):
    """
    Search for flight deals

    - **origin**: IATA airport code (e.g., 'NYC', 'LAX')
    - **destination**: IATA airport code (e.g., 'LON', 'PAR')
    - **departure_date**:
    - **return_date**: Optional return date (must be after departure)
    - **adults**: Number of adult passengers (1-9)
    - **children**: Number of child passengers (0-9)
    - **infants**: Number of infant passengers (0-9)
    - **cabin_class**: economy, premium_economy, business, or first
    - **max_price**: Maximum price filter in USD
    - **direct_flights_only**: Search for direct flights only
    """
    try:
        logger.info(
            f"Flight search: {search_request.origin} -> {search_request.destination} on {search_request.departure_date}"
        )

        response = await flight_service.search_flights(search_request)

        if response.total_results == 0:
            logger.warning(
                f"No flights found for {search_request.origin} -> {search_request.destination}"
            )

        return response

    except ValueError as e:
        logger.error(f"Validation error in flight search: {e}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected error in flight search: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during flight search",
        )


@router.get("/search", response_model=FlightSearchResponse)
async def search_flights_get(
    origin: str = Query(
        ..., description="Origin airport IATA code", min_length=3, max_length=3
    ),
    destination: str = Query(
        ..., description="Destination airport IATA code", min_length=3, max_length=3
    ),
    departure_date: str = Query(..., description="Departure date (YYYY-MM-DD)"),
    return_date: Optional[str] = Query(None, description="Return date (YYYY-MM-DD)"),
    adults: int = Query(1, ge=1, le=9, description="Number of adults"),
    children: int = Query(0, ge=0, le=9, description="Number of children"),
    infants: int = Query(0, ge=0, le=9, description="Number of infants"),
    cabin_class: str = Query("economy", description="Cabin class"),
    max_price: Optional[float] = Query(None, gt=0, description="Maximum price in USD"),
    direct_flights_only: bool = Query(False, description="Direct flights only"),
):
    """
    Search for flights using GET parameters (for easy URL sharing and caching)
    """
    try:
        from datetime import date

        # Parse dates
        dep_date = date.fromisoformat(departure_date)
        ret_date = date.fromisoformat(return_date) if return_date else None

        # Create search request
        search_request = FlightSearchRequest(
            origin=origin.upper(),
            destination=destination.upper(),
            departure_date=dep_date,
            return_date=ret_date,
            adults=adults,
            children=children,
            infants=infants,
            cabin_class=cabin_class,
            max_price=max_price,
            direct_flights_only=direct_flights_only,
        )

        return await search_flights(search_request)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid date format or parameters: {e}",
        )


@router.get("/{flight_id}", response_model=Flight)
async def get_flight_details(flight_id: str):
    """
    Get details for a specific flight by ID
    """
    # This would typically fetch from database or cache
    # For now, return a 404 as this is a placeholder
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Flight details endpoint not implemented",
    )


@router.get("/airports/search")
async def search_airports(
    query: str = Query(..., min_length=2, description="Airport name or city"),
    limit: int = Query(10, ge=1, le=50, description="Maximum results"),
):
    """
    Search for airports by name or city (for autocomplete)
    """
    # This would typically use a local airport database
    # For now, return a placeholder response
    return {
        "airports": [
            {
                "code": "JFK",
                "name": "John F. Kennedy International Airport",
                "city": "New York",
                "country": "United States",
            }
        ]
    }
