# @cefalu/platform — Prisma layer

Owns everything Medusa doesn't: identity roles, community content (reviews/Q&A when promoted off-device), CMS-adjacent records, coupons/gift cards, subscriptions, support, notifications and audit trails. Commerce-mastered entities (orders, payments, carts, inventory, warehouses/stock) are modeled as **reporting mirrors** keyed by their Medusa IDs — Medusa remains the source of truth; nightly/webhook sync fills these for BI, invoicing and audit.

```bash
cp ../.env.local .env            # needs PLATFORM_DATABASE_URL
pnpm --filter @cefalu/platform generate
pnpm --filter @cefalu/platform migrate   # applies prisma/migrations
pnpm --filter @cefalu/platform seed
```
