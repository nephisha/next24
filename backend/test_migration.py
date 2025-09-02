#!/usr/bin/env python3
"""
Simple test script to verify database migration works
Run this to test your setup before full migration
"""

import os
import sys

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


def test_imports():
    """Test if all required modules can be imported"""
    print("🧪 Testing imports...")

    try:
        from app.database import SessionLocal, check_database_connection, create_tables

        print("✅ Database modules imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import database modules: {e}")
        return False

    try:
        from app.models.destinations import Destination, TravelGuide

        print("✅ Model modules imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import model modules: {e}")
        return False

    return True


def test_database_connection():
    """Test database connection"""
    print("\n🔌 Testing database connection...")

    try:
        from app.database import check_database_connection

        if check_database_connection():
            print("✅ Database connection successful")
            return True
        else:
            print("❌ Database connection failed")
            return False
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return False


def test_table_creation():
    """Test table creation"""
    print("\n🏗️ Testing table creation...")

    try:
        from app.database import create_tables

        create_tables()
        print("✅ Tables created successfully")
        return True
    except Exception as e:
        print(f"❌ Table creation failed: {e}")
        return False


def test_basic_operations():
    """Test basic database operations"""
    print("\n📝 Testing basic database operations...")

    try:
        from app.database import SessionLocal
        from app.models.destinations import Destination

        db = SessionLocal()

        # Test query (should work even with empty table)
        count = db.query(Destination).count()
        print(f"✅ Current destinations in database: {count}")

        db.close()
        return True
    except Exception as e:
        print(f"❌ Database operations failed: {e}")
        return False


def main():
    """Run all tests"""
    print("🚀 Starting database setup tests...")
    print("=" * 50)

    # Check environment
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("⚠️  DATABASE_URL environment variable not set")
        print("   For local testing, you can set it like:")
        print("   export DATABASE_URL='postgresql://user:password@localhost/travel_db'")
        print("   Or create a .env file in the backend directory")
    else:
        print(f"📊 Using database: {database_url[:50]}...")

    # Run tests
    tests = [
        ("Import Test", test_imports),
        ("Database Connection", test_database_connection),
        ("Table Creation", test_table_creation),
        ("Basic Operations", test_basic_operations),
    ]

    passed = 0
    total = len(tests)

    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
            else:
                print(f"❌ {test_name} failed")
        except Exception as e:
            print(f"❌ {test_name} crashed: {e}")

    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed! You're ready to run the migration.")
        print("\nNext steps:")
        print("1. Run: python scripts/migrate_static_data.py")
        print("2. Start your FastAPI server: uvicorn app.main:app --reload")
        print("3. Test the API: curl http://localhost:8000/api/destinations/featured")
    else:
        print("⚠️  Some tests failed. Please fix the issues before running migration.")

        if not os.getenv("DATABASE_URL"):
            print("\n💡 Quick setup for local development:")
            print("1. Install PostgreSQL")
            print("2. Create database: createdb travel_db")
            print(
                "3. Set environment: export DATABASE_URL='postgresql://localhost/travel_db'"
            )


if __name__ == "__main__":
    main()
