from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # App Settings
    app_name: str = "LastMinute Travel API"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    # Database
    supabase_url: str
    supabase_anon_key: str

    # Redis Cache
    redis_url: str
    cache_ttl: int = 300  # 5 minutes for search results

    # External APIs
    kiwi_api_key: str
    skyscanner_api_key: str
    booking_api_key: Optional[str] = None

    # CORS
    allowed_origins: list = [
        "http://localhost:3000",
        "https://yourdomain.com",
        "https://*.vercel.app",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
