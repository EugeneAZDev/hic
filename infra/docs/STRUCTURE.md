project-root/
│
├── apps/                     # Frontend applications (Next.js, Admin, etc.)
│   ├── frontend/             # Main user-facing app (Next.js + React)
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/          # App Router (Next.js 13+)
│   │   │   ├── components/   # Reusable UI
│   │   │   ├── lib/          # Utilities, hooks, API clients
│   │   │   └── types/        # Local types (if not shared)
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── admin/                # Optional: admin panel
│       └── ...               # Same structure
│
├── services/                 # Backend services (microservices-ready)
│   ├── user-service/         # Manages users, auth, profiles
│   │   ├── src/
│   │   │   ├── user/
│   │   │   │   ├── user.module.ts
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── dto/
│   │   │   ├── auth/
│   │   │   ├── main.ts       # Fastify bootstrap
│   │   │   └── ...
│   │   ├── test/
│   │   ├── openapi.yml       # OpenAPI spec (auto-generated or manual)
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── order-service/        # Example: order processing
│   │   └── ...
│   │
│   └── gateway-service/      # API Gateway (optional) or MQTT event handler
│       └── ...
│
├── packages/                 # Shared, reusable packages
│   ├── shared-types/         # Shared TypeScript interfaces
│   │   ├── user.dto.ts
│   │   ├── order.dto.ts
│   │   ├── api-response.dto.ts
│   │   └── package.json      # @project/shared-types
│   │
│   ├── api-clients/          # Auto-generated API clients for frontend
│   │   ├── user-client/      # Generated from OpenAPI
│   │   │   ├── index.ts
│   │   │   └── types.ts
│   │   └── order-client/
│   │       └── ...
│   │ 
│   └── config/               # Shared configuration utilities
│       └── logger.util.ts    # Shared logger, metrics, etc.
│
├── infra/                    # Infrastructure & DevOps
│   ├── docker/               # Docker configs for external services
│   │   ├── mosquitto/
│   │   │   ├── mosquitto.conf
│   │   │   └── data/
│   │   ├── postgres/
│   │   │   └── init.sql
│   │   └── redis/
│   │       └── redis.conf
│   │
│   ├── scripts/              # DevOps automation
│   │   ├── generate-clients.ts   # Generate API clients from OpenAPI
│   │   ├── sync-types.sh         # Sync shared types across services
│   │   ├── deploy-qa.sh          # Deploy QA
│   │   ├── deploy-prod.sh        # Deploy PROD
│   │   └── migrate-db.sh         # Run TypeORM migrations
│   │
│   ├── cron/                   # Scheduled tasks
│   │   ├── cleanup-cache.sh
│   │   └── backup-db.sh
│   │
│   └── docs/                   # Architecture & contracts
│       ├── architecture.md
│       ├── mqtt-topics.md      # List of MQTT topics & message formats
│       └── data-flow.png
│
├── .github/
│   └── workflows/
│       ├── ci.yml                  # Lint, test all apps & services
│       ├── cd-frontend-qa.yml      # Deploy frontend to QA
│       ├── cd-frontend-prod.yml    # Deploy frontend to PROD
│       ├── cd-service.yml          # Build & deploy service (on merge to main)
│       ├── publish-contracts.yml   # Update OpenAPI & shared types
│       └── release.yml             # Versioning, changelog
│
├── docker-compose.yml          # Main compose: frontend + services + DBs + MQTT
├── docker-compose.dev.yml      # Override: hot-reload, dev mode
├── docker-compose.prod.yml     # Override: build, production settings
│
├── turbo.json                  # Turborepo: define build/test/deploy pipelines
├── package.json                # Root: workspaces, scripts
├── tsconfig.base.json          # Base TS config for all projects
├── .env                        # Environment (not in git)
├── .env.example                # Template
├── .gitignore
├── README.md                   # Setup, run, deploy guide
└── Makefile                    # Optional: make dev, make build, make test