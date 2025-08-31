import httpx
import asyncio
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.config import settings
from app.models.flights import (
    Flight,
    FlightSegment,
    Airport,
    Airline,
    CabinClass,
    FlightSearchRequest,
)
import logging

logger = logging.getLogger(__name__)


# Airport code to currency mapping for SerpAPI
AIRPORT_CURRENCY_MAP = {
    # United States
    "JFK": "USD",
    "LAX": "USD",
    "ORD": "USD",
    "MIA": "USD",
    "SFO": "USD",
    "LAS": "USD",
    "SEA": "USD",
    "DEN": "USD",
    "ATL": "USD",
    "DFW": "USD",
    "PHX": "USD",
    "IAH": "USD",
    "BOS": "USD",
    "MSP": "USD",
    "DTW": "USD",
    "PHL": "USD",
    "LGA": "USD",
    "BWI": "USD",
    "DCA": "USD",
    "IAD": "USD",
    # United Kingdom
    "LHR": "GBP",
    "LGW": "GBP",
    "STN": "GBP",
    "LTN": "GBP",
    "MAN": "GBP",
    "EDI": "GBP",
    "GLA": "GBP",
    "BHX": "GBP",
    "NCL": "GBP",
    # Eurozone
    "CDG": "EUR",
    "ORY": "EUR",  # France
    "FRA": "EUR",
    "MUC": "EUR",
    "DUS": "EUR",
    "BER": "EUR",  # Germany
    "AMS": "EUR",  # Netherlands
    "MAD": "EUR",
    "BCN": "EUR",  # Spain
    "FCO": "EUR",
    "MXP": "EUR",
    "LIN": "EUR",  # Italy
    "VIE": "EUR",  # Austria
    "BRU": "EUR",  # Belgium
    "LIS": "EUR",  # Portugal
    "ATH": "EUR",  # Greece
    "DUB": "EUR",  # Ireland
    "HEL": "EUR",  # Finland
    # Non-Eurozone Europe
    "ZUR": "CHF",  # Switzerland
    "CPH": "DKK",  # Denmark
    "ARN": "SEK",
    "GOT": "SEK",  # Sweden
    "OSL": "NOK",  # Norway
    # Asia Pacific
    "NRT": "JPY",
    "HND": "JPY",
    "KIX": "JPY",  # Japan
    "ICN": "KRW",
    "GMP": "KRW",  # South Korea
    "PVG": "CNY",
    "PEK": "CNY",
    "CAN": "CNY",
    "SZX": "CNY",  # China
    "HKG": "HKD",  # Hong Kong
    "TPE": "TWD",  # Taiwan
    "SIN": "SGD",  # Singapore
    "BKK": "THB",
    "DMK": "THB",  # Thailand
    "KUL": "MYR",
    "PEN": "MYR",  # Malaysia
    "CGK": "IDR",
    "DPS": "IDR",  # Indonesia
    "MNL": "PHP",  # Philippines
    "SYD": "AUD",
    "MEL": "AUD",
    "BNE": "AUD",
    "PER": "AUD",
    "ADL": "AUD",  # Australia
    "AKL": "NZD",
    "CHC": "NZD",  # New Zealand
    # India
    "DEL": "INR",
    "BOM": "INR",
    "MAA": "INR",
    "BLR": "INR",
    "HYD": "INR",
    "CCU": "INR",
    "COK": "INR",
    "GOI": "INR",
    "AMD": "INR",
    "PNQ": "INR",
    # Middle East
    "DXB": "AED",
    "AUH": "AED",  # UAE
    "DOH": "QAR",  # Qatar
    "KWI": "KWD",  # Kuwait
    "RUH": "SAR",
    "JED": "SAR",
    "DMM": "SAR",  # Saudi Arabia
    "BAH": "BHD",  # Bahrain
    "MCT": "OMR",  # Oman
    "IST": "TRY",
    "SAW": "TRY",  # Turkey
    "TLV": "ILS",  # Israel
    # Canada
    "YYZ": "CAD",
    "YVR": "CAD",
    "YUL": "CAD",
    "YYC": "CAD",
    "YOW": "CAD",
    # South America
    "GRU": "BRL",
    "GIG": "BRL",
    "BSB": "BRL",  # Brazil
    "EZE": "ARS",
    "AEP": "ARS",  # Argentina
    "SCL": "CLP",  # Chile
    "LIM": "PEN",  # Peru
    "BOG": "COP",  # Colombia
    "UIO": "USD",  # Ecuador (uses USD)
    # Africa
    "CAI": "EGP",  # Egypt
    "JNB": "ZAR",
    "CPT": "ZAR",
    "DUR": "ZAR",  # South Africa
    "LOS": "NGN",
    "ABV": "NGN",  # Nigeria
    "ADD": "ETB",  # Ethiopia
    "NBO": "KES",  # Kenya
    "CMN": "MAD",
    "RAK": "MAD",  # Morocco
    # Eastern Europe
    "SVO": "RUB",
    "DME": "RUB",
    "VKO": "RUB",  # Russia
    "WAW": "PLN",
    "KRK": "PLN",  # Poland
    "PRG": "CZK",  # Czech Republic
    "BUD": "HUF",  # Hungary
    "OTP": "RON",  # Romania
    "SOF": "BGN",  # Bulgaria
    "ZAG": "HRK",  # Croatia
    "BEG": "RSD",  # Serbia
}


def get_airport_currency(airport_code: str) -> str:
    """Get the currency for an airport code"""
    return AIRPORT_CURRENCY_MAP.get(airport_code.upper(), "USD")


class SerpAPIFlights:
    """
    SerpAPI Google Flights integration
    Scrapes Google Flights results through SerpAPI

    Sign up at: https://serpapi.com/
    Pricing: $50/month for 5,000 searches
    """

    def __init__(self):
        self.base_url = "https://serpapi.com/search"
        self.api_key = getattr(settings, "serpapi_key", None)

    async def search_flights(self, search_request: FlightSearchRequest) -> List[Flight]:
        """Search flights using SerpAPI Google Flights"""
        if not self.api_key:
            logger.warning("SerpAPI key not configured")
            return []

        try:
            # Use shorter timeout to allow for response processing
            async with httpx.AsyncClient(timeout=20.0) as client:
                params = self._build_search_params(search_request)
                logger.info(f"SerpAPI request params: {params}")

                response = await client.get(self.base_url, params=params)
                logger.info(f"SerpAPI response status: {response.status_code}")

                if response.status_code != 200:
                    logger.error(
                        f"SerpAPI error {response.status_code}: {response.text}"
                    )
                    return []

                data = response.json()
                logger.info(f"SerpAPI response keys: {list(data.keys())}")

                if "error" in data:
                    logger.error(f"SerpAPI returned error: {data['error']}")
                    return []

                return self._parse_flights(data, search_request)

        except httpx.TimeoutException as e:
            logger.warning(f"SerpAPI timeout after 20s: {e}")
            return []
        except httpx.HTTPStatusError as e:
            logger.error(
                f"SerpAPI HTTP error {e.response.status_code}: {e.response.text}"
            )
            return []
        except httpx.RequestError as e:
            logger.error(f"SerpAPI request error: {e}")
            return []
        except Exception as e:
            logger.error(f"SerpAPI error: {e}")
            return []

    def _build_search_params(
        self, search_request: FlightSearchRequest
    ) -> Dict[str, Any]:
        """Build SerpAPI parameters for Google Flights search"""
        # Normalize airport codes to uppercase for case-insensitive handling
        origin_code = search_request.origin.upper()
        destination_code = search_request.destination.upper()

        # Map common city codes to specific airport codes for SerpAPI
        airport_mapping = {
            "NYC": "JFK",  # Use JFK for New York
            "CHI": "ORD",  # Use ORD for Chicago
            "WAS": "DCA",  # Use DCA for Washington
            "LON": "LHR",  # Use LHR for London
            "PAR": "CDG",  # Use CDG for Paris
            "TOK": "NRT",  # Use NRT for Tokyo
            "BER": "BER",  # Use BER for Berlin
            "ROM": "FCO",  # Use FCO for Rome
            "MIL": "MXP",  # Use MXP for Milan
            "BAR": "BCN",  # Use BCN for Barcelona
            "MAD": "MAD",  # MAD is fine for Madrid
            "AMS": "AMS",  # AMS is fine for Amsterdam
            "FRA": "FRA",  # FRA is fine for Frankfurt
            "ZUR": "ZUR",  # ZUR is fine for Zurich
            "VIE": "VIE",  # VIE is fine for Vienna
            "CPH": "CPH",  # CPH is fine for Copenhagen
            "STO": "ARN",  # Use ARN for Stockholm
            "OSL": "OSL",  # OSL is fine for Oslo
            "HEL": "HEL",  # HEL is fine for Helsinki
            "DUB": "DUB",  # DUB is fine for Dublin
            "EDI": "EDI",  # EDI is fine for Edinburgh
            "MAN": "MAN",  # MAN is fine for Manchester
            "BRU": "BRU",  # BRU is fine for Brussels
            "LIS": "LIS",  # LIS is fine for Lisbon
            "ATH": "ATH",  # ATH is fine for Athens
            "IST": "IST",  # IST is fine for Istanbul
            "MOW": "SVO",  # Use SVO for Moscow
            "LED": "LED",  # LED is fine for St. Petersburg
            "WAW": "WAW",  # WAW is fine for Warsaw
            "PRG": "PRG",  # PRG is fine for Prague
            "BUD": "BUD",  # BUD is fine for Budapest
            "BUH": "OTP",  # Use OTP for Bucharest
            "SOF": "SOF",  # SOF is fine for Sofia
            "ZAG": "ZAG",  # ZAG is fine for Zagreb
            "BEG": "BEG",  # BEG is fine for Belgrade
            "SKP": "SKP",  # SKP is fine for Skopje
            "TIA": "TIA",  # TIA is fine for Tirana
            "LJU": "LJU",  # LJU is fine for Ljubljana
            "SJJ": "SJJ",  # SJJ is fine for Sarajevo
            "DBV": "DBV",  # DBV is fine for Dubrovnik
            "SPU": "SPU",  # SPU is fine for Split
            "PUY": "PUY",  # PUY is fine for Pula
            "RJK": "RJK",  # RJK is fine for Rijeka
            "ZAD": "ZAD",  # ZAD is fine for Zadar
        }

        origin = airport_mapping.get(origin_code, origin_code)
        destination = airport_mapping.get(destination_code, destination_code)

        # Get currency based on origin airport
        origin_currency = get_airport_currency(origin)

        params = {
            "engine": "google_flights",
            "departure_id": origin,
            "arrival_id": destination,
            "outbound_date": search_request.departure_date.strftime("%Y-%m-%d"),
            "adults": str(search_request.adults),  # Convert to string
            "currency": origin_currency,  # Use origin country currency
            "hl": "en",
            "api_key": self.api_key,
        }

        # Only add children and infants if > 0
        if search_request.children > 0:
            params["children"] = str(search_request.children)
        if search_request.infants > 0:
            params["infants"] = str(search_request.infants)

        if search_request.return_date:
            params["return_date"] = search_request.return_date.strftime("%Y-%m-%d")
            params["type"] = "1"  # Round trip
        else:
            params["type"] = "2"  # One way

        if search_request.direct_flights_only:
            params["stops"] = "0"

        # Add travel class
        params["travel_class"] = self._map_cabin_class(search_request.cabin_class)

        return params

    def _map_cabin_class(self, cabin_class: CabinClass) -> str:
        """Map internal cabin class to Google Flights format"""
        mapping = {
            CabinClass.ECONOMY: "1",
            CabinClass.PREMIUM_ECONOMY: "2",
            CabinClass.BUSINESS: "3",
            CabinClass.FIRST: "4",
        }
        return mapping.get(cabin_class, "1")

    def _parse_flights(
        self, data: Dict[str, Any], search_request: FlightSearchRequest
    ) -> List[Flight]:
        """Parse SerpAPI Google Flights response"""
        flights = []

        # SerpAPI returns flights in 'best_flights' and 'other_flights'
        all_flights = []
        all_flights.extend(data.get("best_flights", []))
        all_flights.extend(data.get("other_flights", []))

        for flight_data in all_flights:
            try:
                flight = self._parse_single_flight(flight_data, search_request)
                if flight:
                    flights.append(flight)
            except Exception as e:
                logger.warning(f"Failed to parse SerpAPI flight: {e}")
                continue

        return flights

    def _parse_single_flight(
        self, flight_data: Dict[str, Any], search_request: FlightSearchRequest
    ) -> Optional[Flight]:
        """Parse a single flight from SerpAPI response"""
        try:
            # Extract basic flight info
            price = flight_data.get("price", 0)
            # Use currency based on origin airport (same as what we sent to SerpAPI)
            currency = get_airport_currency(search_request.origin)

            # Extract total duration
            total_duration = flight_data.get("total_duration", 0)

            # Extract flights (segments)
            flight_segments = flight_data.get("flights", [])
            if not flight_segments:
                return None

            segments = []

            for segment_data in flight_segments:
                segment = self._parse_segment(segment_data, search_request.cabin_class)
                if segment:
                    segments.append(segment)

            if not segments:
                return None

            # Calculate stops
            stops = len(segments) - 1

            # Generate flight ID using first segment's flight number
            first_segment = segments[0]
            flight_id = f"serpapi_{first_segment.flight_number.replace(' ', '_')}_{search_request.departure_date}"

            return Flight(
                id=flight_id,
                segments=segments,
                total_duration_minutes=total_duration,
                stops=stops,
                price=float(price),
                currency=currency,
                deep_link=flight_data.get("booking_token", ""),
                provider="Google Flights",
            )

        except Exception as e:
            logger.warning(f"Error parsing SerpAPI flight: {e}")
            return None

    def _parse_segment(
        self, segment_data: Dict[str, Any], cabin_class: CabinClass
    ) -> Optional[FlightSegment]:
        """Parse a flight segment from SerpAPI data"""
        try:
            # Extract departure info
            departure = segment_data.get("departure_airport", {})
            arrival = segment_data.get("arrival_airport", {})

            # Extract times (SerpAPI format: "2025-08-31 11:30")
            dep_time_str = departure.get("time")
            arr_time_str = arrival.get("time")

            if not dep_time_str or not arr_time_str:
                return None

            # Parse times - SerpAPI uses format "2025-08-31 11:30"
            dep_time = datetime.strptime(dep_time_str, "%Y-%m-%d %H:%M")
            arr_time = datetime.strptime(arr_time_str, "%Y-%m-%d %H:%M")

            # Calculate duration
            duration_minutes = segment_data.get("duration", 0)

            # Extract airline info
            airline_name = segment_data.get("airline", "")

            # Extract flight number
            flight_number = segment_data.get("flight_number", "")

            # Extract airline code from flight number (e.g., "F9 2503" -> "F9")
            airline_code = flight_number.split()[0] if flight_number else ""

            return FlightSegment(
                origin=Airport(
                    code=departure.get("id", ""),
                    name=departure.get("name", ""),
                    city="",  # Not provided in this format
                    country="",
                ),
                destination=Airport(
                    code=arrival.get("id", ""),
                    name=arrival.get("name", ""),
                    city="",  # Not provided in this format
                    country="",
                ),
                departure_time=dep_time,
                arrival_time=arr_time,
                duration_minutes=duration_minutes,
                flight_number=flight_number,
                airline=Airline(code=airline_code, name=airline_name),
                cabin_class=cabin_class,
                booking_class="",
            )

        except Exception as e:
            logger.warning(f"Error parsing SerpAPI segment: {e}")
            return None
