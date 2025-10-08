import { createClient } from 'redis';


let redisClient = null;
let isConnected = false;

export const connectCache = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redisClient.on('error', (err) => {
      console.error('Redis Error:', err);
      isConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('Connected to Redis');
      isConnected = true;
    });

    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    isConnected = false;
  }
};

export const disconnectCache = async () => {
  if (redisClient) {
    await redisClient.disconnect();
    isConnected = false;
  }
};

const generateCacheKey = (query, type = '', limit = 20) => {
  return `search:${query}:${type}:${limit}`;
};

export const getCachedSearch = async (query, type, limit) => {
  if (!isConnected || !redisClient) return null;
  
  try {
    const key = generateCacheKey(query, type, limit);
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

export const setCachedSearch = async (query, type, limit, results) => {
  if (!isConnected || !redisClient) return false;
  
  try {
    const key = generateCacheKey(query, type, limit);
    await redisClient.setEx(key, 300, JSON.stringify(results)); // 5 minutes
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};


export const getCachedSuggestions = async (partialQuery) => {
  if (!isConnected || !redisClient) return null;
  
  try {
    const key = `suggestions:${partialQuery}`;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};


export const setCachedSuggestions = async (partialQuery, suggestions) => {
  if (!isConnected || !redisClient) return false;
  
  try {
    const key = `suggestions:${partialQuery}`;
    await redisClient.setEx(key, 600, JSON.stringify(suggestions)); // 10 minutes
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};
