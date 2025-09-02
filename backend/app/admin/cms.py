from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.destinations import Destination, TravelGuide
from pydantic import BaseModel
import uuid
from datetime import datetime
import boto3
from ..config import settings

router = APIRouter(prefix="/admin", tags=["admin"])


class DestinationCreate(BaseModel):
    name: str
    country: str
    city_code: str
    description: str
    best_time_to_visit: Optional[str] = None
    avg_flight_price: Optional[float] = None
    currency: str = "USD"
    highlights: List[str] = []
    tags: List[str] = []
    is_featured: bool = False


class DestinationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    best_time_to_visit: Optional[str] = None
    avg_flight_price: Optional[float] = None
    highlights: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None


class GuideCreate(BaseModel):
    title: str
    category: str
    content: str
    excerpt: str
    author: str
    read_time: int
    tags: List[str] = []
    is_featured: bool = False


# Image upload service
class ImageUploadService:
    def __init__(self):
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
            region_name=settings.aws_region,
        )
        self.bucket_name = settings.s3_bucket_name

    async def upload_image(self, file: UploadFile, folder: str = "destinations") -> str:
        """Upload image to S3 and return URL"""
        try:
            # Generate unique filename
            file_extension = file.filename.split(".")[-1]
            unique_filename = f"{folder}/{uuid.uuid4()}.{file_extension}"

            # Upload to S3
            self.s3_client.upload_fileobj(
                file.file,
                self.bucket_name,
                unique_filename,
                ExtraArgs={"ContentType": file.content_type},
            )

            # Return public URL
            return f"https://{self.bucket_name}.s3.{settings.aws_region}.amazonaws.com/{unique_filename}"
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Image upload failed: {str(e)}"
            )


image_service = ImageUploadService()


@router.post("/destinations")
async def create_destination(
    destination: DestinationCreate, db: Session = Depends(get_db)
):
    """Create a new destination"""
    # Generate slug
    slug = f"{destination.country.lower().replace(' ', '-')}-{destination.name.lower().replace(' ', '-')}"

    db_destination = Destination(
        name=destination.name,
        country=destination.country,
        city_code=destination.city_code,
        description=destination.description,
        best_time_to_visit=destination.best_time_to_visit,
        avg_flight_price=destination.avg_flight_price,
        currency=destination.currency,
        highlights=destination.highlights,
        tags=destination.tags,
        is_featured=destination.is_featured,
        slug=slug,
    )

    db.add(db_destination)
    db.commit()
    db.refresh(db_destination)

    return {"message": "Destination created successfully", "id": str(db_destination.id)}


@router.put("/destinations/{destination_id}")
async def update_destination(
    destination_id: str, destination: DestinationUpdate, db: Session = Depends(get_db)
):
    """Update an existing destination"""
    db_destination = (
        db.query(Destination).filter(Destination.id == destination_id).first()
    )

    if not db_destination:
        raise HTTPException(status_code=404, detail="Destination not found")

    # Update fields
    for field, value in destination.dict(exclude_unset=True).items():
        setattr(db_destination, field, value)

    db_destination.updated_at = datetime.utcnow()
    db.commit()

    return {"message": "Destination updated successfully"}


@router.post("/destinations/{destination_id}/upload-image")
async def upload_destination_image(
    destination_id: str,
    file: UploadFile = File(...),
    image_type: str = "hero",  # "hero" or "gallery"
    db: Session = Depends(get_db),
):
    """Upload image for destination"""
    db_destination = (
        db.query(Destination).filter(Destination.id == destination_id).first()
    )

    if not db_destination:
        raise HTTPException(status_code=404, detail="Destination not found")

    # Upload image
    image_url = await image_service.upload_image(file, "destinations")

    if image_type == "hero":
        db_destination.hero_image = image_url
    else:
        # Add to gallery
        gallery = db_destination.gallery_images or []
        gallery.append(image_url)
        db_destination.gallery_images = gallery

    db.commit()

    return {"message": "Image uploaded successfully", "url": image_url}


@router.post("/guides")
async def create_guide(guide: GuideCreate, db: Session = Depends(get_db)):
    """Create a new travel guide"""
    # Generate slug
    slug = guide.title.lower().replace(" ", "-").replace("/", "-")

    db_guide = TravelGuide(
        title=guide.title,
        category=guide.category,
        content=guide.content,
        excerpt=guide.excerpt,
        author=guide.author,
        read_time=guide.read_time,
        tags=guide.tags,
        is_featured=guide.is_featured,
        slug=slug,
        is_published=True,
        published_at=datetime.utcnow(),
    )

    db.add(db_guide)
    db.commit()
    db.refresh(db_guide)

    return {"message": "Guide created successfully", "id": str(db_guide.id)}


@router.get("/destinations")
async def list_destinations_admin(
    page: int = 1, limit: int = 50, db: Session = Depends(get_db)
):
    """List all destinations for admin"""
    offset = (page - 1) * limit

    destinations = db.query(Destination).offset(offset).limit(limit).all()

    total = db.query(Destination).count()

    return {
        "destinations": [
            {
                "id": str(dest.id),
                "name": dest.name,
                "country": dest.country,
                "is_active": dest.is_active,
                "is_featured": dest.is_featured,
                "created_at": dest.created_at.isoformat(),
                "updated_at": dest.updated_at.isoformat(),
            }
            for dest in destinations
        ],
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
    }
