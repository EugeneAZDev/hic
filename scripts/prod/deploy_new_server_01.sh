#!/usr/bin/env bash
# Update the server
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../config/server.conf"

echo "Create folder for ${PROJECT_NAME} project"

INITIAL_SCRIPT=$(cat <<EOF
mkdir -p /opt/${PROJECT_NAME}/nginx
sudo apt update && sudo apt upgrade -y
sudo reboot
EOF
)

ssh root@"$IP" "$INITIAL_SCRIPT" 2>&1
