import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import type { PageProps } from "@/types";
import { ROUTES } from "@/constants";
import { constructMetadata } from "@/lib/seo";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = constructMetadata({
  title: "Payment Failed",
  pathname: "/order-failed",
  noIndex: true,
});

export default async function OrderFailedPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const reason = typeof params?.reason === "string" ? params.reason : null;

  return (
    <Section padding="lg">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="size-10 text-destructive" aria-hidden="true" />
        </span>
        <h1 className="text-display-sm md:text-display-md">Payment didn&apos;t go through</h1>
        <p className="text-muted-foreground">
          {reason ?? "The transaction was cancelled or declined."} Your cart is safe — nothing was charged, and any bank hold auto-reverses within 5–7 business days.
        </p>
        <div className="mt-2 flex flex-col gap-3 xs:flex-row">
          <Button asChild size="lg">
            <Link href={ROUTES.checkout}>Try again</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={ROUTES.contact}>Contact support</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
