#!/usr/bin/env bash
cd ~/projects/hic
docker compose --env-file .env.qa -f docker-compose.yaml up -d
echo "Waiting for containers to become healthy"
sleep 3
clear
docker ps