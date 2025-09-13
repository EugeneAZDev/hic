#!/usr/bin/env bash
# Shows which services will be included in the configuration
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$PROJECT_ROOT"

# Load configuration
source "$PROJECT_ROOT/infra/config/networking.conf"

echo APP_MODE: $APP_MODE
echo "$PROJECT_ROOT"

ENV_FILE="$PROJECT_ROOT/.env-files/.env.${APP_MODE}"
[[ -f "$ENV_FILE" ]] || { echo "$ENV_FILE not found!"; exit 1; }

echo "Using services:"

docker-compose \
  -f "$PROJECT_ROOT/infra/docker-compose/base.yaml" \
  --env-file "$ENV_FILE" \
  --profile dev \
  config --services | sort