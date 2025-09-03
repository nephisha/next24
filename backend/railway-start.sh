#!/bin/bash

# Railway startup script for Next24 Backend
echo "Starting Next24 Backend on Railway..."

# Set default port if not provided
PORT=${PORT:-8000}

echo "Using port: $PORT"

# Start the application
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT