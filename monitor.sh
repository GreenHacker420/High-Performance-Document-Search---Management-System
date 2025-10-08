#!/bin/bash

# Monitoring script for Document Search System
set -e

echo "📊 Document Search System - Health Monitor"
echo "=========================================="

# Load environment variables if .env exists
if [ -f .env ]; then
    source .env
fi

BACKEND_PORT=${BACKEND_PORT:-9000}
FRONTEND_PORT=${FRONTEND_PORT:-3000}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "🔍 Checking $service_name... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "$expected_status"; then
        echo -e "${GREEN}✅ Healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ Unhealthy${NC}"
        return 1
    fi
}

# Function to check Docker service
check_docker_service() {
    local service_name=$1
    echo -n "🐳 Checking Docker service $service_name... "
    
    if docker-compose ps "$service_name" | grep -q "Up"; then
        echo -e "${GREEN}✅ Running${NC}"
        return 0
    else
        echo -e "${RED}❌ Not Running${NC}"
        return 1
    fi
}

# Check Docker services
echo "🐳 Docker Services Status:"
check_docker_service "postgres"
check_docker_service "redis" 
check_docker_service "backend"
check_docker_service "frontend"

echo ""

# Check HTTP endpoints
echo "🌐 HTTP Health Checks:"
check_service "Frontend" "http://localhost:$FRONTEND_PORT/health"
check_service "Backend API" "http://localhost:$BACKEND_PORT/health"
check_service "Backend Search" "http://localhost:$BACKEND_PORT/api/search?q=test"

echo ""

# Check database connectivity
echo "💾 Database Connectivity:"
echo -n "🔍 Checking PostgreSQL... "
if docker-compose exec -T postgres pg_isready -U ${POSTGRES_USER:-postgres} > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connected${NC}"
else
    echo -e "${RED}❌ Connection Failed${NC}"
fi

echo -n "🔍 Checking Redis... "
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Connected${NC}"
else
    echo -e "${RED}❌ Connection Failed${NC}"
fi

echo ""

# Resource usage
echo "📈 Resource Usage:"
echo "🐳 Docker Container Stats:"
docker-compose exec backend sh -c 'echo "Backend Memory: $(cat /proc/meminfo | grep MemAvailable)"' 2>/dev/null || echo "Backend: Unable to get stats"

# Disk usage for volumes
echo ""
echo "💽 Volume Usage:"
docker system df

echo ""

# Recent logs (last 10 lines)
echo "📝 Recent Logs (last 10 lines):"
echo "--- Backend ---"
docker-compose logs --tail=5 backend 2>/dev/null || echo "No backend logs available"

echo ""
echo "--- Frontend ---"  
docker-compose logs --tail=5 frontend 2>/dev/null || echo "No frontend logs available"

echo ""
echo "=========================================="
echo "🎯 Quick Commands:"
echo "   View all logs: docker-compose logs -f"
echo "   Restart services: docker-compose restart"
echo "   Check status: docker-compose ps"
echo "   Stop all: docker-compose down"
echo "=========================================="
