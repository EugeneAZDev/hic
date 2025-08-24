#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../config/server.conf"

# Before run this script, go to the DNS server and turn off the Proxy
# [Check](../scripts/config/server.conf) file to see APP_ENV consistant with the DNS server
# The script should be run only once, the first time
# SSL_ENABLED=false in .env.prod file

SCRIPT_NAME=$(basename "$0")
echo "Script '$SCRIPT_NAME' is running"

# Ensure we're in the project directory
cd "$PROJECT_PATH"

echo "Building project for ${APP_ENV} environment..."

# Run the existing build script which handles environment loading and building
"$SCRIPT_DIR/../dev/build.sh"

if [ $? -eq 0 ]; then
    echo "✓ Build completed successfully for ${APP_ENV} environment"
    echo "Build artifacts are ready for deployment"
else
    echo "❌ Build failed! Please check the build output above"
    exit 1
fi

echo "Uploading project files"

# Create necessary directories on the server before copying files
echo "Creating directories on the server..."

CREATE_DIRS=$(cat <<EOF
mkdir -p $SERVER_PROJECT_PATH/infra
mkdir -p $SERVER_PROJECT_PATH/services
mkdir -p $SERVER_PROJECT_PATH/services/backend
mkdir -p $SERVER_PROJECT_PATH/apps
mkdir -p $SERVER_PROJECT_PATH/apps/frontend
EOF
)
if ssh root@"$IP" "$CREATE_DIRS" 2>&1; then
    echo "✓ Directories created successfully on the server"
else
    echo "❌ Failed to create directories on the server"
    exit 1
fi

# Copy files - only copy files that exist
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH"/.env* "$SERVER_PROJECT_PATH/" 2>/dev/null || echo "No .env* files found, skipping..."
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH"/docker-compose* "$SERVER_PROJECT_PATH"
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH/pnpm-lock.yaml" "$SERVER_PROJECT_PATH"
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH/pnpm-workspace.yaml" "$SERVER_PROJECT_PATH"
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH/packages" "$SERVER_PROJECT_PATH"
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH/services/backend/dist" "$SERVER_PROJECT_PATH/services/backend"
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH/services/backend/package.json" "$SERVER_PROJECT_PATH/services/backend"
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH/services/backend/Dockerfile" "$SERVER_PROJECT_PATH/services/backend"
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH/apps/frontend/.next" "$SERVER_PROJECT_PATH/apps/frontend"
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH/apps/frontend/package.json" "$SERVER_PROJECT_PATH/apps/frontend"
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH/apps/frontend/public" "$SERVER_PROJECT_PATH/apps/frontend"
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH/apps/frontend/Dockerfile" "$SERVER_PROJECT_PATH/apps/frontend"
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH/infra/db" "$SERVER_PROJECT_PATH/infra"
rsync -avz --progress --mkpath --rsync-path="sudo rsync" "$PROJECT_PATH/nginx" "$SERVER_PROJECT_PATH"

if [ $? -eq 0 ]; then
  echo "Uploading project files to the server completed successfully!"
  echo "Uploading project files: Done"
else
  error "Error during uploading!"
  exit 1
fi

BUILD_RUN_STOP_NGINX_CONTAINER=$(cat <<EOF
cd /opt/hic/
docker compose --env-file .env.prod build --no-cache nginx
docker compose --env-file .env.prod up -d nginx
docker compose --env-file .env.prod stop nginx
EOF
)
RUN_FRONTEND_BACKEND_CONTAINER=$(cat <<EOF
cd /opt/hic/
docker compose --env-file .env.prod build frontend
docker compose --env-file .env.prod build backend
docker compose --env-file .env.prod up -d
EOF
)
RUN_CERTBOT_CONTAINER=$(cat <<EOF
cd /opt/hic/
docker compose -f docker-compose.yaml -f docker-compose.extra.yaml --env-file .env.prod build --no-cache certbot
docker compose -f docker-compose.yaml -f docker-compose.extra.yaml --env-file .env.prod up -d certbot
EOF
)
# Warning! At the moment DOMAIN and certbot container filled manualy, just to save time, not critical
GET_FIRST_CERT=$(cat <<EOF
cd /opt/hic/

docker compose -f docker-compose.yaml -f docker-compose.extra.yaml --env-file .env.prod run --rm \
    --entrypoint certbot \
    -p 80:80 \
    certbot certonly \
    --standalone \
    -d hic.gtechdev.top \
    --agree-tos --no-eff-email --non-interactive

echo "Check log files"
docker compose -f docker-compose.yaml -f docker-compose.extra.yaml --env-file .env.prod logs certbot
echo "Check log files: Done"

echo "Check extended logs"
docker exec hic-certbot-1 cat /var/log/letsencrypt/letsencrypt.log
echo "Check extended logs: Done"

EOF
)
ssh root@"$IP" "$BUILD_RUN_STOP_NGINX_CONTAINER" 2>&1
ssh root@"$IP" "$RUN_FRONTEND_BACKEND_CONTAINER" 2>&1
ssh root@"$IP" "$RUN_CERTBOT_CONTAINER" 2>&1
ssh root@"$IP" "$GET_FIRST_CERT" 2>&1
