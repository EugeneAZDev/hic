#!/bin/bash
set -e

# Configuration
DOMAIN=${1:-hic-staging.gtechdev.top}
EMAIL=${2:-goldentechdevelopment@gmail.com}
NGINX_CONTAINER="hic-nginx-staging"

echo "Getting SSL certificate for domain: $DOMAIN"
echo "Email: $EMAIL"

# Check if domain is provided
if [ -z "$DOMAIN" ]; then
    echo "Usage: $0 <domain> [email]"
    echo "Example: $0 hic-staging.gtechdev.top goldentechdevelopment@gmail.com"
    exit 1
fi

# Check if nginx container is running
if ! docker ps | grep -q "$NGINX_CONTAINER"; then
    echo "Error: nginx container '$NGINX_CONTAINER' is not running"
    echo "Please start the staging environment first"
    exit 1
fi

# Create cert and ssl directories if they don't exist
mkdir -p infra/nginx/ssl/live/$DOMAIN
mkdir -p infra/nginx/cert

# Get SSL certificate using certbot
echo "Requesting SSL certificate from Let's Encrypt..."

docker run --rm \
    --name certbot \
    -v "$(pwd)/infra/nginx/ssl:/etc/letsencrypt" \
    -v "$(pwd)/infra/nginx/cert:/var/www/cert" \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/cert \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --domains $DOMAIN

echo "SSL certificate obtained successfully!"
echo "Certificate location: infra/nginx/ssl/live/$DOMAIN/"

# Restart nginx to load new certificate
echo "Restarting nginx container..."
docker restart $NGINX_CONTAINER

echo "SSL setup complete! You can now set SSL_ENABLED=true"
