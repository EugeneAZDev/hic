#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$PROJECT_ROOT"
source "$PROJECT_ROOT/infra/config/networking.conf"
echo "$PROJECT_ROOT/infra/config/networking.conf"

DATE=$(date +"%d_%m_%Y_%H_%M")
TARGET_PATH="/run/media/eulw/HDD1863/Backups/hic_history/${PROJECT_NAME}_$DATE"
mkdir -p "$TARGET_PATH"
rsync -aHAX --progress \
 --exclude='apps/auth-service/node_modules' \
 --exclude='apps/auth-service/.next' \
 --exclude='apps/auth-service/.turbo' \
 --exclude='apps/backend/node_modules' \
 --exclude='apps/backend/dist' \
 --exclude='apps/backend/.turbo' \
 --exclude='apps/bff/node_modules' \
 --exclude='apps/bff/dist' \
 --exclude='apps/bff/.turbo' \
 --exclude='apps/frontend/node_modules' \
 --exclude='apps/frontend/.next' \
 --exclude='apps/frontend/.turbo' \
 --exclude='apps/worker-service/node_modules' \
 --exclude='apps/worker-service/.next' \
 --exclude='apps/worker-service/.turbo' \
 --exclude='packages/prisma/auth/node_modules' \
 --exclude='packages/prisma/main/node_modules' \
 --exclude='packages/prisma/generated' \
 --exclude='packages/shared/dto/node_modules' \
 --exclude='packages/shared/dto/dist' \
 --exclude='packages/shared/dto/.turbo' \
 --exclude='packages/shared/schemas/.turbo' \
 --exclude='packages/shared/schemas/node_modules' \
 --exclude='packages/shared/schemas/dist' \
 --exclude='packages/shared/security/node_modules' \
 --exclude='packages/shared/security/dist' \
 --exclude='packages/shared/security/.turbo' \
 --exclude='node_modules' \
 --exclude='.turbo' \
 --exclude='**/tsconfig.tsbuildinfo' \
 --exclude='**/coverage' \
 --exclude='**/.DS_Store' \
 --exclude='**/Thumbs.db' \
 --exclude='**/*.log' \
 --exclude='**/dist' \
 --exclude='**/build' \
 --exclude='**/.next' \
 --exclude='**/.turbo' \
 --exclude='**/node_modules' \
 --exclude='**/tsconfig.tsbuildinfo' \
 --exclude='**/coverage' \
 --exclude='**/.DS_Store' \
 --exclude='**/Thumbs.db' \
 --exclude='**/*.log' \
 "$PROJECT_ROOT/" "$TARGET_PATH/"

echo "✅ Backup completed successfully!"
echo "Backup location: $TARGET_PATH"
