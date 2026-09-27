"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function QuantitySelector({ value, onChange, min = 1, max = 10, size = "md", className }: QuantitySelectorProps) {
  const btn = size === "sm" ? "size-8" : "size-11";
  return (
    <div className={cn("inline-flex items-center rounded-full border", className)} aria-label="Quantity">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(btn, "flex items-center justify-center rounded-l-full transition-colors hover:bg-muted disabled:opacity-40")}
      >
        <Minus className="size-4" />
      </button>
      <span className={cn("text-center text-sm font-bold", size === "sm" ? "w-8" : "w-10")} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(btn, "flex items-center justify-center rounded-r-full transition-colors hover:bg-muted disabled:opacity-40")}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
