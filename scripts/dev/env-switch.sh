#!/usr/bin/env bash
cd ~/projects/hic

ENV_TYPE=${1:-qa}

if [ ! -f ".env.${ENV_TYPE}" ]; then
    echo "❌ Environment file .env.${ENV_TYPE} not found!"
    echo "Available environments:"
    ls -la .env.* | grep -v example | sed 's/\.env\.//' | sort
    exit 1
fi

echo "Switching to $ENV_TYPE environment..."

# Load common environment
if [ -f ".env.${ENV_TYPE}" ]; then
    export $(grep -v '^#' .env.${ENV_TYPE} | xargs)
    echo "✓ Loaded .env.${ENV_TYPE}"
fi

# Load backend specific environment
if [ -f ".env.${ENV_TYPE}.backend" ]; then
    export $(grep -v '^#' .env.${ENV_TYPE}.backend | xargs)
    echo "✓ Loaded .env.${ENV_TYPE}.backend"
fi

# Load frontend specific environment
if [ -f ".env.${ENV_TYPE}.frontend" ]; then
    export $(grep -v '^#' .env.${ENV_TYPE}.frontend | xargs)
    echo "✓ Loaded .env.${ENV_TYPE}.frontend"
fi

echo " Switched to $ENV_TYPE environment"
echo " Current variables:"
echo "   APP_ENV: $APP_ENV"
echo "   NODE_ENV: $NODE_ENV"
echo "   DB_PORT: $DB_PORT"
echo "   FRONTEND_PORT: $FRONTEND_PORT"
echo "   BACKEND_PORT: $BACKEND_PORT"
echo "   NEXT_PUBLIC_BACKEND_URL: $NEXT_PUBLIC_BACKEND_URL"

echo ""
echo " Now you can run:"
echo "   pnpm turbo run build    # Build with current environment"
echo "   pnpm dev                # Run from the root directory (frontend and backend)"

