# Removed code or settings of the project
- turbo.json
```
  "globalDependencies": [
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/build/**"
  ],
```

# Build qa script
## My script

```
# Outdated: part when we don't use docker-compose.yaml
docker build \
  -f apps/frontend/Dockerfile \
  -t ${PROJECT_NAME}-frontend:qa \
  .
docker build \
  -f services/backend/Dockerfile \
  -t ${PROJECT_NAME}-backend:qa \
  .
echo "Builds are ready: ${PROJECT_NAME}-frontend:qa, ${PROJECT_NAME}-backend:qa"
docker images | grep $PROJECT_NAME
docker rm -f "${PROJECT_NAME}-frontend-qa"
docker rm -f "${PROJECT_NAME}-backend-qa"
# Run containers
docker run -d \
  --name "${PROJECT_NAME}-backend-qa" \
  -p 3001:3001 \
  ${PROJECT_NAME}-backend:qa

docker run -d \
  --name "${PROJECT_NAME}-frontend-qa" \
  -p 3000:3000 \
  ${PROJECT_NAME}-frontend:qa
```
## Second one
```
# Build frontend locally first
echo "Building frontend..."
cd apps/frontend
pnpm install
pnpm run build
cd ../..

# Build backend locally first
echo "Building backend..."
cd services/backend
pnpm install
pnpm run build
cd ../..
```
