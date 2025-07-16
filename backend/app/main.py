from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from app.config import settings
from app.cache import cache
from app.api.v1 import flights, hotels

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up application...")
    await cache.connect()
    yield
    # Shutdown
    logger.info("Shutting down application...")
    await cache.close()


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    flights.router, prefix=f"{settings.api_v1_prefix}/flights", tags=["flights"]
)
app.include_router(
    hotels.router, prefix=f"{settings.api_v1_prefix}/hotels", tags=["hotels"]
)


@app.get("/")
async def root():
    return {"message": "LastMinute Travel API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2025-07-16T00:00:00Z"}
