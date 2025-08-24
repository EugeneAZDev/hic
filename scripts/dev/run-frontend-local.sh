#!/usr/bin/env bash
cd ~/projects/hic

# Set environment (default to qa if not specified)
ENV_TYPE=${1:-qa}
export APP_ENV=$ENV_TYPE

echo "Starting frontend locally with $ENV_TYPE environment..."

# Load environment variables
source scripts/dev/env-switch.sh $ENV_TYPE

# Start frontend with correct port
echo "Starting frontend on port $FRONTEND_PORT..."
cd apps/frontend
pnpm run dev
