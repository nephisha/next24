# 🚀 Database Migration Guide

This guide will help you migrate from static data to a dynamic database-driven system.

## 📋 Prerequisites

### Local Development
1. **PostgreSQL** installed and running
2. **Redis** installed and running (optional for basic testing)
3. **Python 3.11+** with pip

### Railway Deployment
1. **Railway account** (free tier available)
2. **Vercel account** for frontend

## 🔧 Local Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Database
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb travel_db

# Create user (optional)
createuser -s travel_user
```

### 3. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
# Minimum required:
DATABASE_URL=postgresql://localhost/travel_db
```

### 4. Test Your Setup
```bash
# Run the test script first
python test_migration.py

# If all tests pass, run the migration
python scripts/migrate_static_data.py
```

### 5. Start the API Server
```bash
uvicorn app.main:app --reload --port 8000
```

### 6. Test the API
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test destinations endpoint
curl http://localhost:8000/api/destinations/featured

# Test specific destination
curl http://localhost:8000/api/destinations/france/paris
```

## ☁️ Railway Deployment

### 1. Create Railway Project
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and create project
railway login
railway new travel-backend

# Add services
railway add postgresql
railway add redis
```

### 2. Set Environment Variables
```bash
# Railway will automatically set DATABASE_URL and REDIS_URL
# You only need to set your API keys:

railway variables set SERPAPI_KEY=your_key_here
railway variables set CLOUDINARY_CLOUD_NAME=your_cloud_name
railway variables set CLOUDINARY_API_KEY=your_api_key
railway variables set CLOUDINARY_API_SECRET=your_api_secret
railway variables set ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

### 3. Deploy to Railway
```bash
# Deploy your backend
railway up

# Run migration on Railway
railway run python scripts/migrate_static_data.py
```

### 4. Get Your Railway URL
```bash
# Get your deployment URL
railway status

# Test your deployed API
curl https://your-app.railway.app/health
curl https://your-app.railway.app/api/destinations/featured
```

## 🌐 Frontend Integration

### 1. Update Frontend Environment
```bash
# In your frontend directory
# Update .env.local or vercel environment variables
NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

### 2. Test Frontend with New API
```bash
# Start your frontend
npm run dev

# Check browser console for API calls
# Verify destinations are loading from your database
```

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Check database exists
psql -l | grep travel_db

# Test connection manually
psql postgresql://localhost/travel_db
```

#### Import Errors
```bash
# Make sure you're in the backend directory
cd backend

# Check Python path
python -c "import sys; print(sys.path)"

# Install missing dependencies
pip install -r requirements.txt
```

#### Railway Deployment Issues
```bash
# Check Railway logs
railway logs

# Check environment variables
railway variables

# Redeploy if needed
railway up --detach
```

### Database Reset
If you need to start fresh:

```bash
# Local
dropdb travel_db
createdb travel_db
python scripts/migrate_static_data.py

# Railway
railway connect postgresql
# In psql: DROP SCHEMA public CASCADE; CREATE SCHEMA public;
railway run python scripts/migrate_static_data.py
```

## 📊 Verification Steps

After successful migration, verify:

1. **API Health**: `GET /health` returns database status
2. **Destinations**: `GET /api/destinations/featured` returns 6+ destinations
3. **Guides**: `GET /api/guides/featured` returns travel guides
4. **Specific Destination**: `GET /api/destinations/france/paris` returns Paris data
5. **Frontend**: Your Next.js app loads destinations from the API

## 🎯 Next Steps

Once migration is complete:

1. **Update Frontend Components**: Replace static imports with API calls
2. **Set Up Caching**: Configure Redis for better performance  
3. **Add Admin Panel**: Use the CMS endpoints for content management
4. **Configure Background Jobs**: Set up automated price updates
5. **Add Monitoring**: Set up health checks and alerts

## 📞 Support

If you encounter issues:

1. Check the test script output: `python test_migration.py`
2. Review Railway logs: `railway logs`
3. Verify environment variables are set correctly
4. Ensure database and Redis are accessible

The migration should take 5-10 minutes for local setup and 10-15 minutes for Railway deployment.