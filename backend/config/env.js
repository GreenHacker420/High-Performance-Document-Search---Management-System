import dotenv from 'dotenv';

dotenv.config();

export const config = {
  db: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'document_search',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },
};
