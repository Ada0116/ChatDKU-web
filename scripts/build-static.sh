#!/usr/bin/env bash
# Builds the Next.js app as a static export for deployment.
# API routes are dev-only proxies/mocks and must be excluded from the static
# export — in production, nginx routes /api/* directly to the backend.
set -euo pipefail

API_DIR="app/api"
BACKUP_DIR="app/__api_dev_backup__"

# Clean up any stale backup dir from a previous failed build
rm -rf "$BACKUP_DIR"

cleanup() {
  if [ -d "$BACKUP_DIR" ]; then
    rm -rf "$API_DIR" 2>/dev/null || true
    mv "$BACKUP_DIR" "$API_DIR"
  fi
}
trap cleanup EXIT

mv "$API_DIR" "$BACKUP_DIR"
NEXT_STATIC_EXPORT=1 npx next build
