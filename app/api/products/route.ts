import { NextResponse, type NextRequest } from "next/server";
import { listProducts } from "@/services/products";
import { enrichFallbackCards  } from "@/services/catalog";
import { cardWithEnrichment } from "@/services/catalog-server";
import type { ProductCardData } from "@/types";

export const dynamic = "force-dynamic";

/** GET /api/products?handles=a,b,c → ProductCardData[] (order preserved). */
export async function GET(request: NextRequest) {
  const handlesParam = request.nextUrl.searchParams.get("handles") ?? "";
  const handles = handlesParam.split(",").map((h) => h.trim()).filter(Boolean).slice(0, 12);
  if (handles.length === 0) return NextResponse.json({ products: [] });

  const { products } = await listProducts({ handles, limit: handles.length });
  const live = products.map(cardWithEnrichment).filter((p): p is ProductCardData => p !== null);
  const fallback = enrichFallbackCards();

  const byHandle = new Map<string, ProductCardData>();
  for (const c of fallback) byHandle.set(c.handle, c);
  for (const c of live) byHandle.set(c.handle, c);

  const ordered = handles.map((h) => byHandle.get(h)).filter((p): p is ProductCardData => Boolean(p));
  return NextResponse.json({ products: ordered });
}
