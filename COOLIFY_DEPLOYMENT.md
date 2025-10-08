# 🚀 Coolify AWS Deployment Guide

Complete step-by-step guide to deploy your Document Search System on Coolify.

## 📋 Prerequisites

- Coolify instance running on AWS
- Domain name configured
- GitHub/GitLab repository access
- SSL certificate (Let's Encrypt via Coolify)

---

## 🎯 Deployment Strategy

**Use Git-Based Deployment with Separate Database Services**

### Why This Approach?
✅ Coolify manages databases separately (better resource management)  
✅ Automatic backups for databases  
✅ Easy scaling and monitoring  
✅ Git-based CI/CD pipeline  

---

## 📝 Step-by-Step Deployment

### **Step 1: Create PostgreSQL Database**

1. **Navigate to Databases**
   - Click "Databases" in Coolify sidebar
   - Click "+ Add Database"

2. **Select PostgreSQL**
   - Choose "PostgreSQL"
   - Version: **PostgreSQL 15** (or latest)

3. **Configure Database**
   ```
   Database Name: document_search
   Username: postgres
   Password: [Generate Strong Password]
   Port: 5432
   ```

4. **Enable Persistence**
   - ✅ Enable volume persistence
   - Volume size: **5GB** (or more based on needs)

5. **Deploy Database**
   - Click "Deploy"
   - Wait for status: "Running"
   - **Copy the internal connection URL** (looks like: `postgres://postgres:password@postgres-xxxx:5432/document_search`)

---

### **Step 2: Create Redis Cache**

1. **Navigate to Databases**
   - Click "Databases" in Coolify sidebar
   - Click "+ Add Database"

2. **Select Redis**
   - Choose "Redis"
   - Version: **Redis 7** (or latest)

3. **Configure Redis**
   ```
   Port: 6379
   Max Memory: 512MB
   Eviction Policy: allkeys-lru
   ```

4. **Enable Persistence**
   - ✅ Enable AOF persistence
   - Volume size: **1GB**

5. **Deploy Redis**
   - Click "Deploy"
   - Wait for status: "Running"
   - **Copy the internal connection URL** (looks like: `redis://redis-xxxx:6379`)

---

### **Step 3: Prepare Your Repository**

1. **Rename docker-compose file for Coolify**
   ```bash
   # In your project root
   mv docker-compose.yml docker-compose.local.yml
   mv docker-compose.coolify.yml docker-compose.yml
   ```

2. **Update .gitignore** (already done)
   ```
   .env
   .env.local
   .env.production
   ```

3. **Commit and Push**
   ```bash
   git add .
   git commit -m "Configure for Coolify deployment"
   git push origin main
   ```

---

### **Step 4: Create Main Application**

1. **Navigate to Applications**
   - Click "Applications" in Coolify sidebar
   - Click "+ Add Application"

2. **Choose Git-Based Deployment**
   - Select: **"Private Repository (with GitHub App)"** or **"Public Repository"**
   - Connect your GitHub/GitLab account if not already connected

3. **Select Repository**
   - Choose your repository
   - Branch: `main` (or your deployment branch)
   - Build Pack: **"Docker Compose"**

4. **Configure Build Settings**
   ```
   Build Context: ./
   Docker Compose File: docker-compose.yml
   ```

---

### **Step 5: Configure Environment Variables**

Add these environment variables in Coolify:

```bash
# Database Configuration (from Step 1)
DB_HOST=postgres-xxxx.coolify.internal
DB_PORT=5432
DB_NAME=document_search
DB_USER=postgres
DB_PASSWORD=your_postgres_password_from_step1

# Redis Configuration (from Step 2)
REDIS_URL=redis://redis-xxxx.coolify.internal:6379

# Backend Configuration
NODE_ENV=production
PORT=9000

# Frontend Configuration
VITE_API_URL=https://api.your-domain.com

# CORS Configuration
CORS_ORIGIN=https://your-domain.com,https://www.your-domain.com

# Upload Configuration
UPLOAD_MAX_SIZE=10485760
```

**Important Notes:**
- Replace `postgres-xxxx` and `redis-xxxx` with actual internal hostnames from Coolify
- Replace `your-domain.com` with your actual domain
- Use strong passwords for production

---

### **Step 6: Configure Domains & SSL**

#### **Frontend Domain**
1. Click "Domains" tab in your application
2. Add domain: `your-domain.com`
3. Port: `3000`
4. Enable SSL: ✅ Let's Encrypt
5. Click "Generate SSL Certificate"

#### **Backend API Domain**
1. Add another domain: `api.your-domain.com`
2. Port: `9000`
3. Enable SSL: ✅ Let's Encrypt
4. Click "Generate SSL Certificate"

#### **DNS Configuration**
Point your domains to Coolify server IP:
```
A Record: your-domain.com → [Coolify-Server-IP]
A Record: api.your-domain.com → [Coolify-Server-IP]
```

---

### **Step 7: Initialize Database Schema**

After first deployment, initialize the database:

1. **Access Backend Container**
   - In Coolify, go to your application
   - Click "Terminal" or "Execute Command"

2. **Run Database Initialization**
   ```bash
   npm run init-db
   ```

   Or manually:
   ```bash
   node config/initDb.js
   ```

3. **Verify Database**
   - Check logs for "Database schema initialized successfully!"

---

### **Step 8: Deploy Application**

1. **Click "Deploy"**
   - Coolify will build and deploy your application
   - Monitor build logs in real-time

2. **Wait for Deployment**
   - Backend: Wait for "Running" status
   - Frontend: Wait for "Running" status

3. **Check Health**
   - Visit: `https://api.your-domain.com/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

---

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] **PostgreSQL**: Database is running and accessible
- [ ] **Redis**: Cache is running and accessible
- [ ] **Backend Health**: `https://api.your-domain.com/health` returns OK
- [ ] **Frontend**: `https://your-domain.com` loads correctly
- [ ] **Search API**: Test search functionality
- [ ] **PDF Upload**: Test file upload
- [ ] **SSL Certificates**: Both domains have valid SSL

---

## 🔍 Testing Your Deployment

### **1. Test Backend API**
```bash
# Health check
curl https://api.your-domain.com/health

# Search test
curl "https://api.your-domain.com/api/search?q=test"

# Suggestions test
curl "https://api.your-domain.com/api/search/suggestions?q=test"
```

### **2. Test Frontend**
- Visit `https://your-domain.com`
- Try live search (type in search box)
- Upload a PDF
- View PDF inline
- Check autocomplete suggestions

### **3. Test Caching**
- Search for something twice
- Second search should show "cached: true" in response
- Check Redis connection in backend logs

---

## 📊 Monitoring in Coolify

### **View Logs**
1. Go to your application in Coolify
2. Click "Logs" tab
3. Select service (backend/frontend)
4. View real-time logs

### **Resource Usage**
1. Click "Metrics" tab
2. Monitor:
   - CPU usage
   - Memory usage
   - Network traffic
   - Disk usage

### **Health Checks**
- Coolify automatically monitors health endpoints
- Restarts containers if health checks fail
- View status in "Overview" tab

---

## 🛠️ Maintenance Tasks

### **Update Application**
```bash
# Push changes to git
git add .
git commit -m "Update feature"
git push origin main

# Coolify auto-deploys (if enabled)
# Or manually click "Redeploy" in Coolify
```

### **Database Backup**
1. Go to PostgreSQL service in Coolify
2. Click "Backup" tab
3. Configure automatic backups:
   - Frequency: Daily
   - Retention: 7 days
   - Storage: S3 or local

### **View Application Logs**
```bash
# In Coolify terminal
docker logs -f <container-name>
```

### **Restart Services**
1. Go to application in Coolify
2. Click "Restart" button
3. Select service to restart

---

## 🚨 Troubleshooting

### **Issue: Database Connection Failed**

**Solution:**
1. Check environment variables in Coolify
2. Verify PostgreSQL is running
3. Check internal hostname: `postgres-xxxx.coolify.internal`
4. Test connection from backend container:
   ```bash
   psql -h postgres-xxxx.coolify.internal -U postgres -d document_search
   ```

### **Issue: Redis Connection Failed**

**Solution:**
1. Check REDIS_URL environment variable
2. Verify Redis is running
3. Check internal hostname: `redis-xxxx.coolify.internal`
4. Test connection:
   ```bash
   redis-cli -h redis-xxxx.coolify.internal ping
   ```

### **Issue: Frontend Can't Connect to Backend**

**Solution:**
1. Check VITE_API_URL environment variable
2. Verify CORS_ORIGIN includes frontend domain
3. Check both domains have valid SSL
4. Test API directly: `curl https://api.your-domain.com/health`

### **Issue: Build Fails**

**Solution:**
1. Check build logs in Coolify
2. Verify Dockerfile syntax
3. Check if all dependencies are in package.json
4. Try rebuilding: Click "Redeploy" with "Force Rebuild"

---

## 📈 Scaling Recommendations

### **For High Traffic**

1. **Scale Backend**
   - In Coolify, increase backend replicas
   - Configure load balancing

2. **Upgrade Database**
   - Increase PostgreSQL resources
   - Consider read replicas

3. **Upgrade Redis**
   - Increase memory limit
   - Consider Redis Cluster

4. **Add CDN**
   - Use CloudFront for static assets
   - Configure in Coolify domains

---

## 🔐 Security Best Practices

### **Environment Variables**
- ✅ Use strong passwords (20+ characters)
- ✅ Never commit .env files
- ✅ Rotate passwords regularly
- ✅ Use Coolify's secret management

### **SSL/TLS**
- ✅ Enable HTTPS for all domains
- ✅ Use Let's Encrypt auto-renewal
- ✅ Force HTTPS redirect

### **Database Security**
- ✅ Use internal networking (Coolify handles this)
- ✅ Regular backups
- ✅ Strong passwords
- ✅ Limited user permissions

---

## 📞 Support & Resources

### **Coolify Documentation**
- [Coolify Docs](https://coolify.io/docs)
- [Docker Compose Guide](https://coolify.io/docs/knowledge-base/docker/compose)

### **Your Application**
- Health Check: `https://api.your-domain.com/health`
- API Docs: `https://api.your-domain.com/`
- Frontend: `https://your-domain.com`

---

## 🎉 Success!

Your Document Search System is now live on Coolify! 🚀

**Quick Links:**
- 🌐 Frontend: `https://your-domain.com`
- 🔌 Backend API: `https://api.your-domain.com`
- 📊 Health: `https://api.your-domain.com/health`

**Next Steps:**
1. Test all features thoroughly
2. Set up monitoring and alerts
3. Configure automatic backups
4. Add your content (FAQs, PDFs, Links)
5. Share with users!

---

**Need Help?** Check Coolify logs and application health endpoints first!
