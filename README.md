# HIC - High Impact Computing Platform

A modern, scalable web application built with a microservices architecture using Next.js, NestJS, and PostgreSQL.

## 🏗️ Architecture

This project follows a monorepo structure using **Turborepo** and **pnpm workspaces**:

```
hic/
├── apps/
│   └── frontend/          # Next.js 15 React application
├── services/
│   └── backend/           # NestJS API server
├── packages/
│   └── shared-dto/        # Shared TypeScript types
├── infra/                 # Database and infrastructure
├── nginx/                 # Reverse proxy and SSL termination
└── scripts/               # Development and deployment scripts
```

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **NestJS** - Progressive Node.js framework
- **Fastify** - High-performance web framework
- **TypeScript** - Type-safe backend development
- **Jest** - Testing framework

### Infrastructure
- **PostgreSQL 13.3** - Primary database
- **Nginx** - Reverse proxy and load balancer
- **Docker & Docker Compose** - Containerization
- **Turborepo** - Monorepo build system

## 📋 Prerequisites

- **Node.js** >= 18
- **pnpm** >= 8.6.0
- **Docker** & **Docker Compose**
- **PostgreSQL** (for local development)

## 🛠️ Installation

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
   ```bash
   cp env.example .env.development
   # Edit .env.development with your configuration
   ```

4. **Start the development environment**
   ```bash
   pnpm dev
   ```

## 🔧 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all services in development mode |
| `pnpm build` | Build all packages and applications |
| `pnpm lint` | Run linting across all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run tests across all packages |

### Service-Specific Commands

#### Frontend
```bash
cd apps/frontend
pnpm dev          # Start on http://localhost:5001
pnpm build        # Build for production
pnpm start        # Start production server
```

#### Backend
```bash
cd services/backend
pnpm dev          # Start in watch mode
pnpm build        # Build for production
pnpm start        # Start production server
pnpm test         # Run tests
```

#### Shared Types
```bash
cd packages/shared-dto
pnpm build        # Build TypeScript definitions
pnpm dev          # Watch mode for development
```

### Docker Development

Start all services with Docker Compose:

```bash
# Development environment
docker-compose up -d

# Production environment
docker-compose -f docker-compose.prod.yaml up -d

# With additional services
docker-compose -f docker-compose.yaml -f docker-compose.extra.yaml up -d
```

## 🌐 Service URLs

| Service | Local URL | Docker URL |
|---------|-----------|------------|
| Frontend | http://localhost:5001 | http://localhost:5001 |
| Backend | http://localhost:7001 | http://localhost:7001 |
| Database | localhost:5435 | db:5432 |
| Nginx | http://localhost:80 | http://localhost:80 |

## 🗄️ Database

### Initial Setup
```bash
# Create PostgreSQL password file
echo "localhost:DB_PORT:DB_NAME:DB_USER:DB_PASSWORD" > ~/.pgpass
chmod 600 ~/.pgpass
```

### Database Initialization
The database is automatically initialized with:
- `01-structure.sql` - Database schema
- `02-data.sql` - Initial data

## 📦 Package Management

This project uses **pnpm workspaces** for efficient package management:

- **Root dependencies** are managed in the root `package.json`
- **Service-specific dependencies** are managed in each service's `package.json`
- **Shared packages** can be referenced using `workspace:` protocol

### Adding Dependencies
```bash
# Add to specific service
pnpm add <package> --filter ./apps/frontend
pnpm add <package> --filter ./services/backend

# Add to shared package
pnpm add <package> --filter ./packages/shared-dto
```

## 🚀 Deployment

### Production Deployment
```bash
# Build all packages
pnpm build

# Deploy using Docker Compose
docker-compose -f docker-compose.prod.yaml up -d
```

### Environment Configuration
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.qa` - QA environment

## 🧪 Testing

Run tests across all packages:
```bash
pnpm test                    # Run all tests
pnpm test --filter=backend  # Run only backend tests
pnpm test:watch             # Run tests in watch mode
```

## 📚 Documentation

- [Infrastructure Documentation](./infra/docs/README.md)
- [Environment Structure](./infra/docs/ENV_STRUCTURE.md)
- [Database Structure](./infra/docs/STRUCTURE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.

## 🆘 Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check what's using a port
lsof -i :5001

# Kill processes
pkill -f node
```

**Cache issues:**
```bash
# Clear Turborepo cache
pnpm turbo clean

# Clear pnpm cache
pnpm store prune
```

**Docker issues:**
```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

For more detailed troubleshooting, check the [infrastructure documentation](./infra/docs/README.md).
