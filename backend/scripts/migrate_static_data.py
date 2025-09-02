#!/usr/bin/env python3
"""
Migration script to convert static data to database records
Run this once to populate your database with initial data
"""

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, create_tables, check_database_connection
from app.models.destinations import Base, Destination, TravelGuide
from datetime import datetime
import uuid

# Static data from your current TypeScript files
DESTINATIONS_DATA = [
    {
        "name": "Paris",
        "country": "France",
        "city_code": "paris",
        "description": "The City of Light beckons with iconic landmarks, world-class museums, and romantic charm.",
        "image": "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800&h=600&fit=crop&auto=format&q=80",
        "highlights": ["Eiffel Tower", "Louvre Museum", "Notre-Dame"],
        "best_time": "Apr-Jun, Sep-Oct",
        "avg_flight_price": 650,
        "rating": 4.8,
        "tags": ["romantic", "culture", "art", "history"],
    },
    {
        "name": "London",
        "country": "United Kingdom",
        "city_code": "london",
        "description": "Royal heritage meets modern innovation in this cosmopolitan capital.",
        "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop&auto=format&q=80",
        "highlights": ["Big Ben", "British Museum", "Tower Bridge"],
        "best_time": "May-Sep",
        "avg_flight_price": 550,
        "rating": 4.7,
        "tags": ["history", "culture", "royal", "museums"],
    },
    {
        "name": "Rome",
        "country": "Italy",
        "city_code": "rome",
        "description": "The Eternal City where ancient history comes alive.",
        "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop&auto=format&q=80",
        "highlights": ["Colosseum", "Vatican City", "Trevi Fountain"],
        "best_time": "Apr-Jun, Sep-Oct",
        "avg_flight_price": 580,
        "rating": 4.9,
        "tags": ["history", "ancient", "culture", "food"],
    },
    {
        "name": "Barcelona",
        "country": "Spain",
        "city_code": "barcelona",
        "description": "Where Gaudí's dreams meet Mediterranean charm.",
        "image": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop&auto=format&q=80",
        "highlights": ["Sagrada Familia", "Park Güell", "Las Ramblas"],
        "best_time": "May-Jun, Sep-Oct",
        "avg_flight_price": 520,
        "rating": 4.6,
        "tags": ["architecture", "beach", "culture", "gaudi"],
    },
    {
        "name": "Berlin",
        "country": "Germany",
        "city_code": "berlin",
        "description": "Where history meets cutting-edge culture.",
        "image": "https://images.unsplash.com/photo-1587330979470-3016b6702d89?w=800&h=600&fit=crop&auto=format&q=80",
        "highlights": ["Brandenburg Gate", "Berlin Wall", "Museum Island"],
        "best_time": "May-Sep",
        "avg_flight_price": 480,
        "rating": 4.5,
        "tags": ["history", "culture", "nightlife", "modern"],
    },
    {
        "name": "Amsterdam",
        "country": "Netherlands",
        "city_code": "amsterdam",
        "description": "Venice of the North with canals, culture, and charm.",
        "image": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop&auto=format&q=80",
        "highlights": ["Anne Frank House", "Rijksmuseum", "Canal Ring"],
        "best_time": "Apr-May, Sep-Nov",
        "avg_flight_price": 520,
        "rating": 4.4,
        "tags": ["canals", "culture", "museums", "cycling"],
    },
    {
        "name": "Athens",
        "country": "Greece",
        "city_code": "athens",
        "description": "The cradle of Western civilization and democracy.",
        "image": "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&h=600&fit=crop&auto=format&q=80",
        "highlights": ["Acropolis", "Ancient Agora", "Plaka District"],
        "best_time": "Apr-Jun, Sep-Oct",
        "avg_flight_price": 590,
        "rating": 4.3,
        "tags": ["ancient", "history", "culture", "mythology"],
    },
    {
        "name": "Istanbul",
        "country": "Turkey",
        "city_code": "istanbul",
        "description": "Where Europe meets Asia in magnificent harmony.",
        "image": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop&auto=format&q=80",
        "highlights": ["Hagia Sophia", "Blue Mosque", "Grand Bazaar"],
        "best_time": "Apr-May, Sep-Nov",
        "avg_flight_price": 650,
        "rating": 4.6,
        "tags": ["culture", "history", "bazaar", "bridge"],
    },
    {
        "name": "Tokyo",
        "country": "Japan",
        "city_code": "tokyo",
        "description": "Where ancient traditions meet cutting-edge innovation.",
        "image": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop&auto=format&q=80",
        "highlights": ["Shibuya Crossing", "Senso-ji Temple", "Tokyo Skytree"],
        "best_time": "Mar-May, Sep-Nov",
        "avg_flight_price": 850,
        "rating": 4.8,
        "tags": ["technology", "tradition", "food", "modern"],
    },
    {
        "name": "Bangkok",
        "country": "Thailand",
        "city_code": "bangkok",
        "description": "The vibrant heart of Southeast Asia.",
        "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        "highlights": ["Grand Palace", "Wat Pho Temple", "Chatuchak Market"],
        "best_time": "Nov-Mar",
        "avg_flight_price": 780,
        "rating": 4.5,
        "tags": ["temples", "street-food", "culture", "tropical"],
    },
]

GUIDES_DATA = [
    {
        "title": "Ultimate Budget Travel Guide",
        "category": "budget",
        "excerpt": "Learn how to travel the world without breaking the bank with our comprehensive budget travel strategies.",
        "content": "Detailed budget travel content here...",
        "image": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
        "author": "Travel Expert",
        "read_time": 12,
        "tags": ["budget", "tips", "money-saving"],
    },
    {
        "title": "Essential Packing Checklist",
        "category": "packing",
        "excerpt": "Never forget anything important again with our ultimate packing checklist for every type of trip.",
        "content": "Comprehensive packing guide content...",
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
        "author": "Packing Pro",
        "read_time": 8,
        "tags": ["packing", "checklist", "travel-tips"],
    },
    {
        "title": "Best Beach Destinations for 2025",
        "category": "best-of",
        "excerpt": "Discover the world's most stunning beaches for your next tropical getaway.",
        "content": "Beach destinations guide content...",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
        "author": "Beach Explorer",
        "read_time": 15,
        "tags": ["beaches", "tropical", "destinations"],
    },
]


def setup_database():
    """Set up database connection and tables"""
    print("🔧 Setting up database...")

    # Check connection first
    if not check_database_connection():
        print(
            "❌ Cannot connect to database. Please check your DATABASE_URL environment variable."
        )
        print("   Example: DATABASE_URL=postgresql://user:password@localhost/travel_db")
        return False

    # Create tables
    try:
        create_tables()
        return True
    except Exception as e:
        print(f"❌ Failed to create tables: {e}")
        return False


def migrate_destinations(db: Session):
    """Migrate destination data to database"""
    print("🏙️ Migrating destinations...")

    for i, dest_data in enumerate(DESTINATIONS_DATA):
        # Generate slug
        slug = f"{dest_data['country'].lower().replace(' ', '-')}-{dest_data['name'].lower().replace(' ', '-')}"

        destination = Destination(
            name=dest_data["name"],
            country=dest_data["country"],
            city_code=dest_data["city_code"],
            description=dest_data["description"],
            hero_image=dest_data["image"],
            highlights=dest_data["highlights"],
            best_time_to_visit=dest_data["best_time"],
            avg_flight_price=dest_data["avg_flight_price"],
            rating=dest_data["rating"],
            tags=dest_data["tags"],
            slug=slug,
            is_active=True,
            is_featured=i < 6,  # First 6 are featured
            currency="USD",
            total_reviews=100 + (i * 50),  # Mock review counts
            popularity_score=1000 - (i * 100),  # Decreasing popularity
        )

        db.add(destination)

    db.commit()
    print(f"✅ Migrated {len(DESTINATIONS_DATA)} destinations")


def migrate_guides(db: Session):
    """Migrate guide data to database"""
    print("📚 Migrating travel guides...")

    for i, guide_data in enumerate(GUIDES_DATA):
        # Generate slug
        slug = guide_data["title"].lower().replace(" ", "-").replace("'", "")

        guide = TravelGuide(
            title=guide_data["title"],
            category=guide_data["category"],
            excerpt=guide_data["excerpt"],
            content=guide_data["content"],
            featured_image=guide_data["image"],
            author=guide_data["author"],
            read_time=guide_data["read_time"],
            tags=guide_data["tags"],
            slug=slug,
            is_published=True,
            is_featured=i < 3,  # First 3 are featured
            published_at=datetime.utcnow(),
        )

        db.add(guide)

    db.commit()
    print(f"✅ Migrated {len(GUIDES_DATA)} travel guides")


def main():
    """Run the migration"""
    print("🚀 Starting data migration...")
    print("=" * 50)

    # Set up database
    if not setup_database():
        return

    # Get database session
    db = SessionLocal()

    try:
        # Check if data already exists
        existing_destinations = db.query(Destination).count()
        existing_guides = db.query(TravelGuide).count()

        if existing_destinations > 0 or existing_guides > 0:
            print(
                f"⚠️  Data already exists: {existing_destinations} destinations, {existing_guides} guides"
            )
            response = input("Do you want to continue and add more data? (y/N): ")
            if response.lower() != "y":
                print("Migration cancelled")
                return

        # Migrate data
        migrate_destinations(db)
        migrate_guides(db)

        print("🎉 Migration completed successfully!")
        print("\nNext steps:")
        print("1. Update your frontend components to use the API")
        print("2. Set up automated data sync tasks")
        print("3. Configure image upload service")
        print("4. Set up admin panel for content management")

    except Exception as e:
        print(f"❌ Migration failed: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
