# Infrastructure

## Database, first run
put according values below:
echo "localhost:DB_PORT:DB_NAME:DB_USER:DB_PASSWORD" > ~/.pgpass
chmod 600 ~/.pgpass

## Local environment
Database - :5435/
Frontend - http://localhost:5001/
Backend - http://localhost:7001/

## Backend
### Initial
  - `node -v`
  - `pnpm -v || sudo npm install -g pnpm` - required for Turborepo
### Useful
  - `pnpm turbo clean` - clear cache
  - `pnpm run build --filter=@hic/backend`
  - In root folder `pnpm add -D turbo`
  - Dev mode `pnpm dev --filter=@hic/backend` in root folder or `pnpm dev` from backend folder
  - Backend folder
    - `pnpm add "@nestjs/common@^11.0.0" "@nestjs/core@^11.0.0" "@nestjs/platform-fastify@^11.0.0"`
    - `pnpm add -D @types/jest`
    - `pnpm add -D @nestjs/testing`
    - `pnpm add -D jest @types/jest ts-jest`
### Loading CPU on PC etc.
`lsof -i :3000` then `pkill -f node`
and check if still an active
`ps aux | grep -i "nest\|turbo\|node"`
## Shared types
  - `pnpm -r --filter="*" exec pwd` check what we have
  - `pnpm add @shared/types --filter ./apps/frontend` - add shared to frontend