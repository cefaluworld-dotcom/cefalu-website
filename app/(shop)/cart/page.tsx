import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = constructMetadata({
  title: "Your Cart",
  pathname: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return <CartView />;
}
