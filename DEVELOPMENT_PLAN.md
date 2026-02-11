# DEVELOPMENT PLAN: Perfilamiento_OTIC_CCHC_v3

## 1. ARCHITECTURE OVERVIEW
**Backend (NestJS):**
- REST API with JWT authentication via Keycloak
- PostgreSQL database with TypeORM
- Modular structure: Auth, Users, Profiles, Reports modules
- Swagger/OpenAPI documentation

**Frontend (React):**
- Single Page Application with React 18
- React Router for navigation
- Axios for API calls
- Material-UI or similar component library
- Keycloak JS adapter for authentication

**Authentication & Authorization:**
- Keycloak server for identity management
- JWT tokens for API security
- Role-based access control (RBAC)

**Infrastructure:**
- Docker containers for all services
- PM2 for process management in production
- Azure deployment ready

**File Structure:**
```
perfilamiento-otic-cchc/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── profiles/
│   │   ├── reports/
│   │   ├── common/
│   │   └── app.module.ts
│   ├── test/
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
├── keycloak/
│   └── Dockerfile
├── scripts/
│   └── generate-files.py
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .dockerignore
├── run.sh
├── run.bat
└── README.md
```

## 2. MVP ACCEPTANCE CRITERIA
1. **Authentication**: Users can log in via Keycloak and access protected routes with valid JWT tokens
2. **User Management**: Admin users can CRUD user profiles with role assignments (admin, user, viewer)
3. **Profile Management**: Authenticated users can create, read, update, and delete professional profiles with fields: name, email, skills, experience, certifications
4. **API Documentation**: Swagger UI available at /api/docs with all endpoints documented
5. **Docker Deployment**: All services (backend, frontend, Keycloak, PostgreSQL) start with `docker compose up` and health checks pass

## 3. EXECUTABLE ITEMS

### ITEM 1: Backend Foundation & Authentication
**Goal:** Create NestJS backend with Keycloak authentication module and PostgreSQL connection
**Files to create/modify:**
- backend/package.json (create) - NestJS dependencies with Keycloak, TypeORM, PostgreSQL
- backend/tsconfig.json (create) - TypeScript configuration
- backend/nest-cli.json (create) - NestJS CLI configuration
- backend/src/main.ts (create) - Application bootstrap with Swagger
- backend/src/app.module.ts (create) - Root module with imports
- backend/src/auth/auth.module.ts (create) - Keycloak authentication module
- backend/src/auth/guards/keycloak-auth.guard.ts (create) - JWT validation guard
- backend/src/auth/decorators/roles.decorator.ts (create) - Role-based access decorator
- backend/src/auth/strategies/keycloak.strategy.ts (create) - Keycloak passport strategy
- backend/src/common/database/database.module.ts (create) - PostgreSQL TypeORM configuration
- backend/.env (create) - Environment variables template
**Dependencies:** None
**Validation:** `npm run start:dev` starts backend on port 3000, connects to PostgreSQL

### ITEM 2: User Management Module
**Goal:** Implement CRUD operations for user management with role-based permissions
**Files to create/modify:**
- backend/src/users/users.module.ts (create) - User management module
- backend/src/users/users.controller.ts (create) - REST endpoints for user CRUD
- backend/src/users/users.service.ts (create) - Business logic for user operations
- backend/src/users/entities/user.entity.ts (create) - TypeORM entity with fields: id, email, name, roles, createdAt
- backend/src/users/dto/create-user.dto.ts (create) - Data transfer object for user creation
- backend/src/users/dto/update-user.dto.ts (create) - Data transfer object for user updates
- backend/src/users/dto/user-response.dto.ts (create) - Response DTO excluding sensitive data
**Dependencies:** Item 1 (Authentication module)
**Validation:** API endpoints accessible at /api/users with proper authentication, CRUD operations work via Postman

### ITEM 3: Profile Management Module
**Goal:** Create professional profile management with skills, experience, and certifications
**Files to create/modify:**
- backend/src/profiles/profiles.module.ts (create) - Profile management module
- backend/src/profiles/profiles.controller.ts (create) - REST endpoints for profile CRUD
- backend/src/profiles/profiles.service.ts (create) - Business logic for profile operations
- backend/src/profiles/entities/profile.entity.ts (create) - TypeORM entity with fields: id, userId, name, email, skills[], experienceYears, certifications[], createdAt
- backend/src/profiles/dto/create-profile.dto.ts (create) - Data transfer object for profile creation
- backend/src/profiles/dto/update-profile.dto.ts (create) - Data transfer object for profile updates
- backend/src/profiles/dto/profile-response.dto.ts (create) - Response DTO for profiles
**Dependencies:** Item 2 (User module for user relationships)
**Validation:** API endpoints accessible at /api/profiles, authenticated users can manage their profiles

### ITEM 4: Reports Module & API Documentation
**Goal:** Implement reporting endpoints and complete Swagger/OpenAPI documentation
**Files to create/modify:**
- backend/src/reports/reports.module.ts (create) - Reports module
- backend/src/reports/reports.controller.ts (create) - Reporting endpoints (summary, statistics, exports)
- backend/src/reports/reports.service.ts (create) - Report generation logic
- backend/src/reports/dto/report-request.dto.ts (create) - Report filtering parameters
- backend/src/common/decorators/api-response.decorator.ts (create) - Swagger response decorators
- backend/src/common/decorators/api-query.decorator.ts (create) - Swagger query parameter decorators
- backend/src/common/interceptors/response.interceptor.ts (create) - Standardized API response format
**Dependencies:** Items 2-3 (User and Profile modules)
**Validation:** Swagger UI available at /api/docs, all endpoints documented, report endpoints return data

### ITEM 5: Frontend Foundation & Authentication
**Goal:** Create React frontend with Keycloak authentication and basic routing
**Files to create/modify:**
- frontend/package.json (create) - React 18 with Keycloak-js, Axios, React Router, Material-UI
- frontend/vite.config.js (create) - Vite configuration for React
- frontend/index.html (create) - HTML template
- frontend/src/main.jsx (create) - React entry point with Keycloak provider
- frontend/src/App.jsx (create) - Main application component with routing
- frontend/src/components/Layout/Layout.jsx (create) - Application layout with navigation
- frontend/src/components/Login/Login.jsx (create) - Login component with Keycloak
- frontend/src/pages/Home/Home.jsx (create) - Home page
- frontend/src/services/auth.service.js (create) - Authentication service with Keycloak
- frontend/src/services/api.service.js (create) - Axios instance with interceptors
- frontend/src/utils/constants.js (create) - Application constants
- frontend/.env (create) - Environment variables template
**Dependencies:** Item 1 (Backend authentication setup)
**Validation:** `npm run dev` starts frontend on port 5173, login redirects to Keycloak

### ITEM 6: Frontend User & Profile Management
**Goal:** Implement React pages for user and profile management with API integration
**Files to create/modify:**
- frontend/src/pages/Users/Users.jsx (create) - User management page (admin only)
- frontend/src/pages/Users/UserForm.jsx (create) - Create/edit user form
- frontend/src/pages/Profiles/Profiles.jsx (create) - Profile listing page
- frontend/src/pages/Profiles/ProfileForm.jsx (create) - Create/edit profile form
- frontend/src/pages/Profiles/ProfileView.jsx (create) - Profile detail view
- frontend/src/components/ProtectedRoute/ProtectedRoute.jsx (create) - Route guard for authentication
- frontend/src/components/RoleGuard/RoleGuard.jsx (create) - Component guard for role-based access
- frontend/src/hooks/useUsers.js (create) - Custom hook for user operations
- frontend/src/hooks/useProfiles.js (create) - Custom hook for profile operations
- frontend/src/styles/theme.js (create) - Material-UI theme configuration
**Dependencies:** Items 2-3, 5 (Backend APIs and frontend foundation)
**Validation:** Users can log in, navigate to profile management, create/edit profiles

### ITEM 7: Testing & Quality Assurance
**Goal:** Implement unit and integration tests for backend and frontend
**Files to create/modify:**
- backend/test/app.e2e-spec.ts (create) - End-to-end test setup
- backend/test/auth.e2e-spec.ts (create) - Authentication tests
- backend/test/users.e2e-spec.ts (create) - User management tests
- backend/test/profiles.e2e-spec.ts (create) - Profile management tests
- backend/jest.config.js (create) - Jest configuration
- frontend/vitest.config.js (create) - Vitest configuration
- frontend/src/__tests__/App.test.jsx (create) - Main app test
- frontend/src/__tests__/services/auth.service.test.js (create) - Auth service tests
- frontend/src/__tests__/components/Login.test.jsx (create) - Login component test
- scripts/generate-files.py (create) - Python script for file generation (non-business logic)
**Dependencies:** Items 1-6 (All application code)
**Validation:** `npm test` runs all tests with >80% coverage, Python script generates template files

### ITEM 8: Infrastructure & Deployment
**Goal:** Create production-ready Docker setup matching the project stack
**Files to create/modify:**
- backend/Dockerfile (create) - Multi-stage build for Node.js 18.16.1, optimized layers, non-root user
- frontend/Dockerfile (create) - Multi-stage build for React, optimized layers, nginx serving
- keycloak/Dockerfile (create) - Keycloak with custom realm configuration
- docker-compose.yml (create) - All services (backend, frontend, keycloak, postgres), health checks, networks
- .dockerignore (create) - Exclude node_modules, .git, unnecessary files
- .gitignore (create) - Exclude generated files, dependencies, secrets (node_modules, __pycache__, .venv, dist, build, .env, etc.)
- run.sh (create) - Unix startup script with validation
- run.bat (create) - Windows startup script with validation
- README.md (create) - Complete setup instructions: prereqs, install, run, test, deploy
- .env.example (create/update) - All environment variables with descriptions
**Dependencies:** All previous items (needs backend/frontend code)
**Validation:** `docker compose up` starts all services, health checks pass, application accessible at http://localhost:8080
**CRITICAL:** Dockerfile MUST match project stack (Node.js → node:18.16.1-alpine, Keycloak → quay.io/keycloak/keycloak, PostgreSQL → postgres:15-alpine)