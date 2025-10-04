# 🧩 High-Performance Document Search & Management System

## 🔍 Public Search Interface (React + Vite)

- **Single search bar** querying all indexed content
- **Filters**: By type (FAQ, Link, PDF)
- **Instant updates**: No full page reload (use React Query or SWR)

### Results layout:
- **FAQ** → Question + snippet
- **Web Link** → Title + description + "Visit"
- **PDF** → File name + "View" button (secure link or preview)a modern, scalable full-stack web app to centralize and index PDFs, web links, and FAQs, allowing instant full-text search across all data types with accurate, ranked results.

## 🏗️ System Overview

A two-interface system:

### Admin Dashboard (React + AntD)

- Manage (CRUD) PDFs, Web Links, and FAQs
- Upload PDFs, auto-extract text, and index data
- Paginated, filterable tables for large datasets

### Public Search UI (React + Vite)

- Single search bar across all data types
- Instant results powered by PostgreSQL full-text search
- Filters to narrow results by type (PDF, FAQ, Link)

## ⚙️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Backend | Node.js + TypeScript + Express | REST API, PDF/web content processing |
| Database | PostgreSQL (pg library only) | Data modeling + Full-text search |
| Admin UI | React + Ant Design | CRUD dashboards |
| Public UI | React + Vite | Search interface |
| File Parsing | pdf-parse, cheerio | Extract text from PDFs and web links |
## 🧱 Database Schema

### Tables

**faqs**
- id, title, content, tags, created_at

**web_links**
- id, url, title, description, content_text, created_at

**pdfs**
- id, file_name, file_path, content_text, uploaded_at

**search_index** (optional unified view using UNION for performance)

### Indexes

- Full-text index (tsvector) on content columns
- B-tree indexes for faster filtering and joins

## 🔌 API Endpoints (Express + TypeScript)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/faqs` | GET/POST/PUT/DELETE | CRUD for FAQs |
| `/api/links` | GET/POST/PUT/DELETE | CRUD for Web Links |
| `/api/pdfs` | GET/POST/DELETE | Upload + list PDFs |
| `/api/search?q=` | GET | Unified search endpoint across FAQs, Links, PDFs |
## 🖥️ Admin Dashboard Features (React + AntD)

- **Tabs**: FAQs | Web Links | PDFs
- **CRUD Forms**: Modal forms with validation
- **Tables**: Server-side pagination, filters, sorting
- **PDF Upload**: Shows progress bar and extraction status
- **Notifications**: For success/error messages

🔍 Public Search Interface (React + Vite)

Single search bar querying all indexed content

Filters: By type (FAQ, Link, PDF)

Instant updates: No full page reload (use React Query or SWR)

Results layout:

FAQ → Question + snippet

Web Link → Title + description + “Visit”

PDF → File name + “View” button (secure link or preview)

## ⚡ Performance & Evaluation Focus

- **Speed**: Sub-200ms search responses
- **Architecture**: Optimized indexing and query structure
- **Code Quality**: Type-safe models and endpoints
- **UX**: Clean, responsive, intuitive design
- **Scalability**: Pagination and async processing

## 📅 Execution Plan (4–8 October 2025)

| Date | Tasks | Deliverables |
|------|-------|--------------|
| **Oct 4 (Sat)** | Project setup (Vite + Express + PostgreSQL), initialize schema, setup pg connection | Repo initialized, DB ready |
| **Oct 5 (Sun)** | Build backend CRUD APIs (FAQs, Links, PDFs). Add PDF text extraction and web page scraping | REST APIs + data insertion |
| **Oct 6 (Mon)** | Implement Admin Dashboard (AntD): tables + forms + upload UI | Working CRUD UI |
| **Oct 7 (Tue)** | Create Public Search UI + integrate /api/search. Add filters, relevance sorting, and results UI | Search interface ready |
| **Oct 8 (Wed)** | Testing, optimization, deployment (Render/Vercel), README + short video demo | Final submission package |
## 📦 Deliverables

- Source code (frontend + backend)
- README with setup + environment details
- SQL dump (schema only)
- Demo link (if deployed)
- Short Loom/video walkthrough (optional but impactful)