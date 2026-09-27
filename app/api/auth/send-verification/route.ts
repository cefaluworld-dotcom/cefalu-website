import { z } from "zod";
import { SignJWT } from "jose";
import { withApi, ok } from "@/lib/api-handler";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/config/site";

const bodySchema = z.object({ email: z.string().email(), firstName: z.string().max(60).optional() });

export const dynamic = "force-dynamic";

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret");

/** Sends a signed email-verification link (24h expiry). Generic response to prevent enumeration. */
export const POST = withApi({ name: "send-verification", bodySchema, limit: 5 }, async ({ body }) => {
  const token = await new SignJWT({ email: body.email, purpose: "verify-email" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret());

  const url = `${siteConfig.url}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
  await sendEmail({
    to: body.email,
    subject: "Verify your email — Cefalu",
    html: `
      <div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px">
        <h1 style="color:#1F4E9E;font-size:22px">Confirm it's you</h1>
        <p style="color:#1F2937;font-size:15px;line-height:24px">
          Hi ${body.firstName ?? "there"}, tap below to verify <strong>${body.email}</strong>.
          The link expires in 24 hours.
        </p>
        <p style="text-align:center;margin:24px 0">
          <a href="${url}" style="background:#1F4E9E;border-radius:999px;color:#fff;display:inline-block;font-weight:600;padding:12px 32px;text-decoration:none">Verify email</a>
        </p>
        <p style="color:#6B7280;font-size:12px">Didn't create a Cefalu account? Ignore this email.</p>
      </div>`,
  });

  return ok({ sent: true });
});
