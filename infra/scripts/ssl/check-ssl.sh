#!/bin/bash
set -e

DOMAIN=${1:-hic-staging.gtechdev.top}
NGINX_CONTAINER="hic-nginx-staging"

echo "Checking SSL status for domain: $DOMAIN"
echo "========================================"

# Check if nginx container is running
if ! docker ps | grep -q "$NGINX_CONTAINER"; then
    echo "nginx container '$NGINX_CONTAINER' is not running"
    exit 1
fi

echo "nginx container is running"

# Check SSL_ENABLED environment variable
SSL_STATUS=$(docker exec $NGINX_CONTAINER sh -c 'echo $SSL_ENABLED' 2>/dev/null || echo "false")
if [ "$SSL_STATUS" = "true" ]; then
    echo "SSL is enabled in nginx container"
else
    echo "SSL is disabled in nginx container"
fi

# Check if certificate files exist
if [ -f "infra/nginx/ssl/live/$DOMAIN/fullchain.pem" ]; then
    echo "SSL certificate exists: infra/nginx/ssl/live/$DOMAIN/fullchain.pem"
    
    # Check certificate expiration
    if command -v openssl >/dev/null 2>&1; then
        EXPIRY=$(openssl x509 -in "infra/nginx/ssl/live/$DOMAIN/fullchain.pem" -noout -enddate 2>/dev/null | cut -d= -f2)
        if [ -n "$EXPIRY" ]; then
            echo "Certificate expires: $EXPIRY"
        fi
    fi
else
    echo "SSL certificate not found: infra/nginx/ssl/live/$DOMAIN/fullchain.pem"
fi

# Check if private key exists
if [ -f "infra/nginx/ssl/live/$DOMAIN/privkey.pem" ]; then
    echo "SSL private key exists: infra/nginx/ssl/live/$DOMAIN/privkey.pem"
else
    echo "SSL private key not found: infra/nginx/ssl/live/$DOMAIN/privkey.pem"
fi

# Test HTTP connection
echo ""
echo "Testing HTTP connection..."
if curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN" | grep -q "200\|301\|302"; then
    echo "HTTP connection working"
else
    echo "HTTP connection failed"
fi

# Test HTTPS connection (if SSL is enabled)
if [ "$SSL_STATUS" = "true" ]; then
    echo ""
    echo "Testing HTTPS connection..."
    if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" | grep -q "200"; then
        echo "HTTPS connection working"
    else
        echo "HTTPS connection failed"
    fi
fi

echo ""
echo "========================================"
echo "SSL Status Check Complete"
