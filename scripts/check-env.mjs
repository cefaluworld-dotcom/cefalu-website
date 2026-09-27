#!/usr/bin/env node
/**
 * Startup env check — run before `next start` in production (see Dockerfile CMD
 * and the deploy workflow). Fails fast with a readable report if required
 * production secrets are missing. Never prints secret values.
 */
const RED = "\x1b[31m", GREEN = "\x1b[32m", YELLOW = "\x1b[33m", RESET = "\x1b[0m";

const isProd = process.env.NODE_ENV === "production";

/** [name, requiredInProd, hint] */
const CHECKS = [
  ["AUTH_SECRET", true, "openssl rand -base64 32"],
  ["NEXT_PUBLIC_SITE_URL", true, "https://cefalu.in"],
  ["NEXT_PUBLIC_MEDUSA_BACKEND_URL", true, "https://api.cefalu.in"],
  ["NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY", true, "pk_… from Medusa admin"],
  ["RAZORPAY_KEY_ID", false, "rzp_live_…"],
  ["RAZORPAY_KEY_SECRET", false, "Razorpay dashboard"],
  ["RAZORPAY_WEBHOOK_SECRET", false, "required if webhooks are enabled"],
  ["CASHFREE_APP_ID", false, "optional gateway"],
  ["RESEND_API_KEY", false, "transactional email"],
  ["MEDUSA_ADMIN_API_KEY", false, "powers /api/admin/*"],
  ["PLATFORM_DATABASE_URL", false, "Prisma platform DB"],
  ["S3_BUCKET", false, "uploads"],
  ["NEXT_PUBLIC_SENTRY_DSN", false, "error tracking"],
];

let hardFail = false;
const missingOptional = [];

for (const [name, requiredInProd, hint] of CHECKS) {
  const present = Boolean(process.env[name]);
  if (present) continue;
  if (isProd && requiredInProd) {
    console.error(`${RED}✗ MISSING (required): ${name}${RESET}  → ${hint}`);
    hardFail = true;
  } else {
    missingOptional.push(`${name} (${hint})`);
  }
}

// Paired secrets
const pair = (a, b) => Boolean(process.env[a]) !== Boolean(process.env[b]);
if (pair("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET")) {
  console.error(`${RED}✗ GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set together${RESET}`);
  hardFail = true;
}

if (missingOptional.length) {
  console.warn(`${YELLOW}⚠ Optional env not set:${RESET}\n   - ${missingOptional.join("\n   - ")}`);
}

if (hardFail) {
  console.error(`\n${RED}Environment check failed. Set the required variables above.${RESET}`);
  process.exit(1);
}
console.log(`${GREEN}✓ Environment check passed${isProd ? " (production)" : ""}.${RESET}`);
