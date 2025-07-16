import redis.asyncio as redis
import json
import hashlib
from typing import Any, Optional
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class RedisCache:
    def __init__(self):
        self.redis_client = None

    async def connect(self):
        try:
            self.redis_client = redis.from_url(
                settings.redis_url, encoding="utf-8", decode_responses=True
            )
            await self.redis_client.ping()
            logger.info("Redis connection established")
        except Exception as e:
            logger.error(f"Redis connection failed: {e}")
            self.redis_client = None

    async def close(self):
        if self.redis_client:
            await self.redis_client.close()

    def _generate_key(self, prefix: str, params: dict) -> str:
        """Generate a consistent cache key from parameters"""

        param_str = json.dumps(params, sort_keys=True)
        hash_object = hashlib.md5(param_str.encode())
        return f"{prefix}:{hash_object.hexdigest()}"

    async def get(self, key: str) -> Optional[Any]:
        if not self.redis_client:
            return None
        try:
            result = await self.redis_client.get(key)
            return json.loads(result) if result else None
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None

    async def set(self, key: str, value: Any, ttl: int = None) -> bool:
        if not self.redis_client:
            return False
        try:
            ttl = ttl or settings.cache_ttl
            await self.redis_client.setex(key, ttl, json.dumps(value, default=str))
            return True
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False

    async def delete(self, key: str) -> bool:
        if not self.redis_client:
            return False
        try:
            await self.redis_client.delete(key)
            return True
        except Exception as e:
            logger.error(f"Cache delete error: {e}")
            return False


cache = RedisCache()
