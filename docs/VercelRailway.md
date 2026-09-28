# Vercel + Railway deployment

Deploy the Next.js storefront from the repository root to Vercel. Deploy Medusa from `medusa/` to Railway alongside PostgreSQL and Redis. Start with separate staging services and data; keep `cefalu.in` on Shopify until checkout and migration are signed off.

## 1. Railway staging

1. Create a Railway project with PostgreSQL, Redis, and a GitHub service for this repository. Set the Medusa service **Root Directory** to `/medusa` and **Dockerfile Path** to `Dockerfile.staging` (relative to that root). The root repository Dockerfile builds the storefront and must not be used for Medusa.
2. Set the Medusa service port to `9000` (`PORT=9000`) and generate a public HTTPS domain. Set the healthcheck path to `/health`. Its image builds the Medusa server and listens on port 9000.
3. Configure Medusa service variables in Railway (substitute the actual Railway service names and domains):

   | Variable | Staging value |
   | --- | --- |
   | `DATABASE_URL` | Reference the PostgreSQL service's private `DATABASE_URL` |
   | `REDIS_URL` | Reference the Redis service's private `REDIS_URL` |
   | `JWT_SECRET`, `COOKIE_SECRET` | Separate long random values |
   | `MEDUSA_BACKEND_URL` | Public Railway Medusa HTTPS URL, without trailing slash |
   | `STORE_CORS` | Exact Vercel staging HTTPS origin |
   | `ADMIN_CORS` | Railway Medusa HTTPS origin |
   | `AUTH_CORS` | Comma-separated Vercel staging and Medusa HTTPS origins |
   | `STOREFRONT_URL` | Vercel staging HTTPS origin |

   Leave `MEDUSA_DB_DISABLE_SSL` unset unless the selected private database connection explicitly needs SSL disabled. Supply the notification and object-storage variables from `medusa/.env.example` only when those services are configured. Railway containers do not provide durable local media storage; configure external object storage before uploading real catalog images.

4. Deploy Medusa, run `pnpm exec medusa db:migrate` in the Medusa service context before taking orders, and verify `https://<medusa-domain>/health`. Create a sales channel and a publishable API key in Medusa Admin at `https://<medusa-domain>/app`. Do not seed demo products into a live database.

## 2. Vercel staging

1. Import the same GitHub repository into Vercel. Select **Next.js**, set **Root Directory** to the repository root, and use the repository's `pnpm@9.15.4` lockfile and default `pnpm build`. Keep the first deployment on a preview/staging domain; do not assign `cefalu.in` yet.
2. Add the following variables to the staging deployment environment before building:

   | Variable | Staging value |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | Stable Vercel staging HTTPS origin, without trailing slash |
   | `AUTH_URL` | Same Vercel staging HTTPS origin |
   | `AUTH_SECRET` | Long random value, different from Railway secrets |
   | `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Public Railway Medusa HTTPS origin |
   | `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Medusa sales-channel key (`pk_…`) |

   Add Sanity, payments, email, Sentry, and platform database variables from `docs/Environment.md` as each integration is tested. `MEDUSA_INTERNAL_URL` is optional on Vercel: use the public HTTPS backend there if set. Never put a private Railway hostname in `NEXT_PUBLIC_*`: browser requests need a public URL. The Medusa backend URL also determines the allowed Next.js image host at build time.
3. Redeploy Vercel after changing any `NEXT_PUBLIC_*` value. Update `STORE_CORS` and `AUTH_CORS` on Railway when the staging origin changes. Wildcard Vercel preview domains require an explicit CORS strategy; use one stable staging origin for checkout testing.

## 3. Verify and promote

- Check Vercel `/api/health` and Railway `/health`, then browse a product with a real image, add it to cart, and complete a staging COD and sandbox gateway order. Confirm browser API requests, cookies, totals, webhooks, and order records.
- Apply platform Prisma migrations separately if `PLATFORM_DATABASE_URL` is enabled. The storefront health endpoint only proves the web process is responding; it does not verify Medusa, payments, or database connections.
- Set distinct production services, databases, keys, and environment variables. Complete `docs/LaunchChecklist.md`, then assign the production domain and switch DNS during a planned cutover. Keep Shopify live until that point. Roll back the storefront through Vercel deployment promotion and the backend through Railway deployment rollback, checking database migration compatibility first.

Current infrastructure and account access are not stored in this repository. Deployments require the Vercel and Railway projects, domains, credentials, and gateway sandbox keys to be supplied through those platforms.
