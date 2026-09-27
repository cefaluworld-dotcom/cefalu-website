/** MSG91 flow SMS helper for backend events. No-ops without credentials. */

const AUTH_KEY = process.env.MSG91_AUTH_KEY;
const SENDER = process.env.MSG91_SENDER_ID ?? "CEFALU";

export async function sendSms(params: {
  mobile: string;
  templateId: string;
  variables?: Record<string, string>;
}): Promise<void> {
  if (!AUTH_KEY) return;
  try {
    await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: { "Content-Type": "application/json", authkey: AUTH_KEY },
      body: JSON.stringify({
        template_id: params.templateId,
        sender: SENDER,
        short_url: "0",
        recipients: [{ mobiles: `91${params.mobile}`, ...params.variables }],
      }),
    });
  } catch (error) {
    console.error("[medusa/sms] failed:", error);
  }
}

export const smsTemplates = {
  orderPlaced: process.env.MSG91_TPL_ORDER_PLACED ?? "",
  orderShipped: process.env.MSG91_TPL_ORDER_SHIPPED ?? "",
  orderDelivered: process.env.MSG91_TPL_ORDER_DELIVERED ?? "",
  otp: process.env.MSG91_TPL_OTP ?? "",
};
