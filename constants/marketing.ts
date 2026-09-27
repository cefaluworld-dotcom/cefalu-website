import type { ColorOption, ProductCardData } from "@/types";
import { ROUTES } from "@/constants";
import { CATALOG_ENRICHMENT } from "@/constants/catalog-content";

/* ------------------------------------------------------------------ */
/* Shop-by-category tiles (Home)                                       */
/* ------------------------------------------------------------------ */

export interface CategoryTile {
  title: string;
  /** Short line under the title — what's in the aisle, not a slogan. */
  description: string;
  href: string;
  department: "Men" | "Women";
}

export const SHOP_CATEGORIES: CategoryTile[] = [
  { title: "Shirts", description: "Oxfords, linens and everyday checks", href: ROUTES.category("men-shirts"), department: "Men" },
  { title: "T-Shirts", description: "Crew necks, polos and henleys", href: ROUTES.category("men-t-shirts"), department: "Men" },
  { title: "Trousers", description: "Chinos, formal trousers and joggers", href: ROUTES.category("men-trousers"), department: "Men" },
  { title: "Kurtas", description: "Cotton and linen, festive to everyday", href: ROUTES.category("men-kurtas"), department: "Men" },
  { title: "Kurtis", description: "Printed, straight and A-line", href: ROUTES.category("women-kurtis"), department: "Women" },
  { title: "Dresses", description: "Midis, maxis and shirt dresses", href: ROUTES.category("women-dresses"), department: "Women" },
  { title: "Co-ord Sets", description: "Two-piece sets, ready to go", href: ROUTES.category("women-co-ords"), department: "Women" },
  { title: "Tops", description: "Shirts, tunics and tees", href: ROUTES.category("women-tops"), department: "Women" },
];

/* ------------------------------------------------------------------ */
/* Store promises (trust bar) — policies, not claims                   */
/* ------------------------------------------------------------------ */

export const STORE_PROMISES = [
  { title: "Free shipping over ₹999", description: "Standard delivery across India in 2–6 days", icon: "Truck" },
  { title: "15-day easy exchanges", description: "Wrong size? Swap it free, no questions", icon: "RefreshCcw" },
  { title: "Cash on delivery", description: "Pay when it reaches your door", icon: "Banknote" },
  { title: "Secure payments", description: "UPI, cards and netbanking via Razorpay & Cashfree", icon: "ShieldCheck" },
] as const;

/* ------------------------------------------------------------------ */
/* Instagram tiles — labels only until the live feed is connected      */
/* ------------------------------------------------------------------ */

export const INSTAGRAM_TILES = [
  { id: "ig-1", label: "Linen, three ways", tone: "from-brand-100 to-brand-200" },
  { id: "ig-2", label: "Behind the stitch", tone: "from-surface to-brand-100" },
  { id: "ig-3", label: "Office week edit", tone: "from-brand-200 to-brand-300" },
  { id: "ig-4", label: "Festive kurtas", tone: "from-brand-50 to-brand-200" },
  { id: "ig-5", label: "How to measure yourself", tone: "from-surface to-brand-200" },
  { id: "ig-6", label: "New drop preview", tone: "from-brand-100 to-brand-300" },
] as const;

/* ------------------------------------------------------------------ */
/* Catalog fallback (used when Medusa is unconfigured; handles, prices */
/* and variants mirror medusa/src/scripts/seed.ts so links stay valid) */
/* ------------------------------------------------------------------ */

const card = (
  handle: string,
  title: string,
  subtitle: string,
  price: number,
  compareAt: number | null
): ProductCardData => {
  const e = CATALOG_ENRICHMENT[handle];
  const colors: ColorOption[] = e?.colors ?? [];
  return {
    id: `fallback-${handle}`,
    handle,
    title,
    subtitle,
    thumbnail: null,
    price: { amount: price, currencyCode: "INR" },
    compareAtPrice: compareAt ? { amount: compareAt, currencyCode: "INR" } : null,
    variantId: `fallback-${handle}-default`,
    inStock: true,
    colors,
    sizes: e?.sizes ?? [],
    badges: e?.tags ?? [],
  };
};

export const FALLBACK_BESTSELLERS: ProductCardData[] = [
  card("oxford-cotton-shirt", "Oxford Cotton Shirt", "Regular fit · 100% cotton", 1299, 1799),
  card("printed-cotton-kurti", "Printed Cotton Kurti", "A-line · Calf length", 1199, 1699),
  card("slim-stretch-chinos", "Slim Stretch Chinos", "Slim fit · Cotton stretch twill", 1599, 2199),
  card("tiered-midi-dress", "Tiered Midi Dress", "Flared · Cotton voile", 1799, 2499),
  card("everyday-crew-tee", "Everyday Crew T-Shirt", "Regular fit · 180 GSM cotton", 599, 799),
  card("rayon-coord-set", "Rayon Co-ord Set", "Relaxed · Shirt + palazzo", 2199, 2999),
  card("linen-blend-kurta", "Linen-Blend Kurta", "Straight fit · Knee length", 1899, 2499),
  card("linen-blazer", "Unstructured Linen Blazer", "Tailored fit · 100% linen", 4499, 5999),
];
