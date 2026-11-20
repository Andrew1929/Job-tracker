#!/usr/bin/env bash
set -Eeuo pipefail

# Deployment must use an exact Git commit SHA.
IMAGE_TAG="${1:-}"

if [[ ! "$IMAGE_TAG" =~ ^[a-f0-9]{40}$ ]]; then
  echo "ERROR: Provide a full 40-character Git SHA"
  exit 1
fi

# Preserve the existing Docker Compose project.
export COMPOSE_PROJECT_NAME="docker"
export IMAGE_TAG

cd "$(dirname "$0")"

COMPOSE=(
  docker compose
  -p docker
  -f compose.yaml
  -f compose.prod.yaml
  -f compose.deploy.yaml
)

echo "Deploying Job Tracker version: $IMAGE_TAG"

# 1. Validate required configuration
test -s .env
test -f Caddyfile

"${COMPOSE[@]}" config --quiet

# 2. Protect existing database volumes.
# Never silently create a new empty database.
docker volume inspect docker_postgres_data >/dev/null
docker volume inspect docker_redis_data >/dev/null

# 3. Start PostgreSQL and Redis if necessary
"${COMPOSE[@]}" up -d --wait --no-build postgres redis

# 4. Download pre-built images
"${COMPOSE[@]}" pull backend frontend

# 5. Backup PostgreSQL before migrations
bash ./backup-postgres.sh

# 6. Apply Prisma migrations
"${COMPOSE[@]}" run --rm --no-deps migrate

# 7. Update application containers
"${COMPOSE[@]}" up -d --no-build --no-deps \
  backend frontend proxy

# 8. Verify application availability
echo "Checking application..."

READY=false

for attempt in {1..20}; do
  FRONTEND_OK=false
  BACKEND_OK=false

  if curl -fsS http://127.0.0.1:3000/ -o /dev/null; then
    FRONTEND_OK=true
  fi

  STATUS="$(curl -s -o /dev/null -w '%{http_code}' \
    http://127.0.0.1:3001/api/jobs || true)"

  if [[ "$STATUS" == "401" ]]; then
    BACKEND_OK=true
  fi

  if $FRONTEND_OK && $BACKEND_OK; then
    READY=true
    break
  fi

  sleep 3
done

if [[ "$READY" != "true" ]]; then
  echo "ERROR: Application health check failed"
  exit 1
fi

echo "Job Tracker deployment successful!"
echo "Version: $IMAGE_TAG"
