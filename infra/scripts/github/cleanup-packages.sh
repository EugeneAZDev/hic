#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# GitHub Container Registry cleanup (USER packages)
# Usage: ./cleanup-packages.sh [dry-run]
# Required scopes: read:packages, delete:packages
###############################################################################
DRY_RUN=${1:-false}
OWNER="EugeneAZDev"            # user / organization where images are stored
PREFIX="hic"                   # package name prefix (hic/frontend, hic/backend …)
PR_KEEP_DAYS=7                 # how many days to keep PR images
STAGING_KEEP_LAST=10           # how many latest staging versions to keep
MAIN_KEEP_LAST=20              # how many latest main/latest versions to keep

echo "=== GitHub Container Registry Cleanup ==="
echo "Owner      : $OWNER"
echo "Prefix     : $PREFIX"
echo "Dry run    : $DRY_RUN"
echo ""

# 1. Check authentication and scopes
if ! gh auth status >/dev/null 2>&1; then
    echo "GitHub CLI not authenticated. Run: gh auth login"
    exit 1
fi
SCOPES=$(gh auth status -t 2>&1 | grep -oE '\b(delete:packages|read:packages)\b' || true)
if ! grep -q "delete:packages" <<< "$SCOPES"; then
    echo "Token does not contain delete:packages scope"
    echo "   Update: gh auth refresh -h github.com -s delete:packages,read:packages,write:packages"
    exit 1
fi

# 2. Get list of all container packages for the user
mapfile -t PACKAGES < <(gh api "user/packages?package_type=container" --paginate \
  -q ".[] | select(.name | startswith(\"${PREFIX}/\")) | .name" 2>/dev/null || true)

if [ ${#PACKAGES[@]} -eq 0 ]; then
    echo "No packages found with prefix ${PREFIX}/"
    exit 0
fi
echo "Found packages: ${#PACKAGES[@]}"
printf ' - %s\n' "${PACKAGES[@]}"
echo ""

# 3. Helper functions
# delete one version
delete_version() {
    local pkg=$1 id=$2
    if $DRY_RUN; then
        echo "   [DRY-RUN] delete version $id from $pkg"
    else
        gh api -X DELETE "user/packages/container/${pkg}/versions/${id}" >/dev/null \
          && echo "   deleted version $id" \
          || echo "   failed to delete $id"
    fi
}
# keep N latest versions
keep_last_versions() {
    local pkg=$1 keep=$2
    echo "  $pkg (keeping latest $keep)"
    mapfile -t VERSIONS < <(gh api "user/packages/container/${pkg}/versions?per_page=100" \
      -q 'sort_by(.created_at) | reverse | .['"$keep"':] | .[].id' 2>/dev/null || true)
    for vid in "${VERSIONS[@]}"; do
        delete_version "$pkg" "$vid"
    done
}
# delete older than X days
delete_older_than() {
    local pkg=$1 days=$2
    echo "  $pkg (deleting older than $days days)"
    local cut_ts=$(date -d "$days days ago" +%s)
    mapfile -t VERSIONS < <(gh api "user/packages/container/${pkg}/versions?per_page=100" \
      -q '.[] | select(.created_at) | select((.created_at | strptime("%Y-%m-%dT%H:%M:%SZ") | mktime) < '"$cut_ts"') | .id' 2>/dev/null || true)
    for vid in "${VERSIONS[@]}"; do
        delete_version "$pkg" "$vid"
    done
}

# 4. Process each package and apply cleanup policy
for pkg in "${PACKAGES[@]}"; do
    case "$pkg" in
        */pr-*|*pr-[0-9]*)
            delete_older_than "$pkg" 7 ;;
        */staging|*staging-*)
            keep_last_versions "$pkg" 10 ;;
        *)  
            # everything else (including 0.0.1-sha-XXXX) we consider "main"
            keep_last_versions "$pkg" 20 ;;
    esac
done

echo ""
echo "Done."

echo ""
echo "USAGE:"
echo "Set scopes once:"
echo "gh auth refresh -h github.com -s delete:packages,read:packages,write:packages"
echo ""
echo "Dry run:"
echo "./cleanup-packages.sh true"
echo ""
echo "Real cleanup:"
echo "./cleanup-packages.sh"