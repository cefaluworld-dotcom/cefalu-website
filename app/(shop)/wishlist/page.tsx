import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { Section } from "@/components/layout/section";
import { WishlistView } from "@/components/product/wishlist-view";

export const metadata: Metadata = constructMetadata({
  title: "Your Wishlist",
  pathname: "/wishlist",
  noIndex: true,
});

export default function WishlistPage() {
  return (
    <Section eyebrow="Saved for someday" title="Your wishlist" padding="sm">
      <WishlistView />
    </Section>
  );
}
