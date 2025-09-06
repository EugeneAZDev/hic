# ENV Files Description
- All files exists in `./.env-files/` folder from the root of the project
- Create `.env.local` files with the following structure:
```
APP_ENV=local

# Auth Database
AUTH_DB_HOST=localhost
AUTH_DB_PORT=5437
AUTH_DB_NAME=hic_auth
AUTH_DB_SHADOW_NAME="${AUTH_DB_NAME}_shadow"
AUTH_DB_USER=admin
AUTH_DB_PASSWORD=auth_password
AUTH_DATABASE_URL=postgresql://${AUTH_DB_USER}:${AUTH_DB_PASSWORD}@${AUTH_DB_HOST}:${AUTH_DB_PORT}/${AUTH_DB_NAME}
SHADOW_DATABASE_URL_AUTH=postgresql://${AUTH_DB_USER}:${AUTH_DB_PASSWORD}@${AUTH_DB_HOST}:${AUTH_DB_PORT}/${AUTH_DB_SHADOW_NAME}

# Main Database
DB_HOST=localhost
DB_PORT=5435
DB_NAME=hic
DB_SHADOW_NAME="${DB_NAME}_shadow"
DB_USER=hic_user
DB_PASSWORD=hic_password
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
SHADOW_DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_SHADOW_NAME}

# Frontend specific variables
FRONTEND_PORT=3000
FRONTEND_URL=http://localhost:3000

# Backend specific variables
BFF_PORT=3010
BACKEND_PORT=3011
WORKER_SERVICE_PORT=5000
NEXT_PUBLIC_BFF_URL=http://localhost:3010/bff
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3012/api/auth

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

SSL_ENABLED=false
USE_MAILHOG=true

```
