#!/usr/bin/env bash
cd ~/projects/hic

# Set environment (default to qa if not specified)
ENV_TYPE=${1:-qa}
export APP_ENV=$ENV_TYPE

echo "Starting backend locally with $ENV_TYPE environment..."

# Load environment variables
source scripts/dev/env-switch.sh $ENV_TYPE

# Start backend with correct port
echo "Starting backend on port $BACKEND_PORT..."
cd services/backend
pnpm run dev
