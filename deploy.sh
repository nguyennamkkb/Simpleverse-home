#!/bin/bash
set -e

APP_DIR="/home/namnl/Documents/app/Simpleverse-home"
COMPOSE_FILE="$APP_DIR/docker-compose.yml"

echo "=== Deploy Simpleverse-home ==="

# 1. Pull code mới nhất
echo "[1/3] Pulling latest code..."
cd "$APP_DIR"
git pull

# 2. Down container cũ
echo "[2/3] Stopping old container..."
docker compose -f "$COMPOSE_FILE" down

# 3. Build và khởi chạy bản mới
echo "[3/3] Building and starting new version..."
docker compose -f "$COMPOSE_FILE" up -d --build

echo "=== Deploy completed! ===" 
docker ps | grep simpleverse
