import { z } from "zod";
import { withApi, ok } from "@/lib/api-handler";
import { fetchPaymentsForOrder } from "@/lib/razorpay";
import { getCashfreeOrder } from "@/lib/cashfree";

const querySchema = z.object({
  gateway: z.enum(["razorpay", "cashfree"]),
  orderId: z.string().min(3).max(120),
});

export const dynamic = "force-dynamic";

/** Payment status lookup for retry flows and support. */
export const GET = withApi({ name: "payment-status", querySchema, limit: 20 }, async ({ query }) => {
  if (query.gateway === "razorpay") {
    const payments = await fetchPaymentsForOrder(query.orderId);
    const latest = payments[payments.length - 1] ?? null;
    return ok({
      gateway: "razorpay",
      orderId: query.orderId,
      status: latest?.status ?? "created",
      paymentId: latest?.id ?? null,
      canRetry: !latest || latest.status === "failed" || latest.status === "created",
    });
  }

  const order = await getCashfreeOrder(query.orderId);
  return ok({
    gateway: "cashfree",
    orderId: query.orderId,
    status: order?.order_status?.toLowerCase() ?? "not_found",
    paymentId: order?.cf_order_id ?? null,
    canRetry: !order || order.order_status !== "PAID",
  });
});
