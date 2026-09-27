import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import type { PageProps } from "@/types";
import { ROUTES } from "@/constants";
import { constructMetadata } from "@/lib/seo";
import { getCashfreeOrder } from "@/lib/cashfree";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = constructMetadata({
  title: "Order Confirmed",
  pathname: "/order-confirmed",
  noIndex: true,
});

export default async function OrderConfirmedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const ref = typeof params?.ref === "string" ? params.ref : null;
  const gateway = typeof params?.gateway === "string" ? params.gateway : null;

  if (gateway === "cashfree" && ref) {
    const order = await getCashfreeOrder(ref);
    if (order && order.order_status !== "PAID") {
      redirect(`/order-failed?reason=${encodeURIComponent("Cashfree reports this order as " + order.order_status.toLowerCase() + ".")}`);
    }
  }

  return (
    <Section padding="lg">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
        </span>
        <h1 className="text-display-sm md:text-display-md">Order confirmed 🎉</h1>
        <p className="text-muted-foreground">
          Thank you for choosing Cefalu. A confirmation email with tracking details is
          on its way. Your order will be delivered in 2–6 business days.
        </p>
        {ref && (
          <p className="rounded-full bg-surface px-4 py-2 font-mono text-sm">
            Reference: <strong>{ref}</strong>
          </p>
        )}
        <div className="mt-2 flex flex-col gap-3 xs:flex-row">
          <Button asChild size="lg">
            <Link href={ROUTES.shop}>Continue shopping</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={ROUTES.sizeGuide}>Size guide</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
