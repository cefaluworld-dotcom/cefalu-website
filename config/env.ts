import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  AUTH_SECRET: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_AUDIENCE_ID: z.string().min(1).optional(),
  EMAIL_FROM: z.string().min(1).default("Cefalu <hello@cefalu.in>"),
  MSG91_AUTH_KEY: z.string().min(1).optional(),
  RAZORPAY_KEY_ID: z.string().min(1).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
  CASHFREE_APP_ID: z.string().min(1).optional(),
  CASHFREE_SECRET_KEY: z.string().min(1).optional(),
  SANITY_API_READ_TOKEN: z.string().min(1).optional(),
  MEDUSA_REVALIDATE_SECRET: z.string().min(1).optional(),
  // Day 3 additions
  PLATFORM_DATABASE_URL: z.string().url().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1).optional(),
  CASHFREE_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  MEDUSA_ADMIN_API_KEY: z.string().min(1).optional(),
  ADMIN_EMAILS: z.string().optional(),
  MODERATOR_EMAILS: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  S3_REGION: z.string().default("ap-south-1"),
  S3_BUCKET: z.string().min(1).optional(),
  S3_ACCESS_KEY_ID: z.string().min(1).optional(),
  S3_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  S3_FILE_URL: z.string().url().optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
})
  .refine((e) => !e.GOOGLE_CLIENT_ID === !e.GOOGLE_CLIENT_SECRET, {
    message: "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set together",
    path: ["GOOGLE_CLIENT_SECRET"],
  })
  .refine(
    (e) =>
      (!e.S3_BUCKET && !e.S3_ACCESS_KEY_ID && !e.S3_SECRET_ACCESS_KEY) ||
      (e.S3_BUCKET && e.S3_ACCESS_KEY_ID && e.S3_SECRET_ACCESS_KEY),
    { message: "S3 needs bucket + access key + secret together", path: ["S3_BUCKET"] }
  )
  .refine((e) => e.NODE_ENV !== "production" || !!e.AUTH_SECRET, {
    message: "AUTH_SECRET is required in production",
    path: ["AUTH_SECRET"],
  });

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_MEDUSA_BACKEND_URL: z.string().url().default("http://localhost:9000"),
  NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().default("production"),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().default("2025-01-01"),
  NEXT_PUBLIC_GTM_ID: z.string().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  AUTH_SECRET: process.env.AUTH_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
  EMAIL_FROM: process.env.EMAIL_FROM,
  MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  CASHFREE_APP_ID: process.env.CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY,
  SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
  MEDUSA_REVALIDATE_SECRET: process.env.MEDUSA_REVALIDATE_SECRET,
  PLATFORM_DATABASE_URL: process.env.PLATFORM_DATABASE_URL,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  CASHFREE_ENV: process.env.CASHFREE_ENV,
  MEDUSA_ADMIN_API_KEY: process.env.MEDUSA_ADMIN_API_KEY,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS,
  MODERATOR_EMAILS: process.env.MODERATOR_EMAILS,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  S3_REGION: process.env.S3_REGION,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  S3_FILE_URL: process.env.S3_FILE_URL,
  LOG_LEVEL: process.env.LOG_LEVEL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_MEDUSA_BACKEND_URL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
  NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
} as const;

const isServer = typeof window === "undefined";
const skip = !!process.env.SKIP_ENV_VALIDATION;

function parseEnv() {
  if (skip) return processEnv as ClientEnv & ServerEnv;
  const parsed = isServer
    ? serverSchema.and(clientSchema).safeParse(processEnv)
    : clientSchema.safeParse(processEnv);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  return parsed.data as ClientEnv & ServerEnv;
}

type ServerEnv = z.infer<typeof serverSchema>;
type ClientEnv = z.infer<typeof clientSchema>;

export const env = parseEnv();
