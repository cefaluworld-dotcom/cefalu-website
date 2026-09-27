# Launch Checklist

Tick every box before flipping DNS to production. Owners in brackets.

## Pre-launch (functional)
- [ ] Home, PLP, PDP, cart, checkout, account all render on desktop + mobile.
- [ ] Place a real test order end-to-end on each gateway (Razorpay, Cashfree, COD).
- [ ] Order confirmation + shipped + delivered emails received; SMS received (if MSG91 live).
- [ ] Forgot/reset password loop works (email link → new password → login).
- [ ] Email verification link verifies and redirects.
- [ ] Coupons apply correctly; totals match `quoteOrder` (subtotal, shipping, COD, GST-included).
- [ ] Search returns results; empty/error states look right.
- [ ] 404 and error boundaries render branded pages.

## Production readiness
- [ ] `pnpm check-env` passes with `NODE_ENV=production` and all required vars set.
- [ ] `pnpm build` clean; route sizes reviewed for regressions.
- [ ] Docker image builds and `/api/health` returns 200 in the container.
- [ ] ECS service healthy with ≥2 tasks; autoscaling policies attached.
- [ ] RDS Multi-AZ, automated backups on; platform + Medusa migrations applied.
- [ ] Redis reachable from Medusa; event bus working (order events fire subscribers).
- [ ] Secrets in AWS Secrets Manager (no plaintext env in task def).

## Security
- [ ] CSP has no `unsafe-eval` in production; all third-party origins intentional.
- [ ] HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, Referrer-Policy present (verify with `curl -I`).
- [ ] Mutating `/api` calls reject cross-origin (CSRF middleware) — spot check.
- [ ] Rate limits active (hammer an endpoint → 429).
- [ ] Webhook signature verification rejects a tampered body (both gateways).
- [ ] `AUTH_SECRET` is a strong unique value; cookies `Secure` + `HttpOnly` in prod.
- [ ] No secret or PII in logs/Sentry; source maps uploaded but not public.
- [ ] Dependency audit clean (`pnpm audit`); Dependabot enabled.

## SEO
- [ ] `robots.txt` and `sitemap.xml` reachable and correct.
- [ ] Organization + WebSite (+ SearchAction) JSON-LD on the homepage.
- [ ] Product + Offer + AggregateRating + Review JSON-LD on PDPs.
- [ ] Breadcrumb JSON-LD on PLP/PDP; FAQ JSON-LD where FAQs exist.
- [ ] Canonical URLs and Open Graph/Twitter tags on every indexable page.
- [ ] Titles/descriptions unique; no `noindex` on pages that should rank.
- [ ] Validate a PDP in Google Rich Results Test.

## Accessibility
- [ ] `pnpm e2e` axe suite passes (no serious/critical) on key pages.
- [ ] Keyboard-only pass through browse → checkout; focus visible throughout.
- [ ] Color contrast AA; all images have meaningful/alt-empty text; forms labelled.
- [ ] Reduced-motion respected (page transitions, animations).

## Testing
- [ ] Unit + integration suites green (`pnpm test:coverage`); thresholds met.
- [ ] Playwright smoke + cart + a11y green in CI.
- [ ] Manual cross-browser: latest Chrome, Safari, Firefox, and iOS/Android.

## Backup & data
- [ ] RDS automated backups + a tested manual snapshot before launch.
- [ ] Point-in-time recovery enabled; retention ≥7 days.
- [ ] S3 versioning on for media; lifecycle rules set.
- [ ] Documented restore procedure (see Rollback) rehearsed once.

## Rollback plan
- [ ] Previous ECS task revision known-good and one command away.
- [ ] DB migration reverts documented; latest snapshot id recorded.
- [ ] CloudFront invalidation command handy (only for non-hashed assets).
- [ ] On-call owner + comms channel identified for launch window.

## Post-launch (first 24h)
- [ ] Watch CloudWatch dashboards (CPU, 5xx, latency) and Sentry issues.
- [ ] Confirm first real orders flow through and notifications fire.
- [ ] Verify analytics (GA/GTM/Meta Pixel) recording pageviews + purchases.
