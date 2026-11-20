#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

BACKUP_DIR="$HOME/backups"
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

BACKUP_FILE="$BACKUP_DIR/job-tracker-$(date +%Y%m%d-%H%M%S).dump"

docker compose \
  -f compose.yaml \
  -f compose.prod.yaml \
  exec -T postgres \
  pg_dump -U postgres -d job_tracker -Fc \
  > "$BACKUP_FILE"

docker compose \
  -f compose.yaml \
  -f compose.prod.yaml \
  exec -T postgres \
  pg_restore --list < "$BACKUP_FILE" > /dev/null

chmod 600 "$BACKUP_FILE"

echo "PostgreSQL backup created: $BACKUP_FILE"
