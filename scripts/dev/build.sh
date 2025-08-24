#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../config/server.conf"
cd $PROJECT_PATH
set -e # Exit on error

# Configurable time threshold for rebuild (in hours)
REBUILD_THRESHOLD_HOURS=1

# Check if rebuild is needed based on last build time
should_rebuild() {
    local frontend_build_time=0
    local backend_build_time=0
    
    # Check frontend build time
    if [ -d "apps/frontend/.next" ]; then
        frontend_build_time=$(stat -c %Y "apps/frontend/.next" 2>/dev/null || echo 0)
    fi
    
    # Check backend build time
    if [ -d "services/backend/dist" ]; then
        backend_build_time=$(stat -c %Y "services/backend/dist" 2>/dev/null || echo 0)
    fi
    
    local current_time=$(date +%s)
    local threshold_seconds=$((REBUILD_THRESHOLD_HOURS * 3600))
    
    # If either build directory doesn't exist or is older than threshold, rebuild
    if [ $frontend_build_time -eq 0 ] || [ $backend_build_time -eq 0 ] || \
       [ $((current_time - frontend_build_time)) -gt $threshold_seconds ] || \
       [ $((current_time - backend_build_time)) -gt $threshold_seconds ]; then
        return 0  # true - should rebuild
    else
        return 1  # false - no rebuild needed
    fi
}

# Load environment variables for build
echo "Loading environment: ${APP_ENV}"

# Load common environment
if [ -f ".env.${APP_ENV}" ]; then
    export $(grep -v '^#' .env.${APP_ENV} | xargs)
    echo "✓ Loaded .env.${APP_ENV}"
else
    echo ".env.${APP_ENV} not found"
fi

# Override NODE_ENV for build process
export NODE_ENV=production
echo "✓ Set NODE_ENV=production for build"

# Load backend specific environment
if [ -f ".env.${APP_ENV}.backend" ]; then
    export $(grep -v '^#' .env.${APP_ENV}.backend | xargs)
    echo "✓ Loaded .env.${APP_ENV}.backend"
fi

# Load frontend specific environment
if [ -f ".env.${APP_ENV}.frontend" ]; then
    export $(grep -v '^#' .env.${APP_ENV}.frontend | xargs)
    echo "✓ Loaded .env.${APP_ENV}.frontend"
fi

# Check if rebuild is needed
if should_rebuild; then
    echo "Build is older than ${REBUILD_THRESHOLD_HOURS} hour(s) or missing. Performing full rebuild..."
    
    # Clean build directories
    if [ -d "apps/frontend/.next" ]; then
        echo "Removing frontend build cache..."
        rm -rf apps/frontend/.next
    fi
    if [ -d "services/backend/dist" ]; then
        echo "Removing backend build cache..."
        rm -rf services/backend/dist
    fi
    
    # Run full build with environment variables
    echo "Running turbo build for ${APP_ENV} environment..."
    pnpm turbo run build
else
    echo "Build is recent (less than ${REBUILD_THRESHOLD_HOURS} hour(s) old). Skipping rebuild."
    echo "To force rebuild, manually remove .next and dist directories or modify REBUILD_THRESHOLD_HOURS variable."
fi

# Build Docker images
# echo "Building Docker images..."
# docker compose --env-file .env.qa -f docker-compose.yaml build --no-cache
