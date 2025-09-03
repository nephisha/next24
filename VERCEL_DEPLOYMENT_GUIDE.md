# Vercel Deployment Guide for Next24 Frontend

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- Vercel CLI installed: `npm install -g vercel`
- Railway backend deployed and running
- Railway backend URL available

### 2. Deployment Commands

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm ci

# Test build locally (recommended)
npm run build

# Deploy to Vercel
vercel --prod
```

### 3. Environment Variables Setup

In Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-railway-app.railway.app` | Production |
| `NODE_ENV` | `production` | Production |

**Important**: Replace `your-railway-app.railway.app` with your actual Railway backend URL.

## 🔧 Configuration Files

### vercel.json (Already configured)
```json
{
    "buildCommand": "npm run build",
    "outputDirectory": ".next",
    "framework": "nextjs",
    "regions": ["iad1"],
    "functions": {
        "app/**/*.tsx": {
            "maxDuration": 30
        }
    },
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                {
                    "key": "X-Content-Type-Options",
                    "value": "nosniff"
                },
                {
                    "key": "X-Frame-Options",
                    "value": "DENY"
                },
                {
                    "key": "X-XSS-Protection",
                    "value": "1; mode=block"
                }
            ]
        }
    ]
}
```

### package.json scripts (Already configured)
```json
{
    "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint",
        "type-check": "tsc --noEmit"
    }
}
```

## ✅ Pre-deployment Checklist

### Before deploying, ensure:

- [ ] Railway backend is deployed and accessible
- [ ] Backend health check works: `curl https://your-railway-app.railway.app/health`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Local build works: `npm run build`
- [ ] Environment variables are set in Vercel dashboard

### Test locally:
```bash
# In frontend directory
npm ci
npm run type-check
npm run build
npm run start
```

## 🚨 Common Issues & Solutions

### Issue 1: Build Timeout
**Error**: "Build exceeded maximum duration"

**Solutions**:
1. Reduce bundle size by removing unused dependencies
2. Optimize images and assets
3. Use dynamic imports for large components

### Issue 2: Environment Variable Not Found
**Error**: API calls failing with 404 or connection errors

**Solutions**:
1. Verify `NEXT_PUBLIC_API_URL` is set in Vercel dashboard
2. Ensure the URL includes `https://` protocol
3. Check Railway backend is accessible from the URL

### Issue 3: TypeScript Errors
**Error**: Build fails with TypeScript compilation errors

**Solutions**:
1. Run `npm run type-check` locally first
2. Fix all TypeScript errors before deploying
3. Check imports and type definitions

### Issue 4: CORS Errors
**Error**: API calls blocked by CORS policy

**Solutions**:
1. Add your Vercel domain to Railway backend `ALLOWED_ORIGINS`
2. Format: `https://your-app.vercel.app,https://your-app-git-main.vercel.app`
3. Include both production and preview URLs

## 🔍 Testing Deployment

After deployment, test these URLs:

1. **Homepage**: `https://your-app.vercel.app`
2. **Flights page**: `https://your-app.vercel.app/flights`
3. **Hotels page**: `https://your-app.vercel.app/hotels`
4. **API connection**: Check browser network tab for successful API calls

## 📊 Performance Optimization

### Vercel-specific optimizations:

1. **Image Optimization**: Already configured with Next.js Image component
2. **Static Generation**: Pages are pre-rendered where possible
3. **Edge Functions**: API routes run on Vercel Edge Network
4. **Caching**: Static assets cached automatically

### Monitoring:
- Enable Vercel Analytics in project settings
- Monitor Core Web Vitals
- Check function execution times

## 🔄 Continuous Deployment

### Automatic deployments:
1. Connect GitHub repository to Vercel
2. Enable automatic deployments for main branch
3. Preview deployments for pull requests

### Manual deployments:
```bash
# Deploy specific branch
vercel --prod

# Deploy with specific environment
vercel --prod --env NEXT_PUBLIC_API_URL=https://staging-api.railway.app
```

## 📞 Troubleshooting Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Open Vercel dashboard
vercel open

# Check environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

## 🎯 Success Indicators

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ Homepage loads correctly
- ✅ Flight search form works
- ✅ Hotel search form works
- ✅ API calls return data (check browser network tab)
- ✅ No console errors in browser
- ✅ All navigation links work

## 📝 Next Steps After Deployment

1. **Custom Domain**: Add your custom domain in Vercel dashboard
2. **SSL Certificate**: Automatically provided by Vercel
3. **Analytics**: Enable Vercel Analytics for insights
4. **Monitoring**: Set up error tracking (Sentry, etc.)
5. **SEO**: Verify meta tags and Open Graph data

---

**Need help?** Check the deployment logs first, then review this guide step by step.