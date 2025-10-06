# Document Search & Management System - Backend API

A high-performance Node.js backend API for managing and searching PDFs, web links, and FAQs with full-text search capabilities.

## 🚀 Features

- **CRUD Operations** for FAQs, Web Links, and PDFs
- **Full-text Search** using PostgreSQL's built-in search capabilities
- **PDF Text Extraction** using pdf-parse
- **Web Scraping** for automatic link metadata extraction
- **File Upload** with validation and size limits
- **Pagination** for all list endpoints
- **Type-safe** database queries

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=document_search
   DB_PASSWORD=your_password
   DB_PORT=5432
   PORT=3000
   UPLOAD_DIR=./uploads
   ```

4. **Initialize the database**
   
   First, create the database:
   ```bash
   psql -U postgres -c "CREATE DATABASE document_search;"
   ```

   Then run the schema initialization:
   ```bash
   npm run init-db
   ```

5. **Start the server**
   
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm start
   ```

## 📡 API Endpoints

### FAQs

- `GET /api/faqs` - Get all FAQs (paginated)
  - Query params: `page`, `limit`
- `GET /api/faqs/:id` - Get FAQ by ID
- `POST /api/faqs` - Create new FAQ
  - Body: `{ title, content, tags[] }`
- `PUT /api/faqs/:id` - Update FAQ
  - Body: `{ title?, content?, tags[]? }`
- `DELETE /api/faqs/:id` - Delete FAQ

### Web Links

- `GET /api/links` - Get all links (paginated)
  - Query params: `page`, `limit`
- `GET /api/links/:id` - Get link by ID
- `POST /api/links` - Create new link (auto-scrapes if URL provided)
  - Body: `{ url, title?, description?, autoScrape? }`
- `PUT /api/links/:id` - Update link
  - Body: `{ url?, title?, description? }`
- `DELETE /api/links/:id` - Delete link

### PDFs

- `GET /api/pdfs` - Get all PDFs (paginated)
  - Query params: `page`, `limit`
- `GET /api/pdfs/:id` - Get PDF by ID
- `POST /api/pdfs` - Upload PDF (multipart/form-data)
  - Field: `file` (PDF file, max 10MB)
- `GET /api/pdfs/:id/download` - Download PDF file
- `DELETE /api/pdfs/:id` - Delete PDF

### Search

- `GET /api/search` - Unified search across all content
  - Query params: 
    - `q` (required) - Search query
    - `type` (optional) - Filter by type: `faq`, `link`, or `pdf`
    - `limit` (optional) - Max results (default: 20)

### Health Check

- `GET /health` - Server health status
- `GET /` - API information

## 🗄️ Database Schema

### Tables

**faqs**
- `id` - Serial primary key
- `title` - VARCHAR(500)
- `content` - TEXT
- `tags` - TEXT[]
- `created_at`, `updated_at` - Timestamps
- `search_vector` - tsvector (auto-generated)

**web_links**
- `id` - Serial primary key
- `url` - TEXT (unique)
- `title` - VARCHAR(500)
- `description` - TEXT
- `content_text` - TEXT
- `created_at`, `updated_at` - Timestamps
- `search_vector` - tsvector (auto-generated)

**pdfs**
- `id` - Serial primary key
- `file_name` - VARCHAR(500)
- `file_path` - TEXT
- `content_text` - TEXT
- `file_size` - BIGINT
- `uploaded_at` - Timestamp
- `search_vector` - tsvector (auto-generated)

### Indexes

- GIN indexes on `search_vector` columns for full-text search
- B-tree indexes on timestamp columns for sorting

## 🔍 Search Implementation

The search uses PostgreSQL's full-text search with:
- **Weighted ranking**: Title (A) > Description (B) > Content (C)
- **websearch_to_tsquery**: Supports natural language queries
- **ts_rank**: Relevance-based result ordering
- **Type filtering**: Optional filtering by content type

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js           # Database connection pool
│   ├── env.js          # Environment configuration
│   ├── initDb.js       # Database initialization script
│   └── schema.sql      # Database schema
├── controllers/
│   ├── faq.controller.js
│   ├── weblink.controller.js
│   ├── pdf.controller.js
│   └── search.controller.js
├── models/
│   ├── faq.model.js
│   ├── weblink.model.js
│   ├── pdf.model.js
│   └── search.model.js
├── routes/
│   ├── faq.routes.js
│   ├── weblink.routes.js
│   ├── pdf.routes.js
│   └── search.routes.js
├── utils/
│   ├── pdfParser.js    # PDF text extraction
│   └── webScraper.js   # Web page scraping
├── uploads/            # PDF storage directory
├── server.js           # Main application entry
└── package.json
```

## 🧪 Testing the API

### Using cURL

**Create a FAQ:**
```bash
curl -X POST http://localhost:3000/api/faqs \
  -H "Content-Type: application/json" \
  -d '{"title":"What is Node.js?","content":"Node.js is a JavaScript runtime...","tags":["nodejs","javascript"]}'
```

**Add a Web Link:**
```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"url":"https://nodejs.org","autoScrape":true}'
```

**Upload a PDF:**
```bash
curl -X POST http://localhost:3000/api/pdfs \
  -F "file=@/path/to/document.pdf"
```

**Search:**
```bash
curl "http://localhost:3000/api/search?q=nodejs&type=faq&limit=10"
```

## 🔒 Security Considerations

- File upload validation (PDF only, max 10MB)
- SQL injection prevention via parameterized queries
- CORS enabled for frontend integration
- Input validation on all endpoints

## 🚀 Performance Optimizations

- Connection pooling for database
- GIN indexes for fast full-text search
- Pagination to limit result sets
- Async/await for non-blocking operations
- Query execution time logging

## 📝 License

MIT

## 👨‍💻 Author

GreenHacker