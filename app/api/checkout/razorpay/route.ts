import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createRazorpayOrder, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { quoteOrder } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 });

const bodySchema = z.object({
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
  email: z.string().email(),
  couponCode: z.string().max(20).optional(),
  shippingMethod: z.enum(["standard", "express"]).optional(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (!limiter.check(10, `rzp-order:${ip}`).success) {
    return NextResponse.json({ success: false, error: "Too many attempts." }, { status: 429 });
  }

  if (!isRazorpayConfigured) {
    return NextResponse.json(
      { success: false, error: "Online payment isn't configured. Choose Cash on Delivery." },
      { status: 503 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  // Server-side total: never trust a client-computed amount.
  const quote = quoteOrder({
    items: parsed.data.items,
    couponCode: parsed.data.couponCode,
    shippingMethod: parsed.data.shippingMethod,
    paymentMethod: "razorpay",
  });
  const totalPaise = quote.totalPaise;

  try {
    const order = await createRazorpayOrder({
      amountPaise: totalPaise,
      receipt: `nutro_${Date.now().toString(36)}`,
      notes: { email: parsed.data.email, items: String(parsed.data.items.length) },
    });

    return NextResponse.json({
      success: true,
      order: { id: order.id, amount: order.amount, currency: order.currency },
      keyId: getRazorpayKeyId(),
    });
  } catch (error) {
    console.error("[api/checkout/razorpay]", error);
    return NextResponse.json(
      { success: false, error: "Couldn't initiate payment. Please try again." },
      { status: 502 }
    );
  }
}
