#!/bin/bash

# Test Next24 Frontend Build
echo "🧪 Testing Next24 Frontend Build..."

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Not in frontend directory. Run this from frontend/ folder."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Type check
echo "🔍 Running TypeScript type check..."
if npm run type-check; then
    echo "✅ TypeScript check passed"
else
    echo "❌ TypeScript errors found. Fix them before deploying."
    exit 1
fi

# Lint check
echo "🔍 Running ESLint..."
if npm run lint; then
    echo "✅ Lint check passed"
else
    echo "⚠️  Lint warnings found (not blocking)"
fi

# Build test
echo "🔨 Testing build with 'npm run build'..."
if npm run build; then
    echo "✅ Build successful!"
    echo "📁 Output directory: .next"
    echo "📊 Build size:"
    du -sh .next 2>/dev/null || echo "Could not calculate build size"
else
    echo "❌ Build failed!"
    echo ""
    echo "💡 Common solutions:"
    echo "   1. Fix TypeScript errors shown above"
    echo "   2. Check for missing environment variables"
    echo "   3. Verify all imports are correct"
    echo "   4. Check Next.js configuration"
    exit 1
fi

# Test start (optional)
echo ""
echo "🎉 Build test completed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Deploy to Vercel: vercel --prod"
echo "   2. Set NEXT_PUBLIC_API_URL in Vercel dashboard"
echo "   3. Test the deployed application"
echo ""
echo "🔍 To test locally: npm run start (after build)"