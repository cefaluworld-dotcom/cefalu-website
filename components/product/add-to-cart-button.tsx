"use client";

import { ShoppingBag } from "lucide-react";
import type { CartLine } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";
import { Button, type ButtonProps } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface AddToCartButtonProps extends Omit<ButtonProps, "onClick"> {
  line: Omit<CartLine, "quantity">;
  quantity?: number;
  inStock?: boolean;
  openDrawer?: boolean;
  label?: string;
}

export function AddToCartButton({
  line,
  quantity = 1,
  inStock = true,
  openDrawer = true,
  label = "Add to cart",
  children,
  ...props
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUiStore((s) => s.openCart);

  if (!inStock) {
    return (
      <Button disabled variant="outline" {...props}>
        Out of stock
      </Button>
    );
  }

  return (
    <Button
      {...props}
      onClick={() => {
        addItem({ ...line, quantity });
        if (openDrawer) openCart();
        else toast.success("Added to cart", { description: line.title });
      }}
    >
      {children ?? (
        <>
          <ShoppingBag aria-hidden="true" />
          {label}
        </>
      )}
    </Button>
  );
}
