import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { config } from './config/env.js';
import pool from './config/db.js';
import { connectCache, disconnectCache } from './services/cache.service.js';
import faqRoutes from './routes/faq.routes.js';
import weblinkRoutes from './routes/weblink.routes.js';
import pdfRoutes from './routes/pdf.routes.js';
import searchRoutes from './routes/search.routes.js';
import { healthCheck, apiInfo, errorHandler, notFound  } from './routes/common.js';

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api/faqs', faqRoutes);
app.use('/api/links', weblinkRoutes);
app.use('/api/pdfs', pdfRoutes);
app.use('/api/search', searchRoutes);


app.get('/health', healthCheck);


app.get('/', apiInfo);


app.use(errorHandler);


app.use(notFound);


const PORT = config.server.port;

app.listen(PORT, async () => {
  try {
    // test db connection
    await pool.query('SELECT NOW()');
    console.log(`Database connected successfully`);
    
    await connectCache();
    
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
});


// shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await disconnectCache();
  await pool.end();
  process.exit(0);
});