from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.cache import cache
from app.api.v1 import flights, hotels

# ─────────────────────────────
# Logging Configuration
# ─────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ─────────────────────────────
# FastAPI App Lifecycle
# ─────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up application...")
    await cache.connect()
    yield
    logger.info("Shutting down application...")
    await cache.close()


# ─────────────────────────────
# FastAPI App Initialization
# ─────────────────────────────
app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    lifespan=lifespan,
)

# ─────────────────────────────
# Middleware Configuration
# ─────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.debug else settings.allowed_origins,
    allow_credentials=False if settings.debug else True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# ─────────────────────────────
# Exception Handlers
# ─────────────────────────────
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    body = await request.body()
    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors(),
            "raw_body": body.decode("utf-8"),
        },
    )


# ─────────────────────────────
# Routers
# ─────────────────────────────
app.include_router(
    flights.router, prefix=f"{settings.api_v1_prefix}/flights", tags=["flights"]
)
app.include_router(
    hotels.router, prefix=f"{settings.api_v1_prefix}/hotels", tags=["hotels"]
)


# ─────────────────────────────
# Base Routes
# ─────────────────────────────
@app.get("/")
async def root():
    return {"message": "LastMinute Travel API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2025-07-16T00:00:00Z"}
