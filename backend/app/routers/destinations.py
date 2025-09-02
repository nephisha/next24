from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..services.destination_service import DestinationService, GuideService
from pydantic import BaseModel

router = APIRouter(prefix="/api/destinations", tags=["destinations"])


class DestinationResponse(BaseModel):
    id: str
    name: str
    country: str
    cityCode: str
    description: str
    image: str
    highlights: List[str]
    bestTime: str
    avgFlightPrice: str
    rating: float
    slug: str


@router.get("/featured")
async def get_featured_destinations(
    limit: int = Query(6, ge=1, le=20), db: Session = Depends(get_db)
):
    """Get featured destinations for homepage"""
    service = DestinationService(db)
    destinations = await service.get_featured_destinations(limit)
    return {"destinations": destinations}


@router.get("/")
async def get_all_destinations(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sort_by: str = Query(
        "popularity", regex="^(popularity|rating|price_low|price_high)$"
    ),
    db: Session = Depends(get_db),
):
    """Get paginated destinations with sorting"""
    service = DestinationService(db)
    result = await service.get_all_destinations(page, limit, sort_by)
    return result


@router.get("/{country}/{city}")
async def get_destination_detail(
    country: str, city: str, db: Session = Depends(get_db)
):
    """Get destination details by country and city"""
    service = DestinationService(db)
    destination = await service.get_destination_by_slug(country, city)

    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")

    return destination


@router.post("/update-prices")
async def update_flight_prices(db: Session = Depends(get_db)):
    """Update flight prices from external APIs (admin endpoint)"""
    service = DestinationService(db)
    await service.update_flight_prices()
    return {"message": "Flight prices updated successfully"}


# Travel Guides endpoints
guides_router = APIRouter(prefix="/api/guides", tags=["guides"])


@guides_router.get("/featured")
async def get_featured_guides(
    limit: int = Query(6, ge=1, le=20), db: Session = Depends(get_db)
):
    """Get featured travel guides"""
    service = GuideService(db)
    guides = await service.get_featured_guides(limit)
    return {"guides": guides}


@guides_router.get("/category/{category}")
async def get_guides_by_category(category: str, db: Session = Depends(get_db)):
    """Get guides by category"""
    service = GuideService(db)
    guides = await service.get_guides_by_category(category)
    return {"guides": guides}
