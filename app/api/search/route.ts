import { NextResponse, type NextRequest } from "next/server";
import type { ProductCardData } from "@/types";
import { SHOP_CATEGORIES } from "@/constants/marketing";
import { listProducts } from "@/services/products";
import { enrichFallbackCards } from "@/services/catalog";
import { cardWithEnrichment } from "@/services/catalog-server";
import { applyListingState, parseListingState } from "@/lib/plp-filters";

export const dynamic = "force-dynamic";

/** GET /api/search?q= → instant product results + category suggestions. */
export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 80);
  if (q.length < 2) return NextResponse.json({ products: [], suggestions: [] });

  const { products } = await listProducts({ q, limit: 6 });
  const live = products.map(cardWithEnrichment).filter((p): p is ProductCardData => p !== null);
  // Offline: same matcher the listing page uses (title, fabric, fit, colour, occasion…).
  const results =
    live.length > 0
      ? live
      : applyListingState(enrichFallbackCards(), parseListingState(new URLSearchParams({ q }))).slice(0, 6);

  const term = q.toLowerCase();
  const suggestions = [...new Set(SHOP_CATEGORIES.map((c) => c.title))]
    .filter((t) => t.toLowerCase().includes(term) || term.includes(t.toLowerCase().replace(/s$/, "")))
    .slice(0, 4);

  return NextResponse.json({ products: results, suggestions });
}
