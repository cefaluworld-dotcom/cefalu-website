import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { Section } from "@/components/layout/section";
import { CheckoutView } from "@/components/forms/checkout-view";

export const metadata: Metadata = constructMetadata({
  title: "Checkout",
  pathname: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <Section eyebrow="Secure checkout" title="Almost there" padding="sm">
      <CheckoutView />
    </Section>
  );
}
