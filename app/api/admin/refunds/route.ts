import { z } from "zod";
import { withApi, ok } from "@/lib/api-handler";
import { refundPayment } from "@/lib/razorpay";
import { audit } from "@/lib/logger";

const bodySchema = z.object({
  paymentId: z.string().min(5).max(60),
  amountRupees: z.number().int().positive().max(10_00_000).optional(),
  reason: z.string().min(3).max(300),
});

export const dynamic = "force-dynamic";

/** Admin-only Razorpay refund (full when amount omitted). */
export const POST = withApi(
  { name: "admin-refund", bodySchema, role: "admin", limit: 10 },
  async ({ body, actor }) => {
    const refund = await refundPayment({
      paymentId: body.paymentId,
      amountPaise: body.amountRupees ? body.amountRupees * 100 : undefined,
      notes: { reason: body.reason, by: actor?.email ?? "admin" },
    });
    audit("refund.initiated", {
      refundId: refund.id,
      paymentId: body.paymentId,
      amountPaise: refund.amount,
      by: actor?.email,
      reason: body.reason,
    });
    return ok({ refundId: refund.id, status: refund.status, amountPaise: refund.amount });
  }
);
