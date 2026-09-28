# Cefalu

Readymade garment store for cefalu.in — a Next.js 15 storefront on MedusaJS 2, with Sanity CMS, a Prisma/PostgreSQL platform database, Razorpay/Cashfree payments, Resend/MSG91 notifications and S3 media.

## Quick start
```bash
pnpm install
cp .env.example .env.local        # validation is lenient in dev
docker compose up --build         # Postgres + Redis + Medusa + storefront
# — or storefront only (offline fallbacks) —
pnpm dev
```
Storefront → http://localhost:3000

## Scripts
`pnpm dev` · `pnpm build` · `pnpm start` · `pnpm typecheck` · `pnpm lint` · `pnpm test` · `pnpm test:coverage` · `pnpm e2e` · `pnpm check-env` · `pnpm --dir platform migrate|seed` (install platform dependencies first)

## Highlights
- **Storefront** — enterprise PLP (filters, grid/list, infinite scroll), premium PDP (gallery zoom, sticky buy box, subscription pricing, reviews & Q&A), cart with coupons + GST, multi-step checkout, full account area.
- **Backend** — Medusa modules (review, wishlist) + subscribers (email/SMS on order lifecycle & password reset); Admin-API-backed admin endpoints.
- **Platform DB** — 36-model Prisma schema (RBAC, reviews, commerce mirrors, subscriptions, support, audit) with migration + seed.
- **Payments** — Razorpay (modal) + Cashfree (hosted) + COD; signature-verified webhooks; refunds; retry/status.
- **Production** — strict CSP + security headers, per-IP rate limiting, zod validation everywhere, Sentry, health check, standalone Docker image, ECS/RDS/S3/CloudFront deploy, GitHub Actions CI/CD, Playwright + axe E2E.

## Documentation
| Doc | Contents |
| --- | --- |
| [Architecture](docs/Architecture.md) | System planes, rendering strategy, source of truth |
| [FolderStructure](docs/FolderStructure.md) | Where everything lives |
| [Environment](docs/Environment.md) | Every env var + cross-field rules |
| [Deployment](docs/Deployment.md) | AWS topology, CI/CD, migrations, rollback |
| [Vercel + Railway](docs/VercelRailway.md) | Staging setup, required variables, verification, cutover |
| [API](docs/API.md) | REST reference (also `/api-docs`, `/api/openapi`) |
| [DeveloperGuide](docs/DeveloperGuide.md) | Local dev, adding routes, data model |
| [Contributing](docs/Contributing.md) | Workflow & standards |
| [Troubleshooting](docs/Troubleshooting.md) | Common issues + rollback |
| [LaunchChecklist](docs/LaunchChecklist.md) | Pre-launch, security, SEO, a11y, backup, rollback |

## License
Proprietary © Cefalu Apparel Pvt. Ltd.
