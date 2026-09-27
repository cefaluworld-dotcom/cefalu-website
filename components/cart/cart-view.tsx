"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Ticket, X } from "lucide-react";
import type { CartLine, ProductCardData } from "@/types";
import { COUPONS, FREE_SHIPPING_THRESHOLD, ROUTES } from "@/constants";
import { quoteOrder } from "@/lib/pricing";
import { useCartStore, selectItemCount, selectSubtotal } from "@/store/cart-store";
import { useSavedStore } from "@/store/saved-store";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice } from "@/utils/format";
import { enrichFallbackCards } from "@/lib/enrichment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { Section } from "@/components/layout/section";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { DeliveryChecker } from "@/components/product/delivery-checker";
import { ProductCarousel } from "@/components/product/product-carousel";

function SavedForLater() {
  const items = useSavedStore((s) => s.items);
  const remove = useSavedStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) return null;

  function moveToCart(line: CartLine) {
    addItem(line);
    remove(line.variantId);
    toast.success("Moved to cart", { description: line.title });
  }

  return (
    <div className="rounded-2xl border bg-card">
      <h2 className="border-b px-4 py-3 font-display text-base font-bold sm:px-6">
        Saved for later ({items.length})
      </h2>
      <ul className="divide-y px-4 sm:px-6">
        {items.map((line) => (
          <li key={line.variantId} className="flex items-center justify-between gap-3 py-3.5">
            <div className="min-w-0">
              <Link href={ROUTES.product(line.handle)} className="line-clamp-1 text-sm font-semibold hover:text-primary">
                {line.title}
              </Link>
              <p className="text-xs text-muted-foreground">{formatPrice(line.unitPrice)} × {line.quantity}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => moveToCart(line)}>Move to cart</Button>
              <Button size="icon-sm" variant="ghost" aria-label={`Remove ${line.title} from saved`} onClick={() => remove(line.variantId)}>
                <X className="size-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CartView() {
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; percentOff: number } | null>(null);

  // Single source of truth for money: per-piece GST slabs, discount allocation, shipping.
  const quote = useMemo(
    () =>
      quoteOrder({
        items: items.map((i) => ({ unitPrice: i.unitPrice, quantity: i.quantity })),
        couponCode: coupon?.code,
        shippingMethod: "standard",
      }),
    [items, coupon]
  );
  const { discount, afterDiscount, shipping, total, gstIncluded } = quote;
  const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount);

  const crossSell = useMemo<ProductCardData[]>(() => {
    const inCart = new Set(items.map((i) => i.handle));
    return enrichFallbackCards().filter((p) => !inCart.has(p.handle)).slice(0, 6);
  }, [items]);

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    const match = COUPONS[code];
    if (!match) {
      toast.error("Invalid coupon", { description: "Check the code and try again." });
      return;
    }
    setCoupon({ code, percentOff: match.percentOff });
    toast.success(`${code} applied`, { description: match.label });
    setCouponInput("");
  }

  if (!mounted) {
    return (
      <Section title="Your cart" padding="sm">
        <div className="grid gap-8 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </Section>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Section padding="lg">
          <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="size-9 text-primary" aria-hidden="true" />
            </span>
            <h1 className="text-display-sm">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Browse new arrivals and wardrobe staples — every piece has a measured size chart.
            </p>
            <Button asChild size="lg">
              <Link href={ROUTES.shop}>Shop all clothing</Link>
            </Button>
          </div>
          <div className="mx-auto mt-12 max-w-4xl">
            <SavedForLater />
          </div>
        </Section>
        <Section eyebrow="Start here" title="Customer favourites" className="border-t bg-surface" padding="sm">
          <ProductCarousel products={crossSell} label="Recommended products" />
        </Section>
      </>
    );
  }

  return (
    <>
      <Section title="Your cart" description={`${count} item${count === 1 ? "" : "s"}`} padding="sm">
        <div className="grid items-start gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border bg-card">
              <ul className="divide-y px-4 sm:px-6">
                {items.map((line) => (
                  <CartLineItem key={line.variantId} line={line} showActions />
                ))}
              </ul>
              <div className="border-t px-4 py-3 text-right sm:px-6">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
                >
                  Clear cart
                </button>
              </div>
            </div>
            <SavedForLater />
          </div>

          <aside className="rounded-2xl border bg-card p-6 lg:sticky lg:top-24" aria-label="Order summary">
            <h2 className="font-display text-lg font-bold">Order summary</h2>

            <form
              className="mt-5 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                applyCoupon();
              }}
            >
              <Input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code"
                aria-label="Coupon code"
                className="h-10 uppercase placeholder:normal-case"
              />
              <Button type="submit" variant="outline" className="h-10">Apply</Button>
            </form>
            {coupon && (
              <p className="mt-2 flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2 text-xs font-semibold text-primary">
                <span className="flex items-center gap-1.5">
                  <Ticket className="size-3.5" aria-hidden="true" /> {coupon.code} — {coupon.percentOff}% off
                </span>
                <button type="button" onClick={() => setCoupon(null)} aria-label="Remove coupon">
                  <X className="size-3.5" />
                </button>
              </p>
            )}

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold">{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <dt>Coupon discount</dt>
                  <dd className="font-semibold">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-semibold">
                  {shipping === 0 ? <span className="text-success">Free</span> : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <dt>GST (18%) included</dt>
                <dd>{formatPrice(gstIncluded)}</dd>
              </div>
              <Separator />
              <div className="flex justify-between text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-bold">{formatPrice(total)}</dd>
              </div>
            </dl>

            {toFreeShipping > 0 && (
              <p className="mt-4 rounded-xl bg-gold-50 px-3 py-2 text-xs font-semibold text-gold-700">
                Add {formatPrice(toFreeShipping)} more to unlock free shipping 🚚
              </p>
            )}

            <div className="mt-4">
              <DeliveryChecker />
            </div>

            <Button asChild size="lg" className="mt-6 w-full">
              <Link href={coupon ? `${ROUTES.checkout}?coupon=${coupon.code}` : ROUTES.checkout}>
                Proceed to checkout
              </Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full">
              <Link href={ROUTES.shop}>Continue shopping</Link>
            </Button>
          </aside>
        </div>
      </Section>

      <Section eyebrow="Goes well together" title="Complete your routine" className="border-t bg-surface" padding="sm">
        <ProductCarousel products={crossSell} label="Cross-sell recommendations" />
      </Section>
    </>
  );
}
