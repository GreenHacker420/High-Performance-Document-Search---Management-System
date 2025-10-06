# Document Search & Management System - Frontend

A modern React application with two interfaces: **Admin Dashboard** for CRUD operations and **Public Search** for searching across all content types.

## 🚀 Features

### Public Search Interface
- **Universal Search**: Search across FAQs, Web Links, and PDFs
- **Type Filters**: Filter results by content type
- **Instant Results**: Real-time search with pagination
- **Download PDFs**: Direct download functionality
- **Visit Links**: Open web links in new tabs

### Admin Dashboard
- **FAQ Management**: Full CRUD operations with tags
- **Web Link Management**: Auto-scraping of metadata
- **PDF Management**: Upload with drag-and-drop, text extraction
- **Responsive Tables**: Server-side pagination and sorting
- **Modal Forms**: Clean, validated forms for data entry

## 🛠️ Tech Stack

- **React 19** - Latest React with modern features
- **Ant Design 5** - Professional UI components
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Configuration

The frontend connects to the backend API at `http://localhost:3000/api`. 

To change the API URL, edit `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## 🎯 Usage

### Development
```bash
npm run dev
```
Access the application at `http://localhost:5173`

### Navigation
- **Public Search** (`/search`) - Default landing page
- **Admin Dashboard** (`/admin`) - Management interface

## 🧪 Testing the Application

1. **Start the backend** (from backend directory):
   ```bash
   npm run dev
   ```

2. **Start the frontend** (from frontend directory):
   ```bash
   npm run dev
   ```

3. **Test the features**:
   - Go to Admin Dashboard
   - Add some FAQs, links, and upload PDFs
   - Switch to Public Search
   - Search for your content
