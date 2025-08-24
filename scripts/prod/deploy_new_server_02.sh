#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../config/server.conf"

# Have issue:
# This command `tail -c1 /var/lib/dpkg/info/linux-firmware.list | hexdump -C` returned:
# 00000000  00
# 00000001
# instead of: 00000000  0a
# How to fix:
# `echo "" | sudo tee -a /var/lib/dpkg/info/linux-firmware.list > /dev/null`
INSTALLING_SOFT=$(cat <<EOF
sudo apt install -y docker.io
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
sudo mkdir -p /usr/lib/docker/cli-plugins
sudo ln -s /usr/local/bin/docker-compose /usr/lib/docker/cli-plugins/docker-compose
sudo curl -L https://github.com/docker/buildx/releases/download/v0.16.2/buildx-v0.16.2.linux-amd64 -o /usr/lib/docker/cli-plugins/docker-buildx
sudo chmod +x /usr/lib/docker/cli-plugins/docker-buildx
echo "The"
docker-compose --version
echo "has been installed"
EOF
)
ssh root@"$IP" "$INSTALLING_SOFT" 2>&1

# Backend -  :7001
# Database - :5435
# Frontend - :5001
TURN_ON_FIREWALL=$(cat <<EOF
sudo ufw allow 7001
sudo ufw allow 5435
sudo ufw allow 5001
sudo ufw allow 80/tcp
sudo ufw allow 'OpenSSH'
sudo ufw allow 443
sudo ufw enable
sudo ufw status
EOF
)
ssh root@"$IP" "$TURN_ON_FIREWALL" 2>&1
