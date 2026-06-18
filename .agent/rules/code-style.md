# PulsePass Code Style Rules

- **Language**: TypeScript is strictly required. Use strong typing and interface definitions for all data structures. Avoid `any`.
- **Naming Conventions**:
  - Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for components
  - Components: `PascalCase`
  - Functions/Variables: `camelCase`
  - Constants/Enums: `UPPER_SNAKE_CASE`
  - Database tables: `snake_case`
  - Types/Interfaces: `PascalCase` prefixed with `I` is optional; prefer plain `PascalCase`
- **Components**: Use React Functional Components with hooks. Define props as `interface ComponentNameProps`.
- **Styling**: Strictly use Vanilla CSS (CSS Modules). Leverage `var()` references to `theme-tokens.css` for all colors, typography, and spacing. Do NOT use Tailwind CSS.
- **Imports**: Order: 1) Node/Next.js built-ins, 2) third-party packages, 3) `@/` aliased internal modules, 4) relative imports. Group with blank lines between.
- **Error Handling**: Wrap all API routes and async operations in try/catch. Use Zod for validation errors. Never swallow errors silently.
- **Exports**: Prefer named exports over default exports.
- **Linting**: Keep code clean. No unused variables, no `console.log` in production code. Handle promises with catch or await inside try/catch.
