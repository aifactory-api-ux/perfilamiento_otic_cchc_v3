#!/usr/bin/env sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

check_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

ensure_env() {
  if [ ! -f .env ]; then
    if [ -f .env.example ]; then
      echo "Creating .env from .env.example"
      cp .env.example .env
    else
      echo "Missing .env and .env.example" >&2
      exit 1
    fi
  fi
}

check_command docker

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  echo "Docker Compose not found" >&2
  exit 1
fi

ensure_env

echo "Starting services with $COMPOSE_CMD"
$COMPOSE_CMD up -d --build

$COMPOSE_CMD ps

echo "Services are starting. Use 'docker compose logs -f' to follow logs."
