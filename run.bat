@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"

where docker >nul 2>&1
if errorlevel 1 (
  echo Missing required command: docker
  exit /b 1
)

if exist .env (
  echo Using existing .env
) else (
  if exist .env.example (
    echo Creating .env from .env.example
    copy .env.example .env >nul
  ) else (
    echo Missing .env and .env.example
    exit /b 1
  )
)

docker compose version >nul 2>&1
if errorlevel 1 (
  where docker-compose >nul 2>&1
  if errorlevel 1 (
    echo Docker Compose not found
    exit /b 1
  ) else (
    set COMPOSE_CMD=docker-compose
  )
) else (
  set COMPOSE_CMD=docker compose
)

echo Starting services with %COMPOSE_CMD%
%COMPOSE_CMD% up -d --build

%COMPOSE_CMD% ps

echo Services are starting. Use "docker compose logs -f" to follow logs.
