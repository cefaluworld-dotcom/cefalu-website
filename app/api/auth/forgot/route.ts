import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { medusa, isMedusaConfigured } from "@/lib/medusa/client";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 });
const schema = z.object({ email: z.string().email() });

/**
 * Triggers Medusa's password-reset flow (emits auth.password_reset with a
 * one-time token; the backend's notification subscriber emails the link to
 * /reset-password?token=…&email=…). Always responds success to avoid
 * account enumeration.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (!limiter.check(3, `forgot:${ip}`).success) {
    return NextResponse.json({ success: false, error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid body" }, { status: 400 });
  }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Enter a valid email" }, { status: 422 });
  }

  if (isMedusaConfigured) {
    try {
      await medusa.auth.resetPassword("customer", "emailpass", { identifier: parsed.data.email });
    } catch {
      // swallow: same response whether or not the account exists
    }
  }
  return NextResponse.json({ success: true });
}
