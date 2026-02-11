# Proyecto: Perfilamiento OTIC CCHC

## Descripcion
Plataforma de gestion de perfiles profesionales con autenticacion Keycloak, API REST en NestJS y frontend en React. Permite administrar usuarios, perfiles, habilidades y reportes con control de acceso por roles.

## Stack Tecnologico y Requisitos Previos
- **Backend:** Node.js 18.16.1, NestJS, TypeORM, PostgreSQL
- **Frontend:** React 18, Vite, Axios, React Router, MUI
- **Auth:** Keycloak (OIDC/JWT)

Requisitos:
- Node.js 18.16.1 y npm
- PostgreSQL 15+
- Instancia Keycloak y un Realm configurado

## Instalacion y Configuracion
1. Instala dependencias:
   - `cd backend && npm install`
   - `cd frontend && npm install`
2. Configura variables de entorno:
   - Backend: `backend/.env`
   - Frontend: `frontend/.env`
3. Crea la base de datos y usuario en PostgreSQL.
4. Configura un cliente en Keycloak (tipo confidential o public segun el frontend).

## Uso y Ejecucion
Backend:
- `cd backend && npm run start:dev`
- Swagger: `http://localhost:3000/api`

Frontend:
- `cd frontend && npm run dev`
- App: `http://localhost:5173`

## API Reference (Resumen)
Usuarios:
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PATCH /users/:id`
- `DELETE /users/:id`

Perfiles:
- `GET /profiles`
- `GET /profiles/:id`
- `POST /profiles`
- `PATCH /profiles/:id`
- `DELETE /profiles/:id`

Reportes:
- `GET /reports/summary`
- `GET /reports/statistics`
- `POST /reports/export`

## Estructura del Proyecto
```
perfilamiento-otic-cchc/
├── backend/
│   ├── src/
│   └── .env
├── frontend/
│   ├── src/
│   └── .env
└── README.md
```

## Guia de Configuracion
Variables de entorno principales:
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
- `KEYCLOAK_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET`
- `FRONTEND_URL`, `PORT`

Para ajustes avanzados, revisa los modulos `backend/src/auth`, `backend/src/common/database` y `frontend/src/services`.
