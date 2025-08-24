#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config/server.conf"
CONST_DATE="23_08_2025_20_36"
SOURCE_PATH="/run/media/eulw/HDD1863/Backups/hic_history/${PROJECT_NAME}_${CONST_DATE}"
rsync -aHAX --progress "$SOURCE_PATH/" "$PROJECT_PATH"