"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants";

const MAX_RECENT = 6;

interface SearchState {
  recent: string[];
  addRecent: (q: string) => void;
  removeRecent: (q: string) => void;
  clearRecent: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recent: [],
      addRecent: (q) => {
        const term = q.trim();
        if (!term) return;
        set((s) => ({
          recent: [term, ...s.recent.filter((r) => r.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT),
        }));
      },
      removeRecent: (q) => set((s) => ({ recent: s.recent.filter((r) => r !== q) })),
      clearRecent: () => set({ recent: [] }),
    }),
    { name: STORAGE_KEYS.recentSearches, storage: createJSONStorage(() => localStorage) }
  )
);
