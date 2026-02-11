"""Utility for generating local configuration files.

This script is intended for developers to bootstrap non-business
configuration files such as .env or docker-compose overrides.
"""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Iterable

PROJECT_ROOT = Path(__file__).resolve().parents[1]

ENV_TEMPLATE = """# Backend
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=perfilamiento
DB_SSL=false
DB_SYNC=false

KEYCLOAK_URL=http://localhost:8081
KEYCLOAK_REALM=perfilamiento
KEYCLOAK_CLIENT_ID=perfilamiento-app
KEYCLOAK_CLIENT_SECRET=change_me
KEYCLOAK_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----
YOUR_PUBLIC_KEY_HERE
-----END PUBLIC KEY-----

# Frontend
VITE_API_BASE_URL=http://localhost:3000/api
VITE_KEYCLOAK_URL=http://localhost:8081
VITE_KEYCLOAK_REALM=perfilamiento
VITE_KEYCLOAK_CLIENT_ID=perfilamiento-app

# Keycloak
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin
KC_DB=postgres
KC_DB_URL=jdbc:postgresql://localhost:5432/keycloak
KC_DB_USERNAME=postgres
KC_DB_PASSWORD=postgres
KC_HTTP_ENABLED=true
KC_HOSTNAME_STRICT=false

# Postgres
POSTGRES_DB=perfilamiento
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
"""

COMPOSE_OVERRIDE_TEMPLATE = """version: '3.9'

services:
  backend:
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      DB_NAME: perfilamiento
      DB_SSL: 'false'
      DB_SYNC: 'false'
      KEYCLOAK_URL: http://keycloak:8080
      KEYCLOAK_REALM: perfilamiento
      KEYCLOAK_CLIENT_ID: perfilamiento-app
      KEYCLOAK_CLIENT_SECRET: change_me
      KEYCLOAK_PUBLIC_KEY: |-
        -----BEGIN PUBLIC KEY-----
        YOUR_PUBLIC_KEY_HERE
        -----END PUBLIC KEY-----
  frontend:
    environment:
      VITE_API_BASE_URL: http://localhost:3000/api
      VITE_KEYCLOAK_URL: http://localhost:8081
      VITE_KEYCLOAK_REALM: perfilamiento
      VITE_KEYCLOAK_CLIENT_ID: perfilamiento-app
"""


def write_file(path: Path, content: str, force: bool) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and not force:
        return path
    path.write_text(content)
    return path


def generate_env(force: bool) -> Iterable[Path]:
    targets = [
        PROJECT_ROOT / '.env',
    ]
    for target in targets:
        yield write_file(target, ENV_TEMPLATE, force)


def generate_compose_override(force: bool) -> Iterable[Path]:
    target = PROJECT_ROOT / 'docker-compose.override.yml'
    yield write_file(target, COMPOSE_OVERRIDE_TEMPLATE, force)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description='Generate local config files.')
    parser.add_argument(
        '--force',
        action='store_true',
        help='Overwrite existing files when present.',
    )
    parser.add_argument(
        '--env',
        action='store_true',
        help='Generate .env file from template.',
    )
    parser.add_argument(
        '--compose-override',
        action='store_true',
        help='Generate docker-compose.override.yml file.',
    )
    parser.add_argument(
        '--all',
        action='store_true',
        help='Generate all supported files.',
    )
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    selected = args.all or args.env or args.compose_override
    if not selected:
        parser.print_help()
        return 1

    created = []
    if args.all or args.env:
        created.extend(generate_env(args.force))
    if args.all or args.compose_override:
        created.extend(generate_compose_override(args.force))

    for path in created:
        print(f'Generated: {path.relative_to(PROJECT_ROOT)}')

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
