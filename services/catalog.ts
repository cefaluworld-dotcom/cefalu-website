import "server-only";
import type { HttpTypes } from "@medusajs/types";
import type { ProductCardData } from "@/types";
import { toProductCard } from "@/services/products";
import { getEnrichment } from "@/lib/enrichment";

export { getEnrichment, enrichFallbackCards, getFallbackProduct } from "@/lib/enrichment";

/** Card + enrichment merge for live Medusa products (server-side). */
export function cardWithEnrichment(product: HttpTypes.StoreProduct): ProductCardData | null {
  const card = toProductCard(product);
  if (!card) return null;
  const e = getEnrichment(card.handle, product.metadata);
  return { ...card, rating: e.rating, reviewCount: e.reviewCount, badges: e.tags, colors: e.colors, sizes: e.sizes };
}
