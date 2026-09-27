import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 });

const bodySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(150),
  message: z.string().min(10).max(2000),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  if (!limiter.check(3, `contact:${ip}`).success) {
    return NextResponse.json(
      { success: false, error: "Too many messages. Try again in a minute." },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[api/contact] Resend not configured; message logged only.", parsed.data.subject);
    return NextResponse.json({ success: true });
  }

  try {
    const resend = new Resend(apiKey);
    const { name, email, subject, message } = parsed.data;
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Cefalu Website <onboarding@resend.dev>",
      to: siteConfig.contact.email,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error("[api/contact] Resend error:", error);
      return NextResponse.json(
        { success: false, error: "Couldn't send right now. Email us directly instead." },
        { status: 502 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/contact]", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}
