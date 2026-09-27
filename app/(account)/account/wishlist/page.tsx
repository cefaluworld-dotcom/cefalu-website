import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { WishlistView } from "@/components/product/wishlist-view";

export const metadata: Metadata = constructMetadata({
  title: "Wishlist", pathname: "/account/wishlist", noIndex: true,
});

export default function AccountWishlistPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Wishlist</h1>
      <div className="mt-6"><WishlistView /></div>
    </div>
  );
}
