"use client";

import { create } from "zustand";

interface UiState {
  isCartOpen: boolean;
  isMobileNavOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setCartOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isCartOpen: false,
  isMobileNavOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  setCartOpen: (isCartOpen) => set({ isCartOpen }),
  setMobileNavOpen: (isMobileNavOpen) => set({ isMobileNavOpen }),
}));
