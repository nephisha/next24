import os
from pydantic import BaseSettings
from typing import Optional


class RailwaySettings(BaseSettings):
    """Railway-specific configuration"""

    # Railway provides these automatically
    railway_environment: str = os.getenv("RAILWAY_ENVIRONMENT", "development")
    railway_project_id: str = os.getenv("RAILWAY_PROJECT_ID", "")
    railway_service_id: str = os.getenv("RAILWAY_SERVICE_ID", "")

    # Database - Railway PostgreSQL
    database_url: str = os.getenv("DATABASE_URL", "postgresql://localhost/travel_db")
    database_private_url: Optional[str] = os.getenv(
        "DATABASE_PRIVATE_URL"
    )  # Railway internal network

    # Redis - Railway Redis or external
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    redis_private_url: Optional[str] = os.getenv(
        "REDIS_PRIVATE_URL"
    )  # Railway internal network

    # Use private URLs for internal communication (faster, no egress costs)
    @property
    def internal_database_url(self) -> str:
        return self.database_private_url or self.database_url

    @property
    def internal_redis_url(self) -> str:
        return self.redis_private_url or self.redis_url

    # External APIs
    serpapi_key: str = os.getenv("SERPAPI_KEY", "")
    amadeus_client_id: str = os.getenv("AMADEUS_CLIENT_ID", "")
    amadeus_client_secret: str = os.getenv("AMADEUS_CLIENT_SECRET", "")

    # Image storage - Use Railway volumes or external CDN
    image_storage_type: str = os.getenv(
        "IMAGE_STORAGE_TYPE", "cloudinary"
    )  # "railway", "cloudinary", "s3"
    cloudinary_cloud_name: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    cloudinary_api_key: str = os.getenv("CLOUDINARY_API_KEY", "")
    cloudinary_api_secret: str = os.getenv("CLOUDINARY_API_SECRET", "")

    # CORS for Vercel
    allowed_origins: list = [
        "https://*.vercel.app",
        "https://your-domain.com",
        "http://localhost:3000",  # Development
    ]

    # Railway-specific optimizations
    worker_processes: int = int(os.getenv("WEB_CONCURRENCY", "1"))
    max_connections: int = int(os.getenv("MAX_CONNECTIONS", "100"))

    class Config:
        env_file = ".env"


railway_settings = RailwaySettings()
