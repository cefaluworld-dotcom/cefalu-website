import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { medusa, isMedusaConfigured } from "@/lib/medusa/client";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 });

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(60),
  lastName: z.string().min(1, "Last name is required").max(60),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (!limiter.check(5, `register:${ip}`).success) {
    return NextResponse.json(
      { success: false, error: "Too many attempts. Try again shortly." },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid body" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  if (!isMedusaConfigured) {
    return NextResponse.json(
      { success: false, error: "Accounts are not available yet — commerce backend not configured." },
      { status: 503 }
    );
  }

  const { firstName, lastName, email, password } = parsed.data;

  try {
    const token = await medusa.auth.register("customer", "emailpass", { email, password });
    await medusa.store.customer.create(
      { email, first_name: firstName, last_name: lastName },
      {},
      { Authorization: `Bearer ${token}` }
    );
    // Fire-and-forget email verification (self-call keeps the JWT signing in one place)
    void fetch(`${siteConfig.url}/api/auth/send-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: parsed.data.email, firstName: parsed.data.firstName }),
    }).catch(() => undefined);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error && /exists|identity/i.test(error.message)
        ? "An account with this email already exists."
        : "Registration failed. Please try again.";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
