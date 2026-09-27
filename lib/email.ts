import "server-only";
import { Resend } from "resend";
import { logger } from "@/lib/logger";

const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM_EMAIL ?? "Cefalu <onboarding@resend.dev>";

export const isEmailConfigured = Boolean(API_KEY);

/**
 * Thin Resend wrapper: never throws (transactional email must not break the
 * request path); logs and no-ops when the key is missing.
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean }> {
  if (!API_KEY) {
    logger.warn("[email] RESEND_API_KEY missing; skipped", { subject: params.subject });
    return { success: false };
  }
  try {
    const resend = new Resend(API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    if (error) {
      logger.error("[email] send failed", { message: error.message });
      return { success: false };
    }
    return { success: true };
  } catch (error) {
    logger.error("[email] send threw", { message: String(error) });
    return { success: false };
  }
}
