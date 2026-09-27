"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Shirt } from "lucide-react";
import type { ProductCardData } from "@/types";
import { ROUTES } from "@/constants";
import { getEnrichment } from "@/lib/enrichment";
import { sortSizes } from "@/constants/catalog-content";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/product/price";
import { RatingStars } from "@/components/product/rating-stars";
import { ColorSwatches } from "@/components/product/color-swatches";
import { cn } from "@/lib/utils";

/**
 * Preview only. Apparel needs a size before it can go in the bag, and the card
 * doesn't carry the variant matrix — so the primary action leads to the product page.
 */
export function QuickView({ product, className }: { product: ProductCardData; className?: string }) {
  const [open, setOpen] = useState(false);
  const e = getEnrichment(product.handle);
  const colors = product.colors ?? e.colors;
  const sizes = sortSizes(product.sizes ?? e.sizes);
  const reviewCount = product.reviewCount ?? e.reviewCount;

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={product.title}
      description={e.shortDescription}
      className="sm:max-w-2xl"
      trigger={
        <button
          type="button"
          aria-label={`Quick view: ${product.title}`}
          className={cn(
            "flex size-10 items-center justify-center rounded-full border bg-background/90 text-muted-foreground backdrop-blur transition-colors hover:text-primary",
            className
          )}
        >
          <Eye className="size-4.5" aria-hidden="true" />
        </button>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl border bg-surface">
          {product.thumbnail ? (
            <Image src={product.thumbnail} alt={product.title} fill sizes="320px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center">
              <Shirt className="size-12 text-brand-200" aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-4">
          {reviewCount > 0 && <RatingStars rating={product.rating ?? e.rating} reviewCount={reviewCount} />}
          <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-muted-foreground">Fabric</dt>
            <dd>{e.fabric}</dd>
            <dt className="text-muted-foreground">Fit</dt>
            <dd>{e.fit}</dd>
            {sizes.length > 0 && (
              <>
                <dt className="text-muted-foreground">Sizes</dt>
                <dd className="tabular-nums">{sizes.join(" · ")}</dd>
              </>
            )}
          </dl>
          {colors.length > 0 && <ColorSwatches colors={colors} max={8} />}
          <Button asChild size="lg" className="mt-auto" onClick={() => setOpen(false)}>
            <Link href={ROUTES.product(product.handle)}>
              Choose size <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
