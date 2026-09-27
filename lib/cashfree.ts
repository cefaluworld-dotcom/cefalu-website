import "server-only";
import crypto from "node:crypto";
import { PaymentError } from "@/lib/errors";

const APP_ID = process.env.CASHFREE_APP_ID;
const SECRET = process.env.CASHFREE_SECRET_KEY;
const ENV = process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";
const BASE = ENV === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

export const isCashfreeConfigured = Boolean(APP_ID && SECRET);

const headers = () => ({
  "Content-Type": "application/json",
  "x-api-version": "2023-08-01",
  "x-client-id": APP_ID ?? "",
  "x-client-secret": SECRET ?? "",
});

export interface CashfreeOrder {
  cf_order_id: string;
  order_id: string;
  payment_session_id: string;
  order_status: string;
}

/** Create a Cashfree PG order; the session id powers their hosted checkout. */
export async function createCashfreeOrder(params: {
  orderId: string;
  amountRupees: number;
  customer: { id: string; email: string; phone: string; name: string };
  returnUrl: string;
  notes?: Record<string, string>;
}): Promise<CashfreeOrder> {
  if (!isCashfreeConfigured) throw new PaymentError("Cashfree is not configured");

  const res = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      order_id: params.orderId,
      order_amount: params.amountRupees,
      order_currency: "INR",
      customer_details: {
        customer_id: params.customer.id,
        customer_email: params.customer.email,
        customer_phone: params.customer.phone,
        customer_name: params.customer.name,
      },
      order_meta: { return_url: params.returnUrl, notify_url: undefined },
      order_note: "Cefalu order",
      order_tags: params.notes,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new PaymentError(`Cashfree order failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()) as CashfreeOrder;
}

export async function getCashfreeOrder(orderId: string): Promise<CashfreeOrder | null> {
  if (!isCashfreeConfigured) return null;
  const res = await fetch(`${BASE}/orders/${encodeURIComponent(orderId)}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as CashfreeOrder;
}

/** Webhook signature: base64(HMACSHA256(timestamp + rawBody, secret)). */
export function verifyCashfreeWebhook(rawBody: string, signature: string, timestamp: string): boolean {
  if (!SECRET) return false;
  const expected = crypto.createHmac("sha256", SECRET).update(timestamp + rawBody).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function cashfreeCheckoutUrl(paymentSessionId: string): string {
  const host = ENV === "production" ? "https://payments.cashfree.com" : "https://payments-test.cashfree.com";
  return `${host}/pg/view/sessions/checkout?payment_session_id=${encodeURIComponent(paymentSessionId)}`;
}
