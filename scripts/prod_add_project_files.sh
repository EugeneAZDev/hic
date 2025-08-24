#!/usr/bin/env bash
CONFIG_FULL_PATH="$HOME/core-s/scripts/.config/mnav.conf"
if [ -f "$CONFIG_FULL_PATH" ]; then
    source "$CONFIG_FULL_PATH"
else
    echo "Error: Configuration file not found! ($CONFIG_FULL_PATH)"
    exit 1
fi
# ------------------------------------------------------------------
SOURCE=$HOME/projects/new
TARGET=root@$IP:/opt/new/

rsync -avz --progress "$SOURCE/docker-compose.qa.yaml" "$TARGET"
rsync -avz --progress "$SOURCE/.env.qa" "$TARGET"
