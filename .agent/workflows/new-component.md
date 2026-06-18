---
description: "Workflow for creating a new UI component with vanilla CSS and design tokens"
---
# Workflow: New Component

1. Identify the component's purpose and scope from the PRD or user request.
2. Create a new `.tsx` file (e.g., `Button.tsx`) in the appropriate `components/` subfolder.
3. Create a corresponding CSS Module file (e.g., `Button.module.css`). Do NOT use Tailwind CSS.
4. In the CSS file, import design tokens via `var()` references to `theme-tokens.css` (e.g., `var(--color-primary)`, `var(--font-body-large-font-size)`).
5. Define TypeScript interfaces for the component's Props.
6. Implement the component as a React Functional Component, applying CSS Module classes (`styles.className`).
7. Ensure the component respects the Design System principles: Clarity, Trust, Speed, Delight.
8. Verify accessibility meets WCAG 2.2 AA (keyboard navigation, focus states, screen reader support, semantic HTML, contrast compliance).
9. Export the component as a named export.
