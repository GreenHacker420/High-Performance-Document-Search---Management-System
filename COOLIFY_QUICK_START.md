# ⚡ Coolify Quick Start - TL;DR

## 🎯 What to Choose in Coolify

### **1. Create PostgreSQL Database**
```
Databases → PostgreSQL → Create
├─ Name: document_search
├─ User: postgres
├─ Password: [strong password]
└─ Copy URL: postgres://postgres:pass@postgres-xxxx:5432/document_search
```

### **2. Create Redis Cache**
```
Databases → Redis → Create
├─ Port: 6379
├─ Max Memory: 512MB
└─ Copy URL: redis://redis-xxxx:6379
```

### **3. Create Application**
```
Applications → Git Based → Private Repository (with GitHub App)
├─ Repository: [your-repo]
├─ Branch: main
├─ Build Pack: Docker Compose
└─ Docker Compose File: docker-compose.yml
```

---

## 🔧 Environment Variables to Add

```bash
# From PostgreSQL service
DB_HOST=postgres-xxxx.coolify.internal
DB_PORT=5432
DB_NAME=document_search
DB_USER=postgres
DB_PASSWORD=[from-postgres-service]

# From Redis service
REDIS_URL=redis://redis-xxxx.coolify.internal:6379

# Your domains
VITE_API_URL=https://api.your-domain.com
CORS_ORIGIN=https://your-domain.com

# Production settings
NODE_ENV=production
PORT=9000
```

---

## 🌐 Domain Configuration

```
Frontend Domain:
├─ Domain: your-domain.com
├─ Port: 3000
└─ SSL: ✅ Let's Encrypt

Backend Domain:
├─ Domain: api.your-domain.com
├─ Port: 9000
└─ SSL: ✅ Let's Encrypt
```

---

## 📝 Before First Deploy

```bash
# 1. Rename docker-compose for Coolify
mv docker-compose.yml docker-compose.local.yml
mv docker-compose.coolify.yml docker-compose.yml

# 2. Commit and push
git add .
git commit -m "Configure for Coolify"
git push origin main
```

---

## 🚀 After First Deploy

```bash
# Initialize database schema
# In Coolify terminal for backend container:
npm run init-db
```

---

## ✅ Quick Test

```bash
# Health check
curl https://api.your-domain.com/health

# Search test
curl "https://api.your-domain.com/api/search?q=test"

# Frontend
open https://your-domain.com
```

---

## 🎯 Summary

**Choose in Coolify:**
1. **Databases** → PostgreSQL (for main database)
2. **Databases** → Redis (for caching)
3. **Applications** → Git Based → Private Repository (for your app)

**That's it!** 🎉

Full guide: See `COOLIFY_DEPLOYMENT.md`
