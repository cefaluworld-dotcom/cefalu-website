"use client";

import { useMemo } from "react";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { useMounted } from "@/hooks/use-mounted";
import type { ProductCardData } from "@/types";
import { getEnrichment } from "@/lib/enrichment";
import { Section } from "@/components/layout/section";
import { ProductCarousel } from "@/components/product/product-carousel";

export function RecentlyViewed({ excludeHandle }: { excludeHandle?: string }) {
  const mounted = useMounted();
  const items = useRecentlyViewedStore((s) => s.items);

  const cards = useMemo<ProductCardData[]>(
    () =>
      items
        .filter((i) => i.handle !== excludeHandle)
        .map((i) => {
          const e = getEnrichment(i.handle);
          return {
            id: `rv-${i.handle}`,
            handle: i.handle,
            title: i.title,
            subtitle: null,
            thumbnail: i.thumbnail,
            price: i.price,
            compareAtPrice: null,
            rating: e.rating,
            reviewCount: e.reviewCount,
            variantId: `rv-${i.handle}`,
            inStock: true,
          };
        }),
    [items, excludeHandle]
  );

  if (!mounted || cards.length === 0) return null;

  return (
    <Section eyebrow="Pick up where you left" title="Recently viewed" className="border-t" padding="sm">
      <ProductCarousel products={cards} label="Recently viewed products" />
    </Section>
  );
}
