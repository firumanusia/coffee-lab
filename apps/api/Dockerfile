# MENOOWEL API — built from the monorepo root (Coolify: Base Directory = /, Dockerfile = apps/api/Dockerfile)
FROM node:22-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci --ignore-scripts
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared
RUN npm run -w @menoowel/api prisma:generate && npm run -w @menoowel/api build

FROM node:22-slim AS run
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/apps/api ./apps/api
COPY --from=build /app/packages/shared ./packages/shared
WORKDIR /app/apps/api
EXPOSE 3000
# Apply migrations on boot (idempotent), then start. Seeding is done separately.
CMD ["sh","-c","npx prisma migrate deploy && node dist/main.js"]
