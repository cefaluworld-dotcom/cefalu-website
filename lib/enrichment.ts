import type { HttpTypes } from "@medusajs/types";
import type { ProductCardData, ProductEnrichment } from "@/types";
import { CATALOG_ENRICHMENT, DEFAULT_ENRICHMENT } from "@/constants/catalog-content";
import { FALLBACK_BESTSELLERS } from "@/constants/marketing";

/**
 * Pure enrichment helpers — safe to import from BOTH server and client
 * components (no `server-only` dependency chain).
 */

/** Merge Medusa metadata (if present) over the local enrichment library. */
export function getEnrichment(
  handle: string,
  metadata?: Record<string, unknown> | null
): ProductEnrichment {
  const base = CATALOG_ENRICHMENT[handle] ?? DEFAULT_ENRICHMENT;
  if (!metadata) return base;

  const overlay: Partial<ProductEnrichment> = {};
  for (const key of Object.keys(base) as Array<keyof ProductEnrichment>) {
    const value = metadata[key];
    if (value !== undefined) (overlay as Record<string, unknown>)[key] = value;
  }
  return { ...base, ...overlay };
}

export function enrichFallbackCards(): ProductCardData[] {
  return FALLBACK_BESTSELLERS.map((c) => {
    const e = getEnrichment(c.handle);
    return { ...c, rating: e.rating, reviewCount: e.reviewCount, badges: e.tags, colors: e.colors, sizes: e.sizes };
  });
}

/**
 * Minimal StoreProduct synthesized from fallback data so PDPs work offline.
 * Builds the same Size × Colour option matrix the Medusa seed creates.
 */
export function getFallbackProduct(handle: string): HttpTypes.StoreProduct | null {
  const card = FALLBACK_BESTSELLERS.find((c) => c.handle === handle);
  if (!card) return null;
  const e = CATALOG_ENRICHMENT[handle] ?? DEFAULT_ENRICHMENT;
  const colors = e.colors.length > 0 ? e.colors.map((c) => c.name) : ["Default"];
  const sizes = e.sizes.length > 0 ? e.sizes : ["One Size"];

  const variants = colors.flatMap((color) =>
    sizes.map((size) => ({
      id: `fallback-${handle}-${slug(color)}-${slug(size)}`,
      title: `${size} / ${color}`,
      sku: null,
      manage_inventory: false,
      inventory_quantity: 50,
      options: [
        { id: `opt-size-${size}`, option_id: "opt_size", value: size, option: { id: "opt_size", title: "Size" } },
        { id: `opt-color-${color}`, option_id: "opt_color", value: color, option: { id: "opt_color", title: "Color" } },
      ],
      calculated_price: {
        calculated_amount: card.price.amount,
        original_amount: card.compareAtPrice?.amount ?? card.price.amount,
        currency_code: card.price.currencyCode.toLowerCase(),
      },
    }))
  );

  const product = {
    id: card.id,
    title: card.title,
    subtitle: card.subtitle,
    handle: card.handle,
    description: `${e.shortDescription}\n\n${e.highlights.join(". ")}.`,
    thumbnail: card.thumbnail,
    images: [],
    metadata: null,
    categories: [],
    options: [
      { id: "opt_size", title: "Size", values: sizes.map((v) => ({ id: `ov-size-${v}`, value: v })) },
      { id: "opt_color", title: "Color", values: colors.map((v) => ({ id: `ov-color-${v}`, value: v })) },
    ],
    variants,
  };
  return product as unknown as HttpTypes.StoreProduct;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
