import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  disabled?: boolean;
  external?: boolean;
  badge?: string;
}

export interface NavItemWithChildren extends NavItem {
  items?: NavItem[];
}

export interface FooterNavGroup {
  title: string;
  items: NavItem[];
}

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  keywords: string[];
  locale: string;
  currency: string;
  contact: {
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  links: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
    linkedin: string;
  };
  announcement: {
    message: string;
    href: string;
  };
}

export interface CategoryPreview {
  title: string;
  handle: string;
  description: string;
  icon: LucideIcon;
}

export interface BenefitItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface CartLine {
  variantId: string;
  productId: string;
  handle: string;
  title: string;
  variantTitle: string;
  thumbnail: string | null;
  unitPrice: number;
  currencyCode?: string;
  quantity: number;
  maxQuantity?: number;
  size?: string;
  color?: string;
}

export interface Money {
  amount: number;
  currencyCode: string;
}

export interface ProductCardData {
  id: string;
  handle: string;
  title: string;
  subtitle: string | null;
  thumbnail: string | null;
  price: Money;
  compareAtPrice: Money | null;
  rating?: number;
  reviewCount?: number;
  badges?: string[];
  variantId: string;
  inStock: boolean;
  colors?: ColorOption[];
  sizes?: string[];
}

export type SearchParams = Record<string, string | string[] | undefined>;

export interface PageProps<TParams = Record<string, string>> {
  params: Promise<TParams>;
  searchParams: Promise<SearchParams>;
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  mainImage?: Record<string, unknown> | null;
  publishedAt?: string | null;
  author?: { name?: string | null; image?: Record<string, unknown> | null } | null;
  categories?: Array<{ title: string; slug: string }> | null;
  body?: Array<{ _type: string } & Record<string, unknown>> | null;
  bodyWords?: number | null;
}

export interface Stat {
  value: string;
  label: string;
}

/* ---------- Apparel catalog ---------- */

export type Gender = "men" | "women" | "unisex";

export type FitFamily = "Slim" | "Regular" | "Relaxed" | "Oversized" | "Straight" | "A-Line" | "Flared" | "Tailored";

export interface ColorOption {
  name: string;
  /** CSS colour used for the swatch. */
  hex: string;
}

/** Garment measurement chart. `rows[i].values` align with `columns`. */
export interface SizeChart {
  id: string;
  title: string;
  unit: "in" | "cm";
  columns: string[];
  rows: Array<{ size: string; values: string[] }>;
  howToMeasure: Array<{ label: string; description: string }>;
  fitNote?: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface GalleryMedia {
  id: string;
  type: "image" | "video";
  url: string;
  alt?: string;
}

export interface ProductEnrichment {
  brand: string;
  gender: Gender;
  /** Merchandising subcategory, e.g. "Shirts", "Kurtis". */
  subcategory: string;
  shortDescription: string;
  highlights: string[];
  /** Full composition, e.g. "100% cotton oxford, 140 GSM". */
  fabric: string;
  /** Filter facet, e.g. "Cotton", "Linen blend". */
  fabricFamily: string;
  fit: string;
  fitFamily: FitFamily;
  pattern: string;
  occasion: string[];
  sleeve?: string;
  neck?: string;
  length?: string;
  closure?: string;
  care: string[];
  sizeChartId: string;
  modelInfo?: string;
  /** Plain-language sizing advice, e.g. "True to size". */
  fitAdvice: string;
  colors: ColorOption[];
  sizes: string[];
  /** HSN code printed on the tax invoice (Chapters 61 knitted / 62 woven). */
  hsnCode: string;
  faqs: ProductFAQ[];
  video?: string;
  tags: string[];
  /** Aggregate rating from real reviews only (0 until reviews exist). */
  rating: number;
  reviewCount: number;
}

export interface ReviewEntry {
  id: string;
  productHandle: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  date: string; // ISO
  verified: boolean;
  photos: string[];
  videos: string[];
  helpful: number;
}

export interface QuestionEntry {
  id: string;
  productHandle: string;
  author: string;
  question: string;
  answer?: string;
  date: string;
}

export interface WishlistItem {
  handle: string;
  title: string;
  thumbnail: string | null;
  price: Money;
  variantId: string;
  productId: string;
  addedAt: string;
}

export interface RecentlyViewedItem {
  handle: string;
  title: string;
  thumbnail: string | null;
  price: Money;
  viewedAt: string;
}

export type PlpSort = "-created_at" | "price-asc" | "price-desc" | "rating" | "title";

export interface PlpFilters {
  q?: string;
  categories: string[];
  genders: Gender[];
  sizes: string[];
  colors: string[];
  fabrics: string[];
  fits: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly: boolean;
  minDiscount?: number;
}

export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
}
