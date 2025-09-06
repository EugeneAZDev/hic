#!/usr/bin/env bash
set -e

echo "Starting development environment..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

APP_MODE=dev
echo "APP_MODE: $APP_MODE"

ENV_FILE="$PROJECT_ROOT/.env-files/.env.${APP_MODE}"
[[ -f "$ENV_FILE" ]] || { echo "❌ $ENV_FILE not found!"; exit 1; }

docker-compose \
  -f "$PROJECT_ROOT/infra/docker-compose/base.yaml" \
  -f "$PROJECT_ROOT/infra/docker-compose/dev.yaml" \
  -f "$PROJECT_ROOT/infra/docker-compose/nginx.yaml" \
  --env-file "$ENV_FILE" \
  --profile dev \
  down

echo "Dev environment stopped"
