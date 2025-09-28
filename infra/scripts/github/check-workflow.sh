#!/bin/bash
# Before run `docker pull node:18-alpine`
set -e

# Record start time
START_TIME=$(date +%s)
START_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create logs directory if it doesn't exist
mkdir -p logs/github

# Generate timestamp for log file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="logs/github/check-workflow_${TIMESTAMP}.log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to log command output
log_cmd() {
    log "Running: $1"
    eval "$1" 2>&1 | while IFS= read -r line; do
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] $line" | tee -a "$LOG_FILE"
    done
    return ${PIPESTATUS[0]}
}

# Function to calculate and log execution time
log_execution_time() {
    END_TIME=$(date +%s)
    EXECUTION_TIME=$((END_TIME - START_TIME))
    
    # Convert seconds to human readable format
    HOURS=$((EXECUTION_TIME / 3600))
    MINUTES=$(((EXECUTION_TIME % 3600) / 60))
    SECONDS=$((EXECUTION_TIME % 60))
    
    if [ $HOURS -gt 0 ]; then
        TIME_STR="${HOURS}h ${MINUTES}m ${SECONDS}s"
    elif [ $MINUTES -gt 0 ]; then
        TIME_STR="${MINUTES}m ${SECONDS}s"
    else
        TIME_STR="${SECONDS}s"
    fi
    
    log "Script execution completed in ${TIME_STR}"
    log "Start time: $(date -d @$START_TIME '+%Y-%m-%d %H:%M:%S')"
    log "End time: $(date -d @$END_TIME '+%Y-%m-%d %H:%M:%S')"
}

log "Testing GitHub Actions workflows locally..."
log "Log file: $LOG_FILE"

# Check YAML syntax for both workflow files
# Install yamllint: `sudo pacman -S yamllint` (Manjaro/Arch) or `yay -S yamllint` (AUR)
# For faster testing, you can skip this step with: `./check-workflow.sh --skip-act`

log "Checking YAML syntax..."
if command -v yamllint &> /dev/null; then
    log_cmd "yamllint .github/workflows/staging.yml"
    log_cmd "yamllint infra/scripts/github/workflows/local-staging.yml"
else
    log "yamllint not available, skipping YAML syntax check"
    # Basic YAML validation with Python
    log_cmd "python3 -c \"import yaml; yaml.safe_load(open('.github/workflows/staging.yml')); print('staging.yml syntax OK')\""
    log_cmd "python3 -c \"import yaml; yaml.safe_load(open('infra/scripts/github/workflows/local-staging.yml')); print('local-staging.yml syntax OK')\""
fi

# Check Docker Compose configuration
log "Checking Docker Compose configuration..."
# Use existing .env.staging file for testing
if [ -f ".env-files/.env.staging" ]; then
  log "Using .env-files/.env.staging for Docker Compose validation"
  log_cmd "docker compose -f infra/docker-compose/base.yaml -f infra/docker-compose/staging.yaml -f infra/docker-compose/nginx.yaml --env-file .env-files/.env.staging --profile staging config"
else
  log "Warning: .env-files/.env.staging not found, skipping Docker Compose validation"
fi

# Check Prisma schemas
log "Checking Prisma schemas..."
# Load environment variables from .env.staging and build DATABASE_URL
if [ -f ".env-files/.env.staging" ]; then
  log "Loading environment variables from .env-files/.env.staging"
  # Source the .env file to load variables
  set -a  # automatically export all variables
  source .env-files/.env.staging
  set +a  # stop automatically exporting
  
  # Build DATABASE_URL from loaded variables
  export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5435/${DB_NAME}"
  export DATABASE_URL_AUTH="postgresql://${AUTH_DB_USER}:${AUTH_DB_PASSWORD}@localhost:5437/${AUTH_DB_NAME}"
  
  log "Using DATABASE_URL: postgresql://${DB_USER}:***@localhost:5435/${DB_NAME}"
  log "Using DATABASE_URL_AUTH: postgresql://${AUTH_DB_USER}:***@localhost:5437/${AUTH_DB_NAME}"
else
  log "Warning: .env-files/.env.staging not found, using default values"
  export DATABASE_URL="postgresql://hic_user:staging_db_password@localhost:5435/hic_staging"
  export DATABASE_URL_AUTH="postgresql://hic_auth_user:staging_auth_db_password@localhost:5437/hic_auth_staging"
fi

log_cmd "pnpm --filter ./packages/prisma/main prisma validate"
log_cmd "pnpm --filter ./packages/prisma/auth prisma validate"

# Check Docker Bake configuration
log "Checking Docker Bake configuration..."
log_cmd "docker buildx bake --print"

# Test with act (if available)
if command -v act &> /dev/null; then
  log "Testing workflow with act..."
  
  if [[ "$1" != "--skip-act" ]]; then
    # Create pnpm cache volume if it doesn't exist
    log "Creating pnpm cache volume if it doesn't exist..."
    docker volume create pnpm-cache 2>/dev/null || true
    
    log "Using pnpm cache volume for faster builds..."
    log_cmd "act --workflows infra/scripts/github/workflows/ -j build-push --artifact-server-path /tmp/artifacts -v pnpm-cache:/tmp/.pnpm --bind"
  else
    log "Skipping act test as requested"
  fi
else
  log "act not available, skipping workflow test"
fi

log "All checks passed!"
log "Log saved to: $LOG_FILE"
log_execution_time
