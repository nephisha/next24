# 🐳 Docker Setup for LastMinute Travel

## 🚀 Quick Start

### **Option 1: Use the Startup Script (Recommended)**
```bash
./start-docker.sh
```
Choose option 1 for development or option 2 for production.

### **Option 2: Manual Commands**

#### **Development Mode (with hot reload):**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

#### **Production Mode:**
```bash
docker-compose up --build
```

## 📋 Prerequisites

1. **Docker Desktop** installed and running
2. **Docker Compose** (usually included with Docker Desktop)

## 🌐 Access Points

Once running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Redis**: localhost:6379

## 🔧 Services Included

### **Backend (FastAPI)**
- **Port**: 8000
- **Features**: 
  - SerpAPI Google Flights integration
  - Mock data fallback
  - Redis caching
  - Health checks
  - Hot reload (dev mode)

### **Frontend (Next.js)**
- **Port**: 3000
- **Features**:
  - React flight search interface
  - Tailwind CSS styling
  - Hot reload (dev mode)

### **Redis Cache**
- **Port**: 6379
- **Purpose**: Caches flight search results for better performance

## 🛠️ Development vs Production

### **Development Mode** (`docker-compose.dev.yml`)
- ✅ Hot reload for both frontend and backend
- ✅ Volume mounts for live code changes
- ✅ Debug mode enabled
- ✅ Detailed logging

### **Production Mode** (`docker-compose.yml`)
- ✅ Optimized builds
- ✅ Production-ready configuration
- ✅ Health checks
- ✅ Restart policies

## 🔑 Environment Variables

The Docker setup includes all necessary environment variables:

```env
# SerpAPI (Google Flights)
SERPAPI_KEY=50077c30799321f18150852dfffb59190305d26ec3f081ea7310684e9e27eff9

# Application
DEBUG=true
USE_MOCK_DATA=false

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 📝 Common Commands

### **Start Services**
```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up

# Background mode
docker-compose up -d
```

### **Stop Services**
```bash
docker-compose down
```

### **Rebuild Services**
```bash
docker-compose up --build
```

### **View Logs**
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
```

### **Access Service Shell**
```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh
```

## 🧪 Testing the Setup

1. **Start the services**:
   ```bash
   ./start-docker.sh
   ```

2. **Test the backend**:
   ```bash
   curl http://localhost:8000/health
   ```

3. **Test flight search**:
   ```bash
   curl -X POST "http://localhost:8000/api/v1/flights/search" \
     -H "Content-Type: application/json" \
     -d '{"origin":"NYC","destination":"LAX","departure_date":"2025-12-25","adults":1}'
   ```

4. **Open frontend**: Visit http://localhost:3000

## 🔍 Troubleshooting

### **Port Already in Use**
```bash
# Find what's using the port
lsof -i :3000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### **Docker Issues**
```bash
# Clean up Docker
docker system prune -a

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### **Permission Issues**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

## 🎯 Benefits of Docker Setup

- ✅ **Consistent Environment**: Same setup across all machines
- ✅ **Easy Setup**: One command to start everything
- ✅ **Isolated Dependencies**: No conflicts with local installations
- ✅ **Production Ready**: Same containers can be deployed anywhere
- ✅ **Redis Included**: Built-in caching for better performance
- ✅ **Hot Reload**: Development-friendly with live code updates

## 🚀 Ready to Go!

Your LastMinute Travel app is now fully containerized and ready to run with Docker. The setup includes:

- Real Google Flights data via SerpAPI
- Fast Redis caching
- Hot reload for development
- Production-ready configuration
- Health checks and monitoring

Just run `./start-docker.sh` and you're ready to search for flights! 🛫