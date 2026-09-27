"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { HttpTypes } from "@medusajs/types";
import type { ProductEnrichment } from "@/types";
import { ROUTES } from "@/constants";
import { siteConfig } from "@/config/site";
import { useCartStore } from "@/store/cart-store";
import { sortSizes } from "@/constants/catalog-content";
import {
  findVariant,
  isVariantInStock,
  optionValues,
  resolveOptionIds,
  sizeAvailability,
  valueOf,
} from "@/lib/variants";
import { cn } from "@/lib/utils";
import { Price } from "@/components/product/price";
import { RatingStars } from "@/components/product/rating-stars";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { OfferBanner } from "@/components/product/offer-banner";
import { DeliveryChecker } from "@/components/product/delivery-checker";
import { WishlistButton } from "@/components/product/wishlist-button";
import { SizeGuideDialog } from "@/components/product/size-guide-dialog";
import { ShareButtons } from "@/components/blog/share-buttons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface BuyBoxProps {
  product: HttpTypes.StoreProduct;
  enrichment: ProductEnrichment;
}

/** Apparel buy box: colour swatches, size selector with per-colour stock, size guide, add to bag. */
export function BuyBox({ product, enrichment }: BuyBoxProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const variants = useMemo(() => product.variants ?? [], [product.variants]);
  const ids = useMemo(() => resolveOptionIds(product.options), [product.options]);

  const colors = useMemo(() => optionValues(product.options, ids.color), [product.options, ids.color]);
  const sizes = useMemo(() => sortSizes(optionValues(product.options, ids.size)), [product.options, ids.size]);

  // Default to the first colour that has any size in stock.
  const firstInStockColor =
    colors.find((c) => variants.some((v) => valueOf(v, ids.color) === c && isVariantInStock(v))) ?? colors[0] ?? null;

  const [color, setColor] = useState<string | null>(firstInStockColor);
  const [size, setSize] = useState<string | null>(sizes.length === 1 ? sizes[0] ?? null : null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const availability = useMemo(() => sizeAvailability(variants, ids, sizes, color), [variants, ids, sizes, color]);
  const selectionComplete = (!ids.size || size !== null) && (!ids.color || color !== null);
  const variant = useMemo(
    () => (selectionComplete ? findVariant(variants, ids, { size, color }) : undefined),
    [selectionComplete, variants, ids, size, color]
  );

  // Price is identical across sizes in this catalogue; show the first variant's price until a size is picked.
  const priced = variant ?? variants[0];
  if (!priced) return null;

  const price = priced.calculated_price;
  const amount = price?.calculated_amount ?? 0;
  const original = price?.original_amount ?? amount;
  const currency = price?.currency_code?.toUpperCase() ?? "INR";
  const inStock = variant ? isVariantInStock(variant) : true;
  const swatchHex = (name: string) => enrichment.colors.find((c) => c.name === name)?.hex ?? "#E5E7EB";

  const line = variant
    ? {
        variantId: variant.id,
        productId: product.id,
        handle: product.handle ?? product.id,
        title: product.title,
        variantTitle: [size, color].filter(Boolean).join(" / ") || (variant.title ?? "Default"),
        thumbnail: product.thumbnail ?? null,
        unitPrice: amount,
        currencyCode: currency,
        size: size ?? undefined,
        color: color ?? undefined,
      }
    : null;

  function requireSize() {
    setSizeError(true);
    document.getElementById("size-selector")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function buyNow() {
    if (!line) return requireSize();
    addItem({ ...line, quantity });
    router.push(ROUTES.checkout);
  }

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      {enrichment.reviewCount > 0 && (
        <a href="#reviews" className="inline-block focus-visible:outline-none">
          <RatingStars rating={enrichment.rating} reviewCount={enrichment.reviewCount} size="md" />
        </a>
      )}

      <div>
        <Price
          size="lg"
          price={{ amount, currencyCode: currency }}
          compareAtPrice={original > amount ? { amount: original, currencyCode: currency } : null}
        />
        <p className="mt-1 text-xs text-muted-foreground">MRP inclusive of all taxes</p>
      </div>

      {colors.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">
            Colour: <span className="font-normal text-muted-foreground">{color ?? "Select"}</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-pressed={c === color}
                aria-label={c}
                title={c}
                className={cn(
                  "size-10 rounded-full border-2 p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  c === color ? "border-primary" : "border-transparent hover:border-border"
                )}
              >
                <span className="block size-full rounded-full border border-black/10" style={{ backgroundColor: swatchHex(c) }} />
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {sizes.length > 0 && (
        <fieldset id="size-selector" aria-describedby="size-help">
          <div className="mb-3 flex items-center justify-between gap-3">
            <legend className="text-sm font-semibold">
              Size: <span className="font-normal text-muted-foreground">{size ?? "Select a size"}</span>
            </legend>
            <SizeGuideDialog
              chartId={enrichment.sizeChartId}
              selectedSize={size}
              fitAdvice={enrichment.fitAdvice}
              modelInfo={enrichment.modelInfo}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const state = availability[s];
              const available = state?.available ?? false;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={!available}
                  onClick={() => {
                    setSize(s);
                    setSizeError(false);
                  }}
                  aria-pressed={s === size}
                  aria-label={available ? `Size ${s}` : `Size ${s}, sold out in ${color ?? "this colour"}`}
                  className={cn(
                    "min-w-[3.25rem] rounded-lg border px-3 py-2.5 text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    s === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : available
                        ? "hover:border-primary"
                        : "cursor-not-allowed text-muted-foreground/60 line-through decoration-1",
                    sizeError && !size && "border-destructive"
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <p id="size-help" className="mt-2.5 text-sm" aria-live="polite">
            {sizeError && !size ? (
              <span className="font-medium text-destructive">Please choose a size.</span>
            ) : size && availability[size]?.lowStock ? (
              <span className="font-medium text-warning-foreground">Only {availability[size]?.lowStock} left in {size}.</span>
            ) : (
              <span className="text-muted-foreground">
                {enrichment.fitAdvice}
                {enrichment.modelInfo ? ` ${enrichment.modelInfo}.` : ""}
              </span>
            )}
          </p>
        </fieldset>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <QuantitySelector value={quantity} onChange={setQuantity} />
        {line ? (
          <AddToCartButton className="flex-1" quantity={quantity} inStock={inStock} line={line} label="Add to bag" />
        ) : (
          <Button size="lg" className="flex-1" onClick={requireSize}>
            Select a size
          </Button>
        )}
      </div>
      <Button size="lg" variant="outline" className="w-full" disabled={Boolean(line) && !inStock} onClick={buyNow}>
        Buy now
      </Button>

      <div className="flex items-center justify-between gap-3">
        <WishlistButton
          item={{
            handle: product.handle ?? product.id,
            title: product.title,
            thumbnail: product.thumbnail ?? null,
            price: { amount, currencyCode: currency },
            variantId: priced.id,
            productId: product.id,
          }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Share</span>
          <ShareButtons url={`${siteConfig.url}${ROUTES.product(product.handle ?? "")}`} title={product.title} />
        </div>
      </div>

      <Separator />
      <OfferBanner />
      <DeliveryChecker />
    </div>
  );
}
