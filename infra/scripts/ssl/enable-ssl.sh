#!/bin/bash
set -e

DOMAIN=${1:-hic-staging.gtechdev.top}
NGINX_CONTAINER="hic-nginx-staging"

echo "Enabling SSL for domain: $DOMAIN"

# Check if certificate exists
if [ ! -f "infra/nginx/ssl/live/$DOMAIN/fullchain.pem" ]; then
    echo "Error: SSL certificate not found for domain $DOMAIN"
    echo "Please run: ./infra/scripts/ssl/get-ssl-cert.sh $DOMAIN"
    exit 1
fi

# Check if nginx container is running
if ! docker ps | grep -q "$NGINX_CONTAINER"; then
    echo "Error: nginx container '$NGINX_CONTAINER' is not running"
    echo "Please start the staging environment first"
    exit 1
fi

# Stop nginx container
echo "Stopping nginx container..."
docker stop $NGINX_CONTAINER

# Start nginx with SSL_ENABLED=true
echo "Starting nginx with SSL enabled..."
SSL_ENABLED=true DOMAIN=$DOMAIN docker-compose -f infra/docker-compose/nginx.yaml up -d

# Wait for nginx to start
sleep 3

# Check if nginx started successfully
if ! docker ps | grep -q "$NGINX_CONTAINER"; then
    echo "Error: Failed to start nginx container"
    exit 1
fi

echo "SSL enabled successfully!"
echo "Your site should now be available at: https://$DOMAIN"
echo ""
echo "Note: Make sure to update your environment variables:"
echo "  SSL_ENABLED=true"
echo "  DOMAIN=$DOMAIN"
