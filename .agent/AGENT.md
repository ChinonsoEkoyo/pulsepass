---
description: "Core initialization file for the PulsePass project agent"
---
# PulsePass Agent Context

Welcome to the PulsePass project. PulsePass is an enterprise event infrastructure platform that centralizes the event lifecycle (creation, RSVP, ticketing, Flutterwave payments, check-in).

## Tech Stack
- **Frontend**: Next.js (App Router), TypeScript, Vanilla CSS (CSS Modules), Custom UI Components
- **Backend & Database**: Postgres (Neon) + Drizzle ORM
- **Payments**: Flutterwave (NOT Paystack)
- **Hosting**: Vercel

## Project Files
- `PulsePass_Enterprise_PRD.md` — Full product requirements document
- `theme-tokens.css` — Generated design token CSS variables (do not edit directly)
- `color-tokens.json` / `design-tokens.json` — Source token files
- `convert-tokens.js` / `update-tokens.js` — Token generation scripts

## Core Workflows
Available in `.agent/workflows/` for common tasks (creating components, API routes).

## Skills
Available in `.agent/skills/` for specialized tasks (DB migrations, API scaffolding, component building, Flutterwave integration).

## Rules
Refer to `.agent/rules/` for architecture, code-style, design-system, and security guidelines.

## Design System
- Custom components with Vanilla CSS Modules (no Tailwind, no Shadcn UI)
- All styling must use `var()` references to `theme-tokens.css`
- Must meet WCAG 2.2 AA accessibility standards
- Design principles: Clarity, Trust, Speed, Delight
