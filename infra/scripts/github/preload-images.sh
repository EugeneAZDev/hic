#!/bin/bash
set -e

echo "Preloading Docker images for faster act runs..."

# Preload base images
echo "Loading node:18-alpine..."
docker pull node:18-alpine

echo "Loading postgres:15..."
docker pull postgres:15

echo "Loading redis:7-alpine..."
docker pull redis:7-alpine

echo "Loading catthehacker/ubuntu:act-latest..."
docker pull catthehacker/ubuntu:act-latest

# Create pnpm cache volume
echo "Creating pnpm cache volume..."
docker volume create pnpm-cache 2>/dev/null || echo "Volume already exists"

echo "Images preloaded successfully!"
