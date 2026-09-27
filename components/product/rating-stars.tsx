import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
  showCount?: boolean;
}

export function RatingStars({ rating, reviewCount, size = "sm", className, showCount = true }: RatingStarsProps) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const rounded = rating - full >= 0.75 ? full + 1 : full;
  const dim = size === "sm" ? "size-3.5" : "size-4.5";

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        role="img"
        aria-label={`Rated ${rating} out of 5 stars`}
        className="inline-flex items-center gap-0.5 text-gold-500"
      >
        {Array.from({ length: 5 }, (_, i) => {
          if (i < (hasHalf ? full : rounded)) {
            return <Star key={i} className={cn(dim, "fill-current")} aria-hidden="true" />;
          }
          if (hasHalf && i === full) {
            return (
              <span key={i} className={cn(dim, "relative")} aria-hidden="true">
                <Star className={cn(dim, "absolute inset-0 text-gold-500/30")} />
                <StarHalf className={cn(dim, "absolute inset-0 fill-current")} />
              </span>
            );
          }
          return <Star key={i} className={cn(dim, "text-gold-500/30")} aria-hidden="true" />;
        })}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className={cn("text-muted-foreground", size === "sm" ? "text-xs" : "text-sm")}>
          {rating} ({reviewCount.toLocaleString("en-IN")})
        </span>
      )}
    </span>
  );
}
