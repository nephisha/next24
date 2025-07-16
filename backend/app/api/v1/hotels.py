from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional, List
from app.models.hotels import HotelSearchRequest, HotelSearchResponse, Hotel
from app.services.hotel_service import HotelService
from app.api.deps import validate_search_params
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
hotel_service = HotelService()


@router.post("/search", response_model=HotelSearchResponse)
async def search_hotels(
    search_request: HotelSearchRequest, _: dict = Depends(validate_search_params())
):
    """
    Search for last-minute hotel deals

    - **destination**: City name or location
    - **latitude/longitude**: Optional coordinates for precise location
    - **check_in**: Today or tomorrow only for last-minute deals
    - **check_out**: Check-out date (must be after check-in)
    - **adults**: Number of adult guests (1-30)
    - **children**: Number of child guests (0-30)
    - **rooms**: Number of rooms needed (1-30)
    - **max_price**: Maximum price per night in USD
    - **min_rating**: Minimum hotel rating (0-5 stars)
    """
    try:
        logger.info(
            f"Hotel search: {search_request.destination} from {search_request.check_in} to {search_request.check_out}"
        )

        response = await hotel_service.search_hotels(search_request)

        if response.total_results == 0:
            logger.warning(f"No hotels found for {search_request.destination}")

        return response

    except ValueError as e:
        logger.error(f"Validation error in hotel search: {e}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected error in hotel search: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during hotel search",
        )


@router.get("/search", response_model=HotelSearchResponse)
async def search_hotels_get(
    destination: str = Query(..., description="Destination city or location"),
    check_in: str = Query(..., description="Check-in date (YYYY-MM-DD)"),
    check_out: str = Query(..., description="Check-out date (YYYY-MM-DD)"),
    adults: int = Query(1, ge=1, le=30, description="Number of adults"),
    children: int = Query(0, ge=0, le=30, description="Number of children"),
    rooms: int = Query(1, ge=1, le=30, description="Number of rooms"),
    latitude: Optional[float] = Query(None, ge=-90, le=90, description="Latitude"),
    longitude: Optional[float] = Query(None, ge=-180, le=180, description="Longitude"),
    max_price: Optional[float] = Query(
        None, gt=0, description="Maximum price per night in USD"
    ),
    min_rating: Optional[float] = Query(
        None, ge=0, le=5, description="Minimum hotel rating"
    ),
):
    """
    Search for hotels using GET parameters (for easy URL sharing and caching)
    """
    try:
        from datetime import date

        # Parse dates
        checkin_date = date.fromisoformat(check_in)
        checkout_date = date.fromisoformat(check_out)

        # Create search request
        search_request = HotelSearchRequest(
            destination=destination,
            latitude=latitude,
            longitude=longitude,
            check_in=checkin_date,
            check_out=checkout_date,
            adults=adults,
            children=children,
            rooms=rooms,
            max_price=max_price,
            min_rating=min_rating,
        )

        return await search_hotels(search_request)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid date format or parameters: {e}",
        )


@router.get("/{hotel_id}", response_model=Hotel)
async def get_hotel_details(hotel_id: str):
    """
    Get details for a specific hotel by ID
    """
    # This would typically fetch from database or cache
    # For now, return a 404 as this is a placeholder
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Hotel details endpoint not implemented",
    )


@router.get("/destinations/search")
async def search_destinations(
    query: str = Query(..., min_length=2, description="City or destination name"),
    limit: int = Query(10, ge=1, le=50, description="Maximum results"),
):
    """
    Search for destinations by name (for autocomplete)
    """
    # This would typically use a destinations database
    # For now, return a placeholder response
    return {
        "destinations": [
            {
                "name": "New York",
                "country": "United States",
                "latitude": 40.7128,
                "longitude": -74.0060,
            },
            {
                "name": "London",
                "country": "United Kingdom",
                "latitude": 51.5074,
                "longitude": -0.1278,
            },
        ]
    }
