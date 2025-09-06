#!/bin/bash

# Script to inspect Bull queues in Redis
# Usage: ./inspect-queues.sh [queue-name] [detail-level]
# detail-level: basic, detailed, full

REDIS_HOST=${REDIS_HOST:-localhost}
REDIS_PORT=${REDIS_PORT:-6379}
REDIS_DB=${REDIS_DB:-0}

# Queue names
EMAIL_QUEUE="bull:email-queue"
USER_SYNC_QUEUE="bull:user-sync-queue"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to get queue stats
get_queue_stats() {
    local queue_name=$1
    local display_name=$2
    
    echo -e "${CYAN}=== $display_name ===${NC}"
    
    # Get counts for each queue state
    local waiting=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB LLEN "$queue_name:waiting" 2>/dev/null | grep -E '^[0-9]+$' || echo "0")
    local active=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB LLEN "$queue_name:active" 2>/dev/null | grep -E '^[0-9]+$' || echo "0")
    local completed=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB LLEN "$queue_name:completed" 2>/dev/null | grep -E '^[0-9]+$' || echo "0")
    local failed=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB LLEN "$queue_name:failed" 2>/dev/null | grep -E '^[0-9]+$' || echo "0")
    local delayed=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB ZCARD "$queue_name:delayed" 2>/dev/null | grep -E '^[0-9]+$' || echo "0")
    local paused=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB LLEN "$queue_name:paused" 2>/dev/null | grep -E '^[0-9]+$' || echo "0")
    
    echo -e "  ${GREEN}Waiting:${NC} $waiting"
    echo -e "  ${YELLOW}Active:${NC} $active"
    echo -e "  ${BLUE}Completed:${NC} $completed"
    echo -e "  ${RED}Failed:${NC} $failed"
    echo -e "  ${PURPLE}Delayed:${NC} $delayed"
    echo -e "  ${CYAN}Paused:${NC} $paused"
    
    local total=$((waiting + active + completed + failed + delayed + paused))
    echo -e "  ${CYAN}Total:${NC} $total"
    echo
}

# Function to show detailed job information
show_detailed_jobs() {
    local queue_name=$1
    local state=$2
    local display_name=$3
    
    echo -e "${CYAN}=== $display_name ($state) ===${NC}"
    
    case $state in
        "waiting"|"active"|"completed"|"failed"|"paused")
            local jobs=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB LRANGE "$queue_name:$state" 0 -1 2>/dev/null)
            if [ -z "$jobs" ] || [ "$jobs" = "" ]; then
                echo "  No jobs in $state state"
            else
                echo "$jobs" | while read -r job_id; do
                    if [ -n "$job_id" ]; then
                        echo -e "  ${YELLOW}Job ID:${NC} $job_id"
                        # Get job data
                        local job_data=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB HGET "$queue_name:$job_id" "data" 2>/dev/null)
                        if [ -n "$job_data" ]; then
                            echo -e "  ${GREEN}Data:${NC} $job_data"
                        fi
                        # Get job options
                        local job_opts=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB HGET "$queue_name:$job_id" "opts" 2>/dev/null)
                        if [ -n "$job_opts" ]; then
                            echo -e "  ${BLUE}Options:${NC} $job_opts"
                        fi
                        echo
                    fi
                done
            fi
            ;;
        "delayed")
            local jobs=$(docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB ZRANGE "$queue_name:delayed" 0 -1 WITHSCORES 2>/dev/null)
            if [ -z "$jobs" ] || [ "$jobs" = "" ]; then
                echo "  No delayed jobs"
            else
                echo "$jobs" | while read -r line; do
                    if [ -n "$line" ]; then
                        local job_id=$(echo $line | cut -d' ' -f1)
                        local timestamp=$(echo $line | cut -d' ' -f2)
                        local delay_time=$(date -d "@$timestamp" 2>/dev/null || echo "Invalid timestamp")
                        echo -e "  ${YELLOW}Job ID:${NC} $job_id"
                        echo -e "  ${PURPLE}Delayed until:${NC} $delay_time"
                        echo
                    fi
                done
            fi
            ;;
    esac
}

# Function to show all jobs in a queue
show_all_jobs() {
    local queue_name=$1
    local display_name=$2
    
    echo -e "${CYAN}=== All Jobs in $display_name ===${NC}"
    
    for state in waiting active completed failed delayed paused; do
        show_detailed_jobs "$queue_name" "$state" "$display_name"
    done
}

# Main script logic
echo -e "${CYAN}Bull Queue Inspector${NC}"
echo "Redis: $REDIS_HOST:$REDIS_PORT (DB: $REDIS_DB)"
echo

# Check if Redis is accessible
if ! docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB ping > /dev/null 2>&1; then
    echo -e "${RED}Error: Cannot connect to Redis container${NC}"
    exit 1
fi

# Determine which queue(s) to inspect
if [ -n "$1" ]; then
    # Specific queue
    case $1 in
        "email"|"email-queue")
            QUEUE_NAME=$EMAIL_QUEUE
            DISPLAY_NAME="Email Queue"
            ;;
        "user-sync"|"user-sync-queue")
            QUEUE_NAME=$USER_SYNC_QUEUE
            DISPLAY_NAME="User Sync Queue"
            ;;
        *)
            echo -e "${RED}Error: Unknown queue '$1'. Available queues: email, user-sync${NC}"
            exit 1
            ;;
    esac
    
    # Determine detail level
    DETAIL_LEVEL=${2:-basic}
    
    case $DETAIL_LEVEL in
        "basic")
            get_queue_stats "$QUEUE_NAME" "$DISPLAY_NAME"
            ;;
        "detailed")
            get_queue_stats "$QUEUE_NAME" "$DISPLAY_NAME"
            for state in waiting active failed; do
                show_detailed_jobs "$QUEUE_NAME" "$state" "$DISPLAY_NAME"
            done
            ;;
        "full")
            show_all_jobs "$QUEUE_NAME" "$DISPLAY_NAME"
            ;;
        *)
            echo -e "${RED}Error: Unknown detail level '$DETAIL_LEVEL'. Available levels: basic, detailed, full${NC}"
            exit 1
            ;;
    esac
else
    # All queues
    DETAIL_LEVEL=${2:-basic}
    
    case $DETAIL_LEVEL in
        "basic")
            get_queue_stats "$EMAIL_QUEUE" "Email Queue"
            get_queue_stats "$USER_SYNC_QUEUE" "User Sync Queue"
            ;;
        "detailed")
            get_queue_stats "$EMAIL_QUEUE" "Email Queue"
            for state in waiting active failed; do
                show_detailed_jobs "$EMAIL_QUEUE" "$state" "Email Queue"
            done
            
            get_queue_stats "$USER_SYNC_QUEUE" "User Sync Queue"
            for state in waiting active failed; do
                show_detailed_jobs "$USER_SYNC_QUEUE" "$state" "User Sync Queue"
            done
            ;;
        "full")
            show_all_jobs "$EMAIL_QUEUE" "Email Queue"
            show_all_jobs "$USER_SYNC_QUEUE" "User Sync Queue"
            ;;
        *)
            echo -e "${RED}Error: Unknown detail level '$DETAIL_LEVEL'. Available levels: basic, detailed, full${NC}"
            exit 1
            ;;
    esac
fi

echo -e "${GREEN}Inspection complete!${NC}"
echo
echo -e "${CYAN}Usage examples:${NC}"
echo "  ./infra/scripts/queues/inspect-queues.sh                    # Show basic stats for all queues"
echo "  ./infra/scripts/queues/inspect-queues.sh email              # Show basic stats for email queue"
echo "  ./infra/scripts/queues/inspect-queues.sh email detailed     # Show detailed info for email queue"
echo "  ./infra/scripts/queues/inspect-queues.sh user-sync full     # Show all jobs in user-sync queue"
echo
echo -e "${CYAN}Or from the queues directory:${NC}"
echo "  cd infra/scripts/queues"
echo "  ./inspect-queues.sh                    # Show basic stats for all queues"
echo "  ./inspect-queues.sh email              # Show basic stats for email queue"
echo "  ./inspect-queues.sh email detailed     # Show detailed info for email queue"
echo "  ./inspect-queues.sh user-sync full     # Show all jobs in user-sync queue"
