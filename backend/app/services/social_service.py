from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, or_
from datetime import datetime, timedelta
import requests
import json
import asyncio
from ..models.social import (
    SocialMediaPost,
    UserGeneratedContent,
    PhotoContest,
    SocialMediaFeed,
    ContentStatus,
    SocialPlatform,
    MediaType,
)
from ..services.media_service import media_service, moderation_service
from ..database import get_db
import redis
from ..config import settings

# Redis client for caching
redis_client = None
if settings.redis_url:
    redis_client = redis.from_url(settings.redis_url, decode_responses=True)


class SocialMediaService:
    """Service for managing social media content"""

    def __init__(self, db: Session):
        self.db = db
        self.cache_ttl = 1800  # 30 minutes

    async def import_instagram_posts(
        self, hashtags: List[str], limit: int = 50
    ) -> Dict[str, Any]:
        """Import posts from Instagram using hashtags"""
        try:
            imported_count = 0

            for hashtag in hashtags:
                # This would integrate with Instagram Basic Display API
                # For now, we'll create mock data
                posts = await self._fetch_instagram_posts(
                    hashtag, limit // len(hashtags)
                )

                for post_data in posts:
                    # Check if post already exists
                    existing = (
                        self.db.query(SocialMediaPost)
                        .filter(SocialMediaPost.external_id == post_data["id"])
                        .first()
                    )

                    if existing:
                        continue

                    # Upload media to Cloudinary
                    media_result = await media_service.upload_from_url(
                        post_data["media_url"],
                        folder="instagram",
                        tags=[hashtag, "instagram", "travel"],
                    )

                    if not media_result["success"]:
                        continue

                    # Moderate content
                    moderation_result = await moderation_service.moderate_image(
                        media_result["url"]
                    )

                    # Create social media post
                    social_post = SocialMediaPost(
                        platform=SocialPlatform.INSTAGRAM,
                        external_id=post_data["id"],
                        external_url=post_data["permalink"],
                        caption=post_data.get("caption", ""),
                        hashtags=self._extract_hashtags(post_data.get("caption", "")),
                        media_type=MediaType.IMAGE,
                        media_url=media_result["url"],
                        media_width=media_result.get("width"),
                        media_height=media_result.get("height"),
                        file_size=media_result.get("bytes"),
                        author_username=post_data.get("username"),
                        likes_count=post_data.get("like_count", 0),
                        comments_count=post_data.get("comments_count", 0),
                        status=ContentStatus.APPROVED
                        if moderation_result["approved"]
                        else ContentStatus.FLAGGED,
                        moderation_score=moderation_result["score"],
                        moderation_flags=moderation_result["flags"],
                        posted_at=datetime.fromisoformat(
                            post_data["timestamp"].replace("Z", "+00:00")
                        ),
                    )

                    self.db.add(social_post)
                    imported_count += 1

            self.db.commit()

            # Clear cache
            self._clear_feed_cache()

            return {
                "success": True,
                "imported_count": imported_count,
                "message": f"Successfully imported {imported_count} posts",
            }

        except Exception as e:
            self.db.rollback()
            return {"success": False, "error": str(e)}

    async def submit_user_content(self, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """Submit user-generated content"""
        try:
            # Upload media
            if "file_content" in content_data:
                media_result = await media_service.upload_file(
                    content_data["file_content"],
                    content_data["filename"],
                    folder="user_uploads",
                    tags=["user_generated", "travel"],
                )
            else:
                media_result = await media_service.upload_from_url(
                    content_data["media_url"],
                    folder="user_uploads",
                    tags=["user_generated", "travel"],
                )

            if not media_result["success"]:
                return {"success": False, "error": "Failed to upload media"}

            # Moderate content
            moderation_result = await moderation_service.moderate_image(
                media_result["url"]
            )

            text_moderation = await moderation_service.moderate_text(
                content_data.get("description", "")
            )

            # Create user content
            user_content = UserGeneratedContent(
                user_email=content_data.get("user_email"),
                user_name=content_data.get("user_name"),
                user_instagram=content_data.get("user_instagram"),
                title=content_data["title"],
                description=content_data.get("description"),
                media_type=MediaType.IMAGE,  # Detect from file
                media_url=media_result["url"],
                thumbnail_url=media_service.get_thumbnail_url(
                    media_result["public_id"]
                ),
                destination_name=content_data.get("destination_name"),
                travel_date=datetime.fromisoformat(content_data["travel_date"])
                if content_data.get("travel_date")
                else None,
                trip_duration=content_data.get("trip_duration"),
                travel_budget=content_data.get("travel_budget"),
                travel_companions=content_data.get("travel_companions"),
                contest_id=content_data.get("contest_id"),
                campaign_hashtag=content_data.get("campaign_hashtag"),
                status=ContentStatus.APPROVED
                if (moderation_result["approved"] and text_moderation["approved"])
                else ContentStatus.PENDING,
            )

            self.db.add(user_content)
            self.db.commit()

            return {
                "success": True,
                "content_id": str(user_content.id),
                "status": user_content.status.value,
                "message": "Content submitted successfully",
            }

        except Exception as e:
            self.db.rollback()
            return {"success": False, "error": str(e)}

    async def get_social_feed(
        self, feed_name: str = "homepage", limit: int = 20, offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Get curated social media feed"""
        cache_key = f"social_feed:{feed_name}:{limit}:{offset}"

        # Try cache first
        try:
            cached_data = redis_client.get(cache_key)
            if cached_data:
                return json.loads(cached_data)
        except Exception:
            pass

        # Query database
        query = self.db.query(SocialMediaPost).filter(
            SocialMediaPost.status == ContentStatus.APPROVED
        )

        # Apply feed-specific filters
        if feed_name == "featured":
            query = query.filter(SocialMediaPost.is_featured == True)
        elif feed_name == "trending":
            query = query.filter(SocialMediaPost.is_trending == True)

        # Order by engagement and recency
        posts = (
            query.order_by(
                desc(SocialMediaPost.display_priority),
                desc(SocialMediaPost.likes_count + SocialMediaPost.comments_count),
                desc(SocialMediaPost.posted_at),
            )
            .offset(offset)
            .limit(limit)
            .all()
        )

        # Format response
        feed_data = []
        for post in posts:
            feed_data.append(
                {
                    "id": str(post.id),
                    "platform": post.platform.value,
                    "media_url": post.media_url,
                    "thumbnail_url": media_service.get_thumbnail_url(post.media_url)
                    if post.media_url
                    else None,
                    "caption": post.caption,
                    "hashtags": post.hashtags,
                    "author": {
                        "username": post.author_username,
                        "display_name": post.author_display_name,
                        "avatar_url": post.author_avatar_url,
                        "verified": post.author_verified,
                    },
                    "engagement": {
                        "likes": post.likes_count,
                        "comments": post.comments_count,
                        "shares": post.shares_count,
                    },
                    "location": post.location_name,
                    "posted_at": post.posted_at.isoformat() if post.posted_at else None,
                    "external_url": post.external_url,
                }
            )

        # Cache the result
        try:
            redis_client.setex(
                cache_key, self.cache_ttl, json.dumps(feed_data, default=str)
            )
        except Exception:
            pass

        return feed_data

    async def get_user_content_feed(
        self, contest_id: str = None, limit: int = 20
    ) -> List[Dict[str, Any]]:
        """Get user-generated content feed"""
        query = self.db.query(UserGeneratedContent).filter(
            UserGeneratedContent.status == ContentStatus.APPROVED
        )

        if contest_id:
            query = query.filter(UserGeneratedContent.contest_id == contest_id)

        contents = (
            query.order_by(
                desc(UserGeneratedContent.feature_score),
                desc(UserGeneratedContent.likes_count),
                desc(UserGeneratedContent.submitted_at),
            )
            .limit(limit)
            .all()
        )

        feed_data = []
        for content in contents:
            feed_data.append(
                {
                    "id": str(content.id),
                    "title": content.title,
                    "description": content.description,
                    "media_url": content.media_url,
                    "thumbnail_url": content.thumbnail_url,
                    "author": {
                        "name": content.user_name,
                        "instagram": content.user_instagram,
                    },
                    "destination": content.destination_name,
                    "travel_date": content.travel_date.isoformat()
                    if content.travel_date
                    else None,
                    "trip_details": {
                        "duration": content.trip_duration,
                        "budget": content.travel_budget,
                        "companions": content.travel_companions,
                    },
                    "engagement": {"likes": content.likes_count},
                    "submitted_at": content.submitted_at.isoformat(),
                }
            )

        return feed_data

    async def _fetch_instagram_posts(
        self, hashtag: str, limit: int
    ) -> List[Dict[str, Any]]:
        """Fetch posts from Instagram API (mock implementation)"""
        # This would integrate with Instagram Basic Display API
        # For now, return mock data
        mock_posts = []

        for i in range(min(limit, 10)):
            mock_posts.append(
                {
                    "id": f"mock_instagram_{hashtag}_{i}",
                    "permalink": f"https://instagram.com/p/mock_{i}",
                    "media_url": f"https://images.unsplash.com/photo-{1500000000 + i}-{i * 1000}?w=800&h=800&fit=crop",
                    "caption": f"Amazing travel experience! #{hashtag} #travel #wanderlust",
                    "username": f"traveler_{i}",
                    "like_count": 100 + (i * 50),
                    "comments_count": 10 + (i * 5),
                    "timestamp": (datetime.utcnow() - timedelta(days=i)).isoformat()
                    + "Z",
                }
            )

        return mock_posts

    def _extract_hashtags(self, text: str) -> List[str]:
        """Extract hashtags from text"""
        import re

        hashtags = re.findall(r"#(\w+)", text)
        return hashtags

    def _clear_feed_cache(self):
        """Clear all feed cache"""
        try:
            keys = redis_client.keys("social_feed:*")
            if keys:
                redis_client.delete(*keys)
        except Exception:
            pass


class PhotoContestService:
    """Service for managing photo contests"""

    def __init__(self, db: Session):
        self.db = db

    async def create_contest(self, contest_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new photo contest"""
        try:
            contest = PhotoContest(
                title=contest_data["title"],
                theme=contest_data["theme"],
                description=contest_data["description"],
                start_date=datetime.fromisoformat(contest_data["start_date"]),
                end_date=datetime.fromisoformat(contest_data["end_date"]),
                prize_description=contest_data.get("prize_description"),
                prize_value=contest_data.get("prize_value"),
                rules=contest_data.get("rules", []),
                hashtags=contest_data.get("hashtags", []),
                max_entries_per_user=contest_data.get("max_entries_per_user", 3),
                cover_image=contest_data.get("cover_image"),
                is_featured=contest_data.get("is_featured", False),
            )

            self.db.add(contest)
            self.db.commit()

            return {
                "success": True,
                "contest_id": str(contest.id),
                "message": "Contest created successfully",
            }

        except Exception as e:
            self.db.rollback()
            return {"success": False, "error": str(e)}

    async def get_active_contests(self) -> List[Dict[str, Any]]:
        """Get all active contests"""
        now = datetime.utcnow()

        contests = (
            self.db.query(PhotoContest)
            .filter(
                and_(
                    PhotoContest.is_active == True,
                    PhotoContest.start_date <= now,
                    PhotoContest.end_date >= now,
                )
            )
            .order_by(desc(PhotoContest.is_featured), desc(PhotoContest.start_date))
            .all()
        )

        contest_data = []
        for contest in contests:
            contest_data.append(
                {
                    "id": str(contest.id),
                    "title": contest.title,
                    "theme": contest.theme,
                    "description": contest.description,
                    "start_date": contest.start_date.isoformat(),
                    "end_date": contest.end_date.isoformat(),
                    "prize_description": contest.prize_description,
                    "prize_value": contest.prize_value,
                    "rules": contest.rules,
                    "hashtags": contest.hashtags,
                    "max_entries_per_user": contest.max_entries_per_user,
                    "cover_image": contest.cover_image,
                    "is_featured": contest.is_featured,
                    "total_entries": contest.total_entries,
                    "total_participants": contest.total_participants,
                }
            )

        return contest_data
