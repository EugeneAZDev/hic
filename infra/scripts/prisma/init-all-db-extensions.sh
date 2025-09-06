#!/usr/bin/env bash
set -e

echo "Installing PostgreSQL extensions in all databases..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$PROJECT_ROOT"
source "$PROJECT_ROOT/infra/config/networking.conf"
echo "APP_MODE: $APP_MODE"

# Load environment variables
set -a
source "$PROJECT_ROOT/.env-files/.env.${APP_MODE}"
set +a

# Function to install extensions in a database
install_extensions() {
    local container_name=$1
    local db_name=$2
    local user=$3
    
    echo "Installing extensions in ${db_name} database..."
    docker exec -i "${container_name}" psql -U "${user}" -d "${db_name}" << EOF
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOF
    echo "✓ Extensions installed in ${db_name}"
}

# Function to create and setup shadow database
setup_shadow_db() {
    local container_name=$1
    local db_name=$2
    local shadow_db_name=$3
    local user=$4
    
    echo "Setting up shadow database ${shadow_db_name}..."
    
    # Create shadow database if it doesn't exist
    docker exec -i "${container_name}" psql -U "${user}" -d postgres << EOF
SELECT 'CREATE DATABASE ${shadow_db_name}' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${shadow_db_name}')\gexec
EOF
    
    # Install extensions in shadow database
    docker exec -i "${container_name}" psql -U "${user}" -d "${shadow_db_name}" << EOF
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOF
    echo "✓ Shadow database ${shadow_db_name} configured"
}

# Install extensions in main databases
install_extensions "hic-auth-db" "hic_auth" "admin"
install_extensions "hic-db" "hic" "hic_user"

# Setup shadow databases
setup_shadow_db "hic-auth-db" "hic_auth" "hic_auth_shadow" "admin"
setup_shadow_db "hic-db" "hic" "hic_shadow" "hic_user"

echo ""
echo "🎉 All database extensions installed successfully!"
