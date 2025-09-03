# Railway Deployment Guide - FIXED

## 🚨 Railway PORT Error Fix

The error `"Invalid value for '--port': '$PORT' is not a valid integer"` occurs when Railway can't properly handle the PORT environment variable. Here are **3 working solutions**:

## 🎯 Solution 1: NIXPACKS (Recommended - Easiest)

This is the most reliable approach for Railway:

### Step 1: Use NIXPACKS Configuration
Rename `railway.json` to `railway-dockerfile.json` (backup) and create:

**backend/railway.json**:
```json
{
    "$schema": "https://railway.app/railway.schema.json",
    "build": {
        "builder": "NIXPACKS"
    },
    "deploy": {
        "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
        "healthcheckPath": "/health",
        "healthcheckTimeout": 100,
        "restartPolicyType": "ON_FAILURE",
        "restartPolicyMaxRetries": 10
    }
}
```

### Step 2: Deploy
```bash
cd backend
railway up
```

## 🎯 Solution 2: Dockerfile with Inline Script

If you prefer Docker, use this approach:

### Step 1: Update railway.json
```json
{
    "$schema": "https://railway.app/railway.schema.json",
    "build": {
        "builder": "DOCKERFILE",
        "dockerfilePath": "Dockerfile.production"
    },
    "deploy": {
        "healthcheckPath": "/health",
        "healthcheckTimeout": 100,
        "restartPolicyType": "ON_FAILURE",
        "restartPolicyMaxRetries": 10
    }
}
```

### Step 2: Use Dockerfile.production
The `Dockerfile.production` file has been created with an inline startup script that properly handles the PORT variable.

## 🎯 Solution 3: Railway Dashboard Configuration

### Step 1: Remove railway.json
Delete or rename the `railway.json` file temporarily.

### Step 2: Configure in Railway Dashboard
1. Go to your Railway project dashboard
2. Settings → Deploy
3. Set **Build Command**: (leave empty)
4. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set **Root Directory**: `backend`

### Step 3: Environment Variables
Set these in Railway dashboard:
```
PORT=8000
PYTHONUNBUFFERED=1
PYTHONDONTWRITEBYTECODE=1
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
SERPAPI_KEY=your_serpapi_key
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

## 🔧 Quick Fix Commands

### Option A: Switch to NIXPACKS
```bash
cd backend
cp railway.json railway-dockerfile.json.backup
cp railway-nixpacks.json railway.json
railway up
```

### Option B: Use Production Dockerfile
```bash
cd backend
# Update railway.json to use Dockerfile.production
railway up
```

### Option C: Manual Dashboard Setup
```bash
cd backend
mv railway.json railway.json.backup
railway up
# Then configure in dashboard
```

## ✅ Verification Steps

After deployment, test these:

1. **Health Check**:
   ```bash
   curl https://your-app.railway.app/health
   ```

2. **API Test**:
   ```bash
   curl "https://your-app.railway.app/api/v1/flights/search?origin=NYC&destination=LAX&departure_date=2025-09-15&return_date=2025-09-22&adults=1&children=0&infants=0&cabin_class=economy"
   ```

3. **Check Logs**:
   ```bash
   railway logs
   ```

## 🚨 Troubleshooting

### If deployment still fails:

1. **Check Railway Logs**:
   ```bash
   railway logs --tail 100
   ```

2. **Verify Environment Variables**:
   ```bash
   railway variables
   ```

3. **Test Locally with Railway Environment**:
   ```bash
   railway run python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

### Common Issues:

1. **Missing Dependencies**: Ensure `requirements.txt` is complete
2. **Database Connection**: Verify `DATABASE_URL` is set correctly
3. **Port Binding**: Railway automatically sets `$PORT`, don't hardcode it
4. **File Permissions**: Ensure startup scripts are executable

## 📋 Environment Variables Checklist

Required variables in Railway:
- [ ] `DATABASE_URL` (auto-set by Railway Postgres)
- [ ] `REDIS_URL` (auto-set by Railway Redis)
- [ ] `SERPAPI_KEY` (your API key)
- [ ] `ALLOWED_ORIGINS` (your Vercel domain)
- [ ] `PORT` (auto-set by Railway, but can set to 8000 as default)

Optional but recommended:
- [ ] `PYTHONUNBUFFERED=1`
- [ ] `PYTHONDONTWRITEBYTECODE=1`
- [ ] `DEBUG=false`

## 🎉 Success Indicators

Your deployment is working when:
- ✅ Railway build completes without errors
- ✅ Health check returns `{"status":"healthy"}`
- ✅ API endpoints return data
- ✅ No PORT-related errors in logs
- ✅ Database connection established

Choose **Solution 1 (NIXPACKS)** for the easiest deployment experience!