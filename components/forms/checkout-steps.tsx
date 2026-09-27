"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const CHECKOUT_STEPS = ["Contact", "Address", "Shipping", "Payment", "Review"] as const;
export type CheckoutStep = (typeof CHECKOUT_STEPS)[number];

export function CheckoutStepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1 sm:gap-2" aria-label="Checkout progress">
      {CHECKOUT_STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step} className="flex flex-1 items-center gap-1 sm:gap-2">
            <span
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary text-primary",
                !done && !active && "text-muted-foreground"
              )}
            >
              {done ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
            </span>
            <span className={cn("hidden text-xs font-semibold sm:block", active ? "text-primary" : "text-muted-foreground")}>
              {step}
            </span>
            {i < CHECKOUT_STEPS.length - 1 && (
              <span aria-hidden="true" className={cn("h-px flex-1", done ? "bg-primary" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
