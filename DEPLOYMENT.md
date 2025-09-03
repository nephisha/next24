# Next24 Travel Platform - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB RAM available
- Ports 3000, 8000, 5432, and 6379 available

### Development Mode (Recommended for development)
```bash
./start-development.sh
```

### Production Mode
```bash
./start-production.sh
```

## 📋 Manual Setup

### Development Environment
```bash
# Stop any existing containers
docker-compose -f docker-compose.dev.yml down --volumes

# Build and start services
docker-compose -f docker-compose.dev.yml up --build -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Production Environment
```bash
# Stop any existing containers
docker-compose down --volumes

# Build and start services
docker-compose up --build -d

# View logs
docker-compose logs -f
```

## 🔧 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js React application |
| Backend API | http://localhost:8000 | FastAPI backend |
| API Documentation | http://localhost:8000/docs | Interactive API docs |
| Database | localhost:5432 | PostgreSQL database |
| Redis Cache | localhost:6379 | Redis cache server |

## 🏗️ Architecture

### Services
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: FastAPI with Python 3.11
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Search APIs**: SerpAPI integration for flights and hotels

### Key Features
- ✈️ Flight search across 600+ airlines
- 🏨 Hotel search with real-time pricing
- 🗺️ 19+ destination guides with local insights
- 📅 Interactive trip planner
- 👥 Community features and photo contests
- 💱 Multi-currency support (50+ currencies)
- 🔍 Advanced search filters
- 📱 Responsive design for all devices

## 🔍 Health Checks

### Backend Health
```bash
curl http://localhost:8000/health
```

### Test Flight Search
```bash
curl "http://localhost:8000/api/v1/flights/search?origin=NYC&destination=LAX&departure_date=2025-09-15&return_date=2025-09-22&adults=1&children=0&infants=0&cabin_class=economy"
```

### Test Hotel Search
```bash
curl -X POST "http://localhost:8000/api/v1/hotels/search" \
  -H "Content-Type: application/json" \
  -d '{"destination":"New York","check_in":"2025-09-15","check_out":"2025-09-17","adults":2,"children":0,"rooms":1}'
```

## 🛠️ Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8000

# Kill the process if needed
kill -9 <PID>
```

#### Docker Issues
```bash
# Clean up Docker
docker system prune -a
docker volume prune

# Restart Docker service
# On macOS: Restart Docker Desktop
# On Linux: sudo systemctl restart docker
```

#### Database Connection Issues
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Reset database
docker-compose down --volumes
docker-compose up -d
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f redis
```

## 🔒 Environment Variables

### Backend Configuration
- `SERPAPI_KEY`: SerpAPI key for flight/hotel search
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `DEBUG`: Enable debug mode (true/false)
- `ALLOWED_ORIGINS`: CORS allowed origins

### Frontend Configuration
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NODE_ENV`: Environment (development/production)

## 📊 Performance

### Resource Requirements
- **Development**: 2GB RAM, 2 CPU cores
- **Production**: 4GB RAM, 4 CPU cores
- **Storage**: 10GB minimum

### Optimization Tips
- Use Redis caching for API responses
- Enable gzip compression
- Optimize images and assets
- Use CDN for static content

## 🚢 Production Deployment

### Railway (Recommended)
1. Connect your GitHub repository
2. Deploy backend and frontend as separate services
3. Configure environment variables
4. Set up PostgreSQL and Redis add-ons

### Vercel + Railway
1. Deploy frontend to Vercel
2. Deploy backend to Railway
3. Configure CORS and environment variables

### Docker Compose (VPS)
1. Copy files to your server
2. Configure environment variables
3. Run production startup script
4. Set up reverse proxy (nginx)
5. Configure SSL certificates

## 📈 Monitoring

### Health Endpoints
- Backend: `GET /health`
- Database: Check PostgreSQL connection
- Cache: Check Redis connection

### Metrics
- Response times
- Error rates
- Cache hit rates
- Database query performance

## 🔄 Updates

### Development Updates
Code changes are automatically reflected due to volume mounts and hot reload.

### Production Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

## 📞 Support

For issues or questions:
1. Check the logs first
2. Review this deployment guide
3. Check GitHub issues
4. Contact the development team

---

**Next24 Travel Platform** - Your complete AI-powered travel companion 🌍✈️