/** Resend transactional email via REST (no SDK dependency). */

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM_EMAIL ?? "Cefalu <onboarding@resend.dev>";
const STORE_URL = process.env.STOREFRONT_URL ?? "http://localhost:3000";

export const isEmailConfigured = Boolean(RESEND_KEY);

export async function sendEmail(params: { to: string; subject: string; html: string }): Promise<void> {
  if (!RESEND_KEY) {
    console.warn("[medusa/email] RESEND_API_KEY missing; skipped:", params.subject);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_KEY}` },
    body: JSON.stringify({ from: FROM, to: params.to, subject: params.subject, html: params.html }),
  });
  if (!res.ok) console.error("[medusa/email] send failed:", res.status, await res.text());
}

const shell = (title: string, body: string) => `
<div style="background:#F4F7FB;padding:32px 16px;font-family:Helvetica,Arial,sans-serif">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:32px">
    <h1 style="color:#1F4E9E;font-size:22px;margin:0 0 12px">${title}</h1>
    ${body}
    <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0" />
    <p style="color:#6B7280;font-size:12px;line-height:18px;margin:0">
      Cefalu Apparel Pvt. Ltd. · Mumbai, India<br/>
      Questions? Reply to this email or write to care@cefalu.in.
    </p>
  </div>
</div>`;

const p = (text: string) => `<p style="color:#1F2937;font-size:15px;line-height:24px;margin:0 0 12px">${text}</p>`;
const btn = (href: string, label: string) =>
  `<p style="text-align:center;margin:24px 0"><a href="${href}" style="background:#1F4E9E;border-radius:999px;color:#fff;display:inline-block;font-size:15px;font-weight:600;padding:12px 32px;text-decoration:none">${label}</a></p>`;

export const templates = {
  passwordReset: (email: string, token: string) =>
    shell(
      "Reset your password",
      p("We received a request to reset your Cefalu password. The link below is valid for 15 minutes.") +
        btn(`${STORE_URL}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`, "Choose a new password") +
        p("If you didn't request this, you can safely ignore this email — your password is unchanged.")
    ),

  welcome: (firstName: string) =>
    shell(
      `Welcome, ${firstName} 🌿`,
      p("Thanks for joining Cefalu. Check each product's size chart; returns and exchanges may be requested within 7 days, subject to our policy.") +
        p("Your welcome gift: <strong style=\"color:#1F4E9E;letter-spacing:3px\">WELCOME10</strong> — 10% off your first order.") +
        btn(`${STORE_URL}/shop`, "Shop bestsellers")
    ),

  orderConfirmation: (o: { displayId: string | number; total: string; itemsHtml: string }) =>
    shell(
      "Order confirmed 🎉",
      p(`Thanks for your order <strong>#${o.displayId}</strong>. We're packing it now — expect delivery within 2–5 business days.`) +
        `<div style="margin:16px 0">${o.itemsHtml}</div>` +
        p(`<strong>Total: <span style="color:#1F4E9E">${o.total}</span></strong>`)
    ),

  orderShipped: (o: { displayId: string | number; tracking?: string }) =>
    shell(
      "Your order is on the way 🚚",
      p(`Order <strong>#${o.displayId}</strong> has been shipped.`) +
        (o.tracking ? p(`Tracking number: <strong>${o.tracking}</strong>`) : "") +
        btn(`${STORE_URL}/account/orders`, "Track your order")
    ),

  orderDelivered: (o: { displayId: string | number }) =>
    shell(
      "Delivered ✅",
      p(`Order <strong>#${o.displayId}</strong> was delivered. We hope you enjoy your Cefalu purchase.`) +
        p("If there is a problem with your order, contact us with your order number and unboxing photos or video.") +
        btn(`${STORE_URL}/account/orders`, "Leave a review")
    ),
};

export const inr = (amount: number) => `₹${Math.round(amount).toLocaleString("en-IN")}`;
