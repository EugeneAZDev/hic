#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config/server.conf"
echo $IP
DATE=$(date +"%d_%m_%Y_%H_%M")
TARGET_PATH="/run/media/eulw/HDD1863/Backups/hic_history/${PROJECT_NAME}_$DATE"
cd "$PROJECT_PATH"
rm -rf apps/frontend/.next
rm -rf services/backend/dist
BACKUP_PROJECT_PATH="$BACKUP_PATH"
echo $TARGET_PATH
mkdir $TARGET_PATH
rsync -aHAX --progress --exclude='apps/frontend/node_modules' --exclude='packages/shared-types/node_modules' --exclude='services/backend/node_modules' --exclude='node_modules' "$PROJECT_PATH/" "$TARGET_PATH/"
