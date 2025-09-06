#!/bin/bash

# Script to clear Bull queues in Redis
# Usage: ./clear-queues.sh [queue-name]

REDIS_HOST=${REDIS_HOST:-localhost}
REDIS_PORT=${REDIS_PORT:-6379}
REDIS_DB=${REDIS_DB:-0}

# Queue names
EMAIL_QUEUE="bull:email-queue"
USER_SYNC_QUEUE="bull:user-sync-queue"

echo "Clearing Bull queues from Redis..."
echo "Redis: $REDIS_HOST:$REDIS_PORT (DB: $REDIS_DB)"

if [ -n "$1" ]; then
    # Clear specific queue
    QUEUE_NAME="bull:$1"
    echo "Clearing queue: $QUEUE_NAME"
    docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB DEL "$QUEUE_NAME:waiting" "$QUEUE_NAME:active" "$QUEUE_NAME:completed" "$QUEUE_NAME:failed" "$QUEUE_NAME:delayed" "$QUEUE_NAME:paused"
    echo "Queue $1 cleared successfully"
else
    # Clear all queues
    echo "Clearing all queues..."
    
    # Clear email queue
    docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB DEL "$EMAIL_QUEUE:waiting" "$EMAIL_QUEUE:active" "$EMAIL_QUEUE:completed" "$EMAIL_QUEUE:failed" "$EMAIL_QUEUE:delayed" "$EMAIL_QUEUE:paused"
    echo "Email queue cleared"
    
    # Clear user sync queue
    docker exec docker-compose-redis-1 redis-cli -n $REDIS_DB DEL "$USER_SYNC_QUEUE:waiting" "$USER_SYNC_QUEUE:active" "$USER_SYNC_QUEUE:completed" "$USER_SYNC_QUEUE:failed" "$USER_SYNC_QUEUE:delayed" "$USER_SYNC_QUEUE:paused"
    echo "User sync queue cleared"
    
    echo "All queues cleared successfully"
fi

echo "Done!"
