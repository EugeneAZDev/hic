# SSL Configuration for HIC Project

This directory contains scripts for managing SSL certificates and HTTPS configuration.

## Prerequisites

1. Domain name pointing to your server
2. Docker and Docker Compose installed
3. Staging environment running (`dc-dev-start` or similar)

## Quick Start

### 1. Get SSL Certificate

```bash
# Get certificate for your domain
./infra/scripts/ssl/get-ssl-cert.sh hic-staging.gtechdev.top goldentechdevelopment@gmail.com

# Or with custom email
./infra/scripts/ssl/get-ssl-cert.sh hic-staging your-email@example.com
```

### 2. Enable SSL

```bash
# Enable SSL in nginx
./infra/scripts/ssl/enable-ssl.sh hic-staging.gtechdev.top
```

### 3. Check SSL Status

```bash
# Check if SSL is working correctly
./infra/scripts/ssl/check-ssl.sh hic-staging.gtechdev.top
```

## Manual Steps

### Environment Variables

After getting the certificate, update your environment variables:

```bash
# In your .env file or environment
SSL_ENABLED=true
DOMAIN=hic-staging
```

### Restart Services

```bash
# Restart nginx container
docker restart hic-nginx-staging

# Or restart entire staging environment
dc-dev-stop && dc-dev-start
```

## File Structure

```
infra/nginx/
├── ssl/
│   └── live/
│       └── hic-staging/
│           ├── fullchain.pem    # SSL certificate
│           ├── privkey.pem      # Private key
│           └── ...
├── cert/                        # ACME challenge directory
└── conf/
    └── hic.conf                 # Generated nginx config
```

## Troubleshooting

### Certificate Not Found
- Ensure domain is correctly configured
- Check if nginx container is running
- Verify DNS is pointing to your server

### SSL Not Working
- Check if `SSL_ENABLED=true` is set
- Verify certificate files exist in correct location
- Check nginx logs: `docker logs hic-nginx-staging`

### Certificate Renewal
Let's Encrypt certificates expire every 90 days. Set up automatic renewal:

```bash
# Add to crontab for automatic renewal
0 2 * * * /path/to/project/infra/scripts/ssl/get-ssl-cert.sh hic-staging.gtechdev.top goldentechdevelopment@gmail.com
```

## Security Notes

- Never commit private keys to version control
- Use strong passwords for private keys
- Regularly update certificates
- Monitor certificate expiration dates
