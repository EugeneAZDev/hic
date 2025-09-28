#!/usr/bin/env bash
# If something is wrong, run `pnpm build` before running this script
set -e

echo "Starting development environment..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$PROJECT_ROOT"
source "$PROJECT_ROOT/infra/config/networking.conf"

ENV_FILE="$PROJECT_ROOT/.env-files/.env.${APP_MODE}"
[[ -f "$ENV_FILE" ]] || { echo "❌ $ENV_FILE not found!"; exit 1; }

# Create external volumes if they don't exist
echo "Creating external volumes if they don't exist..."
docker volume create hic-db-data 2>/dev/null || echo "Volume hic-db-data already exists"
docker volume create hic-auth-db-data 2>/dev/null || echo "Volume hic-auth-db-data already exists"

# Remove conflicting containers
# echo "Removing conflicting containers..."
# docker rm -f hic-db-basic hic-auth-db-basic hic-redis-basic hic-mailhog-basic 2>/dev/null || true

APP_MODE=local
echo "APP_MODE: $APP_MODE"

# Load all variables from env file
set -a
source "$ENV_FILE"
set +a

docker-compose \
  -f "$PROJECT_ROOT/infra/docker-compose/base.yaml" \
  --env-file "$ENV_FILE" \
  --profile local \
  up --build -d

pnpm dev

echo "Dev environment is running!"
echo "Auth:       http://localhost:3012/api/auth"
echo "BFF:        http://localhost:3010/bff"
echo "Backend:    http://localhost:3011"
echo "Worker:     http://localhost:5000"
