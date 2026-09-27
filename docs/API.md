# API Reference

All storefront APIs live under `/api`. The machine-readable spec is served at **`/api/openapi`** (OpenAPI 3.1) and rendered human-readably at **`/api-docs`**. Every non-webhook route is wrapped by `withApi()` (rate limiting, zod validation, role guard, structured logs, `AppError` mapping).

## Conventions
- **Auth**: session cookie (Auth.js). Role routes require `customer` / `moderator` / `admin` (from `ADMIN_EMAILS` / `MODERATOR_EMAILS`).
- **Errors**: `{ success:false, error, code, details? }` with codes `VALIDATION_ERROR`, `AUTH_ERROR`, `FORBIDDEN`, `NOT_FOUND`, `RATE_LIMITED`, `PAYMENT_ERROR`, `UPSTREAM_ERROR`, `INTERNAL_ERROR`.
- **Success**: `{ success:true, ...data }`.
- **Rate limits**: per-IP per-route (defaults 30/min; sensitive routes lower).

## Catalog
| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/products?handles=a,b` | Ordered `ProductCardData[]` (max 12) |
| GET | `/api/search?q=` | Instant results + goal suggestions |

## Checkout & payments
| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/checkout/razorpay` | Create Razorpay order (server-computed total) |
| POST | `/api/checkout/razorpay/verify` | Verify payment signature |
| POST | `/api/checkout/cashfree` | Create Cashfree order → hosted checkout URL |
| POST | `/api/checkout/complete` | Finalize order in Medusa after payment/COD |
| GET | `/api/payments/status?gateway=&orderId=` | Status + `canRetry` |
| POST | `/api/webhooks/razorpay` | HMAC-verified; audit-logged |
| POST | `/api/webhooks/cashfree` | HMAC-verified (`x-webhook-signature`/`-timestamp`) |

## Auth & account
| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/auth/register` | Creates customer; fires verification email |
| POST | `/api/auth/forgot` / `/api/auth/reset` | Medusa reset-token flow |
| POST | `/api/auth/send-verification` · GET `/api/auth/verify-email` | Signed 24h JWT link |
| PATCH | `/api/account/profile` | Update name/phone (session) |
| POST/DELETE | `/api/account/addresses` | Add / remove address (session) |
| POST | `/api/account/delete` | Delete account (typed `confirm:"DELETE"`) |

## Marketing
| Method | Path |
| --- | --- |
| POST | `/api/newsletter` · `/api/contact` |

## Admin (`moderator`/`admin`)
| Method | Path | Role |
| --- | --- | --- |
| GET | `/api/admin/dashboard` | admin |
| GET | `/api/admin/orders` · `/customers` · `/products` | moderator |
| GET | `/api/admin/inventory` · `/reports/sales?days=` | admin |
| GET | `/api/admin/coupons` | moderator |
| POST | `/api/admin/refunds` | admin |
| POST | `/api/admin/uploads` | moderator (presigned S3 PUT) |

## Health
`GET /api/health` → `{ status, uptime, timestamp }` (used by ALB/Docker healthchecks).

## Medusa backend routes
Custom store/admin routes served by the Medusa app: `GET/POST /store/reviews`, `GET/POST/DELETE /store/wishlist`, `GET/POST /admin/reviews`. See `medusa/src/api`.
