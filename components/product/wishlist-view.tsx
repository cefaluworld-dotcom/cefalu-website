"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Leaf, Share2, ShoppingBag, Trash2 } from "lucide-react";
import type { WishlistItem } from "@/types";
import { ROUTES } from "@/constants";
import { siteConfig } from "@/config/site";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";

export function WishlistView() {
  const mounted = useMounted();
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);

  function moveToCart(item: WishlistItem) {
    addItem({
      variantId: item.variantId,
      productId: item.productId,
      handle: item.handle,
      title: item.title,
      variantTitle: "Default",
      thumbnail: item.thumbnail,
      unitPrice: item.price.amount,
      currencyCode: item.price.currencyCode,
      quantity: 1,
    });
    remove(item.handle);
    toast.success("Moved to cart", { description: item.title });
  }

  async function share() {
    const url = `${siteConfig.url}${ROUTES.shop}?wishlist=${items.map((i) => i.handle).join(",")}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Cefalu wishlist", url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Wishlist link copied");
      }
    } catch {
      /* user dismissed share sheet */
    }
  }

  if (!mounted) {
    return (
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />)}
      </ul>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-10 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-secondary">
          <Heart className="size-9 text-primary" aria-hidden="true" />
        </span>
        <h2 className="font-display text-2xl font-bold">Nothing saved yet</h2>
        <p className="text-muted-foreground">Tap the heart on any product to keep it here for later.</p>
        <Button asChild size="lg">
          <Link href={ROUTES.shop}>Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} item{items.length === 1 ? "" : "s"}</p>
        <Button variant="outline" size="sm" onClick={share}>
          <Share2 aria-hidden="true" /> Share wishlist
        </Button>
      </div>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <li key={item.handle} className="card-hover group relative flex flex-col overflow-hidden rounded-2xl border bg-card">
            <Link href={ROUTES.product(item.handle)} className="relative block aspect-square bg-surface" aria-label={item.title}>
              {item.thumbnail ? (
                <Image src={item.thumbnail} alt={item.title} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <span className="flex h-full items-center justify-center"><Leaf className="size-12 text-brand-200" aria-hidden="true" /></span>
              )}
            </Link>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="line-clamp-2 text-sm font-bold leading-snug">
                <Link href={ROUTES.product(item.handle)}>{item.title}</Link>
              </h3>
              <p className="text-sm font-bold">{formatPrice(item.price.amount)}</p>
              <div className="mt-auto flex gap-2 pt-1">
                <Button size="sm" className="flex-1" onClick={() => moveToCart(item)}>
                  <ShoppingBag aria-hidden="true" /> Move to cart
                </Button>
                <Button size="icon-sm" variant="outline" aria-label={`Remove ${item.title}`} onClick={() => remove(item.handle)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
