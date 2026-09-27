import { NextResponse, type NextRequest } from "next/server";
import { verifyCashfreeWebhook } from "@/lib/cashfree";
import { logger, activity } from "@/lib/logger";

export const dynamic = "force-dynamic";

interface CashfreeWebhookEvent {
  type: string;
  data?: {
    order?: { order_id?: string; order_amount?: number };
    payment?: { cf_payment_id?: number; payment_status?: string; payment_method?: Record<string, unknown> };
  };
}

/** Cashfree webhook receiver — HMAC verified via x-webhook-signature/timestamp headers. */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature") ?? "";
  const timestamp = request.headers.get("x-webhook-timestamp") ?? "";

  if (!verifyCashfreeWebhook(rawBody, signature, timestamp)) {
    logger.warn("[webhook/cashfree] invalid signature");
    return NextResponse.json({ received: false }, { status: 400 });
  }

  let event: CashfreeWebhookEvent;
  try {
    event = JSON.parse(rawBody) as CashfreeWebhookEvent;
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  activity(`cashfree.${event.type.toLowerCase()}`, {
    gateway: "cashfree",
    orderId: event.data?.order?.order_id,
    amount: event.data?.order?.order_amount,
    paymentId: event.data?.payment?.cf_payment_id,
    status: event.data?.payment?.payment_status,
  });

  return NextResponse.json({ received: true });
}
