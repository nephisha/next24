"""
Hotel search API endpoints.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
import logging
from datetime import datetime

from ..integrations.serpapi_hotels import (
    search_hotels_serpapi,
    HotelSearchParams,
    HotelSearchResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/hotels", tags=["hotels"])


@router.post("/search", response_model=HotelSearchResponse)
async def search_hotels(params: HotelSearchParams) -> HotelSearchResponse:
    """
    Search for hotels using SerpAPI Google Hotels.

    Args:
        params: Hotel search parameters including destination, dates, guests, etc.

    Returns:
        HotelSearchResponse with hotel results

    Raises:
        HTTPException: If search fails or parameters are invalid
    """
    try:
        # Validate dates
        check_in_date = datetime.strptime(params.check_in, "%Y-%m-%d")
        check_out_date = datetime.strptime(params.check_out, "%Y-%m-%d")

        if check_in_date >= check_out_date:
            raise HTTPException(
                status_code=400, detail="Check-out date must be after check-in date"
            )

        if check_in_date < datetime.now().date():
            raise HTTPException(
                status_code=400, detail="Check-in date cannot be in the past"
            )

        # Validate guest counts
        if params.adults < 1 or params.adults > 30:
            raise HTTPException(
                status_code=400, detail="Adults must be between 1 and 30"
            )

        if params.children < 0 or params.children > 30:
            raise HTTPException(
                status_code=400, detail="Children must be between 0 and 30"
            )

        if params.rooms < 1 or params.rooms > 30:
            raise HTTPException(
                status_code=400, detail="Rooms must be between 1 and 30"
            )

        logger.info(
            f"Searching hotels for {params.destination} from {params.check_in} to {params.check_out}"
        )

        # Search hotels using SerpAPI
        results = search_hotels_serpapi(params)

        logger.info(f"Found {len(results.hotels)} hotels for {params.destination}")

        return results

    except ValueError as e:
        logger.error(f"Invalid date format: {e}")
        raise HTTPException(
            status_code=400, detail="Invalid date format. Use YYYY-MM-DD"
        )
    except Exception as e:
        logger.error(f"Hotel search failed: {e}")
        raise HTTPException(status_code=500, detail=f"Hotel search failed: {str(e)}")


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint for hotel service."""
    return {
        "status": "healthy",
        "service": "hotels",
        "timestamp": datetime.now().isoformat(),
    }
