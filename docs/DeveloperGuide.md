# Developer Guide

## Prerequisites
- Node 20+, pnpm 9 (`corepack enable`)
- Docker (for Postgres/Redis/Medusa locally)

## First run
```bash
pnpm install
cp .env.example .env.local          # fill what you have; validation is lenient in dev
cp medusa/.env.example medusa/.env

# Option A: everything in Docker
docker compose up --build

# Option B: storefront only (uses offline fallbacks when Medusa is absent)
pnpm dev
```
Storefront: http://localhost:3000 · Medusa: http://localhost:9000 · Studio: `pnpm --filter medusa exec medusa develop`.

## Everyday commands
| Command | Does |
| --- | --- |
| `pnpm dev` | Next dev server (Turbopack) |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint (Next config) |
| `pnpm test` / `pnpm test:coverage` | Vitest unit + coverage |
| `pnpm e2e` / `pnpm e2e:ui` | Playwright E2E |
| `pnpm check-env` | Validate environment |
| `pnpm --filter @cefalu/platform generate\|migrate\|seed` | Prisma platform DB |

## Working with data
- The storefront **degrades gracefully** without Medusa: fallback products/prices render PDPs and PLPs so you can build UI offline.
- Reviews/wishlist/compare persist to `localStorage` client-side; the Medusa `review`/`wishlist` modules provide the server-backed equivalent once connected.
- Never import `services/*` from a client component — use `lib/enrichment.ts`. `server-only` will throw at build if you do.

## Adding an API route
Use the wrapper so you inherit validation, limits, roles and logging:
```ts
import { z } from "zod";
import { withApi, ok } from "@/lib/api-handler";

const bodySchema = z.object({ /* … */ });

export const POST = withApi(
  { name: "my-route", bodySchema, role: "customer", limit: 20 },
  async ({ body, actor }) => ok({ /* … */ })
);
```

## Money
Always integer INR. Compute totals only through `quoteOrder()` in `lib/pricing.ts`; format with `formatPrice()`.

## Commit hygiene
Keep `pnpm lint && pnpm typecheck && pnpm test` green before pushing — CI runs the same plus a production build and Playwright. Conventional-commit messages recommended.
