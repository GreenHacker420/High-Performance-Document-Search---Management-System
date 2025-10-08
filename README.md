# 🔍 High-Performance Document Search & Management System

A modern, full-stack document search system with **live search**, **AI-powered suggestions**, and **PDF inline viewing**. Built with React, Node.js, PostgreSQL, and Redis.

## ✨ Features

### 🚀 **Live Search**
- **Search as you type** - Results appear instantly without clicking search
- **Partial word matching** - "java" finds "JavaScript" content
- **Smart ranking** - Relevance-based result ordering
- **Highlighted snippets** - Search terms highlighted in results

### 🧠 **Intelligent Search**
- **PostgreSQL Full-Text Search** - Advanced search capabilities
- **Redis Caching** - 5-minute result cache, 10-minute suggestion cache
- **Autocomplete Suggestions** - Smart suggestions as you type
- **Instant Filtering** - Client-side result filtering

### 📄 **Document Management**
- **PDF Inline Viewing** - View PDFs without downloading
- **Multi-format Support** - FAQs, Web Links, and PDFs
- **File Upload** - Drag & drop PDF uploads
- **Content Extraction** - Automatic text extraction from PDFs

### 🎨 **Modern UI/UX**
- **Responsive Design** - Works on all devices
- **Clean Interface** - Intuitive search experience
- **Real-time Feedback** - Loading states and cache indicators
- **Accessibility** - Screen reader friendly

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   React + Vite  │────│   Node.js       │────│   Full-Text     │
│   Port: 3000    │    │   Port: 9000    │    │   Search        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   Redis Cache   │
                       │   Search Cache  │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 15+ (for local development)

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd "High-Performance Document Search & Management System"
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Deploy with Docker
```bash
./deploy.sh
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:9000
- **Health Check**: http://localhost:9000/health

## 🛠️ Development

### Local Development Setup
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend  
cd frontend
npm install
npm run dev

# Database (separate terminal)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15

# Redis (separate terminal)
docker run -d -p 6379:6379 redis:7-alpine
```

### Project Structure
```
├── backend/                 # Node.js API server
│   ├── config/             # Database & environment config
│   ├── controllers/        # Route controllers
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── services/          # Business logic (cache, etc.)
│   └── uploads/           # File uploads directory
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   └── services/      # API services
│   └── public/            # Static assets
├── docker-compose.yml     # Multi-service deployment
├── deploy.sh             # Deployment script
└── monitor.sh            # Health monitoring script
```

## 📊 Performance Features

### Caching Strategy
- **Search Results**: 5-minute TTL for faster repeat searches
- **Suggestions**: 10-minute TTL for autocomplete
- **Static Assets**: 1-year browser cache with immutable headers

### Database Optimizations
- **Connection Pooling**: Max 20 connections with timeouts
- **Full-Text Indexes**: PostgreSQL `tsvector` for fast search
- **Query Optimization**: Parameterized queries with ranking

### Frontend Optimizations
- **Code Splitting**: Lazy-loaded components
- **Debounced Search**: 500ms delay to reduce API calls
- **Instant Filtering**: Client-side result filtering
- **Gzipped Assets**: Compressed static files

## 🔒 Security Features

### Backend Security
- **CORS Protection**: Configurable origin whitelist
- **Request Limits**: 10MB max request size
- **SQL Injection Protection**: Parameterized queries
- **Non-root Containers**: Security-hardened Docker images

### Frontend Security
- **CSP Headers**: Content Security Policy
- **XSS Protection**: Anti-cross-site scripting
- **Frame Protection**: Clickjacking prevention
- **HTTPS Ready**: SSL/TLS support

## 🐳 Docker Deployment

### Services
- **Frontend**: Nginx + React (Multi-stage build)
- **Backend**: Node.js 18 Alpine
- **Database**: PostgreSQL 15 Alpine
- **Cache**: Redis 7 Alpine

### Health Checks
All services include health checks:
```bash
# Check all services
./monitor.sh

# Individual health checks
curl http://localhost:3000/health    # Frontend
curl http://localhost:9000/health    # Backend
```

## 🌐 Production Deployment (Coolify)

### 1. Coolify Setup
1. Create new project in Coolify dashboard
2. Connect Git repository
3. Choose "Docker Compose" deployment
4. Set environment variables

### 2. Environment Variables
```bash
POSTGRES_PASSWORD=your_secure_password
VITE_API_URL=https://your-domain.com:9000
NODE_ENV=production
```

### 3. Domain Configuration
- Add custom domain in Coolify
- Enable SSL (Let's Encrypt)
- Configure port mappings

### 4. Deploy
Click "Deploy" in Coolify dashboard and monitor logs.

## 📈 Monitoring & Maintenance

### Health Monitoring
```bash
./monitor.sh              # Full system health check
docker-compose ps          # Service status
docker-compose logs -f     # Live logs
```

### Database Backup
```bash
# Backup
docker-compose exec postgres pg_dump -U postgres document_search > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres document_search < backup.sql
```

### Updates
```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

## 🔧 API Endpoints

### Search API
```bash
# Search documents
GET /api/search?q=query&type=faq&limit=20

# Get suggestions
GET /api/search/suggestions?q=partial_query

# Health check
GET /health
```

### Document APIs
```bash
# FAQs
GET /api/faqs
POST /api/faqs
PUT /api/faqs/:id
DELETE /api/faqs/:id

# PDFs
GET /api/pdfs
POST /api/pdfs (multipart/form-data)
GET /api/pdfs/:id/download
DELETE /api/pdfs/:id

# Web Links
GET /api/links
POST /api/links
PUT /api/links/:id
DELETE /api/links/:id
```

## 🧪 Testing

### Manual Testing
1. **Live Search**: Type in search box, verify instant results
2. **Partial Words**: Search "java" should find "JavaScript"
3. **PDF Upload**: Upload PDF, verify text extraction
4. **PDF Viewing**: Click "View" on PDF results
5. **Caching**: Repeat searches should show cache indicator

### Performance Testing
```bash
# Load test search endpoint
curl -w "@curl-format.txt" -s "http://localhost:9000/api/search?q=test"

# Monitor resource usage
docker stats
```

## 🚨 Troubleshooting

### Common Issues

**Services not starting**
```bash
docker-compose logs <service-name>
```

**Database connection failed**
- Check PostgreSQL logs
- Verify environment variables
- Ensure database is ready before backend

**Search not working**
- Check backend logs for errors
- Verify PostgreSQL full-text search setup
- Test API endpoints directly

**Frontend not loading**
- Check Nginx configuration
- Verify API URL in environment
- Check CORS settings

## 📝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PostgreSQL** for powerful full-text search
- **Redis** for high-performance caching
- **React** for modern UI framework
- **Ant Design** for beautiful components
- **Docker** for containerization
- **Coolify** for easy deployment

---

## 🎯 Key Features Summary

✅ **Live Search** - Search as you type  
✅ **Partial Matching** - "java" finds "JavaScript"  
✅ **Redis Caching** - 5-10 minute cache TTL  
✅ **PDF Viewing** - Inline PDF viewer  
✅ **Smart Suggestions** - Autocomplete with ranking  
✅ **Production Ready** - Docker + Coolify deployment  
✅ **Security Hardened** - CORS, CSP, non-root containers  
✅ **Performance Optimized** - Connection pooling, gzip, CDN-ready  

**🚀 Ready for production deployment on your Coolify AWS instance!**
