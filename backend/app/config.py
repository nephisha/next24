from pydantic_settings import BaseSettings
from typing import Optional, List, Union
from pydantic import field_validator
import os


class Settings(BaseSettings):
    # App Settings
    app_name: str = "LastMinute Travel API"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    # Database
    database_url: Optional[str] = None
    supabase_url: Optional[str] = None
    supabase_anon_key: Optional[str] = None

    # Redis Cache
    redis_url: Optional[str] = None
    cache_ttl: int = 300  # 5 minutes for search results

    # External APIs
    kiwi_api_key: Optional[str] = None
    skyscanner_api_key: Optional[str] = None
    booking_api_key: Optional[str] = None
    aviasales_api_token: Optional[str] = None
    aviasales_partner_id: Optional[str] = None

    # Better alternatives
    amadeus_client_id: Optional[str] = None
    amadeus_client_secret: Optional[str] = None
    rapidapi_key: Optional[str] = None

    # Google Flights alternatives
    serpapi_key: Optional[str] = None  # SerpAPI for Google Flights scraping
    travelpayouts_token: Optional[str] = None  # Travelpayouts official API
    travelpayouts_marker: Optional[str] = None  # Travelpayouts affiliate marker

    # Development mode
    use_mock_data: bool = False

    # CORS
    allowed_origins: Union[List[str], str] = [
        "http://localhost:3000",
        "https://next24.xyz",
        "https://*.vercel.app",
    ]

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
