import "server-only";

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID ?? "CEFALU";

export const isSmsConfigured = Boolean(MSG91_AUTH_KEY);

/** Send a transactional SMS via MSG91 Flow API. No-ops when unconfigured. */
export async function sendSms(params: {
  mobile: string; // 10-digit Indian number
  templateId: string;
  variables?: Record<string, string>;
}): Promise<{ success: boolean; error?: string }> {
  if (!MSG91_AUTH_KEY) {
    console.warn("[lib/sms] MSG91 not configured; skipping SMS.");
    return { success: true };
  }

  try {
    const res = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: { "Content-Type": "application/json", authkey: MSG91_AUTH_KEY },
      body: JSON.stringify({
        template_id: params.templateId,
        sender: MSG91_SENDER_ID,
        short_url: "0",
        recipients: [{ mobiles: `91${params.mobile}`, ...params.variables }],
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text();
      return { success: false, error: `MSG91 ${res.status}: ${body}` };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "SMS failed" };
  }
}

/* -------------------- Event-specific service layer -------------------- */

const TPL = {
  otp: process.env.MSG91_TPL_OTP ?? "",
  orderUpdate: process.env.MSG91_TPL_ORDER_PLACED ?? "",
  shippingUpdate: process.env.MSG91_TPL_ORDER_SHIPPED ?? "",
  deliveryAlert: process.env.MSG91_TPL_ORDER_DELIVERED ?? "",
} as const;

/** OTP delivery for login/verification flows (##OTP## variable in the DLT template). */
export function sendOtp(mobile: string, otp: string) {
  return sendSms({ mobile, templateId: TPL.otp, variables: { otp } });
}

/** Order placed/updated notification. */
export function sendOrderUpdate(mobile: string, orderId: string, amount: string) {
  return sendSms({ mobile, templateId: TPL.orderUpdate, variables: { order_id: orderId, amount } });
}

/** Shipment-on-the-way notification with tracking number. */
export function sendShippingUpdate(mobile: string, orderId: string, tracking: string) {
  return sendSms({ mobile, templateId: TPL.shippingUpdate, variables: { order_id: orderId, tracking } });
}

/** Delivered alert. */
export function sendDeliveryAlert(mobile: string, orderId: string) {
  return sendSms({ mobile, templateId: TPL.deliveryAlert, variables: { order_id: orderId } });
}
