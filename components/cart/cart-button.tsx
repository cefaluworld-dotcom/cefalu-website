"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore, selectItemCount } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/ui/button";

export function CartButton() {
  const mounted = useMounted();
  const count = useCartStore(selectItemCount);
  const openCart = useUiStore((s) => s.openCart);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={openCart}
      aria-label={`Open cart${mounted && count > 0 ? `, ${count} items` : ""}`}
    >
      <ShoppingBag className="size-5" />
      {mounted && count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-accent text-2xs font-bold text-accent-foreground"
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Button>
  );
}
