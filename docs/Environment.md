# Environment Variables

Copy `.env.example` → `.env.local` (storefront) and `medusa/.env.example` → `medusa/.env` (backend). Validation runs at boot via `config/env.ts` (zod) and `scripts/check-env.mjs` (production hard-fail). Set `SKIP_ENV_VALIDATION=1` only for CI builds.

## Storefront (root `.env.local`)

### Public (exposed to the browser — `NEXT_PUBLIC_*`)
| Variable | Required | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | prod | `https://cefalu.in` |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | prod | `https://api.cefalu.in` |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | prod | `pk_…` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | — | `abc123` |
| `NEXT_PUBLIC_SANITY_DATASET` | — | `production` |
| `NEXT_PUBLIC_GTM_ID` / `NEXT_PUBLIC_GA_MEASUREMENT_ID` | — | analytics |
| `NEXT_PUBLIC_META_PIXEL_ID` | — | Meta Pixel |
| `NEXT_PUBLIC_SENTRY_DSN` | — | error tracking |

### Server-only
| Variable | Required | Purpose |
| --- | --- | --- |
| `AUTH_SECRET` | prod | Auth.js JWT signing (`openssl rand -base64 32`) |
| `PLATFORM_DATABASE_URL` | — | Prisma platform DB |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | — | payments |
| `RAZORPAY_WEBHOOK_SECRET` | if webhooks | webhook HMAC |
| `CASHFREE_APP_ID` / `CASHFREE_SECRET_KEY` / `CASHFREE_ENV` | — | Cashfree gateway |
| `MEDUSA_ADMIN_API_KEY` | — | powers `/api/admin/*` |
| `ADMIN_EMAILS` / `MODERATOR_EMAILS` | — | role assignment (comma-separated) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | — | Google login (both or neither) |
| `RESEND_API_KEY` / `EMAIL_FROM` | — | transactional email |
| `MSG91_AUTH_KEY` | — | SMS |
| `S3_REGION` / `S3_BUCKET` / `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` / `S3_FILE_URL` | — | uploads (bucket+keys together) |
| `SANITY_API_READ_TOKEN` | — | draft/preview reads |
| `MEDUSA_REVALIDATE_SECRET` | — | ISR revalidation webhook |
| `LOG_LEVEL` | — | `debug\|info\|warn\|error` |
| `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` | — | sourcemap upload at build |

## Backend (`medusa/.env`)
`DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `COOKIE_SECRET`, `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`, plus notifications: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `STOREFRONT_URL`, `MSG91_AUTH_KEY`, `MSG91_SENDER_ID`, `MSG91_TPL_*`.

## Cross-field rules (enforced by `config/env.ts`)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` must be set together.
- `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` must be set together.
- `AUTH_SECRET` is required when `NODE_ENV=production`.
