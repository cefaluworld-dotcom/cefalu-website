"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductCardData } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

/** Scroll-snap product carousel with arrow controls. */
export function ProductCarousel({ products, label }: { products: ProductCardData[]; label: string }) {
  const trackRef = useRef<HTMLUListElement>(null);

  function scrollBy(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <div className="absolute -top-14 right-0 hidden gap-2 md:flex">
        <Button variant="outline" size="icon" aria-label={`Scroll ${label} left`} onClick={() => scrollBy(-1)}>
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button variant="outline" size="icon" aria-label={`Scroll ${label} right`} onClick={() => scrollBy(1)}>
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
      <ul
        ref={trackRef}
        aria-label={label}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none"
      >
        {products.map((p) => (
          <li key={p.id} className="w-64 shrink-0 snap-start">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
