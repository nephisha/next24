# Railway + Vercel + Redis Deployment Strategy

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │    Railway      │    │     Redis       │
│   Frontend      │◄──►│    Backend      │◄──►│     Cache       │
│                 │    │                 │    │                 │
│ • Next.js       │    │ • FastAPI       │    │ • Session Store │
│ • Static Gen    │    │ • PostgreSQL    │    │ • Task Queue    │
│ • Edge Cache    │    │ • Background    │    │ • Rate Limiting │
│ • CDN           │    │   Jobs          │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Deployment Steps

### 1. Railway Backend Setup

```bash
# 1. Create Railway project
railway login
railway new travel-backend

# 2. Add PostgreSQL database
railway add postgresql

# 3. Add Redis
railway add redis

# 4. Set environment variables
railway variables set ENVIRONMENT=production
railway variables set DATABASE_URL=${{Postgres.DATABASE_URL}}
railway variables set REDIS_URL=${{Redis.REDIS_URL}}

# 5. Deploy
railway up
```

### 2. Vercel Frontend Setup

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy to Vercel
vercel --prod

# 3. Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Enter your Railway backend URL: https://your-app.railway.app
```

### 3. Environment Variables

#### Railway Backend
```env
# Database
DATABASE_URL=postgresql://...
DATABASE_PRIVATE_URL=postgresql://...  # Internal Railway network

# Redis
REDIS_URL=redis://...
REDIS_PRIVATE_URL=redis://...  # Internal Railway network

# External APIs
SERPAPI_KEY=your_serpapi_key
AMADEUS_CLIENT_ID=your_amadeus_id
AMADEUS_CLIENT_SECRET=your_amadeus_secret

# Image Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://your-domain.com
```

#### Vercel Frontend
```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
NEXT_PUBLIC_WS_URL=wss://your-railway-app.railway.app
EDGE_CONFIG=your_edge_config_id
```

## 📊 Performance Optimizations

### Railway Backend Optimizations

1. **Database Connection Pooling**
```python
# In database.py
engine = create_engine(
    railway_settings.internal_database_url,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=3600
)
```

2. **Redis Caching Strategy**
```python
# Cache hierarchy
- L1: Application memory (5 minutes)
- L2: Redis cache (30 minutes - 2 hours)
- L3: Database (source of truth)
```

3. **Background Jobs**
```python
# Use Railway's internal Redis for Celery
CELERY_BROKER_URL = railway_settings.internal_redis_url
```

### Vercel Frontend Optimizations

1. **Static Generation with ISR**
```typescript
// In page components
export async function generateStaticParams() {
  // Pre-generate popular destinations
}

export const revalidate = 3600; // 1 hour ISR
```

2. **Edge Caching**
```typescript
// API routes with edge caching
export const runtime = 'edge';
export const revalidate = 1800; // 30 minutes
```

3. **Image Optimization**
```typescript
// Use Vercel Image Optimization
import Image from 'next/image';

<Image
  src={destination.image}
  width={800}
  height={600}
  alt={destination.name}
  priority={index < 3} // Prioritize above-fold images
/>
```

## 🔄 Data Flow Strategy

### 1. Static Data Migration
```bash
# Run once to populate database
python backend/scripts/migrate_static_data.py
```

### 2. Dynamic Data Updates
```python
# Scheduled tasks (Railway Cron or external cron service)
@celery_app.task
def update_flight_prices():
    # Updates every hour
    pass

@celery_app.task  
def sync_destination_images():
    # Updates daily
    pass
```

### 3. Real-time Updates
```typescript
// WebSocket connection for live updates
const ws = new RailwayWebSocket();
ws.connect((data) => {
  // Update UI with real-time price changes
});
```

## 🛡️ Production Considerations

### Security
- Use Railway's private networking for internal communication
- Enable CORS only for your Vercel domains
- Use environment variables for all secrets
- Implement rate limiting with Redis

### Monitoring
```python
# Health checks
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": os.getenv("RAILWAY_DEPLOYMENT_ID", "unknown")
    }
```

### Scaling
- Railway: Auto-scaling based on CPU/memory
- Vercel: Edge functions scale automatically
- Redis: Use Railway Redis Pro for production workloads

## 💰 Cost Optimization

### Railway
- Use internal networking to avoid egress charges
- Optimize database queries to reduce CPU usage
- Use connection pooling to reduce database connections

### Vercel
- Leverage ISR to reduce function invocations
- Use Edge Runtime where possible
- Optimize images to reduce bandwidth

### Redis
- Set appropriate TTL values to manage memory usage
- Use Redis pipelining for bulk operations
- Monitor memory usage and upgrade plan as needed

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
```python
# Ensure Railway backend allows Vercel domain
ALLOWED_ORIGINS=["https://*.vercel.app", "https://your-domain.com"]
```

2. **Database Connection Issues**
```python
# Use Railway's private database URL for better performance
DATABASE_URL = railway_settings.internal_database_url
```

3. **Redis Connection Timeouts**
```python
# Configure Redis client with retries
redis_client = redis.from_url(
    railway_settings.internal_redis_url,
    socket_connect_timeout=5,
    retry_on_timeout=True
)
```

4. **Vercel Build Timeouts**
```json
// In vercel.json
{
  "functions": {
    "app/**/*.tsx": {
      "maxDuration": 30
    }
  }
}
```

## 📈 Monitoring & Analytics

### Railway Monitoring
- Use Railway's built-in metrics
- Set up alerts for high CPU/memory usage
- Monitor database connection pool

### Vercel Analytics
- Enable Vercel Analytics for performance insights
- Monitor Core Web Vitals
- Track API response times

### Custom Monitoring
```python
# Add custom metrics
import time
from functools import wraps

def track_performance(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        result = await func(*args, **kwargs)
        duration = time.time() - start_time
        
        # Log to your monitoring service
        logger.info(f"{func.__name__} took {duration:.2f}s")
        return result
    return wrapper
```