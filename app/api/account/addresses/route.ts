import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { addAddress, deleteAddress } from "@/services/customers";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address1: z.string().min(5),
  address2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^[1-9]\d{5}$/),
  phone: z.string().regex(/^[6-9]\d{9}$/),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.medusaToken) return NextResponse.json({ success: false, error: "Sign in required" }, { status: 401 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid body" }, { status: 400 });
  }
  const parsed = createSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 422 });
  }
  const d = parsed.data;
  const result = await addAddress(session.medusaToken, {
    first_name: d.firstName,
    last_name: d.lastName,
    address_1: d.address1,
    address_2: d.address2,
    city: d.city,
    province: d.state,
    postal_code: d.pincode,
    country_code: "in",
    phone: d.phone,
  });
  return NextResponse.json(result, { status: result.success ? 200 : 502 });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.medusaToken) return NextResponse.json({ success: false }, { status: 401 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ success: false }, { status: 400 });
  const result = await deleteAddress(session.medusaToken, id);
  return NextResponse.json(result, { status: result.success ? 200 : 502 });
}
