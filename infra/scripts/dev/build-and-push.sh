#!/bin/bash

# Build and push Docker images to registry, optionally start services
# Usage: ./build-and-push.sh [registry_url] [version] [push] [start] [no_cache]
# ./infra/scripts/dev/build-and-push.sh
# ./infra/scripts/dev/build-and-push.sh myregistry.com:5007 v1.0.0 false true

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root directory (3 levels up from script location)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Default values
REGISTRY_URL=${1:-localhost:5007}
VERSION=${2:-dev}
PUSH=${3:-false}
START_SERVICES=${4:-true}

echo "Building and pushing images to registry: $REGISTRY_URL"
echo "Version: $VERSION"
echo "Push to registry: $PUSH"
echo "Start services after build: $START_SERVICES"

# Services to build
SERVICES=("backend" "auth-service" "worker-service" "bff")

# Go to the project root directory
cd "$PROJECT_ROOT"

# Load environment variables for frontend build
APP_MODE=dev
ENV_FILE="$PROJECT_ROOT/.env-files/.env.${APP_MODE}"
if [[ -f "$ENV_FILE" ]]; then
    echo "Loading environment variables from $ENV_FILE"
    
    # Save original NODE_ENV
    ORIGINAL_NODE_ENV="$NODE_ENV"
    
    # Load all variables from env file
    set -a
    source "$ENV_FILE"
    set +a
    
    # Restore original NODE_ENV to avoid conflicts
    export NODE_ENV="$ORIGINAL_NODE_ENV"
else
    echo "Environment file $ENV_FILE not found!"
    exit 1
fi

echo "Building frontend with environment variables..."
echo "NEXT_PUBLIC_BFF_URL: $NEXT_PUBLIC_BFF_URL"
echo "NEXT_PUBLIC_AUTH_SERVICE_URL: $NEXT_PUBLIC_AUTH_SERVICE_URL"

pnpm install && pnpm build

# Build each service
for service in "${SERVICES[@]}"; do
    echo "Building $service..."
    
    # Remove conflicting containers
    echo "Removing conflicting containers..."
    docker rm -f hic-db-basic hic-auth-db-basic hic-redis-basic hic-mailhog-basic 2>/dev/null || true
    docker rm -f hic-db-dev hic-auth-db-dev hic-redis-dev hic-mailhog-dev 2>/dev/null || true
    docker rm -f hic-backend-dev hic-auth-service-dev hic-worker-service-dev hic-bff-dev hic-nginx-dev 2>/dev/null || true

    # Build the image
    docker build \
        -t "$REGISTRY_URL/$service:$VERSION" \
        -f "$PROJECT_ROOT/apps/$service/Dockerfile" \
        --build-arg NODE_ENV=development \
        "$PROJECT_ROOT"
    
    echo "Built $service:$VERSION"
    
    # Push to registry if requested
    # TODO: Uncomment when ready to test push functionality
    # if [ "$PUSH" = "true" ]; then
    #     echo "Pushing $service to registry..."
    #     docker push "$REGISTRY_URL/$service:$VERSION"
    #     echo "Pushed $service:$VERSION to $REGISTRY_URL"
    # fi
done

echo "Build completed successfully!"

# Show built images
echo "Built images:"
docker images | grep "$REGISTRY_URL"

# TODO: Uncomment when ready to test push functionality
# if [ "$PUSH" = "true" ]; then
#     echo "Images pushed to registry: $REGISTRY_URL"
# else
#     echo "To push images to registry, run: $0 $REGISTRY_URL $VERSION true"
# fi

echo "Images built locally. Push functionality is currently commented out."

# Start services if requested
if [ "$START_SERVICES" = "true" ]; then
    echo ""
    echo "Starting services with built images..."
    
    # Change to project root directory
    cd "$PROJECT_ROOT"
    
    # Source networking configuration
    source "$PROJECT_ROOT/infra/config/networking.conf"

    APP_MODE=dev
    echo "APP_MODE: $APP_MODE"
    
    # Set environment variables for docker-compose
    export REGISTRY_URL="$REGISTRY_URL"
    export VERSION="$VERSION"

    # Start services using docker-compose
    echo "Starting development environment with built images..."
    docker-compose \
        -f "$PROJECT_ROOT/infra/docker-compose/base.yaml" \
        -f "$PROJECT_ROOT/infra/docker-compose/dev.yaml" \
        -f "$PROJECT_ROOT/infra/docker-compose/nginx.yaml" \
        --env-file "$ENV_FILE" \
        --profile dev \
        up --build -d --remove-orphans
    
    echo ""
    echo "Services started successfully!"
    echo "Auth:       http://localhost:3012/api/auth"
    echo "BFF:        http://localhost:3010/bff"
    echo "Backend:    http://localhost:3011"
    echo "Worker:     http://localhost:5000"
    echo "Database:   localhost:5435"
    echo "Auth DB:    localhost:5437"
    echo "Redis:      localhost:6379"
    echo "MailHog:    http://localhost:8025"
    
    echo ""
    echo "To stop services, run: $PROJECT_ROOT/infra/scripts/dev/dc-stop.sh"
    echo "To view logs, run: docker-compose -f $PROJECT_ROOT/infra/docker-compose/base.yaml --env-file $ENV_FILE logs -f"
else
    echo ""
    echo "To start services with built images, run: $0 $REGISTRY_URL $VERSION $PUSH true"
fi
