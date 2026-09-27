# Folder Structure

```
cefalu-in/
├── app/                       # Next.js App Router
│   ├── (marketing)/           # Home, about, science, quality, blog, legal…
│   ├── (shop)/                # shop, shop/[category], products/[handle], wishlist, compare
│   ├── (checkout)/            # checkout, order-confirmed, order-failed
│   ├── (auth)/                # login, register, forgot/reset password, verify
│   ├── (account)/account/     # dashboard, orders, addresses, profile, security, …
│   ├── api/                   # Route handlers (products, search, checkout, webhooks, admin, auth, account)
│   ├── api-docs/              # Human-readable REST reference (rendered from lib/openapi.ts)
│   ├── layout.tsx             # Root layout: fonts, providers, Org + WebSite JSON-LD
│   ├── template.tsx           # Page-transition wrapper (reduced-motion aware)
│   ├── error.tsx              # Route error boundary
│   ├── global-error.tsx       # App-shell error boundary (Sentry)
│   └── not-found.tsx          # 404
├── components/
│   ├── ui/                    # shadcn-style primitives (button, input, dialog, …)
│   ├── layout/                # header, footer, mega-menu, mobile-nav, container, section
│   ├── product/               # cards, gallery, buy-box, plp, carousels, filters
│   ├── reviews/               # summary, card, write-review, Q&A
│   ├── cart/ forms/ account/  # cart views, checkout, auth forms, account panels
│   └── common/                # json-ld, analytics, shared bits
├── services/                  # server-only data access (products, orders, customers, checkout, admin, reviews)
├── lib/                       # pricing, errors, logger, api-handler, auth-guard, seo,
│                              # razorpay, cashfree, s3, openapi, medusa/{client,admin}, enrichment
├── store/                     # zustand stores (cart, wishlist, compare, recently-viewed, search, saved)
├── config/                    # site config + env validation (config/env.ts)
├── constants/                 # routes, marketing content, catalog enrichment
├── hooks/  utils/  types/     # shared hooks, formatters, TS types
├── emails/                    # react-email templates + shared shell
├── sanity/                    # schemas (blog + site), client, queries
├── medusa/                    # MedusaJS backend (modules, subscribers, api, config)
├── platform/                  # Prisma schema, migrations, seed (@cefalu/platform)
├── tests/                     # vitest unit tests
├── e2e/                       # Playwright specs (smoke, cart, accessibility)
├── scripts/                   # check-env.mjs, setup.sh
├── .github/workflows/         # ci, deploy-production, deploy-preview
├── Dockerfile  docker-compose*.yml  .devcontainer/
└── middleware.ts  next.config.ts
```

## Conventions

- **Route groups** `(group)` organize by domain without affecting URLs.
- **`server-only`** guards data-access modules; client components import from `lib/enrichment.ts`, never `services/`.
- **Path alias** `@/*` → repo root (mirrored in `vitest.config.ts` and `tsconfig.json`).
- **Money** is integer INR everywhere; formatting via `utils/format.ts` `formatPrice`.
- **Workspaces** — root storefront plus `medusa` and `platform` packages (`pnpm-workspace.yaml`).
