"use client";

import Image from "next/image";
import { useState } from "react";
import { BadgeCheck, ThumbsUp } from "lucide-react";
import type { ReviewEntry } from "@/types";
import { hasVotedHelpful, markHelpful } from "@/services/reviews";
import { formatDate, getInitials } from "@/utils/format";
import { RatingStars } from "@/components/product/rating-stars";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function ReviewCard({ review }: { review: ReviewEntry }) {
  const [voted, setVoted] = useState(() => hasVotedHelpful(review.id));
  const [count, setCount] = useState(review.helpful);

  return (
    <article className="rounded-2xl border bg-card p-5">
      <header className="flex flex-wrap items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback className="bg-secondary text-xs text-primary">{getInitials(review.author)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-bold">
            {review.author}
            {review.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-2xs font-semibold text-primary">
                <BadgeCheck className="size-3" aria-hidden="true" /> Verified purchase
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            <time dateTime={review.date}>{formatDate(review.date)}</time>
          </p>
        </div>
        <RatingStars rating={review.rating} showCount={false} className="ml-auto" />
      </header>

      <h4 className="mt-3 text-sm font-bold">{review.title}</h4>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{review.body}</p>

      {review.videos.length > 0 && (
        <div className="mt-3 space-y-2">
          {review.videos.map((src) => (
            <video
              key={src}
              src={src}
              controls
              preload="metadata"
              className="max-h-64 w-full rounded-xl border object-cover"
              aria-label={`Video from ${review.author}'s review`}
            />
          ))}
        </div>
      )}

      {review.photos.length > 0 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto scrollbar-none">
          {review.photos.map((src) => (
            <li key={src} className="relative size-16 shrink-0 overflow-hidden rounded-xl border">
              <Image src={src} alt={`Photo from ${review.author}'s review`} fill sizes="64px" className="object-cover" />
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        disabled={voted}
        onClick={() => {
          markHelpful(review.productHandle, review.id);
          setVoted(true);
          setCount((c) => c + 1);
        }}
        className={cn(
          "mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
          voted ? "border-primary bg-secondary text-primary" : "text-muted-foreground hover:border-primary hover:text-primary"
        )}
      >
        <ThumbsUp className={cn("size-3.5", voted && "fill-current")} aria-hidden="true" />
        Helpful ({count})
      </button>
    </article>
  );
}
