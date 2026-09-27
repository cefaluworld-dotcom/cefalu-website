import { z } from "zod";
import { withApi, ok } from "@/lib/api-handler";
import { completeOrder } from "@/services/checkout";

const addressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address1: z.string().min(5),
  address2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^[1-9]\d{5}$/),
});

const bodySchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  address: addressSchema,
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
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["razorpay", "cashfree", "cod"]),
  couponCode: z.string().max(20).optional(),
  paymentReference: z.string().min(3).max(120),
});

export const dynamic = "force-dynamic";

/** Finalizes checkout: writes the real order into Medusa (inventory-validated) after payment. */
export const POST = withApi(
  { name: "checkout-complete", bodySchema, limit: 10 },
  async ({ body }) => {
    const result = await completeOrder(body);
    return ok({
      orderId: result.orderId,
      displayId: result.displayId,
      medusaOrder: result.medusaOrder,
      total: result.quote.total,
    });
  }
);
