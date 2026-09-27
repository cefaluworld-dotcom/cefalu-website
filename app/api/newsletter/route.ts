import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 });

const bodySchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const { success: allowed, reset } = limiter.check(5, `newsletter:${ip}`);

  if (!allowed) {
    return NextResponse.json(
      { success: false, error: "Too many attempts. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) },
      }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid email" },
      { status: 422 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.warn("[api/newsletter] Resend not configured; subscription accepted without sync.");
    return NextResponse.json({ success: true });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.contacts.create({
      email: parsed.data.email,
      audienceId,
      unsubscribed: false,
    });

    if (error) {
      console.error("[api/newsletter] Resend error:", error);
      return NextResponse.json(
        { success: false, error: "Subscription failed. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/newsletter] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
