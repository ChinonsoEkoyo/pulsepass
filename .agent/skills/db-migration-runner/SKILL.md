---
name: "db-migration-runner"
description: "Instructions for running Neon Postgres database migrations with Drizzle"
---
# Database Migration Runner

## Setup
PulsePass uses **Drizzle ORM** with **Neon Postgres**. Schema lives in `db/schema/`.

## Commands

| Action | Command |
|---|---|
| Generate migration | `npm run db:generate` |
| Apply migration | `npm run db:migrate` |
| Push schema (dev) | `npm run db:push` |
| Open Drizzle Studio | `npm run db:studio` |

## Workflow
1. Edit schema files in `db/schema/`.
2. Run `npm run db:generate` to create a new migration file in `db/migrations/`.
3. Review the generated SQL.
4. Run `npm run db:migrate` to apply against the Neon database.
5. Verify by checking `drizzle_migrations` table or querying the updated tables.

## Safety
- Never run `db:push` on production — it skips migration history.
- Always wrap schema changes in a transaction.
- Back up production data before destructive operations (DROP, ALTER).
