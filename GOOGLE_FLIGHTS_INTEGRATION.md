# Google Flights API Integration Guide

## 🎯 Overview

I've created multiple ways to integrate with Google Flights data for your LastMinute Travel app. Here are your options, ranked by recommendation:

## 🥇 Option 1: SerpAPI Google Flights (Recommended)

**What it is**: SerpAPI scrapes Google Flights results and provides them via API
**Pros**: 
- ✅ Real Google Flights data
- ✅ Same results users see on Google
- ✅ Reliable and fast
- ✅ No Google approval needed

**Cons**: 
- ❌ Costs $50/month for 5,000 searches
- ❌ Scraping-based (could break if Google changes)

### Setup:
1. Sign up at [serpapi.com](https://serpapi.com/)
2. Get your API key
3. Add to `.env`:
```env
SERPAPI_KEY=your_serpapi_key_here
USE_MOCK_DATA=false
```

### Pricing:
- **Free**: 100 searches/month
- **Starter**: $50/month for 5,000 searches
- **Production**: $150/month for 15,000 searches

## 🥈 Option 2: Travelpayouts API (Cost-Effective)

**What it is**: Official airline partner API with real flight data
**Pros**:
- ✅ Official airline partnerships
- ✅ Very cheap ($0.001 per request)
- ✅ Real flight data
- ✅ Free tier available

**Cons**:
- ❌ Not exactly Google Flights data
- ❌ Less comprehensive than Google

### Setup:
1. Sign up at [travelpayouts.com](https://www.travelpayouts.com/)
2. Get your API token and marker
3. Add to `.env`:
```env
TRAVELPAYOUTS_TOKEN=your_token_here
TRAVELPAYOUTS_MARKER=your_marker_here
USE_MOCK_DATA=false
```

### Pricing:
- **Free**: 100 requests/day
- **Paid**: $0.001 per request (very cheap!)

## 🥉 Option 3: Google Travel Partner API (Enterprise)

**What it is**: Official Google API for travel partners
**Pros**:
- ✅ Official Google API
- ✅ Exact Google Flights data
- ✅ Enterprise-grade reliability

**Cons**:
- ❌ Requires Google approval
- ❌ Revenue sharing model
- ❌ Complex approval process

### Setup:
1. Apply at [developers.google.com/travel](https://developers.google.com/travel)
2. Wait for approval (can take months)
3. Implement OAuth and revenue sharing

## 🔧 Implementation Status

I've already implemented integrations for:

### ✅ **SerpAPI Google Flights**
- File: `backend/app/integrations/serpapi_flights.py`
- Scrapes real Google Flights results
- Returns proper flight objects with segments, prices, airlines

### ✅ **Travelpayouts API**  
- File: `backend/app/integrations/travelpayouts_api.py`
- Official airline partnerships
- Real flight data at low cost

### ✅ **Updated Flight Service**
- Priority order: SerpAPI > Travelpayouts > Amadeus > Others
- Automatic fallback if APIs fail
- Proper error handling and logging

## 🚀 Quick Start (SerpAPI)

1. **Get SerpAPI key**:
   ```bash
   # Sign up at serpapi.com and get your key
   ```

2. **Update environment**:
   ```bash
   echo "SERPAPI_KEY=your_key_here" >> backend/.env
   echo "USE_MOCK_DATA=false" >> backend/.env
   ```

3. **Restart backend**:
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn app.main:app --reload
   ```

4. **Test Google Flights data**:
   ```bash
   curl "http://localhost:8000/api/v1/flights/search?origin=NYC&destination=LAX&departure_date=2025-08-31&adults=1"
   ```

## 📊 Cost Comparison

| Provider | Free Tier | Paid Tier | Data Quality | Setup Difficulty |
|----------|-----------|-----------|--------------|------------------|
| **SerpAPI** | 100/month | $50/5K searches | ⭐⭐⭐⭐⭐ Google Flights | Easy |
| **Travelpayouts** | 100/day | $0.001/request | ⭐⭐⭐⭐ Airline data | Easy |
| **Amadeus** | 2K/month | $0.01-0.05/call | ⭐⭐⭐⭐ Airline data | Medium |
| **Google Partner** | N/A | Revenue share | ⭐⭐⭐⭐⭐ Google Flights | Very Hard |

## 🎯 Recommendation for Your Use Case

For **LastMinute Travel** focusing on same-day/next-day bookings:

### **Start with SerpAPI** because:
1. **Real Google Flights data** - exactly what users expect
2. **Fast setup** - working in minutes
3. **Reliable** - proven scraping technology
4. **Cost-effective** for MVP - $50/month is reasonable

### **Scale with Travelpayouts** because:
1. **Very cheap** - $0.001 per request
2. **Official partnerships** - sustainable long-term
3. **Good for high volume** - no monthly limits

## 🔄 Migration Path

1. **Phase 1**: Start with mock data (✅ Done)
2. **Phase 2**: Add SerpAPI for real Google Flights data
3. **Phase 3**: Add Travelpayouts for cost optimization
4. **Phase 4**: Apply for Google Travel Partner (long-term)

## 🧪 Testing Your Integration

```bash
# Test with SerpAPI (Google Flights data)
curl "http://localhost:8000/api/v1/flights/search?origin=JFK&destination=LAX&departure_date=2025-09-01&adults=1"

# Test with Travelpayouts (airline data)  
curl "http://localhost:8000/api/v1/flights/search?origin=NYC&destination=MIA&departure_date=2025-09-01&adults=2"

# Test error handling (no API keys)
curl "http://localhost:8000/api/v1/flights/search?origin=NYC&destination=LAX&departure_date=2025-09-01&adults=1"
```

## 📝 Environment Variables Summary

```env
# For Google Flights via SerpAPI (recommended)
SERPAPI_KEY=your_serpapi_key

# For Travelpayouts (cost-effective alternative)
TRAVELPAYOUTS_TOKEN=your_token
TRAVELPAYOUTS_MARKER=your_marker

# Disable mock data when using real APIs
USE_MOCK_DATA=false

# Keep existing fallbacks
AMADEUS_CLIENT_ID=your_amadeus_id
AMADEUS_CLIENT_SECRET=your_amadeus_secret
KIWI_API_KEY=your_kiwi_key
```

## 🎉 Result

With these integrations, your LastMinute Travel app can now access:
- **Real Google Flights data** (via SerpAPI)
- **Official airline data** (via Travelpayouts)
- **Fallback options** (Amadeus, Kiwi, etc.)
- **Smart provider selection** based on available credentials

Your users will get the same flight results they see on Google Flights! 🚀