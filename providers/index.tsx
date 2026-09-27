"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
