import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 9000,
    env: process.env.NODE_ENV || 'development',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'document_search',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    // Production optimizations
    max: process.env.DB_POOL_MAX || 20,
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT || 30000,
    connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT || 2000,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    lazyConnect: true,
  },
  upload: {
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: process.env.UPLOAD_MAX_SIZE || 10 * 1024 * 1024, // 10MB
  },
  cors: {
    origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  },
};
