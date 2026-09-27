"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types";
import { STORAGE_KEYS, FREE_SHIPPING_THRESHOLD } from "@/constants";

interface CartState {
  items: CartLine[];
  cartId: string | null;
  addItem: (line: CartLine) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  setCartId: (id: string | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      cartId: null,
      addItem: (line) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === line.variantId);
          if (existing) {
            const nextQty = Math.min(
              existing.quantity + line.quantity,
              existing.maxQuantity ?? 99
            );
            return {
              items: state.items.map((i) =>
                i.variantId === line.variantId ? { ...i, quantity: nextQty } : i
              ),
            };
          }
          return { items: [...state.items, line] };
        }),
      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),
      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [], cartId: null }),
      setCartId: (cartId) => set({ cartId }),
    }),
    { name: STORAGE_KEYS.cart, version: 1 }
  )
);

export const selectItemCount = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectSubtotal = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

export const selectAmountToFreeShipping = (state: CartState): number =>
  Math.max(0, FREE_SHIPPING_THRESHOLD - selectSubtotal(state));
