from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from typing import Generator, Optional
from supabase import create_client, Client

# Database URL from environment (Railway will provide this)
# Try multiple possible environment variable names
DATABASE_URL = (
    os.getenv("DATABASE_URL")
    or os.getenv("POSTGRES_URL")
    or os.getenv("POSTGRESQL_URL")
    or os.getenv("DB_URL")
    or "postgresql://localhost/travel_db"
)

print(
    f"🔍 Using DATABASE_URL: {DATABASE_URL[:50]}..."
    if len(DATABASE_URL) > 50
    else f"🔍 Using DATABASE_URL: {DATABASE_URL}"
)

# Handle Railway's postgres:// URL format (convert to postgresql://)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    print("🔄 Converted postgres:// to postgresql://")

# Also try to build URL from individual components if main URL not available
if DATABASE_URL == "postgresql://localhost/travel_db":
    # Try to build from individual environment variables
    db_host = os.getenv("PGHOST") or os.getenv("DB_HOST")
    db_port = os.getenv("PGPORT") or os.getenv("DB_PORT") or "5432"
    db_name = os.getenv("PGDATABASE") or os.getenv("DB_NAME")
    db_user = os.getenv("PGUSER") or os.getenv("DB_USER")
    db_password = os.getenv("PGPASSWORD") or os.getenv("DB_PASSWORD")

    if all([db_host, db_name, db_user, db_password]):
        DATABASE_URL = (
            f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        )
        print(
            f"🔧 Built DATABASE_URL from components: postgresql://{db_user}:***@{db_host}:{db_port}/{db_name}"
        )

# Create engine with Railway-optimized settings
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False,  # Set to True for SQL debugging
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Supabase client (optional)
supabase: Optional[Client] = None

# Initialize Supabase client if credentials are provided
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if SUPABASE_URL and SUPABASE_ANON_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        print("✅ Supabase client initialized")
    except Exception as e:
        print(f"⚠️ Supabase initialization failed: {e}")
        supabase = None
else:
    print("⚠️ Supabase credentials not provided - logging disabled")


def get_db() -> Generator:
    """Database dependency for FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")


def check_database_connection():
    """Check if database connection is working"""
    try:
        from sqlalchemy import text

        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
