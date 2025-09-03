#!/bin/bash

# Next24 Railway Deployment Script
echo "🚀 Deploying Next24 Backend to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install it first:"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway first:"
    echo "railway login"
    exit 1
fi

# Navigate to backend directory
cd backend

echo "📋 Checking required files..."

# Check if required files exist
if [ ! -f "Dockerfile.railway" ]; then
    echo "❌ Dockerfile.railway not found!"
    exit 1
fi

if [ ! -f "railway.json" ]; then
    echo "❌ railway.json not found!"
    exit 1
fi

if [ ! -f "railway-start.sh" ]; then
    echo "❌ railway-start.sh not found!"
    exit 1
fi

echo "✅ All required files found"

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up --detach

echo "⏳ Waiting for deployment to complete..."
sleep 30

# Get the deployment URL
RAILWAY_URL=$(railway status --json | jq -r '.deployments[0].url' 2>/dev/null || echo "")

if [ -n "$RAILWAY_URL" ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Backend URL: $RAILWAY_URL"
    echo "🔍 Health check: $RAILWAY_URL/health"
    echo "📊 API docs: $RAILWAY_URL/docs"
    
    # Test health endpoint
    echo "🔍 Testing health endpoint..."
    if curl -f "$RAILWAY_URL/health" > /dev/null 2>&1; then
        echo "✅ Health check passed!"
    else
        echo "⚠️  Health check failed - check Railway logs"
    fi
else
    echo "⚠️  Could not get deployment URL - check Railway dashboard"
fi

echo ""
echo "📝 Next steps:"
echo "1. Copy the Railway URL: $RAILWAY_URL"
echo "2. Set NEXT_PUBLIC_API_URL in Vercel to this URL"
echo "3. Deploy frontend to Vercel"
echo ""
echo "🔍 View logs: railway logs"
echo "📊 Dashboard: railway open"