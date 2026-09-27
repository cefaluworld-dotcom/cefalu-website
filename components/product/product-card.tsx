import Image from "next/image";
import Link from "next/link";
import { Shirt } from "lucide-react";
import type { ProductCardData } from "@/types";
import { ROUTES } from "@/constants";
import { getEnrichment } from "@/lib/enrichment";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/product/price";
import { RatingStars } from "@/components/product/rating-stars";
import { WishlistButton } from "@/components/product/wishlist-button";
import { ColorSwatches } from "@/components/product/color-swatches";
import { QuickView } from "@/components/product/quick-view";

interface ProductCardProps {
  product: ProductCardData;
  priority?: boolean;
  className?: string;
  layout?: "grid" | "list";
}

export function ProductCard({ product, priority = false, className, layout = "grid" }: ProductCardProps) {
  const e = getEnrichment(product.handle);
  const rating = product.rating ?? e.rating;
  const reviewCount = product.reviewCount ?? e.reviewCount;
  const discount =
    product.compareAtPrice && product.compareAtPrice.amount > product.price.amount
      ? Math.round(
          ((product.compareAtPrice.amount - product.price.amount) / product.compareAtPrice.amount) * 100
        )
      : 0;

  const wishItem = {
    handle: product.handle,
    title: product.title,
    thumbnail: product.thumbnail,
    price: product.price,
    variantId: product.variantId,
    productId: product.id,
  };

  const colors = product.colors ?? e.colors;

  const media = (
    <>
      {product.thumbnail ? (
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          priority={priority}
          sizes={layout === "list" ? "160px" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <span className="flex h-full items-center justify-center">
          <Shirt className={cn("text-brand-200", layout === "list" ? "size-8" : "size-12")} aria-hidden="true" />
        </span>
      )}
      {discount > 0 && (
        <Badge variant="accent" className="absolute left-3 top-3">{discount}% off</Badge>
      )}
      {discount === 0 && product.badges?.[0] && (
        <Badge variant="default" className="absolute left-3 top-3">{product.badges[0]}</Badge>
      )}
      {!product.inStock && (
        <Badge variant="outline" className="absolute bottom-3 left-3 bg-background/90">Sold out</Badge>
      )}
    </>
  );

  if (layout === "list") {
    return (
      <article className={cn("card-hover group relative flex gap-4 rounded-2xl border bg-card p-4", className)}>
        <Link
          href={ROUTES.product(product.handle)}
          className="relative block aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl bg-surface sm:w-32"
          aria-label={product.title}
        >
          {media}
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className="line-clamp-1 text-base font-bold">
            <Link href={ROUTES.product(product.handle)} className="after:absolute after:inset-0 focus-visible:outline-none">
              {product.title}
            </Link>
          </h3>
          {reviewCount > 0 && <RatingStars rating={rating} reviewCount={reviewCount} />}
          <p className="line-clamp-2 text-sm text-muted-foreground">{e.fabric} · {e.fit}</p>
          <ColorSwatches colors={colors} />
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
            <Price price={product.price} compareAtPrice={product.compareAtPrice} />
            <div className="relative z-10 flex items-center gap-2">
              <WishlistButton item={wishItem} size="sm" />
              <Button asChild size="sm" variant="secondary" className="relative z-10">
                <Link href={ROUTES.product(product.handle)}>Choose size</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("card-hover group relative flex flex-col overflow-hidden rounded-2xl border bg-card", className)}>
      <Link
        href={ROUTES.product(product.handle)}
        className="relative block aspect-[3/4] overflow-hidden bg-surface"
        aria-label={product.title}
      >
        {media}
      </Link>

      <div className="pointer-events-none absolute right-3 top-3 z-10 flex flex-col gap-2 opacity-0 transition-opacity duration-200 focus-within:opacity-100 group-hover:opacity-100">
        <span className="pointer-events-auto"><WishlistButton item={wishItem} /></span>
        <span className="pointer-events-auto"><QuickView product={product} /></span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          <Link href={ROUTES.product(product.handle)} className="after:absolute after:inset-0 focus-visible:outline-none">
            {product.title}
          </Link>
        </h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">{product.subtitle ?? e.fit}</p>
        {reviewCount > 0 && <RatingStars rating={rating} reviewCount={reviewCount} />}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Price price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
          <ColorSwatches colors={colors} max={4} />
        </div>
      </div>
    </article>
  );
}
