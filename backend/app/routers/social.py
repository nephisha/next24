from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
from ..services.social_service import SocialMediaService, PhotoContestService
from ..services.media_service import media_service
import json

router = APIRouter(prefix="/api/social", tags=["social"])


# Pydantic models for request/response
class UserContentSubmission(BaseModel):
    title: str
    description: Optional[str] = None
    user_name: str
    user_email: str
    user_instagram: Optional[str] = None
    destination_name: Optional[str] = None
    travel_date: Optional[str] = None
    trip_duration: Optional[int] = None
    travel_budget: Optional[str] = None
    travel_companions: Optional[str] = None
    contest_id: Optional[str] = None
    campaign_hashtag: Optional[str] = None


class ContestCreate(BaseModel):
    title: str
    theme: str
    description: str
    start_date: str
    end_date: str
    prize_description: Optional[str] = None
    prize_value: Optional[float] = None
    rules: Optional[List[str]] = []
    hashtags: Optional[List[str]] = []
    max_entries_per_user: Optional[int] = 3
    cover_image: Optional[str] = None
    is_featured: Optional[bool] = False


@router.get("/feed/{feed_type}")
async def get_social_feed(
    feed_type: str = "homepage",
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    """Get social media feed"""
    service = SocialMediaService(db)
    feed_data = await service.get_social_feed(feed_type, limit, offset)

    return {"feed_type": feed_type, "posts": feed_data, "count": len(feed_data)}


@router.get("/user-content")
async def get_user_content_feed(
    contest_id: Optional[str] = None, limit: int = 20, db: Session = Depends(get_db)
):
    """Get user-generated content feed"""
    service = SocialMediaService(db)
    content_data = await service.get_user_content_feed(contest_id, limit)

    return {"content": content_data, "count": len(content_data)}


@router.post("/submit-content")
async def submit_user_content(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(None),
    user_name: str = Form(...),
    user_email: str = Form(...),
    user_instagram: str = Form(None),
    destination_name: str = Form(None),
    travel_date: str = Form(None),
    trip_duration: int = Form(None),
    travel_budget: str = Form(None),
    travel_companions: str = Form(None),
    contest_id: str = Form(None),
    campaign_hashtag: str = Form(None),
    db: Session = Depends(get_db),
):
    """Submit user-generated content with file upload"""

    # Validate file
    if not file.content_type.startswith(("image/", "video/")):
        raise HTTPException(
            status_code=400, detail="Only image and video files are allowed"
        )

    # Read file content
    file_content = await file.read()

    # Prepare content data
    content_data = {
        "file_content": file_content,
        "filename": file.filename,
        "title": title,
        "description": description,
        "user_name": user_name,
        "user_email": user_email,
        "user_instagram": user_instagram,
        "destination_name": destination_name,
        "travel_date": travel_date,
        "trip_duration": trip_duration,
        "travel_budget": travel_budget,
        "travel_companions": travel_companions,
        "contest_id": contest_id,
        "campaign_hashtag": campaign_hashtag,
    }

    service = SocialMediaService(db)
    result = await service.submit_user_content(content_data)

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])

    return result


@router.post("/submit-content-url")
async def submit_content_from_url(
    content: UserContentSubmission, media_url: str, db: Session = Depends(get_db)
):
    """Submit user-generated content from URL"""

    content_data = content.dict()
    content_data["media_url"] = media_url

    service = SocialMediaService(db)
    result = await service.submit_user_content(content_data)

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])

    return result


@router.post("/import-instagram")
async def import_instagram_posts(
    hashtags: List[str], limit: int = 50, db: Session = Depends(get_db)
):
    """Import posts from Instagram (admin endpoint)"""
    service = SocialMediaService(db)
    result = await service.import_instagram_posts(hashtags, limit)

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])

    return result


# Photo Contest endpoints
@router.post("/contests")
async def create_contest(contest: ContestCreate, db: Session = Depends(get_db)):
    """Create a new photo contest"""
    service = PhotoContestService(db)
    result = await service.create_contest(contest.dict())

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])

    return result


@router.get("/contests")
async def get_active_contests(db: Session = Depends(get_db)):
    """Get all active photo contests"""
    service = PhotoContestService(db)
    contests = await service.get_active_contests()

    return {"contests": contests, "count": len(contests)}


@router.get("/contests/{contest_id}/entries")
async def get_contest_entries(
    contest_id: str, limit: int = 50, db: Session = Depends(get_db)
):
    """Get entries for a specific contest"""
    service = SocialMediaService(db)
    entries = await service.get_user_content_feed(contest_id, limit)

    return {"contest_id": contest_id, "entries": entries, "count": len(entries)}


# Media optimization endpoints
@router.get("/media/optimize")
async def get_optimized_media_url(
    url: str,
    width: Optional[int] = None,
    height: Optional[int] = None,
    quality: str = "auto:good",
):
    """Get optimized media URL"""

    # Extract public_id from Cloudinary URL
    if "cloudinary.com" in url:
        # Extract public_id from URL
        parts = url.split("/")
        if "upload" in parts:
            upload_index = parts.index("upload")
            public_id = "/".join(parts[upload_index + 2 :]).split(".")[0]

            optimized_url = media_service.get_optimized_url(
                public_id, width, height, quality
            )

            return {
                "original_url": url,
                "optimized_url": optimized_url,
                "width": width,
                "height": height,
                "quality": quality,
            }

    return {
        "original_url": url,
        "optimized_url": url,
        "message": "No optimization applied",
    }


@router.get("/stats")
async def get_social_stats(db: Session = Depends(get_db)):
    """Get social media statistics"""
    from ..models.social import SocialMediaPost, UserGeneratedContent, PhotoContest

    # Get statistics
    total_posts = db.query(SocialMediaPost).count()
    approved_posts = (
        db.query(SocialMediaPost).filter(SocialMediaPost.status == "approved").count()
    )

    total_user_content = db.query(UserGeneratedContent).count()
    approved_user_content = (
        db.query(UserGeneratedContent)
        .filter(UserGeneratedContent.status == "approved")
        .count()
    )

    active_contests = (
        db.query(PhotoContest).filter(PhotoContest.is_active == True).count()
    )

    return {
        "social_posts": {
            "total": total_posts,
            "approved": approved_posts,
            "approval_rate": (approved_posts / total_posts * 100)
            if total_posts > 0
            else 0,
        },
        "user_content": {
            "total": total_user_content,
            "approved": approved_user_content,
            "approval_rate": (approved_user_content / total_user_content * 100)
            if total_user_content > 0
            else 0,
        },
        "contests": {"active": active_contests},
    }
