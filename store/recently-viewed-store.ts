"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { RecentlyViewedItem } from "@/types";
import { STORAGE_KEYS } from "@/constants";

const MAX_ITEMS = 12;

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  track: (item: Omit<RecentlyViewedItem, "viewedAt">) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      track: (item) =>
        set((s) => ({
          items: [
            { ...item, viewedAt: new Date().toISOString() },
            ...s.items.filter((i) => i.handle !== item.handle),
          ].slice(0, MAX_ITEMS),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: STORAGE_KEYS.recentlyViewed, storage: createJSONStorage(() => localStorage) }
  )
);
