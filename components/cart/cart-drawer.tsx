"use client";

import Link from "next/link";
import { ShoppingBag, Truck, X } from "lucide-react";
import { ROUTES, FREE_SHIPPING_THRESHOLD } from "@/constants";
import {
  useCartStore,
  selectAmountToFreeShipping,
  selectItemCount,
  selectSubtotal,
} from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";
import { formatPrice } from "@/utils/format";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerSideContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { CartLineItem } from "@/components/cart/cart-line-item";

export function CartDrawer() {
  const { isCartOpen, setCartOpen, closeCart } = useUiStore();
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotal);
  const remaining = useCartStore(selectAmountToFreeShipping);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Drawer open={isCartOpen} onOpenChange={setCartOpen} direction="right">
      <DrawerSideContent aria-describedby={undefined}>
        <div className="flex items-center justify-between border-b p-4">
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" />
            Your cart {count > 0 && <span className="text-muted-foreground">({count})</span>}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            Review the items in your cart and continue to checkout.
          </DrawerDescription>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Close cart">
              <X className="size-4" />
            </Button>
          </DrawerClose>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="size-7 text-primary" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Find something you like and pick your size.
              </p>
            </div>
            <Button asChild onClick={closeCart}>
              <Link href={ROUTES.shop}>Shop all clothing</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b bg-surface px-4 py-3">
              <p className="flex items-center gap-2 text-xs font-medium">
                <Truck className="size-4 text-primary" />
                {remaining > 0 ? (
                  <span>
                    Add <strong>{formatPrice(remaining)}</strong> more for free shipping
                  </span>
                ) : (
                  <span className="text-success">You&apos;ve unlocked free shipping</span>
                )}
              </p>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-border"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progress towards free shipping"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y overflow-y-auto px-4">
              {items.map((line) => (
                <CartLineItem key={line.variantId} line={line} />
              ))}
            </ul>

            <div className="space-y-4 border-t p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-base font-bold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <Separator />
              <div className="grid gap-2">
                <Button asChild size="lg" onClick={closeCart}>
                  <Link href={ROUTES.checkout}>Proceed to checkout</Link>
                </Button>
                <Button asChild variant="ghost" onClick={closeCart}>
                  <Link href={ROUTES.cart}>View full cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </DrawerSideContent>
    </Drawer>
  );
}
