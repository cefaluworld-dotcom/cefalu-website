import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { sendEmail, templates } from "../lib/email";

/** Emails the reset link when Medusa emits auth.password_reset (completes the storefront flow). */
export default async function passwordResetHandler({
  event,
}: SubscriberArgs<{ entity_id: string; token: string; actor_type: string }>) {
  const { entity_id: email, token, actor_type } = event.data;
  if (actor_type !== "customer") return;
  await sendEmail({
    to: email,
    subject: "Reset your Cefalu password",
    html: templates.passwordReset(email, token),
  });
}

export const config: SubscriberConfig = { event: "auth.password_reset" };
