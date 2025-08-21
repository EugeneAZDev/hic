#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"
cd $PROJECT_PATH
set -e

rm -rf apps/frontend/.next
rm -rf services/backend/dist

pnpm turbo run build

# Current: via docker-compose.yaml
docker-compose --env-file .env.qa down -v
# docker-compose --env-file .env.qa stop
docker-compose --env-file .env.qa up --build -d
echo "QA environment is up: frontend:3000, backend:3001"
docker ps




# Outdated: part when we don't use docker-compose.yaml

# docker build \
#   -f apps/frontend/Dockerfile \
#   -t ${PROJECT_NAME}-frontend:qa \
#   .

# docker build \
#   -f services/backend/Dockerfile \
#   -t ${PROJECT_NAME}-backend:qa \
#   .

# echo "Builds are ready: ${PROJECT_NAME}-frontend:qa, ${PROJECT_NAME}-backend:qa"

# docker images | grep $PROJECT_NAME

# docker rm -f "${PROJECT_NAME}-frontend-qa"
# docker rm -f "${PROJECT_NAME}-backend-qa"

# # Run containers
# docker run -d \
#   --name "${PROJECT_NAME}-backend-qa" \
#   -p 3001:3001 \
#   ${PROJECT_NAME}-backend:qa

# docker run -d \
#   --name "${PROJECT_NAME}-frontend-qa" \
#   -p 3000:3000 \
#   ${PROJECT_NAME}-frontend:qa