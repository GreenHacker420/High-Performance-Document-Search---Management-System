#!/bin/bash

# deployment script for Coolify AWS instance
set -e

echo "Starting deployment of Document Search System..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️ .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your production values before continuing."
    exit 1
fi

# Load environment variables
source .env

echo "🔧 Building and starting services..."

# Stop existing containers
docker-compose down --remove-orphans

# Build and start services
docker-compose up -d --build

echo "⏳ Waiting for services to be ready..."

# Wait for PostgreSQL to be ready
echo "🔍 Checking PostgreSQL connection..."
until docker-compose exec -T postgres pg_isready -U ${POSTGRES_USER:-postgres} > /dev/null 2>&1; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

# Wait for Redis to be ready
echo "🔍 Checking Redis connection..."
until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
    echo "Waiting for Redis..."
    sleep 2
done

# Wait for backend to be ready
echo "🔍 Checking Backend API..."
until curl -f http://localhost:${BACKEND_PORT:-9000}/health > /dev/null 2>&1; do
    echo "Waiting for Backend API..."
    sleep 5
done

# Wait for frontend to be ready
echo "🔍 Checking Frontend..."
until curl -f http://localhost:${FRONTEND_PORT:-3000}/health > /dev/null 2>&1; do
    echo "Waiting for Frontend..."
    sleep 5
done

echo "✅ All services are ready!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:${FRONTEND_PORT:-3000}"
echo "   Backend API: http://localhost:${BACKEND_PORT:-9000}"
echo "   Health Check: http://localhost:${BACKEND_PORT:-9000}/health"
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🎉 Deployment completed successfully!"
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
