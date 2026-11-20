#!/bin/bash
set -euo pipefail

# Install system dependencies
dnf install -y docker git curl

# Enable and start Docker
systemctl enable --now docker

# Install Docker CLI plugins
PLUGIN_DIR="/usr/local/lib/docker/cli-plugins"
mkdir -p "$PLUGIN_DIR"

ARCH="$(uname -m)"

case "$ARCH" in
  x86_64)
    COMPOSE_ARCH="x86_64"
    BUILDX_ARCH="amd64"
    ;;
  aarch64)
    COMPOSE_ARCH="aarch64"
    BUILDX_ARCH="arm64"
    ;;
  *)
    echo "Unsupported architecture: $ARCH"
    exit 1
    ;;
esac

# Install Docker Compose
COMPOSE_VERSION="v2.40.3"

curl -fSL \
  "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-linux-${COMPOSE_ARCH}" \
  -o "${PLUGIN_DIR}/docker-compose"

chmod +x "${PLUGIN_DIR}/docker-compose"

# Install Docker Buildx
BUILDX_VERSION="v0.38.1"

curl -fSL \
  "https://github.com/docker/buildx/releases/download/${BUILDX_VERSION}/buildx-${BUILDX_VERSION}.linux-${BUILDX_ARCH}" \
  -o "${PLUGIN_DIR}/docker-buildx"

chmod +x "${PLUGIN_DIR}/docker-buildx"

# Verify installation
docker --version
docker compose version
docker buildx version

echo "Job Tracker EC2 bootstrap completed successfully"
