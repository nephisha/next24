from supabase import create_client, Client
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class SupabaseClient:
    _instance: Client = None

    @classmethod
    def get_client(cls) -> Client:
        if cls._instance is None:
            if not settings.supabase_url or not settings.supabase_anon_key:
                logger.warning(
                    "Supabase credentials not configured - database features disabled"
                )
                return None
            try:
                cls._instance = create_client(
                    settings.supabase_url, settings.supabase_anon_key
                )
                logger.info("Supabase client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")
                return None
        return cls._instance


supabase: Client = SupabaseClient.get_client()
