import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Missing payment fields" }, { status: 422 });
  }

  const valid = verifyRazorpaySignature({
    orderId: parsed.data.razorpay_order_id,
    paymentId: parsed.data.razorpay_payment_id,
    signature: parsed.data.razorpay_signature,
  });

  if (!valid) {
    return NextResponse.json(
      { success: false, error: "Payment verification failed." },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, paymentId: parsed.data.razorpay_payment_id });
}
