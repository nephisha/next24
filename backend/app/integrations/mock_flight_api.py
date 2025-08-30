import asyncio
from typing import List
from datetime import datetime, timedelta
import random
from app.models.flights import (
    Flight,
    FlightSegment,
    Airport,
    Airline,
    CabinClass,
    FlightSearchRequest,
)


class MockFlightAPI:
    """Mock flight API for development and testing"""

    def __init__(self):
        self.airlines = [
            {"code": "AA", "name": "American Airlines"},
            {"code": "DL", "name": "Delta Air Lines"},
            {"code": "UA", "name": "United Airlines"},
            {"code": "SW", "name": "Southwest Airlines"},
            {"code": "B6", "name": "JetBlue Airways"},
            {"code": "AS", "name": "Alaska Airlines"},
        ]

        self.airports = {
            "NYC": {"name": "New York", "city": "New York"},
            "LAX": {"name": "Los Angeles International", "city": "Los Angeles"},
            "CHI": {"name": "Chicago O'Hare", "city": "Chicago"},
            "MIA": {"name": "Miami International", "city": "Miami"},
            "LAS": {"name": "Las Vegas McCarran", "city": "Las Vegas"},
            "SFO": {"name": "San Francisco International", "city": "San Francisco"},
            "SEA": {"name": "Seattle-Tacoma International", "city": "Seattle"},
            "DEN": {"name": "Denver International", "city": "Denver"},
        }

    async def search_flights(self, search_request: FlightSearchRequest) -> List[Flight]:
        """Generate realistic mock flight data"""
        await asyncio.sleep(0.5)  # Simulate API delay

        flights = []
        num_flights = random.randint(5, 20)

        for i in range(num_flights):
            flight = self._generate_flight(search_request, i)
            flights.append(flight)

        return sorted(flights, key=lambda x: x.price)

    def _generate_flight(
        self, search_request: FlightSearchRequest, index: int
    ) -> Flight:
        airline = random.choice(self.airlines)

        # Generate realistic pricing based on route distance and time
        base_price = random.randint(150, 800)
        if search_request.departure_date == datetime.now().date():
            base_price *= 1.5  # Same-day premium

        # Add stops variation
        stops = random.choices([0, 1, 2], weights=[60, 30, 10])[0]
        if stops > 0:
            base_price *= 0.8  # Connecting flights cheaper

        # Generate flight segments
        segments = self._generate_segments(search_request, airline, stops)

        total_duration = sum(seg.duration_minutes for seg in segments)

        return Flight(
            id=f"mock_{airline['code']}_{index}_{search_request.departure_date}",
            segments=segments,
            total_duration_minutes=total_duration,
            stops=stops,
            price=round(base_price, 2),
            currency="USD",
            deep_link=f"https://example.com/book/{airline['code']}{random.randint(1000, 9999)}",
            provider="MockAPI",
        )

    def _generate_segments(
        self, search_request: FlightSearchRequest, airline: dict, stops: int
    ) -> List[FlightSegment]:
        segments = []

        # Outbound segment
        departure_time = datetime.combine(
            search_request.departure_date,
            datetime.now()
            .time()
            .replace(hour=random.randint(6, 22), minute=random.choice([0, 15, 30, 45])),
        )

        duration = random.randint(90, 360)  # 1.5 to 6 hours
        arrival_time = departure_time + timedelta(minutes=duration)

        origin_info = self.airports.get(
            search_request.origin,
            {"name": search_request.origin, "city": search_request.origin},
        )
        dest_info = self.airports.get(
            search_request.destination,
            {"name": search_request.destination, "city": search_request.destination},
        )

        segment = FlightSegment(
            origin=Airport(
                code=search_request.origin,
                name=origin_info["name"],
                city=origin_info["city"],
                country="US",
            ),
            destination=Airport(
                code=search_request.destination,
                name=dest_info["name"],
                city=dest_info["city"],
                country="US",
            ),
            departure_time=departure_time,
            arrival_time=arrival_time,
            duration_minutes=duration,
            flight_number=f"{airline['code']}{random.randint(100, 9999)}",
            airline=Airline(code=airline["code"], name=airline["name"]),
            cabin_class=search_request.cabin_class,
            booking_class=random.choice(["Y", "B", "M", "H", "Q", "V"]),
        )

        segments.append(segment)

        # Add connecting segments if stops > 0
        for _ in range(stops):
            # Add layover time
            departure_time = arrival_time + timedelta(minutes=random.randint(45, 180))
            duration = random.randint(60, 240)
            arrival_time = departure_time + timedelta(minutes=duration)

            # Mock connecting segment
            connecting_segment = FlightSegment(
                origin=segment.destination,
                destination=Airport(
                    code=search_request.destination,
                    name=dest_info["name"],
                    city=dest_info["city"],
                    country="US",
                ),
                departure_time=departure_time,
                arrival_time=arrival_time,
                duration_minutes=duration,
                flight_number=f"{airline['code']}{random.randint(100, 9999)}",
                airline=Airline(code=airline["code"], name=airline["name"]),
                cabin_class=search_request.cabin_class,
                booking_class=random.choice(["Y", "B", "M", "H", "Q", "V"]),
            )
            segments.append(connecting_segment)

        return segments
