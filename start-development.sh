#!/bin/bash

# Next24 Travel Platform - Development Startup Script
echo "🚀 Starting Next24 Travel Platform (Development Mode)..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.dev.yml down --volumes

# Build and start development containers
echo "🔨 Building and starting development containers..."
docker-compose -f docker-compose.dev.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# Check service health
echo "🔍 Checking service health..."

# Check backend health
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    docker-compose -f docker-compose.dev.yml logs backend --tail=20
    exit 1
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible"
    docker-compose -f docker-compose.dev.yml logs frontend --tail=20
    exit 1
fi

echo ""
echo "🎉 Next24 Travel Platform is ready for development!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 API Docs: http://localhost:8000/docs"
echo "💾 Database: localhost:5432"
echo "🗄️  Redis: localhost:6379"
echo ""
echo "🔥 Development features enabled:"
echo "   - Hot reload for frontend and backend"
echo "   - Volume mounts for live code changes"
echo "   - Debug mode enabled"
echo ""
echo "🔍 To view logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "🛑 To stop: docker-compose -f docker-compose.dev.yml down"
echo ""