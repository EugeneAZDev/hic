#!/bin/bash

# Quick queue statistics script
# Usage: ./queue-stats.sh

REDIS_HOST=${REDIS_HOST:-localhost}
REDIS_PORT=${REDIS_PORT:-6379}
REDIS_DB=${REDIS_DB:-0}

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}Bull Queue Statistics${NC}"
echo "Redis: $REDIS_HOST:$REDIS_PORT (DB: $REDIS_DB)"
echo

# Function to get and display queue stats
show_queue_stats() {
    local queue_name=$1
    local display_name=$2
    
    local waiting=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB LLEN "$queue_name:waiting" 2>/dev/null | grep -E '^[0-9]+$' || echo "0")
    local active=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB LLEN "$queue_name:active" 2>/dev/null | grep -E '^[0-9]+$' || echo "0")
    local completed=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB LLEN "$queue_name:completed" 2>/dev/null | grep -E '^[0-9]+$' || echo "0")
    local failed=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB LLEN "$queue_name:failed" 2>/dev/null | grep -E '^[0-9]+$' || echo "0")
    local delayed=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB ZCARD "$queue_name:delayed" 2>/dev/null | grep -E '^[0-9]+$' || echo "0")
    
    local total=$((waiting + active + completed + failed + delayed))
    
    printf "%-20s | %-8s | %-8s | %-8s | %-8s | %-8s | %-8s\n" \
           "$display_name" "$waiting" "$active" "$completed" "$failed" "$delayed" "$total"
}

# Check Redis connection
if ! docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB ping > /dev/null 2>&1; then
    echo -e "${RED}Error: Cannot connect to Redis container${NC}"
    exit 1
fi

# Print header
printf "%-20s | %-8s | %-8s | %-8s | %-8s | %-8s | %-8s\n" \
       "Queue" "Waiting" "Active" "Completed" "Failed" "Delayed" "Total"
echo "---------------------|----------|----------|----------|----------|----------|----------"

# Show stats for each queue
show_queue_stats "bull:email-queue" "Email Queue"
show_queue_stats "bull:user-sync-queue" "User Sync Queue"

echo
echo -e "${CYAN}Legend:${NC}"
echo -e "  ${GREEN}Waiting:${NC} Jobs waiting to be processed"
echo -e "  ${YELLOW}Active:${NC} Jobs currently being processed"
echo -e "  ${BLUE}Completed:${NC} Successfully completed jobs"
echo -e "  ${RED}Failed:${NC} Jobs that failed processing"
echo -e "  ${CYAN}Delayed:${NC} Jobs scheduled for future execution"
