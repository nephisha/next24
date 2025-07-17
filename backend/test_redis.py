# test_redis.py

import asyncio
import os
from dotenv import load_dotenv
import redis.asyncio as redis

load_dotenv()


async def test_redis():
    redis_url = os.getenv("REDIS_URL")
    if not redis_url:
        print("❌ Missing REDIS_URL")
        return

    try:
        client = redis.from_url(
            redis_url,
            decode_responses=True,
        )
        await client.ping()
        print("✅ Connected to Redis!")

        await client.set("test_key", "Hello from Redis!")
        val = await client.get("test_key")
        print("✅ Read Value:", val)

        await client.delete("test_key")
        await client.aclose()

    except Exception as e:
        print(f"❌ Redis error: {e}")


if __name__ == "__main__":
    asyncio.run(test_redis())
