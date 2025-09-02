from sqlalchemy import (
    Column,
    String,
    Text,
    DateTime,
    Boolean,
    Integer,
    Float,
    ForeignKey,
    JSON,
    Enum,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid
import enum

Base = declarative_base()


class ContentStatus(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    FLAGGED = "flagged"


class MediaType(enum.Enum):
    IMAGE = "image"
    VIDEO = "video"
    STORY = "story"


class SocialPlatform(enum.Enum):
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"
    TWITTER = "twitter"
    FACEBOOK = "facebook"
    YOUTUBE = "youtube"
    USER_UPLOAD = "user_upload"


class SocialMediaPost(Base):
    __tablename__ = "social_media_posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Platform and external data
    platform = Column(Enum(SocialPlatform), nullable=False)
    external_id = Column(String(255))  # Platform's post ID
    external_url = Column(String(500))

    # Content
    caption = Column(Text)
    hashtags = Column(JSON)  # Array of hashtags
    media_type = Column(Enum(MediaType), nullable=False)

    # Media storage
    media_url = Column(String(500), nullable=False)  # Cloudinary URL
    thumbnail_url = Column(String(500))  # For videos
    media_width = Column(Integer)
    media_height = Column(Integer)
    file_size = Column(Integer)  # In bytes

    # Author information
    author_username = Column(String(100))
    author_display_name = Column(String(255))
    author_avatar_url = Column(String(500))
    author_follower_count = Column(Integer)
    author_verified = Column(Boolean, default=False)

    # Engagement metrics
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    shares_count = Column(Integer, default=0)
    views_count = Column(Integer, default=0)

    # Travel-specific data
    location_name = Column(String(255))
    location_coordinates = Column(JSON)  # {"lat": 48.8566, "lng": 2.3522}
    destination_tags = Column(JSON)  # Array of destination names
    travel_season = Column(String(20))  # spring, summer, fall, winter

    # Content moderation
    status = Column(Enum(ContentStatus), default=ContentStatus.PENDING)
    moderation_score = Column(Float)  # AI moderation score 0-1
    moderation_flags = Column(JSON)  # Array of detected issues
    moderated_by = Column(String(100))  # Admin username
    moderated_at = Column(DateTime)

    # Display settings
    is_featured = Column(Boolean, default=False)
    is_trending = Column(Boolean, default=False)
    display_priority = Column(Integer, default=0)

    # Timestamps
    posted_at = Column(DateTime)  # Original post date
    imported_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class UserGeneratedContent(Base):
    __tablename__ = "user_generated_content"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # User information
    user_email = Column(String(255))
    user_name = Column(String(255))
    user_instagram = Column(String(100))

    # Content
    title = Column(String(255), nullable=False)
    description = Column(Text)
    media_type = Column(Enum(MediaType), nullable=False)

    # Media storage
    media_url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500))

    # Travel details
    destination_name = Column(String(255))
    travel_date = Column(DateTime)
    trip_duration = Column(Integer)  # Days
    travel_budget = Column(String(50))  # "budget", "mid-range", "luxury"
    travel_companions = Column(String(100))  # "solo", "couple", "family", "friends"

    # Contest/campaign
    contest_id = Column(UUID(as_uuid=True), ForeignKey("photo_contests.id"))
    campaign_hashtag = Column(String(100))

    # Engagement
    likes_count = Column(Integer, default=0)
    feature_score = Column(Float, default=0.0)  # Algorithm score for featuring

    # Moderation
    status = Column(Enum(ContentStatus), default=ContentStatus.PENDING)
    moderation_notes = Column(Text)

    # Timestamps
    submitted_at = Column(DateTime, default=datetime.utcnow)
    featured_at = Column(DateTime)

    # Relationships
    contest = relationship("PhotoContest", back_populates="entries")


class PhotoContest(Base):
    __tablename__ = "photo_contests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    theme = Column(String(255), nullable=False)
    description = Column(Text)

    # Contest details
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    prize_description = Column(Text)
    prize_value = Column(Float)

    # Rules and guidelines
    rules = Column(JSON)  # Array of rules
    hashtags = Column(JSON)  # Required hashtags
    max_entries_per_user = Column(Integer, default=3)

    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)

    # Metrics
    total_entries = Column(Integer, default=0)
    total_participants = Column(Integer, default=0)

    # Media
    cover_image = Column(String(500))

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    entries = relationship("UserGeneratedContent", back_populates="contest")


class SocialMediaFeed(Base):
    __tablename__ = "social_media_feeds"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Feed configuration
    name = Column(String(255), nullable=False)  # "homepage_feed", "destination_feed"
    description = Column(Text)

    # Content filters
    platforms = Column(JSON)  # Array of platforms to include
    hashtags = Column(JSON)  # Required hashtags
    destinations = Column(JSON)  # Destination filters
    content_types = Column(JSON)  # Media types to include

    # Display settings
    max_posts = Column(Integer, default=20)
    refresh_interval = Column(Integer, default=3600)  # Seconds

    # Algorithm settings
    engagement_weight = Column(Float, default=0.4)
    recency_weight = Column(Float, default=0.3)
    quality_weight = Column(Float, default=0.3)

    # Status
    is_active = Column(Boolean, default=True)
    last_updated = Column(DateTime)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ContentModerationLog(Base):
    __tablename__ = "content_moderation_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Content reference
    content_type = Column(String(50))  # "social_post", "user_content"
    content_id = Column(UUID(as_uuid=True), nullable=False)

    # Moderation details
    action = Column(String(50))  # "approved", "rejected", "flagged"
    reason = Column(Text)
    moderator = Column(String(100))

    # AI moderation data
    ai_score = Column(Float)
    ai_flags = Column(JSON)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
