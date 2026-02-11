FROM node:18.16.1-alpine AS deps

WORKDIR /app

COPY backend/package.json backend/package-lock.json* ./backend/

RUN cd backend && npm ci

FROM deps AS build

COPY backend ./backend

RUN cd backend && npm run build

FROM node:18.16.1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=build /app/backend/dist ./backend/dist
COPY backend/package.json ./backend/package.json

EXPOSE 3000

CMD ["node", "backend/dist/main.js"]
