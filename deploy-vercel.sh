#!/bin/bash

# Next24 Vercel Deployment Script
echo "🚀 Deploying Next24 Frontend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Navigate to frontend directory
cd frontend

echo "📋 Checking configuration..."

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found!"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

echo "✅ Configuration files found"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Type check
echo "🔍 Running type check..."
if npm run type-check; then
    echo "✅ Type check passed"
else
    echo "❌ Type check failed - fix TypeScript errors first"
    exit 1
fi

# Build locally to test (using npm run build as configured)
echo "🔨 Testing build locally with 'npm run build'..."
if npm run build; then
    echo "✅ Local build successful with npm run build"
    echo "📁 Build output in .next directory"
else
    echo "❌ Local build failed - fix build errors first"
    echo "💡 Common fixes:"
    echo "   - Run 'npm run type-check' to find TypeScript errors"
    echo "   - Check for missing dependencies"
    echo "   - Verify NEXT_PUBLIC_API_URL is set"
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Get deployment URL
VERCEL_URL=$(vercel ls --scope=$(vercel whoami) | grep "next24-frontend" | head -1 | awk '{print $2}' 2>/dev/null || echo "")

if [ -n "$VERCEL_URL" ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Frontend URL: https://$VERCEL_URL"
    
    # Test the deployment
    echo "🔍 Testing deployment..."
    if curl -f "https://$VERCEL_URL" > /dev/null 2>&1; then
        echo "✅ Deployment test passed!"
    else
        echo "⚠️  Deployment test failed - check Vercel logs"
    fi
else
    echo "⚠️  Could not get deployment URL - check Vercel dashboard"
fi

echo ""
echo "📝 Important:"
echo "1. Make sure NEXT_PUBLIC_API_URL is set to your Railway backend URL"
echo "2. Check that CORS is configured on the backend for your Vercel domain"
echo ""
echo "🔍 View logs: vercel logs"
echo "📊 Dashboard: vercel open"