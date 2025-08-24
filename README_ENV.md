# Environment Variables Usage in HIC Project

## .env Files Structure

```
hic/
├── .env.qa                    # Common variables for QA environment
├── .env.prod                  # Common variables for Production environment
├── .env.qa.backend           # Backend-specific variables for QA
├── .env.prod.backend         # Backend-specific variables for Production
├── .env.qa.frontend          # Frontend-specific variables for QA
├── .env.prod.frontend        # Frontend-specific variables for Production
└── env.example               # Template example
```

## Environment Variables

### Common Variables (.env.qa, .env.prod)
- `APP_ENV` - Environment identifier (qa/prod)
- `DOMAIN` - Application domain
- `NODE_ENV` - Node.js environment
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password

### Backend-specific Variables (.env.qa.backend, .env.prod.backend)
- `BACKEND_PORT` - Backend service port

### Frontend-specific Variables (.env.qa.frontend, .env.prod.frontend)
- `FRONTEND_PORT` - Frontend service port
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL for frontend (development only)
- `NEXT_PUBLIC_DOMAIN` - Domain for frontend (used for production API calls)

## Usage

### 1. Switching Between Environments

```bash
# Switch to QA environment
source scripts/dev/env-switch.sh qa

# Switch to Production environment
source scripts/dev/env-switch.sh prod
```

### 2. Running Services Locally

```bash
# Start frontend with QA environment
./scripts/dev/run-frontend-local.sh qa

# Start backend with QA environment
./scripts/dev/run-backend-local.sh qa

# Start frontend with Production environment
./scripts/dev/run-frontend-local.sh prod

# Start backend with Production environment
./scripts/dev/run-backend-local.sh prod
```

### 3. Building with Environment Variables

```bash
# Build for QA environment
export APP_ENV=qa
./scripts/dev/build.sh

# Build for Production environment
export APP_ENV=prod
./scripts/dev/build.sh
```

### 4. Docker Compose

```bash
# Run with QA environment
export APP_ENV=qa
docker compose up -d

# Run with Production environment
export APP_ENV=prod
docker compose up -d
```

## How It Works

### Backend (NestJS)
- Port is taken from `process.env.BACKEND_PORT`
- CORS settings use `process.env.FRONTEND_PORT`
- Fallback values: `BACKEND_PORT=7001`, `FRONTEND_PORT=5001`

### Frontend (Next.js)
- Port is taken from `process.env.FRONTEND_PORT`
- Backend URL is taken from `process.env.NEXT_PUBLIC_BACKEND_URL`
- Fallback values: `FRONTEND_PORT=5001`, `NEXT_PUBLIC_BACKEND_URL=http://localhost:7001`

### Docker Compose
- Automatically loads `.env.${APP_ENV}` for common variables
- Automatically loads `.env.${APP_ENV}.backend` for backend
- Automatically loads `.env.${APP_ENV}.frontend` for frontend

## Adding New Variables

1. **Common variables**: add to `.env.qa` and `.env.prod`
2. **Backend variables**: add to `.env.qa.backend` and `.env.prod.backend`
3. **Frontend variables**: add to `.env.qa.frontend` and `.env.prod.frontend`
4. **Update documentation** in this file

## Security

- All `.env*` files are ignored by git
- Never commit passwords or API keys
- Use `env.example` as a template for required variables
- Production passwords should be strong and unique
