"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { Ruler } from "lucide-react";
import { SIZE_CHARTS } from "@/constants/catalog-content";
import { ROUTES } from "@/constants";
import { recommendSize } from "@/lib/fit";
import { cn } from "@/lib/utils";

type Dept = "men" | "women";

const CONFIG: Record<Dept, { chartId: string; label: string; measure: string; ease: number; min: number; max: number }> = {
  // Men's chart lists garment measurements, so allow ~2 in of room over the body.
  men: { chartId: "men-tops", label: "Men", measure: "Chest", ease: 2, min: 30, max: 54 },
  // Women's chart lists body measurements.
  women: { chartId: "women-tops", label: "Women", measure: "Bust", ease: 0, min: 28, max: 50 },
};

/** Hero fit finder: body measurement in, size out — the store's core promise in one control. */
export function FitFinder() {
  const [dept, setDept] = useState<Dept>("men");
  const [value, setValue] = useState<string>("");
  const inputId = useId();
  const cfg = CONFIG[dept];
  const chart = SIZE_CHARTS[cfg.chartId];

  const result = useMemo(() => {
    const n = Number.parseFloat(value);
    if (!chart || !Number.isFinite(n) || n < cfg.min || n > cfg.max) return null;
    return recommendSize(chart, n, { ease: cfg.ease });
  }, [chart, value, cfg]);

  return (
    <div className="relative rounded-2xl border bg-card p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Ruler className="size-4" aria-hidden="true" />
        Find your size in 10 seconds
      </div>

      <div role="radiogroup" aria-label="Department" className="mt-5 inline-flex rounded-full border p-1">
        {(Object.keys(CONFIG) as Dept[]).map((d) => (
          <button
            key={d}
            type="button"
            role="radio"
            aria-checked={dept === d}
            onClick={() => setDept(d)}
            className={cn(
              "rounded-full px-5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              dept === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {CONFIG[d].label}
          </button>
        ))}
      </div>

      <label htmlFor={inputId} className="mt-6 block text-sm font-medium">
        Your {cfg.measure.toLowerCase()} (inches)
      </label>
      <input
        id={inputId}
        type="number"
        inputMode="decimal"
        min={cfg.min}
        max={cfg.max}
        step="0.5"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={dept === "men" ? "e.g. 38" : "e.g. 34"}
        className="mt-2 h-12 w-full rounded-lg border bg-background px-4 text-lg tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      <div className="mt-6 min-h-[5.5rem] border-t pt-5" aria-live="polite">
        {result ? (
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Your size in our {dept === "men" ? "shirts & tees" : "kurtis & dresses"}</p>
              <p className="font-display text-5xl leading-none text-primary">{result.size}</p>
            </div>
            <p className="max-w-[12rem] text-right text-xs text-muted-foreground">
              {result.outOfRange
                ? "Your measurement is above our largest size — write to us and we'll help."
                : `Fits a ${cfg.measure.toLowerCase()} up to ${result.chartValue - cfg.ease} in.`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Measure around the fullest part of your {cfg.measure.toLowerCase()}, tape level and snug.
          </p>
        )}
      </div>

      <Link href={ROUTES.sizeGuide} className="link-underline mt-2 inline-block text-sm font-medium text-primary">
        Full size guide for every category
      </Link>
    </div>
  );
}
