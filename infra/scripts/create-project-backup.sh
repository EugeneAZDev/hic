#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"
cd "$PROJECT_PATH"
rm -rf apps/frontend/.next
rm -rf services/backend/dist
BACKUP_PROJECT_PATH="$BACKUP_PATH/${PROJECT_NAME}_$BACKUP_DATE"
echo $BACKUP_PROJECT_PATH
mkdir $BACKUP_PROJECT_PATH
rsync -aHAX --progress --exclude='apps/frontend/node_modules' --exclude='packages/shared-types/node_modules' --exclude='services/backend/node_modules' --exclude='node_modules' "$PROJECT_PATH/" "$BACKUP_PROJECT_PATH/"
