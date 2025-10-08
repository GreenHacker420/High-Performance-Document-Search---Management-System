# Use Node.js LTS Alpine for smaller image size
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for PDF processing
RUN apk add --no-cache \
    curl \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Install dependencies with production optimizations
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:9000/health || exit 1

# Start the application
CMD ["npm", "start"]
