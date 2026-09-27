# Contributing

## Workflow
1. Branch from `develop`: `feat/…`, `fix/…`, `chore/…`.
2. Keep changes focused; update docs/tests alongside code.
3. Ensure locally green: `pnpm lint && pnpm typecheck && pnpm test`.
4. Open a PR into `develop`. CI must pass (lint, test, build, E2E). A Vercel preview is posted when enabled.
5. Squash-merge with a Conventional Commit title (`feat:`, `fix:`, `perf:`, `docs:`, `refactor:`, `test:`, `chore:`).

## Code standards
- **TypeScript strict**, no `any`. Prefer `unknown` + zod at boundaries.
- **Server vs client**: data access is `server-only`; client components import from `lib/*` client-safe modules.
- **Styling**: Tailwind core utilities + shadcn-style primitives in `components/ui`. Follow the existing design tokens; avoid ad-hoc hex values.
- **Accessibility**: semantic elements, labelled controls, visible focus. New pages should pass the axe E2E (`e2e/accessibility.spec.ts`).
- **Formatting**: Prettier + ESLint on save (see `.devcontainer`).

## Tests
- Unit (vitest) for pure logic in `lib/`, `services/`, `utils/`.
- E2E (Playwright) for critical flows: browse → PDP → cart → checkout entry.
- Add/adjust tests with every behavioral change; don't lower coverage thresholds to pass.

## Reviews
At least one approval. Reviewers check: correctness, types, a11y, bundle impact (avoid pulling heavy deps into client), and that secrets/PII never reach the client or logs.

## Reporting security issues
Email security@cefalu.in — do not open public issues for vulnerabilities.
