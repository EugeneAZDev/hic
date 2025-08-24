#!/usr/bin/env bash

# Before run this script make sure:
# 1. Turn on DNS proxy
# 2. SSL_ENABLED=true in .env.prod file

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../config/server.conf"

SCRIPT_NAME=$(basename "$0")
echo "Script '$SCRIPT_NAME' is running"

# Ensure we're in the project directory
cd "$PROJECT_PATH"

# Copy files - only copy files that exist
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH"/.env* "$SERVER_PROJECT_PATH/" 2>/dev/null || echo "No .env* files found, skipping..."
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH"/docker-compose* "$SERVER_PROJECT_PATH"

STOP_ALL_CONTAINERS=$(cat <<EOF
cd /opt/hic/
docker compose -f docker-compose.yaml -f docker-compose.extra.yaml --env-file .env.prod stop
EOF
)
BUILD_RUN_NGINX_CONTAINER=$(cat <<EOF
cd /opt/hic/
docker compose -f docker-compose.yaml -f docker-compose.extra.yaml --env-file .env.prod build --no-cache nginx
docker compose -f docker-compose.yaml -f docker-compose.extra.yaml --env-file .env.prod up -d nginx
EOF
)

ssh root@"$IP" "$STOP_ALL_CONTAINERS" 2>&1
ssh root@"$IP" "$BUILD_RUN_NGINX_CONTAINER" 2>&1