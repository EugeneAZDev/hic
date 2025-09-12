#!/usr/bin/env bash
set -euo pipefail

# Single server setup for staging
TOKEN="${RUNNER_CFG_PAT:?RUNNER_CFG_PAT unset}"
OWNER="eugeneazdev"
REPO="hic"
RUNNER_NAME="${RUNNER_NAME:-hic-runner}"
WORK_DIR="/opt/actions-runner"
LABELS="${RUNNER_LABELS:-self-hosted,linux,x64,staging}"
RUNNER_VERSION="2.320.0"

[[ $EUID -eq 0 ]] && { echo "Do NOT run as root"; exit 1; }

echo "Setting up runner for staging..."

# Check if runner already exists
if [[ -d "$WORK_DIR" && -f "$WORK_DIR/config.sh" ]]; then
    echo "Runner already exists. Removing old installation..."
    sudo systemctl stop actions.runner.${OWNER}-${REPO}.${RUNNER_NAME}.service 2>/dev/null || true
    sudo systemctl disable actions.runner.${OWNER}-${REPO}.${RUNNER_NAME}.service 2>/dev/null || true
    sudo rm -rf "$WORK_DIR"
fi

echo "Getting registration token..."
RESP=$(curl -s -X POST \
  "https://api.github.com/repos/${OWNER}/${REPO}/actions/runners/registration-token" \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: token ${TOKEN}")

REG_TOKEN=$(echo "$RESP" | jq -r '.token')
[[ $REG_TOKEN == null || -z $REG_TOKEN ]] && { echo "Bad token response: $RESP"; exit 1; }

mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

echo "Downloading actions-runner ${RUNNER_VERSION}..."
curl -L -o runner.tar.gz \
  "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"
tar xzf runner.tar.gz
rm runner.tar.gz

echo "Configuring runner..."
./config.sh --unattended \
  --url "https://github.com/${OWNER}/${REPO}" \
  --token "$REG_TOKEN" \
  --name "$RUNNER_NAME" \
  --labels "$LABELS" \
  --work "_work"

echo "Installing systemd service..."
sudo ./svc.sh install
sudo ./svc.sh start

sleep 3
systemctl is-active --quiet actions.runner.${OWNER}-${REPO}.${RUNNER_NAME}.service \
  && echo "Runner installed and active." \
  || { journalctl -u actions.runner.${OWNER}-${REPO}.${RUNNER_NAME}.service -n 50; exit 1; }

echo ""
echo "Runner setup complete!"
echo "This runner can handle staging deployments."
echo ""
echo "Port mapping for staging setup:"
echo "  Staging:"
echo "    Frontend:  http://localhost:3001"
echo "    BFF:       http://localhost:3015"
echo "    Backend:   http://localhost:3013"
echo "    Auth:      http://localhost:3014"
echo "    Worker:    http://localhost:5001"
echo ""
echo "To deploy:"
echo "  Staging:  docker compose -f infra/docker-compose/base.yaml -f infra/docker-compose/staging.yaml -f infra/docker-compose/nginx.yaml up -d"