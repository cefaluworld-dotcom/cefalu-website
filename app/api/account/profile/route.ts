import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { updateCustomer } from "@/services/customers";

export const dynamic = "force-dynamic";

const schema = z.object({
  firstName: z.string().min(1).max(60),
  lastName: z.string().min(1).max(60),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional().or(z.literal("")),
});

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.medusaToken) {
    return NextResponse.json({ success: false, error: "Sign in required" }, { status: 401 });
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
  const result = await updateCustomer(session.medusaToken, {
    first_name: parsed.data.firstName,
    last_name: parsed.data.lastName,
    ...(parsed.data.phone ? { phone: parsed.data.phone } : {}),
  });
  return NextResponse.json(result, { status: result.success ? 200 : 502 });
}
