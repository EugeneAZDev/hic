# HIC Project

A modern microservices-based web application built with Next.js, NestJS, and PostgreSQL. The project follows a microservices architecture with separate services for authentication, backend business logic, frontend, and background job processing.

## Architecture Overview

The project is structured as a monorepo using pnpm workspaces and consists of:

- **Frontend**: Next.js 15 application with React 19
- **Backend**: NestJS API service for business logic
- **Auth Service**: Dedicated authentication service with JWT
- **BFF (Backend for Frontend)**: API gateway that aggregates data from other services
- **Worker Service**: Background job processing with Bull queues
- **Shared Packages**: Common schemas, DTOs, and security utilities

## Project Structure

```
hic/
├── apps/                          # Application services
│   ├── frontend/                  # Next.js frontend application
│   ├── backend/                   # Main backend API service
│   ├── auth-service/              # Authentication service
│   ├── bff/                       # Backend for Frontend service
│   └── worker-service/            # Background job processing
├── packages/                      # Shared packages
│   ├── prisma/                    # Database schemas and migrations
│   │   ├── main/                  # Main database schema
│   │   └── auth/                  # Authentication database schema
│   ├── shared/
│   │   ├── schemas/               # Zod validation schemas
│   │   ├── dto/                   # Data Transfer Objects
│   │   └── security/              # Security utilities and guards
├── infra/                         # Infrastructure configuration
│   ├── docker-compose/            # Docker Compose configurations
│   ├── nginx/                     # Nginx configuration and SSL
│   └── scripts/                   # Deployment and utility scripts
└── .env-files/                    # Environment configuration files
```

## Quick Start

### Prerequisites

- Node.js >= 18
- pnpm 8.6.0
- Docker and Docker Compose
- PostgreSQL (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hic
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   All environment files are located in the `.env-files/` directory. Create the following files:
   
   - `.env-files/.env.local` - Local development environment
   - `.env-files/.env.dev` - Containerized development environment
   - `.env-files/.env.staging` - Staging environment
   - `.env-files/.env.production` - Production environment
   
   Use the template from `env.example.md` as a reference:
   ```bash
   cp env.example.md .env-files/.env.local
   cp env.example.md .env-files/.env.dev
   # Edit the files with your configuration
   ```

4. **Initialize databases**
   ```bash
   # Initialize Prisma schemas
   pnpm prisma:generate
   
   # Run database migrations (if needed)
   ./infra/scripts/prisma/init-prisma.sh
   ```

## Development Environments

The project supports two development environments with different deployment strategies:

### Local Development Environment (Minimal Containers)

This environment runs only databases and infrastructure in containers, while application services run locally for faster development and debugging.

**Start local environment:**
```bash
# Stop dev environment first (if running)
./infra/scripts/dev/dc-dev-stop.sh

# Start local environment
./infra/scripts/dev/dc-start.sh
```

**Stop local environment:**
```bash
./infra/scripts/dev/dc-stop.sh
```

**What runs in containers:**
- PostgreSQL databases (main and auth)
- Redis
- MailHog

**What runs locally:**
- Frontend (Next.js dev server)
- Backend services (NestJS with hot reload)
- BFF service
- Auth service
- Worker service

### Containerized Development Environment (Full Containers)

This environment runs all services in Docker containers, builds images, and can push them to GitHub Container Registry.

**Start containerized environment:**
```bash
# Stop local environment first (if running)
./infra/scripts/dev/dc-stop.sh

# Start containerized environment
./infra/scripts/dev/dc-dev-start.sh
```

**Stop containerized environment:**
```bash
./infra/scripts/dev/dc-dev-stop.sh
```

**What runs in containers:**
- All application services
- Databases and infrastructure
- Nginx reverse proxy

**Build and push images:**
```bash
# Build and push images to GitHub Container Registry
./infra/scripts/dev/build-and-push.sh [registry_url] [version] [push] [start]
```

### Environment Switching Best Practices

**Important:** Always stop one environment before starting another to avoid port conflicts:

1. **Switching from local to containerized:**
   ```bash
   ./infra/scripts/dev/dc-stop.sh      # Stop local
   ./infra/scripts/dev/dc-dev-start.sh # Start containerized
   ```

2. **Switching from containerized to local:**
   ```bash
   ./infra/scripts/dev/dc-dev-stop.sh  # Stop containerized
   ./infra/scripts/dev/dc-start.sh     # Start local
   ```

## Available Scripts

### Root Level Scripts

```bash
# Development
pnpm dev                    # Start all services in development mode
pnpm dev:worker-service     # Start only worker service
pnpm dev:auth-service       # Start only auth service

# Building
pnpm build                  # Build all services
pnpm build:worker-service   # Build only worker service
pnpm build:auth-service     # Build only auth service

# Code Quality
pnpm lint                   # Lint all services
pnpm format                 # Format code with Prettier

# Database
pnpm prisma:generate        # Generate Prisma clients for both databases
```

### Development Environment Scripts

```bash
# Local Development (minimal containers)
./infra/scripts/dev/dc-start.sh        # Start local environment
./infra/scripts/dev/dc-stop.sh         # Stop local environment

# Containerized Development (full containers)
./infra/scripts/dev/dc-dev-start.sh    # Start containerized environment
./infra/scripts/dev/dc-dev-stop.sh     # Stop containerized environment
./infra/scripts/dev/dc-dev-down.sh     # Stop and remove containers

# Build and Deploy
./infra/scripts/dev/build-and-push.sh  # Build and push Docker images
```

### Service-Specific Scripts

Each service has its own scripts defined in their `package.json`:

- **Frontend**: `dev`, `build`, `start`, `lint`
- **Backend**: `dev`, `build`, `start`, `test`, `lint`, `format`
- **Auth Service**: `dev`, `build`, `start`, `test`, `lint`, `format`
- **BFF**: `dev`, `build`, `start`
- **Worker Service**: `dev`, `build`, `start`, `test`, `lint`, `format`

## Docker Configuration

The project uses Docker for containerization with separate configurations for different environments:

### Development Environment

```bash
# Start development environment
./infra/scripts/dev/dc-dev-start.sh

# Stop development environment
./infra/scripts/dev/dc-dev-stop.sh

# Build and push images
./infra/scripts/dev/build-and-push.sh [registry_url] [version] [push] [start]
```

### Docker Compose Files

- `infra/docker-compose/base.yaml` - Base services (databases, Redis, MailHog)
- `infra/docker-compose/dev.yaml` - Development services
- `infra/docker-compose/staging.yaml` - Staging services
- `infra/docker-compose/nginx.yaml` - Nginx reverse proxy

## Database Schema

The project uses two separate PostgreSQL databases:

### Main Database (`packages/prisma/main/`)
- **User**: User profile information
- **JobHistory**: Background job execution history

### Auth Database (`packages/prisma/auth/`)
- **UserAuth**: Authentication data and credentials
- **Session**: User sessions
- **Token**: Various token types (reset, verification, etc.)
- **Mfa**: Multi-factor authentication data

## Data Validation

The project uses Zod schemas as the single source of truth for:
- API validation
- TypeScript type generation
- Swagger documentation
- Service interfaces

### Key Schemas (`packages/shared/schemas/`)

- **UserSchema**: User data validation
- **AuthResponseSchema**: Authentication responses
- **JobSchemas**: Background job data validation
- **PaginationSchema**: API pagination
- **ApiResponseSchema**: Generic API response wrapper

## Security

Security is handled by the `@hic/shared-security` package:

- JWT token management
- Password hashing with bcrypt
- Passport.js authentication strategies
- Input validation with Zod
- CORS and security headers

## Background Jobs

The Worker Service handles background tasks using Bull queues:

- **Welcome Email**: Send welcome emails to new users
- **Password Reset**: Send password reset emails
- **Custom Emails**: Send custom templated emails
- **User Synchronization**: Sync user data between services

### Queue Management Scripts

```bash
# View queue statistics
./infra/scripts/queues/queue-stats.sh

# Clear all queues
./infra/scripts/queues/clear-queues.sh

# Inspect queue contents
./infra/scripts/queues/inspect-queues.sh
```

### Database Management Scripts

```bash
# Create new Prisma migrations
./infra/scripts/prisma/create-prisma-migrations.sh

# Initialize all database extensions
./infra/scripts/prisma/init-all-db-extensions.sh

# Initialize Prisma schemas
./infra/scripts/prisma/init-prisma.sh
```

### Debug and Development Scripts

```bash
# Debug development configuration
./infra/scripts/debug/config-dev-start.sh

# Test GitHub workflows locally
./infra/scripts/github/check-workflow.sh

# Preload Docker images for faster builds
./infra/scripts/github/preload-images.sh
```

## Service Communication

- **Frontend** → **BFF**: All frontend requests go through BFF
- **BFF** → **Backend/Auth Service**: BFF aggregates data from backend services
- **Worker Service** → **Backend**: Background jobs communicate with backend
- **All Services** → **Redis**: Queue management and caching

## Environment Variables

All environment files are located in `.env-files/` directory:

### Required Variables

```bash
# Database URLs
DATABASE_URL=postgresql://user:password@host:port/database
AUTH_DATABASE_URL=postgresql://user:password@host:port/auth_database

# JWT Secret
JWT_SECRET=your-secret-key

# Service URLs
NEXT_PUBLIC_BFF_URL=http://localhost:3010/bff
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3012/api/auth

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```

## GitHub Actions and CI/CD

The project includes automated CI/CD workflows for building and deploying Docker images to GitHub Container Registry.

### Workflow Features

- **Automated builds**: Builds all services and pushes to `ghcr.io/eugeneazdev/hic`
- **Multi-environment support**: Separate workflows for staging and production
- **Self-hosted runners**: Uses custom runners for deployment
- **Database migrations**: Automatically runs Prisma migrations during deployment
- **Health checks**: Verifies service health after deployment

### Available Workflows

- **Staging**: `infra/scripts/github/workflows/local-staging.yml`
- **Production**: `.github/workflows/staging.yml`

### Testing Workflows Locally

```bash
# Test workflow syntax and configuration
./infra/scripts/github/check-workflow.sh

# Preload Docker images for faster testing
./infra/scripts/github/preload-images.sh
```

### Self-Hosted Runner Setup

For production deployments, set up a self-hosted runner:

```bash
# Set required environment variables
export RUNNER_CFG_PAT="your-github-pat"
export RUNNER_NAME="hic-runner"

# Setup runner
./infra/scripts/setup-runners.sh
```

## SSL Configuration

The project includes automated SSL certificate management using Let's Encrypt.

### SSL Setup

1. **Get SSL certificate:**
   ```bash
   ./infra/scripts/ssl/get-ssl-cert.sh your-domain.com your-email@example.com
   ```

2. **Enable SSL:**
   ```bash
   ./infra/scripts/ssl/enable-ssl.sh your-domain.com
   ```

3. **Check SSL status:**
   ```bash
   ./infra/scripts/ssl/check-ssl.sh your-domain.com
   ```

### SSL Environment Variables

After getting certificates, update your environment:

```bash
SSL_ENABLED=true
DOMAIN=your-domain.com
```

## Deployment

### Local Development

1. Ensure all environment files are configured
2. Choose your development environment:
   - **Local**: `./infra/scripts/dev/dc-start.sh` (minimal containers)
   - **Containerized**: `./infra/scripts/dev/dc-dev-start.sh` (full containers)
3. Access services at:
   - Frontend: http://localhost:3000
   - BFF: http://localhost:3010/bff
   - Backend: http://localhost:3011
   - Auth Service: http://localhost:3012/api/auth
   - Worker Service: http://localhost:5000
   - MailHog: http://localhost:8025

### Staging Deployment

1. Set up self-hosted runner
2. Configure staging environment variables
3. Push to main branch to trigger staging deployment
4. Set up SSL certificates for staging domain

### Production Deployment

1. Build and push Docker images to registry
2. Configure production environment variables
3. Deploy using Docker Compose or Kubernetes
4. Set up SSL certificates using the provided scripts

## Monitoring and Debugging

### Health Checks

All services provide health check endpoints:
- Backend: `/health`
- Auth Service: `/health`
- Worker Service: `/health`
- BFF: `/health`

### Logs

```bash
# View all service logs
docker-compose -f infra/docker-compose/base.yaml --env-file .env-files/.env.local logs -f

# View specific service logs
docker logs hic-backend-dev -f
```

### Database Management

```bash
# Create new migrations
./infra/scripts/prisma/create-prisma-migrations.sh

# Initialize database extensions
./infra/scripts/prisma/init-all-db-extensions.sh
```

## Development Guidelines

1. **Code Style**: Use Prettier for formatting and ESLint for linting
2. **Type Safety**: Use TypeScript and Zod schemas for validation
3. **Testing**: Write tests for all new features
4. **Documentation**: Keep this README updated with changes
5. **Environment**: Never commit `.env` files, use `.env-files/` directory
6. **Database**: Use Prisma migrations for schema changes
7. **Security**: Follow security best practices in the shared-security package

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

See [LICENSE](LICENSE) file for details.
