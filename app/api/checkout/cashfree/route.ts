import { z } from "zod";
import { withApi, ok } from "@/lib/api-handler";
import { PaymentError } from "@/lib/errors";
import { quoteOrder } from "@/lib/pricing";
import { createCashfreeOrder, cashfreeCheckoutUrl, isCashfreeConfigured } from "@/lib/cashfree";
import { siteConfig } from "@/config/site";

const bodySchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  name: z.string().min(2).max(120),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        title: z.string().min(1).max(200),
        unitPrice: z.number().int().positive().max(10_00_000),
        quantity: z.number().int().min(1).max(10),
      })
    )
    .min(1)
    .max(50),
  couponCode: z.string().max(20).optional(),
  shippingMethod: z.enum(["standard", "express"]).optional(),
});

export const dynamic = "force-dynamic";

/** Creates a Cashfree PG order and returns the hosted-checkout URL. */
export const POST = withApi({ name: "cashfree-order", bodySchema, limit: 10 }, async ({ body }) => {
  if (!isCashfreeConfigured) {
    throw new PaymentError("Cashfree isn't configured. Choose Razorpay or Cash on Delivery.");
  }

  const quote = quoteOrder({
    items: body.items,
    couponCode: body.couponCode,
    shippingMethod: body.shippingMethod,
    paymentMethod: "cashfree",
  });

  const orderId = `nutro_cf_${Date.now().toString(36)}`;
  const order = await createCashfreeOrder({
    orderId,
    amountRupees: quote.total,
    customer: {
      id: body.email.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40) || "guest",
      email: body.email,
      phone: body.phone,
      name: body.name,
    },
    returnUrl: `${siteConfig.url}/order-confirmed?ref={order_id}&gateway=cashfree`,
    notes: { coupon: quote.couponCode ?? "", items: String(body.items.length) },
  });

  return ok({
    orderId: order.order_id,
    paymentSessionId: order.payment_session_id,
    checkoutUrl: cashfreeCheckoutUrl(order.payment_session_id),
    amount: quote.total,
  });
});
