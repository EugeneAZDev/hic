#!/usr/bin/env bash
set -e

echo "Starting development environment..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$PROJECT_ROOT"
source "$PROJECT_ROOT/infra/config/networking.conf"

APP_MODE=dev
echo "APP_MODE: $APP_MODE"

ENV_FILE="$PROJECT_ROOT/.env-files/.env.${APP_MODE}"
[[ -f "$ENV_FILE" ]] || { echo "$ENV_FILE not found!"; exit 1; }

# Load environment variables for frontend build
echo "Loading environment variables from $ENV_FILE"

# Save original NODE_ENV
ORIGINAL_NODE_ENV="$NODE_ENV"

# Load all variables from env file
set -a
source "$ENV_FILE"
set +a

# Restore original NODE_ENV to avoid conflicts
export NODE_ENV="$ORIGINAL_NODE_ENV"

echo "Building frontend with environment variables..."
echo "NEXT_PUBLIC_BFF_URL: $NEXT_PUBLIC_BFF_URL"
echo "NEXT_PUBLIC_AUTH_SERVICE_URL: $NEXT_PUBLIC_AUTH_SERVICE_URL"
cd "$PROJECT_ROOT"
pnpm install
pnpm build --filter ./apps/frontend
echo "Frontend build completed"

# Create external volumes if they don't exist
echo "Creating external volumes if they don't exist..."
docker volume create hic-db-data 2>/dev/null || echo "Volume hic-db-data already exists"
docker volume create hic-auth-db-data 2>/dev/null || echo "Volume hic-auth-db-data already exists"

docker-compose \
  -f "$PROJECT_ROOT/infra/docker-compose/base.yaml" \
  -f "$PROJECT_ROOT/infra/docker-compose/dev.yaml" \
  -f "$PROJECT_ROOT/infra/docker-compose/nginx.yaml" \
  --env-file "$ENV_FILE" \
  --profile dev \
  up -d
