"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartLine } from "@/types";
import { ROUTES } from "@/constants";
import { useCartStore } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";
import { useSavedStore } from "@/store/saved-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "@/components/ui/sonner";
import { formatPrice } from "@/utils/format";
import { Button } from "@/components/ui/button";

export function CartLineItem({ line, showActions = false }: { line: CartLine; showActions?: boolean }) {
  const { updateQuantity, removeItem } = useCartStore();
  const closeCart = useUiStore((s) => s.closeCart);
  const saveForLater = useSavedStore((s) => s.save);
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  function onSaveForLater() {
    saveForLater(line);
    removeItem(line.variantId);
    toast.success("Saved for later", { description: line.title });
  }

  function onMoveToWishlist() {
    toggleWishlist({
      handle: line.handle,
      title: line.title,
      thumbnail: line.thumbnail,
      price: { amount: line.unitPrice, currencyCode: line.currencyCode ?? "INR" },
      variantId: line.variantId,
      productId: line.productId,
    });
    removeItem(line.variantId);
    toast.success("Moved to wishlist", { description: line.title });
  }

  return (
    <li className="flex gap-4 py-4">
      <Link
        href={ROUTES.product(line.handle)}
        onClick={closeCart}
        className="relative size-20 shrink-0 overflow-hidden rounded-xl border bg-surface"
      >
        {line.thumbnail ? (
          <Image src={line.thumbnail} alt={line.title} fill sizes="80px" className="object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-lg font-bold text-brand-300">
            N
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={ROUTES.product(line.handle)}
              onClick={closeCart}
              className="line-clamp-2 text-sm font-semibold hover:text-primary"
            >
              {line.title}
            </Link>
            {line.variantTitle !== "Default" && (
              <p className="mt-0.5 text-xs text-muted-foreground">{line.variantTitle}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-7 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(line.variantId)}
            aria-label={`Remove ${line.title} from cart`}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="inline-flex items-center rounded-full border">
            <button
              type="button"
              onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex size-7 items-center justify-center rounded-l-full transition-colors hover:bg-muted"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
              aria-label="Increase quantity"
              className="flex size-7 items-center justify-center rounded-r-full transition-colors hover:bg-muted"
            >
              <Plus className="size-3" />
            </button>
          </div>
          <p className="text-sm font-bold">{formatPrice(line.unitPrice * line.quantity)}</p>
        </div>

        {showActions && (
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onSaveForLater}
              className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              Save for later
            </button>
            <button
              type="button"
              onClick={onMoveToWishlist}
              className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              Move to wishlist
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
