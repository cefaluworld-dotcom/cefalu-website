# Architecture

Cefalu is a three-plane system: a **Next.js 15 storefront**, a **MedusaJS 2 commerce backend**, and a **Prisma/PostgreSQL platform database** for everything commerce doesn't own. Sanity provides editorial content; Razorpay/Cashfree handle payments; Resend/MSG91 handle notifications; S3/CloudFront serve media.

```
                 ┌────────────────────────────────────────────┐
   Browser  ───► │  Next.js 15 (App Router, RSC, standalone)   │
                 │  • Marketing + storefront pages (ISR/SSG)    │
                 │  • Route handlers /api/* (withApi wrapper)   │
                 │  • Auth.js v5 session (JWT cookie)           │
                 └───────┬───────────────┬───────────────┬──────┘
                         │               │               │
           ┌─────────────▼───┐   ┌───────▼───────┐   ┌───▼─────────────┐
           │  MedusaJS 2     │   │  Sanity CMS   │   │  Platform DB    │
           │  products/cart/ │   │  blogs/pages/ │   │  (Prisma/PG):   │
           │  orders/payment │   │  lookbooks    │   │  RBAC, reviews  │
           │  inventory      │   │               │   │  mirrors, audit │
           └───────┬─────────┘   └───────────────┘   └─────────────────┘
                   │
        ┌──────────▼───────────┐
        │ Razorpay / Cashfree  │  webhooks → /api/webhooks/*
        │ Resend / MSG91       │
        │ S3 / CloudFront      │
        └──────────────────────┘
```

## Rendering strategy

| Surface | Strategy | Notes |
| --- | --- | --- |
| Marketing pages | Static / ISR | `revalidate` per page; content from constants + Sanity |
| `/shop`, `/shop/[category]` | ISR (`revalidate = 900`) | `generateStaticParams` for categories |
| `/products/[handle]` | SSG + ISR | Static params from Medusa handles; offline fallback product |
| Cart, checkout, account | Client + server actions | Cart is client state (zustand persist); account reads via session token |
| `/api/*` | Dynamic route handlers | All non-webhook mutating routes wrapped by `withApi` |

## Source of truth

- **Commerce** (products, prices, carts, orders, payments, inventory) → **Medusa**. The storefront reads Medusa via the JS SDK; admin reads via the Admin API (`MEDUSA_ADMIN_API_KEY`).
- **Content** (journal posts, size & fabric-care guides, editorial pages) → **Sanity**.
- **Platform** (roles/permissions, reviews when promoted off-device, subscriptions, support, coupons, audit/activity) → **Prisma/Postgres**. Commerce entities are **read mirrors** keyed by Medusa IDs, filled by webhook/sync jobs for reporting and invoicing.

## Key modules

- `lib/pricing.ts` — the single money engine (coupon → shipping → COD fee → GST-included). Cart UI, checkout UI and payment APIs all call it, so totals can never diverge.
- `lib/api-handler.ts` — `withApi()` wraps every route with per-IP rate limiting, zod validation (body + query), role guards, `AppError` mapping and structured request logs.
- `lib/enrichment.ts` — client-safe product enrichment; `services/catalog.ts` is the server-only superset. This split keeps `server-only` out of client bundles.
- `lib/errors.ts` / `lib/logger.ts` — typed error hierarchy + leveled JSON logging with audit/activity channels.
- `services/*` — server-only data access (products, orders, customers, checkout, admin). Repository-style seams so a datastore swap doesn't touch UI.

## Security posture

Defense in depth: `middleware.ts` sets a strict CSP and same-origin CSRF enforcement for mutating `/api` calls; `next.config.ts` adds HSTS, nosniff, frame-deny and Permissions-Policy; every route validates input with zod and rate-limits per IP; secrets never reach the client (only `NEXT_PUBLIC_*` are exposed, validated in `config/env.ts`). See `docs/Deployment.md` → Security.
