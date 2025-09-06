#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
source "$PROJECT_ROOT/infra/config/networking.conf"
CONST_DATE="31_08_2025_16_54_zod"
# SOURCE_PATH="/run/media/eulw/HDD1863/Backups/hic_history/${PROJECT_NAME}_${CONST_DATE}"
# SOURCE_PATH="/home/eulw/pCloudDrive/Sync/p_hic"
rsync -aHAX --progress "$SOURCE_PATH/" "$PROJECT_PATH"