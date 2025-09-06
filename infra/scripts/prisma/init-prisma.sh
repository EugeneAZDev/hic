#!/usr/bin/env bash
set -e
echo "=== Prisma Database Initialization Process ==="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$PROJECT_ROOT"
source "$PROJECT_ROOT/infra/config/networking.conf"
echo "APP_MODE: $APP_MODE"

# Load environment variables
set -a
source "$PROJECT_ROOT/.env-files/.env.${APP_MODE}"
set +a

echo ""
echo "Step 1: Initializing database extensions..."
"$SCRIPT_DIR/init-all-db-extensions.sh"

echo ""
echo "Step 2: Creating Prisma migrations..."
"$SCRIPT_DIR/create-prisma-migrations.sh"

echo ""
echo "Step 3: Applying migrations and generating clients..."

# Initialize main database
echo "Initializing ${DB_NAME} database..."
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT:-5435}/${DB_NAME}" \
  pnpm --filter ./packages/prisma/main prisma migrate deploy
echo "✓ Main database migrations applied"

DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT:-5435}/${DB_NAME}" \
  pnpm --filter ./packages/prisma/main prisma generate
echo "✓ Main database client generated"

# Initialize auth database
echo "Initializing ${AUTHDB_NAME} database..."
DATABASE_URL_AUTH="postgresql://${AUTH_DB_USER}:${AUTH_DB_PASSWORD}@localhost:${AUTH_DB_PORT:-5437}/${AUTH_DB_NAME}" \
  pnpm --filter ./packages/prisma/auth prisma migrate deploy
echo "✓ Auth database migrations applied"

DATABASE_URL_AUTH="postgresql://${AUTH_DB_USER}:${AUTH_DB_PASSWORD}@localhost:${AUTH_DB_PORT:-5437}/${AUTH_DB_NAME}" \
  pnpm --filter ./packages/prisma/auth prisma generate
echo "✓ Auth database client generated"

echo ""
echo "🎉 All Prisma databases initialized successfully!"
echo "=== Process completed ==="