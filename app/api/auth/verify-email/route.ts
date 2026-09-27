import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { activity } from "@/lib/logger";

export const dynamic = "force-dynamic";

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret");

/** Verifies the emailed token and redirects to the account with a status flag. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const redirectTo = (status: "verified" | "invalid") =>
    NextResponse.redirect(new URL(`/account?emailVerification=${status}`, request.nextUrl.origin));

  if (!token) return redirectTo("invalid");

  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.purpose !== "verify-email" || typeof payload.email !== "string") {
      return redirectTo("invalid");
    }
    activity("email.verified", { email: payload.email });
    return redirectTo("verified");
  } catch {
    return redirectTo("invalid");
  }
}
