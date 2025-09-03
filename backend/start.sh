#!/bin/bash

# Railway startup script
echo "Starting Next24 Backend..."

# Debug environment variables
echo "Environment variables:"
echo "PORT (raw): '$PORT'"
echo "DATABASE_URL (raw): '$DATABASE_URL'"
echo "All env vars with DATABASE:"
env | grep -i database || echo "No DATABASE variables found"
echo "All env vars with POSTGRES:"
env | grep -i postgres || echo "No POSTGRES variables found"
echo "All env vars with PG:"
env | grep -i "^PG" || echo "No PG variables found"
echo "Checking individual PostgreSQL variables:"
echo "  PGHOST: '$PGHOST'"
echo "  PGDATABASE: '$PGDATABASE'"
echo "  PGPORT: '$PGPORT'"
echo "  PGUSER: '$PGUSER'"
echo "  PGPASSWORD: [${#PGPASSWORD} chars]"

# Get port from environment or default to 8000
FINAL_PORT=${PORT:-8000}

echo "Final port to use: $FINAL_PORT"

# Validate port is numeric
if ! [[ "$FINAL_PORT" =~ ^[0-9]+$ ]]; then
    echo "ERROR: Port '$FINAL_PORT' is not a valid number, using default 8000"
    FINAL_PORT=8000
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  WARNING: DATABASE_URL not set - app will use default localhost"
    echo "   Make sure to add a PostgreSQL service to your Railway project"
    echo "   and connect it to this service"
else
    echo "✅ DATABASE_URL is configured"
fi

echo "Starting uvicorn on port $FINAL_PORT..."

# Start uvicorn with the resolved port
exec uvicorn app.main:app --host 0.0.0.0 --port $FINAL_PORT