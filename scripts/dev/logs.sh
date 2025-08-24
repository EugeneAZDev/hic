#!/usr/bin/env bash
cd ~/projects/hic
docker compose --env-file .env.qa -f docker-compose.yaml logs