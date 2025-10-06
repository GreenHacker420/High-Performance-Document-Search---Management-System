import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { config } from './config/env.js';
import pool from './config/db.js';

// Import routes
import faqRoutes from './routes/faq.routes.js';
import weblinkRoutes from './routes/weblink.routes.js';
import pdfRoutes from './routes/pdf.routes.js';
import searchRoutes from './routes/search.routes.js';
import { healthCheck, apiInfo, errorHandler, notFound  } from './routes/common.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/faqs', faqRoutes);
app.use('/api/links', weblinkRoutes);
app.use('/api/pdfs', pdfRoutes);
app.use('/api/search', searchRoutes);

// Health check endpoint
app.get('/health', healthCheck);

// Root endpoint
app.get('/', apiInfo);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use(notFound);

// Start server
const PORT = config.server.port;

app.listen(PORT, async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log(`Server running on port ${PORT}`);
    console.log(`Database connected successfully`);
    console.log(`API available at http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
});


// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await pool.end();
  process.exit(0);
});