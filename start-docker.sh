#!/bin/bash

echo "🚀 Starting Next24 Platform with Docker..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install Docker Compose."
    exit 1
fi

# Choose environment
echo "Choose environment:"
echo "1) Development (with hot reload)"
echo "2) Production"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo "🔧 Starting in DEVELOPMENT mode..."
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    2)
        echo "🏭 Starting in PRODUCTION mode..."
        docker-compose up --build
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac