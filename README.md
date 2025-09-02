# ✈️ Next24 - AI-Powered Travel Platform

A comprehensive travel platform built with Next.js, FastAPI, and PostgreSQL, featuring flight search, destination guides, itinerary planning, and travel recommendations.

## 🌟 Features

### 🔍 **Flight Search**
- Real-time flight search with SerpAPI integration
- Advanced filtering and sorting options
- Price tracking and alerts
- Multi-city and round-trip support

### 🗺️ **Dynamic Destination Guides**
- 19+ comprehensive destination guides
- Seasonal recommendations with weather data
- Interactive budget breakdown calculator
- Local insights and hidden gems
- Photo galleries with categories
- Interactive maps with Google Maps integration

### 📅 **Itinerary Planner**
- Interactive timeline-based planning
- Activity suggestions and recommendations
- Collaboration features for group travel
- Export options (PDF, Calendar, Email)
- Google Maps integration

### 📚 **Travel Guides**
- Budget travel guides
- Packing checklists
- Airport information
- Best destinations by category

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)

### 🐳 Run with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next24
   ```

2. **Start the application**
   ```bash
   ./start-docker.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### 🛠️ Local Development

1. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Database Setup**
   ```bash
   docker-compose up -d postgres
   ```

## 🏗️ Architecture

```
next24/
├── frontend/          # Next.js React application
├── backend/           # FastAPI Python backend
├── database/          # PostgreSQL database setup
├── docs/              # Documentation files
└── docker-compose.yml # Docker orchestration
```

### Frontend (Next.js)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons
- **State Management**: React hooks and context
- **Maps**: Google Maps API integration

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.9+
- **Database**: PostgreSQL with SQLAlchemy
- **APIs**: SerpAPI for flight data
- **Authentication**: JWT-based (ready for implementation)

### Database
- **Primary**: PostgreSQL
- **ORM**: SQLAlchemy
- **Migrations**: Alembic

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local)**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/next24
SERPAPI_KEY=your_serpapi_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 📖 API Documentation

The backend provides a comprehensive REST API documented with OpenAPI/Swagger:
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints
- `GET /flights/search` - Search flights
- `GET /destinations` - Get destination data
- `POST /itineraries` - Create itinerary
- `GET /guides` - Get travel guides

## 🌍 Destinations

The platform features comprehensive guides for 19+ destinations across 6 continents:

- **Europe**: Paris, London, Rome, Barcelona, Berlin, Amsterdam, Athens, Istanbul, Moscow
- **Asia**: Tokyo, Bangkok, Singapore, Beijing, Seoul, Ho Chi Minh City, Mumbai
- **North America**: New York City, Vancouver, Mexico City
- **South America**: Rio de Janeiro, Buenos Aires, Santiago, Lima
- **Africa & Middle East**: Cairo, Cape Town, Marrakech, Dubai, Tel Aviv
- **Oceania**: Sydney, Auckland

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SerpAPI** for flight data
- **Google Maps** for mapping services
- **Unsplash** for high-quality destination images
- **Lucide** for beautiful icons
- **Tailwind CSS** for styling framework

## 📞 Support

For support, email support@next24.com or create an issue in the repository.

---

Built with ❤️ for travelers around the world 🌍