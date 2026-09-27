import Medusa from "@medusajs/js-sdk";

export const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";

export const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  debug: process.env.NODE_ENV === "development",
});

export const isMedusaConfigured = Boolean(process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY);
