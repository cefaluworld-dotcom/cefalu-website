"use client";

import { useMemo, useState } from "react";
import { Camera, PenLine } from "lucide-react";
import type { ReviewEntry } from "@/types";
import { getReviews, summarize } from "@/services/reviews";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewSummary } from "@/components/reviews/review-summary";
import { ReviewCard } from "@/components/reviews/review-card";
import { WriteReviewForm } from "@/components/reviews/write-review-form";
import { cn } from "@/lib/utils";

const PAGE = 4;

export function ReviewsSection({ handle }: { handle: string }) {
  const mounted = useMounted();
  const [extra, setExtra] = useState<ReviewEntry[]>([]);
  const [stars, setStars] = useState<number | null>(null);
  const [photosOnly, setPhotosOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [visible, setVisible] = useState(PAGE);
  const [writing, setWriting] = useState(false);

  const all = useMemo(() => (mounted ? [...extra, ...getReviews(handle)] : []), [mounted, extra, handle]);
  const summary = useMemo(() => summarize(all), [all]);
  const filtered = all.filter(
    (r) =>
      (stars === null || r.rating === stars) &&
      (!photosOnly || r.photos.length > 0) &&
      (!verifiedOnly || r.verified)
  );

  if (!mounted) return <Skeleton className="h-64 rounded-2xl" />;

  return (
    <div id="reviews" className="scroll-mt-28 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold">Customer reviews</h2>
        <Button variant="outline" onClick={() => setWriting((w) => !w)}>
          <PenLine aria-hidden="true" /> {writing ? "Close" : "Write a review"}
        </Button>
      </div>

      <ReviewSummary summary={summary} activeStars={stars} onFilterStars={(s) => { setStars(s); setVisible(PAGE); }} />

      {writing && (
        <WriteReviewForm
          handle={handle}
          onSubmitted={(r) => {
            setExtra((e) => [r, ...e]);
            setWriting(false);
          }}
        />
      )}

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reviews">
        <button
          type="button"
          onClick={() => setPhotosOnly((v) => !v)}
          aria-pressed={photosOnly}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
            photosOnly ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50"
          )}
        >
          <Camera className="size-3.5" aria-hidden="true" /> With photos
        </button>
        <button
          type="button"
          onClick={() => setVerifiedOnly((v) => !v)}
          aria-pressed={verifiedOnly}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
            verifiedOnly ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50"
          )}
        >
          Verified only
        </button>
        {(stars !== null || photosOnly || verifiedOnly) && (
          <button
            type="button"
            onClick={() => { setStars(null); setPhotosOnly(false); setVerifiedOnly(false); }}
            className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-muted-foreground underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No reviews match these filters yet.
        </p>
      ) : (
        <>
          <ul className="space-y-4">
            {filtered.slice(0, visible).map((review) => (
              <li key={review.id}><ReviewCard review={review} /></li>
            ))}
          </ul>
          {visible < filtered.length && (
            <div className="text-center">
              <Button variant="outline" onClick={() => setVisible((v) => v + PAGE)}>
                Load more reviews
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
