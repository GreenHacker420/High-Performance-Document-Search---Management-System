#!/usr/bin/env node

// Simple health check script for production monitoring
// Usage: node healthcheck.js [--backend-url=http://localhost:9000] [--frontend-url=http://localhost:3000]

import http from 'http';
import https from 'https';
import { URL } from 'url';

const args = process.argv.slice(2);
const backendUrl = args.find(arg => arg.startsWith('--backend-url='))?.split('=')[1] || 'http://localhost:9000';
const frontendUrl = args.find(arg => arg.startsWith('--frontend-url='))?.split('=')[1] || 'http://localhost:3000';

const checkEndpoint = (url, name) => {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = client.get(url, { timeout: 5000 }, (res) => {
      const isHealthy = res.statusCode >= 200 && res.statusCode < 300;
      resolve({
        name,
        url,
        status: res.statusCode,
        healthy: isHealthy,
        message: isHealthy ? 'OK' : `HTTP ${res.statusCode}`
      });
    });
    
    req.on('error', (err) => {
      resolve({
        name,
        url,
        status: 0,
        healthy: false,
        message: err.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        name,
        url,
        status: 0,
        healthy: false,
        message: 'Timeout'
      });
    });
  });
};

const runHealthCheck = async () => {
  console.log('🏥 Health Check Starting...');
  console.log('================================');
  
  const checks = await Promise.all([
    checkEndpoint(`${backendUrl}/health`, 'Backend API'),
    checkEndpoint(`${frontendUrl}/health`, 'Frontend'),
    checkEndpoint(`${backendUrl}/api/search?q=test`, 'Search API')
  ]);
  
  let allHealthy = true;
  
  checks.forEach(check => {
    const icon = check.healthy ? '✅' : '❌';
    console.log(`${icon} ${check.name}: ${check.message} (${check.url})`);
    if (!check.healthy) allHealthy = false;
  });
  
  console.log('================================');
  
  if (allHealthy) {
    console.log('🎉 All services are healthy!');
    process.exit(0);
  } else {
    console.log('⚠️  Some services are unhealthy!');
    process.exit(1);
  }
};

runHealthCheck().catch(err => {
  console.error('❌ Health check failed:', err.message);
  process.exit(1);
});
