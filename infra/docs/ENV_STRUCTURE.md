# Environment Files Structure

This document describes the organization of environment files in the HIC project.

## File Structure

```
hic/
├── .env.qa                   # Common variables for QA environment
├── .env.prod                 # Common variables for Production environment
├── .env.qa.backend           # Backend-specific variables for QA
├── .env.prod.backend         # Backend-specific variables for Production
├── .env.qa.frontend          # Frontend-specific variables for QA
├── .env.prod.frontend        # Frontend-specific variables for Production
└── env.example               # Example template (doesn't contain sensitive data)
```

## Environment Files

### Common Variables (.env.qa, .env.prod)
- `APP_ENV` - Environment identifier (qa/prod)
- `DOMAIN` - Application domain
- `NODE_ENV` - Node.js environment
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password

### Backend-Specific Variables (.env.qa.backend, .env.prod.backend)
- `BACKEND_PORT` - Backend service port

### Frontend-Specific Variables (.env.qa.frontend, .env.prod.frontend)
- `FRONTEND_PORT` - Frontend service port

## Usage

### Docker Compose
The `docker-compose.yaml` automatically loads the appropriate environment files:
- Common variables: `.env.${APP_ENV}`
- Backend variables: `.env.${APP_ENV}.backend`
- Frontend variables: `.env.${APP_ENV}.frontend`

### Local Development
For local development without containers, use the environment switch script:
```bash
# Switch to QA environment
source scripts/dev/env-switch.sh qa

# Switch to Production environment
source scripts/dev/env-switch.sh prod
```

### Switching Environments
```bash
# Set APP_ENV variable
export APP_ENV=qa    # or prod

# Run docker compose
docker compose up -d
```

## Security Notes

- All `.env*` files are ignored by git (see `.gitignore`)
- Never commit sensitive data like passwords or API keys
- Use `env.example` as a template for required variables
- Production passwords should be strong and unique

## Adding New Variables

1. Add common variables to `.env.qa` and `.env.prod`
2. Add service-specific variables to respective `.env.{env}.{service}` files
3. Update this documentation
4. Update `env.example` if the variable is not sensitive
