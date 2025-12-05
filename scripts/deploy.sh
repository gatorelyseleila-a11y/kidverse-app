#!/bin/bash

# ===========================================
# KIDVERSE DEPLOYMENT SCRIPT
# ===========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"

echo -e "${GREEN}🚀 KIDVERSE Deployment Script${NC}"
echo "=================================="

# Check if .env.production exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Error: $ENV_FILE not found${NC}"
    echo "Please copy .env.production.example to .env.production and configure it"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' $ENV_FILE | xargs)

# Function to check service health
check_health() {
    local service=$1
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}⏳ Waiting for $service to be healthy...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose -f $COMPOSE_FILE ps $service | grep -q "healthy"; then
            echo -e "${GREEN}✅ $service is healthy${NC}"
            return 0
        fi
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $service failed health check${NC}"
    return 1
}

# Parse command line arguments
case "$1" in
    up)
        echo -e "${YELLOW}📦 Pulling latest images...${NC}"
        docker-compose -f $COMPOSE_FILE pull
        
        echo -e "${YELLOW}🔨 Building services...${NC}"
        docker-compose -f $COMPOSE_FILE build --parallel
        
        echo -e "${YELLOW}🚀 Starting services...${NC}"
        docker-compose -f $COMPOSE_FILE up -d
        
        # Wait for services to be healthy
        check_health postgres
        check_health redis
        check_health api
        check_health web
        
        echo -e "${GREEN}✅ Deployment complete!${NC}"
        echo ""
        echo "Services running:"
        docker-compose -f $COMPOSE_FILE ps
        ;;
        
    down)
        echo -e "${YELLOW}🛑 Stopping services...${NC}"
        docker-compose -f $COMPOSE_FILE down
        echo -e "${GREEN}✅ Services stopped${NC}"
        ;;
        
    restart)
        echo -e "${YELLOW}🔄 Restarting services...${NC}"
        docker-compose -f $COMPOSE_FILE restart
        echo -e "${GREEN}✅ Services restarted${NC}"
        ;;
        
    logs)
        service=${2:-}
        if [ -z "$service" ]; then
            docker-compose -f $COMPOSE_FILE logs -f --tail=100
        else
            docker-compose -f $COMPOSE_FILE logs -f --tail=100 $service
        fi
        ;;
        
    status)
        echo -e "${YELLOW}📊 Service Status${NC}"
        docker-compose -f $COMPOSE_FILE ps
        echo ""
        echo -e "${YELLOW}📈 Resource Usage${NC}"
        docker stats --no-stream $(docker-compose -f $COMPOSE_FILE ps -q)
        ;;
        
    migrate)
        echo -e "${YELLOW}🗃️ Running database migrations...${NC}"
        docker-compose -f $COMPOSE_FILE exec api npx prisma migrate deploy
        echo -e "${GREEN}✅ Migrations complete${NC}"
        ;;
        
    backup)
        echo -e "${YELLOW}💾 Creating database backup...${NC}"
        BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
        docker-compose -f $COMPOSE_FILE exec postgres pg_dump -U $DB_USER $DB_NAME > ./backups/$BACKUP_FILE
        echo -e "${GREEN}✅ Backup created: ./backups/$BACKUP_FILE${NC}"
        ;;
        
    restore)
        backup_file=${2:-}
        if [ -z "$backup_file" ]; then
            echo -e "${RED}❌ Please specify a backup file${NC}"
            echo "Usage: ./deploy.sh restore <backup_file>"
            exit 1
        fi
        
        echo -e "${YELLOW}♻️ Restoring database from $backup_file...${NC}"
        docker-compose -f $COMPOSE_FILE exec -T postgres psql -U $DB_USER $DB_NAME < $backup_file
        echo -e "${GREEN}✅ Database restored${NC}"
        ;;
        
    shell)
        service=${2:-api}
        echo -e "${YELLOW}🐚 Opening shell in $service...${NC}"
        docker-compose -f $COMPOSE_FILE exec $service sh
        ;;
        
    clean)
        echo -e "${YELLOW}🧹 Cleaning up unused Docker resources...${NC}"
        docker system prune -f
        docker volume prune -f
        echo -e "${GREEN}✅ Cleanup complete${NC}"
        ;;
        
    ssl)
        echo -e "${YELLOW}🔒 Checking SSL certificates...${NC}"
        docker-compose -f $COMPOSE_FILE exec traefik cat /letsencrypt/acme.json | jq '.Certificates'
        ;;
        
    *)
        echo "Usage: ./deploy.sh {up|down|restart|logs|status|migrate|backup|restore|shell|clean|ssl}"
        echo ""
        echo "Commands:"
        echo "  up        - Start all services"
        echo "  down      - Stop all services"
        echo "  restart   - Restart all services"
        echo "  logs      - View logs (optionally specify service)"
        echo "  status    - Show service status and resource usage"
        echo "  migrate   - Run database migrations"
        echo "  backup    - Create database backup"
        echo "  restore   - Restore database from backup"
        echo "  shell     - Open shell in service (default: api)"
        echo "  clean     - Clean up unused Docker resources"
        echo "  ssl       - Check SSL certificate status"
        exit 1
        ;;
esac

