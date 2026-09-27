import { NextResponse, type NextRequest } from "next/server";
import { verifyRazorpayWebhook } from "@/lib/razorpay";
import { logger, activity, audit } from "@/lib/logger";

export const dynamic = "force-dynamic";

interface RazorpayWebhookEvent {
  event: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string; amount?: number; status?: string; method?: string } };
    refund?: { entity?: { id?: string; payment_id?: string; amount?: number; status?: string } };
  };
}

/**
 * Razorpay webhook receiver. Signature-verified with RAZORPAY_WEBHOOK_SECRET;
 * events are audit-logged (payment.captured / payment.failed / refund.processed)
 * for reconciliation. Always ACK verified events with 200.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!verifyRazorpayWebhook(rawBody, signature)) {
    logger.warn("[webhook/razorpay] invalid signature");
    return NextResponse.json({ received: false }, { status: 400 });
  }

  let event: RazorpayWebhookEvent;
  try {
    event = JSON.parse(rawBody) as RazorpayWebhookEvent;
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  const payment = event.payload?.payment?.entity;
  const refund = event.payload?.refund?.entity;

  switch (event.event) {
    case "payment.captured":
      activity("payment.captured", {
        gateway: "razorpay",
        paymentId: payment?.id,
        orderId: payment?.order_id,
        amountPaise: payment?.amount,
        method: payment?.method,
      });
      break;
    case "payment.failed":
      activity("payment.failed", {
        gateway: "razorpay",
        paymentId: payment?.id,
        orderId: payment?.order_id,
      });
      break;
    case "refund.processed":
      audit("refund.processed", {
        gateway: "razorpay",
        refundId: refund?.id,
        paymentId: refund?.payment_id,
        amountPaise: refund?.amount,
      });
      break;
    default:
      logger.info("[webhook/razorpay] unhandled event", { event: event.event });
  }

  return NextResponse.json({ received: true });
}
