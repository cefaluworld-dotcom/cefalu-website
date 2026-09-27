import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { medusa, isMedusaConfigured } from "@/lib/medusa/client";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 });
const schema = z.object({
  email: z.string().email(),
  token: z.string().min(10),
  password: z.string().min(8).max(72),
});

/** Completes Medusa's reset flow using the emailed one-time token. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (!limiter.check(5, `reset:${ip}`).success) {
    return NextResponse.json({ success: false, error: "Too many attempts." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid body" }, { status: 400 });
  }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 422 });
  }

  if (!isMedusaConfigured) {
    return NextResponse.json(
      { success: false, error: "Password reset needs the commerce backend online." },
      { status: 503 }
    );
  }

  try {
    await medusa.auth.updateProvider(
      "customer",
      "emailpass",
      { email: parsed.data.email, password: parsed.data.password },
      parsed.data.token
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Reset link is invalid or expired. Request a new one." },
      { status: 400 }
    );
  }
}
