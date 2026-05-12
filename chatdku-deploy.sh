#!/usr/bin/env bash
# Non-interactive deploy script for systemd.
# Builds and deploys the frontend only if /var/www/chatdku is missing or empty.
set -euo pipefail

APP_DIR="/var/www/chatdku"
SRC_DIR="/home/anar/Developer/ChatDKU-web"
BUILD_DIR="out"

# Exit early if deployment already exists and is non-empty
if [ -d "$APP_DIR" ] && [ "$(ls -A "$APP_DIR" 2>/dev/null)" ]; then
  echo "Deployment exists at ${APP_DIR}, nothing to do."
  exit 0
fi

echo "Deployment missing or empty at ${APP_DIR}. Rebuilding..."

cd "$SRC_DIR"

# To ensure dependencies are installed
npm ci --prefer-offline

npm run build:static

# Deploy
sudo mkdir -p "$APP_DIR"
sudo rsync -a --delete "${BUILD_DIR}/" "${APP_DIR}/"

echo "Deploy complete."
