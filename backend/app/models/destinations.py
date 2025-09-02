from sqlalchemy import Column, String, Float, Integer, Text, DateTime, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()


class Destination(Base):
    __tablename__ = "destinations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    country = Column(String(100), nullable=False)
    city_code = Column(String(10), nullable=False, unique=True)
    description = Column(Text)

    # Images and media
    hero_image = Column(String(500))
    gallery_images = Column(JSON)  # Array of image URLs

    # Travel info
    best_time_to_visit = Column(String(50))  # e.g., "Apr-Jun, Sep-Oct"
    avg_flight_price = Column(Float)
    currency = Column(String(3))  # USD, EUR, etc.

    # Ratings and popularity
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    popularity_score = Column(Integer, default=0)

    # Highlights and features
    highlights = Column(JSON)  # Array of key attractions
    tags = Column(JSON)  # Array of tags like ["romantic", "adventure", "culture"]

    # SEO and metadata
    slug = Column(String(255), unique=True)
    meta_title = Column(String(255))
    meta_description = Column(Text)

    # Status and timestamps
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DestinationPricing(Base):
    __tablename__ = "destination_pricing"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    destination_id = Column(UUID(as_uuid=True), nullable=False)

    # Dynamic pricing data
    avg_hotel_price = Column(Float)
    avg_meal_price = Column(Float)
    avg_transport_price = Column(Float)
    budget_range = Column(String(20))  # "budget", "mid-range", "luxury"

    # Seasonal pricing
    season = Column(String(20))  # "peak", "shoulder", "off-season"
    price_multiplier = Column(Float, default=1.0)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class TravelGuide(Base):
    __tablename__ = "travel_guides"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    category = Column(String(100))  # "budget", "packing", "best-of", etc.
    content = Column(Text)
    excerpt = Column(Text)

    # Media
    featured_image = Column(String(500))
    gallery_images = Column(JSON)

    # Metadata
    author = Column(String(100))
    read_time = Column(Integer)  # in minutes
    tags = Column(JSON)

    # SEO
    slug = Column(String(255), unique=True)
    meta_title = Column(String(255))
    meta_description = Column(Text)

    # Status
    is_published = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    published_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
