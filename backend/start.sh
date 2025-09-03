#!/bin/bash

# Railway startup script
echo "Starting Next24 Backend..."

# Debug environment variables
echo "Environment variables:"
echo "PORT (raw): '$PORT'"
echo "All env vars with PORT:"
env | grep -i port || echo "No PORT variables found"

# Get port from environment or default to 8000
FINAL_PORT=${PORT:-8000}

echo "Final port to use: $FINAL_PORT"

# Validate port is numeric
if ! [[ "$FINAL_PORT" =~ ^[0-9]+$ ]]; then
    echo "ERROR: Port '$FINAL_PORT' is not a valid number, using default 8000"
    FINAL_PORT=8000
fi

echo "Starting uvicorn on port $FINAL_PORT..."

# Start uvicorn with the resolved port
exec uvicorn app.main:app --host 0.0.0.0 --port $FINAL_PORT