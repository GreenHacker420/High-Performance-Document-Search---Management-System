# Backend Setup Instructions

## ✅ What's Already Done

1. ✅ PostgreSQL 18 is installed and running
2. ✅ Database `document_search` created
3. ✅ Database schema initialized with tables and indexes

## 🔧 Quick Setup

### 1. Create `.env` file

Run this command to create your `.env` file:

```bash
cat > .env << 'EOF'
# Database Configuration
DB_USER=greenhacker
DB_HOST=localhost
DB_NAME=document_search
DB_PASSWORD=
DB_PORT=5432

# Server Configuration
PORT=3000

# Upload Configuration
UPLOAD_DIR=./uploads
EOF
```

### 2. Start the server

```bash
npm run dev
```

The server should now start successfully on `http://localhost:3000`

## 🧪 Test the API

Once running, test with:

```bash
# Health check
curl http://localhost:3000/health

# API info
curl http://localhost:3000/

# Create a test FAQ
curl -X POST http://localhost:3000/api/faqs \
  -H "Content-Type: application/json" \
  -d '{"title":"Test FAQ","content":"This is a test","tags":["test"]}'

# Search
curl "http://localhost:3000/api/search?q=test"
```

## 📝 Notes

- Your PostgreSQL user is `greenhacker` (your macOS username)
- No password is needed for local Homebrew PostgreSQL
- Database is already initialized with full-text search indexes
- Upload directory will be created automatically on first PDF upload
