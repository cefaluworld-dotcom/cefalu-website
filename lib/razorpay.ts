import "server-only";
import crypto from "node:crypto";

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export const isRazorpayConfigured = Boolean(KEY_ID && KEY_SECRET);

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export async function createRazorpayOrder(params: {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrder> {
  if (!KEY_ID || !KEY_SECRET) throw new Error("Razorpay is not configured");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64")}`,
    },
    body: JSON.stringify({
      amount: params.amountPaise,
      currency: "INR",
      receipt: params.receipt,
      notes: params.notes ?? {},
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Razorpay order creation failed (${res.status}): ${body}`);
  }

  return (await res.json()) as RazorpayOrder;
}

export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!KEY_SECRET) return false;

  const expected = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(params.signature, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function getRazorpayKeyId(): string | undefined {
  return KEY_ID;
}

interface RazorpayPayment {
  id: string;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
  amount: number;
  method?: string;
  order_id?: string;
}

const authHeader = () => ({
  Authorization: `Basic ${Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64")}`,
});

export async function fetchPaymentsForOrder(orderId: string): Promise<RazorpayPayment[]> {
  if (!KEY_ID || !KEY_SECRET) return [];
  const res = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}/payments`, {
    headers: authHeader(),
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { items: RazorpayPayment[] };
  return data.items ?? [];
}

export async function refundPayment(params: {
  paymentId: string;
  amountPaise?: number;
  notes?: Record<string, string>;
}): Promise<{ id: string; status: string; amount: number }> {
  if (!KEY_ID || !KEY_SECRET) throw new Error("Razorpay is not configured");
  const res = await fetch(
    `https://api.razorpay.com/v1/payments/${encodeURIComponent(params.paymentId)}/refund`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({
        ...(params.amountPaise ? { amount: params.amountPaise } : {}),
        notes: params.notes ?? {},
        speed: "normal",
      }),
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`Razorpay refund failed (${res.status}): ${await res.text()}`);
  return (await res.json()) as { id: string; status: string; amount: number };
}

/** Webhook signature: hex(HMACSHA256(rawBody, webhookSecret)). */
export function verifyRazorpayWebhook(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
