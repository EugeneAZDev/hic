#!/usr/bin/env bash
set -e

echo "Creating Prisma migrations..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$PROJECT_ROOT"
source "$PROJECT_ROOT/infra/config/networking.conf"
echo "APP_MODE: $APP_MODE"

# Load environment variables
set -a
source "$PROJECT_ROOT/.env-files/.env.${APP_MODE}"
set +a

echo "Creating migrations for auth database..."
pnpm exec prisma migrate dev \
  --schema packages/prisma/auth/schema.prisma \
  --name init

echo "Creating migrations for main database..."
pnpm exec prisma migrate dev \
  --schema packages/prisma/main/schema.prisma \
  --name init

echo "✓ Prisma migrations created successfully!"
