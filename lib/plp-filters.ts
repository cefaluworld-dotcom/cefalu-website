import type { Gender, PlpFilters, PlpSort, ProductCardData, ProductEnrichment } from "@/types";
import { getEnrichment } from "@/lib/enrichment";
import { sortSizes } from "@/constants/catalog-content";

/**
 * Product-listing filter state, encoded in the URL so filtered views are
 * shareable and survive refresh. Within a facet values are OR-ed; across
 * facets they are AND-ed.
 */
export type ListingState = PlpFilters & { sort: PlpSort };

/** URL keys, kept short and stable (links elsewhere depend on them). */
export const FILTER_KEYS = {
  q: "q",
  gender: "gender",
  category: "cat",
  size: "size",
  color: "color",
  fabric: "fabric",
  fit: "fit",
  min: "min",
  max: "max",
  rating: "rating",
  discount: "discount",
  stock: "stock",
  sort: "sort",
} as const;

export type ListKey = "gender" | "cat" | "size" | "color" | "fabric" | "fit";

const SORT_VALUES: PlpSort[] = ["-created_at", "price-asc", "price-desc", "rating", "title"];
const GENDERS: Gender[] = ["men", "women", "unisex"];

export function parseListingState(sp: URLSearchParams): ListingState {
  const list = (k: string) => sp.get(k)?.split(",").map((v) => v.trim()).filter(Boolean) ?? [];
  const num = (k: string) => {
    const raw = sp.get(k);
    if (raw === null || raw === "") return undefined;
    const v = Number(raw);
    return Number.isFinite(v) ? v : undefined;
  };
  const sort = sp.get(FILTER_KEYS.sort) as PlpSort | null;
  return {
    q: sp.get(FILTER_KEYS.q) ?? undefined,
    genders: list(FILTER_KEYS.gender).filter((g): g is Gender => (GENDERS as string[]).includes(g)),
    categories: list(FILTER_KEYS.category),
    sizes: list(FILTER_KEYS.size),
    colors: list(FILTER_KEYS.color),
    fabrics: list(FILTER_KEYS.fabric),
    fits: list(FILTER_KEYS.fit),
    minPrice: num(FILTER_KEYS.min),
    maxPrice: num(FILTER_KEYS.max),
    minRating: num(FILTER_KEYS.rating),
    minDiscount: num(FILTER_KEYS.discount),
    inStockOnly: sp.get(FILTER_KEYS.stock) === "1",
    sort: sort && SORT_VALUES.includes(sort) ? sort : "-created_at",
  };
}

export function discountPct(p: ProductCardData): number {
  if (!p.compareAtPrice || p.compareAtPrice.amount <= p.price.amount) return 0;
  return Math.round(((p.compareAtPrice.amount - p.price.amount) / p.compareAtPrice.amount) * 100);
}

const sizesOf = (p: ProductCardData, e: ProductEnrichment) => p.sizes ?? e.sizes;
const colorsOf = (p: ProductCardData, e: ProductEnrichment) => (p.colors ?? e.colors).map((c) => c.name);

function matchesQuery(p: ProductCardData, e: ProductEnrichment, q: string): boolean {
  const hay = [
    p.title,
    p.subtitle ?? "",
    e.subcategory,
    e.fabric,
    e.fabricFamily,
    e.fit,
    e.pattern,
    ...e.occasion,
    ...e.tags,
    ...colorsOf(p, e),
  ]
    .join(" ")
    .toLowerCase();
  return q
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term));
}

export function applyListingState(products: ProductCardData[], f: ListingState): ProductCardData[] {
  const q = f.q?.trim().toLowerCase();
  let out = products.filter((p) => {
    const e = getEnrichment(p.handle);
    if (q && !matchesQuery(p, e, q)) return false;
    if (f.genders.length && !f.genders.includes(e.gender)) return false;
    if (f.categories.length && !f.categories.includes(e.subcategory)) return false;
    if (f.sizes.length && !f.sizes.some((s) => sizesOf(p, e).includes(s))) return false;
    if (f.colors.length && !f.colors.some((c) => colorsOf(p, e).includes(c))) return false;
    if (f.fabrics.length && !f.fabrics.includes(e.fabricFamily)) return false;
    if (f.fits.length && !f.fits.includes(e.fitFamily)) return false;
    if (f.minPrice !== undefined && p.price.amount < f.minPrice) return false;
    if (f.maxPrice !== undefined && p.price.amount > f.maxPrice) return false;
    if (f.minRating !== undefined && (p.rating ?? e.rating) < f.minRating) return false;
    if (f.minDiscount !== undefined && discountPct(p) < f.minDiscount) return false;
    if (f.inStockOnly && !p.inStock) return false;
    return true;
  });

  const rating = (p: ProductCardData) => p.rating ?? getEnrichment(p.handle).rating;
  switch (f.sort) {
    case "price-asc":
      out = [...out].sort((a, b) => a.price.amount - b.price.amount);
      break;
    case "price-desc":
      out = [...out].sort((a, b) => b.price.amount - a.price.amount);
      break;
    case "rating":
      out = [...out].sort((a, b) => rating(b) - rating(a));
      break;
    case "title":
      out = [...out].sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break; // server order = newest first
  }
  return out;
}

export interface FacetOptions {
  genders: Gender[];
  categories: string[];
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
  fabrics: string[];
  fits: string[];
  hasReviews: boolean;
}

/** Facet values present in the current product set (so every option can return results). */
export function facetOptions(products: ProductCardData[]): FacetOptions {
  const genders = new Set<Gender>();
  const categories = new Set<string>();
  const sizes = new Set<string>();
  const colors = new Map<string, string>();
  const fabrics = new Set<string>();
  const fits = new Set<string>();
  let hasReviews = false;
  for (const p of products) {
    const e = getEnrichment(p.handle);
    genders.add(e.gender);
    categories.add(e.subcategory);
    sizesOf(p, e).forEach((s) => sizes.add(s));
    (p.colors ?? e.colors).forEach((c) => colors.set(c.name, c.hex));
    fabrics.add(e.fabricFamily);
    fits.add(e.fitFamily);
    if ((p.reviewCount ?? e.reviewCount) > 0) hasReviews = true;
  }
  return {
    genders: GENDERS.filter((g) => genders.has(g)),
    categories: [...categories].sort(),
    sizes: sortSizes([...sizes]),
    colors: [...colors].map(([name, hex]) => ({ name, hex })),
    fabrics: [...fabrics].sort(),
    fits: [...fits].sort(),
    hasReviews,
  };
}

/** Removable chips for every active list/number filter. */
export function activeChips(f: ListingState): Array<{ key: string; value: string; label: string }> {
  const chips: Array<{ key: string; value: string; label: string }> = [];
  const push = (key: string, values: string[], label: (v: string) => string = (v) => v) =>
    values.forEach((v) => chips.push({ key, value: v, label: label(v) }));
  push(FILTER_KEYS.gender, f.genders, (v) => (v === "men" ? "Men" : v === "women" ? "Women" : "Unisex"));
  push(FILTER_KEYS.category, f.categories);
  push(FILTER_KEYS.size, f.sizes, (v) => `Size ${v}`);
  push(FILTER_KEYS.color, f.colors);
  push(FILTER_KEYS.fabric, f.fabrics);
  push(FILTER_KEYS.fit, f.fits, (v) => `${v} fit`);
  if (f.minDiscount !== undefined) chips.push({ key: FILTER_KEYS.discount, value: String(f.minDiscount), label: `${f.minDiscount}%+ off` });
  if (f.minPrice !== undefined || f.maxPrice !== undefined)
    chips.push({ key: "price", value: "", label: `₹${f.minPrice ?? 0}–${f.maxPrice !== undefined ? `₹${f.maxPrice}` : "any"}` });
  if (f.minRating !== undefined) chips.push({ key: FILTER_KEYS.rating, value: String(f.minRating), label: `${f.minRating}★ & up` });
  if (f.inStockOnly) chips.push({ key: FILTER_KEYS.stock, value: "1", label: "In stock" });
  return chips;
}
