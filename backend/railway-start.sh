#!/bin/bash
# Railway startup script

set -e

echo "🚀 Starting Railway deployment..."

# Run database migrations
echo "📊 Running database migrations..."
alembic upgrade head

# Start the application with Railway-optimized settings
echo "🌐 Starting FastAPI application..."
exec uvicorn app.main:app \
    --host 0.0.0.0 \
    --port ${PORT:-8000} \
    --workers ${WEB_CONCURRENCY:-1} \
    --worker-class uvicorn.workers.UvicornWorker \
    --access-log \
    --log-level info