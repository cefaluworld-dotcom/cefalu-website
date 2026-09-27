import crypto from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";

const SECRET = "test_webhook_secret";
const KEY_SECRET = "test_key_secret";

beforeAll(() => {
  process.env.RAZORPAY_WEBHOOK_SECRET = SECRET;
  process.env.RAZORPAY_KEY_ID = "rzp_test_key";
  process.env.RAZORPAY_KEY_SECRET = KEY_SECRET;
});

describe("verifyRazorpayWebhook", () => {
  it("accepts a correctly signed body and rejects tampering", async () => {
    const { verifyRazorpayWebhook } = await import("@/lib/razorpay");
    const body = JSON.stringify({ event: "payment.captured" });
    const signature = crypto.createHmac("sha256", SECRET).update(body).digest("hex");

    expect(verifyRazorpayWebhook(body, signature)).toBe(true);
    expect(verifyRazorpayWebhook(body + " ", signature)).toBe(false);
    expect(verifyRazorpayWebhook(body, "deadbeef")).toBe(false);
  });
});

describe("verifyRazorpaySignature", () => {
  it("validates order|payment HMAC with the key secret", async () => {
    const { verifyRazorpaySignature } = await import("@/lib/razorpay");
    const orderId = "order_123";
    const paymentId = "pay_456";
    const signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    expect(verifyRazorpaySignature({ orderId, paymentId, signature })).toBe(true);
    expect(verifyRazorpaySignature({ orderId, paymentId: "pay_other", signature })).toBe(false);
  });
});
