# LastMinute Travel - Complete Project Package

A production-ready metasearch engine for last-minute flight and hotel deals, built with Next.js and FastAPI.

## 📁 Project Structure

```
lastminute-travel/
├── README.md
├── .gitignore
├── LICENSE
├── backend/
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── railway.json
│   ├── .env.example
│   ├── .dockerignore
│   ├── start.sh
│   └── app/
│       ├── __init__.py
│       ├── main.py
│       ├── config.py
│       ├── database.py
│       ├── cache.py
│       ├── models/
│       │   ├── __init__.py
│       │   ├── flights.py
│       │   └── hotels.py
│       ├── services/
│       │   ├── __init__.py
│       │   ├── flight_service.py
│       │   ├── hotel_service.py
│       │   └── cache_service.py
│       ├── api/
│       │   ├── __init__.py
│       │   ├── deps.py
│       │   └── v1/
│       │       ├── __init__.py
│       │       ├── flights.py
│       │       └── hotels.py
│       ├── integrations/
│       │   ├── __init__.py
│       │   ├── kiwi_api.py
│       │   ├── skyscanner_api.py
│       │   └── booking_api.py
│       └── utils/
│           ├── __init__.py
│           ├── date_helpers.py
│           └── validators.py
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── postcss.config.js
│   ├── vercel.json
│   ├── .env.local
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .lighthouserc.js
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── og-image.jpg
│   │   └── robots.txt
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── globals.css
│       │   ├── flights/
│       │   │   └── page.tsx
│       │   └── hotels/
│       │       └── page.tsx
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── Footer.tsx
│       │   ├── SearchTabs.tsx
│       │   ├── FlightSearchForm.tsx
│       │   ├── HotelSearchForm.tsx
│       │   ├── FlightCard.tsx
│       │   ├── HotelCard.tsx
│       │   ├── SearchResults.tsx
│       │   ├── SearchFilters.tsx
│       │   └── LoadingSpinner.tsx
│       ├── hooks/
│       │   └── useLocalStorage.ts
│       ├── lib/
│       │   ├── api.ts
│       │   └── utils.ts
│       └── types/
│           └── index.ts
├── database/
│   └── schema.sql
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml
│       ├── deploy-frontend.yml
│       └── lighthouse.yml
└── docs/
    ├── setup-guide.md
    ├── api-documentation.md
    └── deployment.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Git**
- API keys for Kiwi.com (required), Skyscanner & Booking.com (optional)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd lastminute-travel

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys

# Frontend setup
cd ../frontend
npm install
cp .env.example .env.local
# Edit .env.local with your backend URL
```

### 2. Required Services

1. **Supabase**: Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Run the SQL schema from `database/schema.sql`
   - Get URL and anon key

2. **Upstash Redis**: Create account at [upstash.com](https://upstash.com)
   - Create Redis database
   - Get Redis URL

3. **API Keys**:
   - Kiwi.com: [tequila.kiwi.com](https://tequila.kiwi.com/portal)
   - Skyscanner: [rapidapi.com/skyscanner](https://rapidapi.com/skyscanner)
   - Booking.com: Apply for partner program

### 3. Local Development

```bash
# Terminal 1: Start backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Open http://localhost:3000

## 🌐 Deployment

### Backend (Railway)

1. Create account at [railway.app](https://railway.app)
2. Connect GitHub repository
3. Set environment variables in Railway dashboard
4. Deploy automatically on push

### Frontend (Vercel)

1. Create account at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set build settings: Framework: Next.js, Root: `frontend`
4. Configure environment variables
5. Deploy automatically on push

### Environment Variables

**Backend (.env)**:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
REDIS_URL=redis://default:password@host:port
KIWI_API_KEY=your_kiwi_api_key
SKYSCANNER_API_KEY=your_skyscanner_api_key
BOOKING_API_KEY=your_booking_api_key
ALLOWED_ORIGINS=https://yourdomain.com
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=https://your-api.railway.app
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## 🔧 Key Features

- **Multi-Provider Search**: Kiwi.com, Skyscanner, Booking.com
- **Smart Caching**: Redis-powered 5-10 minute TTL
- **Last-Minute Focus**: Today and tomorrow only
- **Mobile-First Design**: Responsive across all devices
- **Real-Time Results**: Concurrent API calls
- **Analytics Dashboard**: Search tracking and insights
- **SEO Optimized**: Meta tags, structured data
- **Production Ready**: Error handling, monitoring

## 📊 Performance

- **Response Time**: < 5 seconds
- **Concurrent Searches**: Multiple providers simultaneously
- **Cache Hit Rate**: 30-50% expected
- **Scalability**: 10+ TPS supported
- **Uptime**: 99.9% with modern hosting

## 💰 Cost Estimate (Monthly)

- **Railway (Backend)**: $5-20
- **Vercel (Frontend)**: Free tier suitable
- **Supabase**: Free tier (500MB)
- **Upstash Redis**: Free tier (10K commands/day)
- **Domain**: $10-15/year
- **API Costs**: Variable based on usage

## 🛠️ Development

### Testing

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Pre-commit hooks**: Quality gates
- **Lighthouse CI**: Performance monitoring

## 📚 API Documentation

The backend automatically generates OpenAPI documentation:
- Development: http://localhost:8000/docs
- Production: Available when `DEBUG=true`

### Key Endpoints

- `POST /api/v1/flights/search` - Search flights
- `GET /api/v1/flights/search` - Search flights (URL params)
- `POST /api/v1/hotels/search` - Search hotels
- `GET /api/v1/hotels/search` - Search hotels (URL params)
- `GET /health` - Health check

## 🔍 Monitoring

### Application Monitoring

- **Logs**: Structured logging with timestamps
- **Metrics**: Response times, error rates
- **Health Checks**: Endpoint monitoring
- **Database**: Query performance tracking

### Analytics

- **Search Logs**: All searches tracked in database
- **Popular Routes**: Most searched flight routes
- **Performance**: Search times and cache hit rates
- **User Behavior**: Search patterns and trends

## 🔐 Security

- **Environment Variables**: Sensitive data in env vars
- **CORS**: Properly configured cross-origin requests
- **Input Validation**: Pydantic models for API validation
- **SQL Injection**: Protected with parameterized queries
- **Rate Limiting**: Consider implementing for production
- **HTTPS**: Enforced in production

## 📈 Scaling Considerations

### Current Capacity
- **10 TPS**: Easily supported
- **100 TPS**: Add Redis clustering, rate limiting
- **1000 TPS**: Database read replicas, CDN optimization

### Optimization Areas
- **Caching**: Increase TTL for popular routes
- **Database**: Optimize queries, add indexes
- **API Calls**: Implement smart retries
- **CDN**: Static asset optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Backend not starting:**
- Check Python version (3.11+ required)
- Verify all environment variables are set
- Check Railway logs for errors

**Frontend build fails:**
- Verify Node.js version (18+ required)
- Check API URL is accessible
- Review build logs in Vercel

**API calls failing:**
- Verify CORS settings
- Check API keys are valid
- Test endpoints with curl/Postman

### Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: Create GitHub issue
- **API Docs**: Visit `/docs` endpoint
- **Community**: Join discussions

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Multi-provider flight search
- ✅ Hotel search integration
- ✅ Caching layer
- ✅ Responsive UI
- ✅ Deployment automation

### Phase 2 (Next)
- 🔄 Price alerts and notifications
- 🔄 User accounts and saved searches
- 🔄 Mobile app (React Native)
- 🔄 Advanced filters and sorting
- 🔄 International expansion

### Phase 3 (Future)
- 🔄 Car rental integration
- 🔄 Package deals
- 🔄 B2B API marketplace
- 🔄 AI-powered recommendations
- 🔄 Real-time price tracking

---

## Quick Setup Checklist

- [ ] Clone repository
- [ ] Set up Python virtual environment
- [ ] Install backend dependencies
- [ ] Install frontend dependencies
- [ ] Create Supabase project
- [ ] Set up Redis database
- [ ] Get API keys (Kiwi, Skyscanner, Booking)
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Test local development
- [ ] Deploy to Railway (backend)
- [ ] Deploy to Vercel (frontend)
- [ ] Configure custom domain
- [ ] Set up monitoring

**Total setup time: 2-4 hours**

---

Built with ❤️ by the LastMinute Travel team