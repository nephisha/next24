# Google Maps API Setup Guide

## Overview
The Interactive Itinerary Planner uses Google Maps API to provide interactive maps, route planning, and nearby place suggestions. Follow this guide to set up the API properly.

## Step 1: Get Google Maps API Key

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID for reference

### 1.2 Enable Required APIs
Enable these APIs in your Google Cloud Console:

1. **Maps JavaScript API** - For interactive maps
2. **Places API** - For nearby place suggestions
3. **Directions API** - For route planning between activities
4. **Geocoding API** - For address to coordinates conversion

To enable APIs:
1. Go to "APIs & Services" > "Library"
2. Search for each API and click "Enable"

### 1.3 Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Recommended) Click "Restrict Key" to add security restrictions

## Step 2: Configure API Key Restrictions (Security)

### 2.1 Application Restrictions
- **HTTP referrers (web sites)**: Add your domain(s)
  - For development: `http://localhost:3000/*`
  - For production: `https://yourdomain.com/*`

### 2.2 API Restrictions
Restrict the key to only the APIs you need:
- Maps JavaScript API
- Places API
- Directions API
- Geocoding API

## Step 3: Add API Key to Your Project

### 3.1 Environment Variables
1. Open or create `frontend/.env.local`
2. Add your API key:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 3.2 Restart Development Server
After adding the API key, restart your development server:
```bash
cd frontend
npm run dev
```

## Step 4: Verify Setup

### 4.1 Check Console
1. Open your browser's developer console
2. Navigate to `/planner`
3. Look for any Google Maps API errors
4. You should see the interactive map load successfully

### 4.2 Test Features
- **Map Display**: Interactive map should show
- **Activity Markers**: Activities should appear as numbered markers
- **Route Planning**: "Show Route" button should work
- **Nearby Places**: Restaurant/attraction buttons should function

## Pricing Information

### Free Tier
Google Maps provides a generous free tier:
- **$200 monthly credit** (covers ~28,000 map loads)
- **Maps JavaScript API**: $7 per 1,000 loads
- **Places API**: $17 per 1,000 requests
- **Directions API**: $5 per 1,000 requests

### Cost Optimization Tips
1. **Enable billing alerts** to monitor usage
2. **Set daily quotas** to prevent unexpected charges
3. **Use caching** to reduce API calls
4. **Implement error handling** for failed requests

## Troubleshooting

### Common Errors

#### "InvalidKeyMapError"
- **Cause**: API key is missing, invalid, or restricted
- **Solution**: Check API key in `.env.local` and verify restrictions

#### "RefererNotAllowedMapError"
- **Cause**: Domain not allowed in API key restrictions
- **Solution**: Add your domain to HTTP referrer restrictions

#### "ApiNotActivatedMapError"
- **Cause**: Required APIs not enabled
- **Solution**: Enable all required APIs in Google Cloud Console

#### Map not loading
- **Cause**: Network issues or API limits exceeded
- **Solution**: Check browser console for specific error messages

### Development vs Production

#### Development Setup
```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_dev_api_key
```

#### Production Setup
```bash
# .env.production
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_prod_api_key
```

## Security Best Practices

### 1. API Key Restrictions
- Always restrict API keys to specific domains
- Use separate keys for development and production
- Regularly rotate API keys

### 2. Usage Monitoring
- Set up billing alerts
- Monitor API usage in Google Cloud Console
- Implement rate limiting in your application

### 3. Error Handling
- Gracefully handle API failures
- Provide fallback functionality when maps are unavailable
- Log errors for debugging

## Alternative: Development Without API Key

If you want to develop without setting up Google Maps immediately, the planner will show a fallback interface with:
- Activity list display
- Setup instructions
- All other planner functionality (timeline, suggestions, export)

Simply leave the API key as `your_google_maps_api_key_here` in `.env.local`.

## Support Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Directions API Documentation](https://developers.google.com/maps/documentation/directions)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)

## Cost Estimation

For a travel planning website with moderate usage:

**Monthly Estimates:**
- **1,000 users** creating itineraries
- **5 map loads** per user session
- **10 place searches** per itinerary
- **2 route calculations** per itinerary

**Estimated Monthly Cost:**
- Maps JavaScript API: ~$35
- Places API: ~$170
- Directions API: ~$10
- **Total: ~$215/month**

The $200 monthly credit covers most small to medium websites.