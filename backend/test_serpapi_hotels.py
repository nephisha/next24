#!/usr/bin/env python3
"""
Test script for SerpAPI Hotels integration.
"""

import os
import sys
from datetime import datetime, date, timedelta

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "app"))

from app.integrations.serpapi_hotels import HotelSearchParams, search_hotels_serpapi


def test_hotel_search():
    """Test hotel search functionality."""

    # Set up test parameters
    check_in = date.today() + timedelta(days=7)  # 1 week from now
    check_out = check_in + timedelta(days=2)  # 2 night stay

    params = HotelSearchParams(
        destination="Bali",
        check_in=check_in.isoformat(),
        check_out=check_out.isoformat(),
        adults=2,
        children=0,
        rooms=1,
    )

    print(f"Testing hotel search for {params.destination}")
    print(f"Check-in: {params.check_in}")
    print(f"Check-out: {params.check_out}")
    print(f"Guests: {params.adults} adults, {params.children} children")
    print(f"Rooms: {params.rooms}")
    print("-" * 50)

    try:
        # Search hotels
        response = search_hotels_serpapi(params)

        print(f"✅ Search completed successfully!")
        print(f"Search ID: {response.search_id}")
        print(f"Total results: {response.total_results}")
        print(f"Search time: {response.search_time_ms}ms")
        print(f"Providers: {', '.join(response.providers)}")
        print("-" * 50)

        # Display first few hotels
        for i, hotel in enumerate(response.hotels[:3]):
            print(f"\n🏨 Hotel {i + 1}: {hotel.name}")
            print(f"   📍 Location: {hotel.location.address}")
            print(f"   ⭐ Rating: {hotel.rating or 'N/A'}")
            print(
                f"   💰 Price: ${hotel.price_per_night:.2f}/night (${hotel.total_price:.2f} total)"
            )
            print(f"   🔗 Provider: {hotel.provider}")
            if hotel.amenities:
                amenities = [a.name for a in hotel.amenities[:3]]
                print(f"   🎯 Amenities: {', '.join(amenities)}")

        if len(response.hotels) > 3:
            print(f"\n... and {len(response.hotels) - 3} more hotels")

        return True

    except Exception as e:
        print(f"❌ Search failed: {e}")
        return False


if __name__ == "__main__":
    # Check if SERPAPI_KEY is set
    if not os.getenv("SERPAPI_KEY"):
        print("❌ SERPAPI_KEY environment variable not set!")
        print("Please set your SerpAPI key: export SERPAPI_KEY=your_key_here")
        sys.exit(1)

    print("🧪 Testing SerpAPI Hotels Integration")
    print("=" * 50)

    success = test_hotel_search()

    if success:
        print("\n✅ All tests passed! Hotel search integration is working.")
    else:
        print("\n❌ Tests failed. Please check your configuration.")
        sys.exit(1)
