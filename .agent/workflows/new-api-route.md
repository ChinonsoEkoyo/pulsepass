---
description: "Workflow for scaffolding a new API route with Drizzle + Neon"
---
# Workflow: New API Route

1. Determine the path (e.g., `/api/events/create`).
2. Create `route.ts` inside `app/api/<path>/`.
3. Add the HTTP method handler (GET, POST, PUT, DELETE).
4. Import `db` from `@/db` and the relevant schema from `@/db/schema`.
5. Validate the request body with a Zod schema.
6. Extract and verify the JWT from cookies/Authorization header for protected routes.
7. Execute the database operation using Drizzle (`db.insert`, `db.select`, `db.update`, `db.delete`).
8. Wrap in try/catch — return `400` for validation errors, `401` for auth failures, `500` for internal errors.
9. Return a `NextResponse.json()` with a consistent `{ data?, error? }` shape.
10. Reference `.agent/skills/api-route-scaffolder/SKILL.md` for the full boilerplate template.
