# Flight API Setup Guide

## Current Issues with Flight Data

The current implementation has several challenges:
1. **Complex API integrations** with different response formats
2. **Rate limiting** and API costs
3. **Reliability issues** with multiple providers
4. **Authentication complexity** (OAuth, session management)

## Better Solutions

### Option 1: Use Mock Data for Development (Immediate)

Add to your `.env` file:
```env
USE_MOCK_DATA=true
```

This will use realistic mock flight data for development and testing.

### Option 2: Amadeus for Developers (Recommended)

**Why Amadeus?**
- Single, reliable API
- Real airline data (not OTA markup)
- Better documentation
- More predictable pricing
- Comprehensive flight information

**Setup:**
1. Sign up at [developers.amadeus.com](https://developers.amadeus.com)
2. Create a new app
3. Get your API credentials
4. Add to `.env`:
```env
AMADEUS_CLIENT_ID=your_client_id
AMADEUS_CLIENT_SECRET=your_client_secret
USE_MOCK_DATA=false
```

**Pricing:** 
- Free tier: 2,000 API calls/month
- Production: $0.01-0.05 per call

### Option 3: RapidAPI Flight Search (Alternative)

**Setup:**
1. Sign up at [rapidapi.com](https://rapidapi.com)
2. Subscribe to "Skyscanner Flight Search" or similar
3. Add to `.env`:
```env
RAPIDAPI_KEY=your_rapidapi_key
USE_MOCK_DATA=false
```

### Option 4: Simplified Single Provider

Instead of multiple providers, focus on one reliable source:

**Kiwi.com (Tequila API):**
- Simpler integration
- Good for last-minute deals
- Already implemented

**Setup:**
1. Sign up at [tequila.kiwi.com](https://tequila.kiwi.com/portal)
2. Get API key
3. Add to `.env`:
```env
KIWI_API_KEY=your_api_key
USE_MOCK_DATA=false
```

## Quick Start (Development)

1. **Enable mock data immediately:**
```bash
cd backend
echo "USE_MOCK_DATA=true" >> .env
```

2. **Test the API:**
```bash
# Start the backend
uvicorn app.main:app --reload

# Test flight search
curl "http://localhost:8000/api/v1/flights/search?origin=NYC&destination=LAX&departure_date=2025-08-31&adults=1"
```

3. **You should see realistic mock flight data**

## Production Recommendations

1. **Start with Amadeus** - Most reliable and comprehensive
2. **Add caching** - Already implemented with Redis
3. **Monitor API usage** - Set up alerts for rate limits
4. **Implement fallbacks** - Mock data if APIs fail
5. **Consider costs** - Budget for API calls based on traffic

## Environment Variables Summary

```env
# Development
USE_MOCK_DATA=true

# Production (choose one)
AMADEUS_CLIENT_ID=your_client_id
AMADEUS_CLIENT_SECRET=your_client_secret

# OR
KIWI_API_KEY=your_api_key

# OR  
RAPIDAPI_KEY=your_rapidapi_key

# Database & Cache (required)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
REDIS_URL=your_redis_url
```

## Testing Your Setup

```bash
# Test with mock data
curl "http://localhost:8000/api/v1/flights/search?origin=NYC&destination=LAX&departure_date=2025-08-31&adults=1"

# Check logs
tail -f logs/app.log

# Test frontend
cd frontend
npm run dev
# Visit http://localhost:3000
```

The mock API will generate realistic flight data with:
- Multiple airlines
- Various prices ($150-$800)
- Different flight times
- Direct and connecting flights
- Proper airport codes and names