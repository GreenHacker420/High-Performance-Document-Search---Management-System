# 🚀 Deployment Guide for Coolify AWS Instance

This guide will help you deploy the High-Performance Document Search & Management System on your Coolify AWS instance.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Coolify instance running on AWS
- Domain name configured (optional but recommended)
- SSL certificate (Let's Encrypt via Coolify)

## 🔧 Quick Deployment

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd High-Performance\ Document\ Search\ \&\ Management\ System
cp .env.example .env
```

### 2. Configure Environment
Edit `.env` file with your production values:

```bash
# Database Configuration
POSTGRES_DB=document_search
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_PORT=5432

# Redis Configuration  
REDIS_PORT=6379

# Backend Configuration
BACKEND_PORT=9000
NODE_ENV=production

# Frontend Configuration
FRONTEND_PORT=3000
VITE_API_URL=https://your-domain.com:9000

# Upload Configuration
UPLOAD_MAX_SIZE=10485760
```

### 3. Deploy
```bash
./deploy.sh
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   PostgreSQL    │
│   (Nginx)       │────│   (Node.js)     │────│   Database      │
│   Port: 3000    │    │   Port: 9000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   Redis Cache   │
                       │   Port: 6379    │
                       └─────────────────┘
```

## 🐳 Docker Services

### Frontend (Nginx + React)
- **Image**: Multi-stage build with Node.js + Nginx
- **Port**: 3000 (configurable)
- **Features**: Gzipped assets, security headers, client-side routing
- **Health Check**: `/health` endpoint

### Backend (Node.js API)
- **Image**: Node.js 18 Alpine
- **Port**: 9000 (configurable)
- **Features**: Express API, file uploads, search endpoints
- **Health Check**: `/health` endpoint

### PostgreSQL Database
- **Image**: PostgreSQL 15 Alpine
- **Port**: 5432 (configurable)
- **Features**: Full-text search, automatic schema initialization
- **Persistence**: Named volume `postgres_data`

### Redis Cache
- **Image**: Redis 7 Alpine
- **Port**: 6379 (configurable)
- **Features**: Search result caching, LRU eviction policy
- **Persistence**: Named volume `redis_data`

## 🔒 Security Features

### Backend Security
- Non-root user in containers
- CORS configuration
- Request size limits (10MB)
- Health checks for all services
- Graceful shutdown handling

### Frontend Security
- Security headers (XSS, CSRF protection)
- Content Security Policy
- Frame options protection
- Gzip compression

### Database Security
- Connection pooling with limits
- Parameterized queries (SQL injection protection)
- Connection timeouts

## 📊 Performance Optimizations

### Caching Strategy
- **Search Results**: 5-minute TTL
- **Suggestions**: 10-minute TTL
- **Static Assets**: 1-year cache with immutable headers

### Database Optimizations
- Connection pooling (max 20 connections)
- Idle timeout: 30 seconds
- Connection timeout: 2 seconds
- Full-text search indexes

### Frontend Optimizations
- Multi-stage Docker build
- Gzipped assets
- Code splitting (Vite)
- Lazy loading components

## 🌐 Coolify Configuration

### 1. Create New Project
1. Login to your Coolify dashboard
2. Create new project: "Document Search System"
3. Choose "Docker Compose" deployment

### 2. Repository Setup
1. Connect your Git repository
2. Set branch to `main` or your deployment branch
3. Set build context to root directory

### 3. Environment Variables
Add these in Coolify environment settings:
```
POSTGRES_PASSWORD=your_secure_password
VITE_API_URL=https://your-domain.com:9000
NODE_ENV=production
```

### 4. Domain Configuration
1. Add your domain in Coolify
2. Enable SSL (Let's Encrypt)
3. Configure port mappings:
   - Frontend: 3000 → 80/443
   - Backend: 9000 → 9000

### 5. Deploy
1. Click "Deploy" in Coolify
2. Monitor deployment logs
3. Verify all services are healthy

## 🔍 Monitoring & Logs

### Health Checks
- **Frontend**: `GET /health` → "healthy"
- **Backend**: `GET /health` → `{"status":"ok","timestamp":"..."}`
- **Database**: `pg_isready` command
- **Redis**: `redis-cli ping` command

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Service Status
```bash
docker-compose ps
```

## 🛠️ Maintenance

### Backup Database
```bash
docker-compose exec postgres pg_dump -U postgres document_search > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U postgres document_search < backup.sql
```

### Update Application
```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Scale Services (if needed)
```bash
# Scale backend instances
docker-compose up -d --scale backend=3
```

## 🚨 Troubleshooting

### Common Issues

1. **Services not starting**
   ```bash
   docker-compose logs <service-name>
   ```

2. **Database connection issues**
   - Check PostgreSQL logs
   - Verify environment variables
   - Ensure database is ready before backend starts

3. **Redis connection issues**
   - Check Redis logs
   - Verify Redis URL format
   - Application works without Redis (graceful fallback)

4. **Frontend not loading**
   - Check Nginx logs
   - Verify API URL configuration
   - Check CORS settings

### Performance Issues

1. **Slow search results**
   - Check Redis cache hit rate
   - Monitor database query performance
   - Verify full-text search indexes

2. **High memory usage**
   - Adjust Redis maxmemory settings
   - Monitor database connection pool
   - Check for memory leaks in logs

## 📈 Scaling Recommendations

### For High Traffic
1. **Load Balancer**: Use Coolify's built-in load balancing
2. **Database**: Consider read replicas for PostgreSQL
3. **Cache**: Redis Cluster for distributed caching
4. **CDN**: CloudFront for static assets

### Resource Limits
```yaml
# Add to docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Database backups scheduled
- [ ] Monitoring setup (logs, metrics)
- [ ] Domain DNS configured
- [ ] Firewall rules configured
- [ ] Health checks working
- [ ] Performance testing completed

## 📞 Support

For deployment issues:
1. Check service logs first
2. Verify environment configuration
3. Test individual service health endpoints
4. Review Coolify deployment logs

---

🎉 **Your Document Search System is now production-ready!**
