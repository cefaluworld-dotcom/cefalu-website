# Troubleshooting

## Build & types
- **`server-only` import error in a client component** — you imported `services/*` or a server lib from a `"use client"` file. Import from `lib/enrichment.ts` (client-safe) or move the logic to a server component.
- **`Invalid environment variables` at boot** — a required var is missing/misformatted. Run `pnpm check-env` for a readable report. In CI, set `SKIP_ENV_VALIDATION=1`.
- **Type error on a route's second arg** — Next 15 typed routes require `ctx: { params: Promise<…> }`; `withApi` already matches this. Don't hand-roll the signature.

## Runtime
- **Products/prices missing** — Medusa isn't reachable. The storefront falls back to bundled demo data; check `NEXT_PUBLIC_MEDUSA_BACKEND_URL` and the backend health.
- **Payment fails immediately** — gateway keys unset. Razorpay needs `RAZORPAY_KEY_ID/SECRET`; Cashfree needs `CASHFREE_APP_ID/SECRET_KEY`. COD always works.
- **Webhook 400 (invalid signature)** — the secret in the dashboard doesn't match `RAZORPAY_WEBHOOK_SECRET` / Cashfree secret, or a proxy altered the raw body. Webhooks must receive the unmodified body.
- **Emails/SMS not sending** — `RESEND_API_KEY` / `MSG91_AUTH_KEY` unset. These are no-ops (logged) when absent, by design.
- **Google button missing** — set both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`; the provider is conditionally registered.

## CSP / third-party scripts
If a new integration is blocked in the console, add its origin to the relevant directive in `middleware.ts` (`script-src`, `connect-src`, `frame-src`, …). Keep the allowlist tight.

## Hydration warnings
Ensure client-only values (dates, random, `localStorage`) render after mount (`useMounted`) — the stores already guard this. Don't branch markup on `window` during SSR.

## Rollback
1. **App** — `aws ecs update-service --cluster cefalu-prod --service cefalu-web --task-definition cefalu-web:<previous>` and wait for stability. Hashed static assets make this cache-safe.
2. **Platform DB** — Prisma migrations are additive; to revert a bad migration restore the latest RDS automated snapshot or apply a down migration in a maintenance window.
3. **Medusa** — roll the backend service to its previous task revision; run compensating `db:migrate` only if schema changed.
4. **CDN** — invalidate CloudFront only if you changed non-hashed assets (rare): `aws cloudfront create-invalidation --paths "/*"`.

## Performance regressions
- Check bundle with `pnpm build` route sizes; keep client components lean and dynamic-import heavy widgets.
- Verify images use `next/image` with correct `sizes`; avoid shipping large libraries to the client (D3/three only where needed).
