#!/bin/sh
set -e

# Check if SSL is enabled
if [ "$SSL_ENABLED" = "true" ]; then
    echo "Using SSL configuration"
    envsubst '${DOMAIN}' < /etc/nginx/templates/conf.template.WithSSL > /etc/nginx/conf.d/default.conf
else
    echo "Using non-SSL configuration"
    envsubst '${DOMAIN}' < /etc/nginx/templates/conf.template.NoSSL > /etc/nginx/conf.d/default.conf
fi

# Test nginx configuration
nginx -t

exec nginx -g 'daemon off;'