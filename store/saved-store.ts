"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLine } from "@/types";
import { STORAGE_KEYS } from "@/constants";

interface SavedState {
  items: CartLine[];
  save: (line: CartLine) => void;
  remove: (variantId: string) => void;
  clear: () => void;
}

/** "Save for later" bucket, moved to/from the cart. */
export const useSavedStore = create<SavedState>()(
  persist(
    (set) => ({
      items: [],
      save: (line) =>
        set((s) => ({ items: [line, ...s.items.filter((i) => i.variantId !== line.variantId)] })),
      remove: (variantId) => set((s) => ({ items: s.items.filter((i) => i.variantId !== variantId) })),
      clear: () => set({ items: [] }),
    }),
    { name: STORAGE_KEYS.savedForLater, storage: createJSONStorage(() => localStorage) }
  )
);
