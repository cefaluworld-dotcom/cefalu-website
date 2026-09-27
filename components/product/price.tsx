import type { Money } from "@/types";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format";

interface PriceProps {
  price: Money;
  compareAtPrice?: Money | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "text-sm", md: "text-base", lg: "text-2xl" } as const;

export function Price({ price, compareAtPrice, className, size = "md" }: PriceProps) {
  const hasDiscount = compareAtPrice && compareAtPrice.amount > price.amount;
  const percentOff = hasDiscount
    ? Math.round(((compareAtPrice.amount - price.amount) / compareAtPrice.amount) * 100)
    : 0;

  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn("font-bold text-foreground", sizes[size])}>
        {formatPrice(price.amount)}
      </span>
      {hasDiscount && (
        <>
          <s className={cn("text-muted-foreground", size === "lg" ? "text-base" : "text-xs")}>
            {formatPrice(compareAtPrice.amount)}
          </s>
          <span className="text-xs font-bold text-success">{percentOff}% off</span>
        </>
      )}
    </p>
  );
}
