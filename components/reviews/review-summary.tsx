"use client";

import { RatingStars } from "@/components/product/rating-stars";
import type { summarize } from "@/services/reviews";

type Summary = ReturnType<typeof summarize>;

export function ReviewSummary({
  summary,
  activeStars,
  onFilterStars,
}: {
  summary: Summary;
  activeStars: number | null;
  onFilterStars: (stars: number | null) => void;
}) {
  return (
    <div className="grid gap-6 rounded-2xl border bg-surface p-6 sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="text-center sm:pr-6">
        <p className="font-display text-5xl font-black text-primary">{summary.average}</p>
        <RatingStars rating={summary.average} showCount={false} size="md" className="mt-1 justify-center" />
        <p className="mt-1 text-xs text-muted-foreground">
          {summary.count.toLocaleString("en-IN")} review{summary.count === 1 ? "" : "s"}
        </p>
      </div>
      <ul className="space-y-1.5">
        {summary.buckets.map((b) => (
          <li key={b.stars}>
            <button
              type="button"
              onClick={() => onFilterStars(activeStars === b.stars ? null : b.stars)}
              aria-pressed={activeStars === b.stars}
              className="group flex w-full items-center gap-3 text-left"
            >
              <span className="w-8 shrink-0 text-xs font-semibold">{b.stars}★</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                <span
                  className="block h-full rounded-full bg-gold-500 transition-all"
                  style={{ width: `${b.pct}%` }}
                />
              </span>
              <span className="w-10 shrink-0 text-right text-xs text-muted-foreground group-aria-pressed:font-bold group-aria-pressed:text-primary">
                {b.count}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
