"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { WishlistItem } from "@/types";
import { STORAGE_KEYS } from "@/constants";

interface WishlistState {
  items: WishlistItem[];
  toggle: (item: Omit<WishlistItem, "addedAt">) => boolean; // returns new "in wishlist" state
  remove: (handle: string) => void;
  clear: () => void;
  has: (handle: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.some((i) => i.handle === item.handle);
        set((s) => ({
          items: exists
            ? s.items.filter((i) => i.handle !== item.handle)
            : [{ ...item, addedAt: new Date().toISOString() }, ...s.items],
        }));
        return !exists;
      },
      remove: (handle) => set((s) => ({ items: s.items.filter((i) => i.handle !== handle) })),
      clear: () => set({ items: [] }),
      has: (handle) => get().items.some((i) => i.handle === handle),
    }),
    { name: STORAGE_KEYS.wishlist, storage: createJSONStorage(() => localStorage) }
  )
);

export const selectWishlistCount = (s: WishlistState) => s.items.length;
