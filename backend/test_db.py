# test_supabase.py
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_ANON_KEY")

supabase = create_client(url, key)

# Test connection
try:
    result = supabase.table("search_logs").select("*").limit(1).execute()
    print(" Supabase connection successful!")
    print(f"Table exists and has {len(result.data)} rows")
except Exception as e:
    print(f" Connection failed: {e}")
