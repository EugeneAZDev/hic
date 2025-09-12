#!/usr/bin/env bash

# Script to create a text dump of the project with all files content
# Excludes the same directories and files as backup-project.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
cd "$PROJECT_ROOT"

# Create date string in DD.MM.YYYY format
DATE=$(date +"%d.%m.%Y")
DUMP_FILE="/home/eulw/pCloudDrive/Sync/hic-trash/dumps/project-dump-$DATE.txt" # "$SCRIPT_DIR/project-dump-$DATE.txt"

echo "Creating project dump..."
echo "Project root: $PROJECT_ROOT"
echo "Dump file: $DUMP_FILE"

# Clear the dump file if it exists
> "$DUMP_FILE"

# Function to check if a file should be excluded
should_exclude() {
    local file_path="$1"
    
    # Convert to relative path from project root
    local rel_path="${file_path#$PROJECT_ROOT/}"
    
    # Check specific exclusions
    case "$rel_path" in
        apps/auth-service/node_modules/*) return 0 ;;
        apps/auth-service/.next/*) return 0 ;;
        apps/auth-service/.turbo/*) return 0 ;;
        apps/backend/node_modules/*) return 0 ;;
        apps/backend/dist/*) return 0 ;;
        apps/backend/.turbo/*) return 0 ;;
        apps/bff/node_modules/*) return 0 ;;
        apps/bff/dist/*) return 0 ;;
        apps/bff/.turbo/*) return 0 ;;
        apps/frontend/node_modules/*) return 0 ;;
        apps/frontend/.next/*) return 0 ;;
        apps/frontend/.turbo/*) return 0 ;;
        apps/worker-service/node_modules/*) return 0 ;;
        apps/worker-service/.next/*) return 0 ;;
        apps/worker-service/.turbo/*) return 0 ;;
        packages/prisma/auth/node_modules/*) return 0 ;;
        packages/prisma/main/node_modules/*) return 0 ;;
        packages/prisma/generated/*) return 0 ;;
        packages/shared/dto/node_modules/*) return 0 ;;
        packages/shared/dto/dist/*) return 0 ;;
        packages/shared/dto/.turbo/*) return 0 ;;
        packages/shared/schemas/.turbo/*) return 0 ;;
        packages/shared/schemas/node_modules/*) return 0 ;;
        packages/shared/schemas/dist/*) return 0 ;;
        packages/shared/security/node_modules/*) return 0 ;;
        packages/shared/security/dist/*) return 0 ;;
        packages/shared/security/.turbo/*) return 0 ;;
        node_modules/*) return 0 ;;
        .turbo/*) return 0 ;;
        pnpm-lock.yaml) return 0 ;;
        package-lock.json) return 0 ;;
        yarn.lock) return 0 ;;
        npm-shrinkwrap.json) return 0 ;;
        .env) return 0 ;;
        .env.local) return 0 ;;
        .env.development) return 0 ;;
        .env.production) return 0 ;;
        .env.test) return 0 ;;
        .env-files/*) return 0 ;;
        .idea/*) return 0 ;;
        .vscode/*) return 0 ;;
        .cursor/*) return 0 ;;
        .cursorrules) return 0 ;;
        .vercel/*) return 0 ;;
        scripts/config/*.conf) return 0 ;;
        PROMPTS.md) return 0 ;;
    esac
    
    # Check pattern-based exclusions
    case "$rel_path" in
        */tsconfig.tsbuildinfo) return 0 ;;
        */coverage/*) return 0 ;;
        */.DS_Store) return 0 ;;
        */Thumbs.db) return 0 ;;
        */*.log) return 0 ;;
        */dist/*) return 0 ;;
        */build/*) return 0 ;;
        */out/*) return 0 ;;
        */.next/*) return 0 ;;
        */.nuxt/*) return 0 ;;
        */tmp/*) return 0 ;;
        */temp/*) return 0 ;;
        */.turbo/*) return 0 ;;
        */node_modules/*) return 0 ;;
        */npm-debug.log*) return 0 ;;
        */yarn-debug.log*) return 0 ;;
        */pnpm-debug.log*) return 0 ;;
        */*.so.node) return 0 ;;
        */.idea/*) return 0 ;;
        */.vscode/*) return 0 ;;
        */.cursor/*) return 0 ;;
        */.vercel/*) return 0 ;;
    esac
    
    return 1
}

# Function to process a file
process_file() {
    local file_path="$1"
    local rel_path="${file_path#$PROJECT_ROOT/}"
    
    if should_exclude "$file_path"; then
        return 0
    fi
    
    # Skip if it's a directory
    if [ -d "$file_path" ]; then
        return 0
    fi
    
    # Skip if it's not a regular file
    if [ ! -f "$file_path" ]; then
        return 0
    fi
    
    echo "Processing: $rel_path"
    
    # Add filename to dump
    echo "$rel_path" >> "$DUMP_FILE"
    echo "=================================================================================================" >> "$DUMP_FILE"
    
    # Add file content to dump
    cat "$file_path" >> "$DUMP_FILE"
    
    # Add separator
    echo "" >> "$DUMP_FILE"
    echo "=================================================================================================" >> "$DUMP_FILE"
    echo "" >> "$DUMP_FILE"
}

# Find all files in the project and process them
echo "Scanning project files..."

# Use find to get all files, then process each one
find "$PROJECT_ROOT" -type f | while read -r file; do
    process_file "$file"
done

echo "Project dump completed successfully!"
echo "Dump file: $DUMP_FILE"
echo "File size: $(du -h "$DUMP_FILE" | cut -f1)"
