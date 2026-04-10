# Prisma Setup

## Current model
- Lead persistence uses Prisma-first storage when `DATABASE_URL` is configured.
- Fallback remains `data/leads.json` when database is unavailable.

## Commands
- Generate client: `npm run prisma:generate`
- Create and apply migration (development): `npm run prisma:migrate:dev -- --name init_leads`
- Apply existing migrations (deploy): `npm run prisma:migrate:deploy`
- Open Prisma Studio: `npm run prisma:studio`

## Docker full stack
- Start database only: `docker compose up -d postgres`
- Start app + database: `docker compose up -d --build`
- App container runs `prisma migrate deploy` before `next start`

## Required environment
- `DATABASE_URL` must point to a PostgreSQL database.

Note for local CLI usage on this project:
- Prisma CLI reads `.env` by default. If you only use `.env.local`, export `DATABASE_URL` in the shell before migration commands.
