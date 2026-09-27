import { withApi, ok } from "@/lib/api-handler";
import { COUPONS } from "@/constants";

export const dynamic = "force-dynamic";

/**
 * Coupon catalog (read). Codes are config-driven and applied server-side by
 * the pricing engine; the platform DB `Coupon` table becomes the source of
 * truth once the sync job is enabled.
 */
export const GET = withApi({ name: "admin-coupons", role: "moderator", limit: 60 }, async () =>
  ok({
    coupons: Object.entries(COUPONS).map(([code, c]) => ({
      code,
      percentOff: c.percentOff,
      label: c.label,
      isActive: true,
    })),
  })
);
