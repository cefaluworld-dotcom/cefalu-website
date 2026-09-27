export const ROUTES = {
  home: "/",
  shop: "/shop",
  category: (slug: string) => `/shop/${slug}`,
  product: (handle: string) => `/products/${handle}`,
  newArrivals: "/shop?sort=-created_at",
  sale: "/shop?discount=20",
  cart: "/cart",
  checkout: "/checkout",
  account: "/account",
  orders: "/account/orders",
  login: "/login",
  register: "/register",
  blog: "/blog",
  post: (slug: string) => `/blog/${slug}`,
  about: "/about",
  contact: "/contact",
  faq: "/faq",
  sizeGuide: "/size-guide",
  fabricCare: "/fabric-care",
  search: "/search",
  orderConfirmed: "/order-confirmed",
  orderFailed: "/order-failed",
  wishlist: "/wishlist",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verify: "/verify",
  accountOrders: "/account/orders",
  accountOrder: (id: string) => `/account/orders/${id}`,
  accountAddresses: "/account/addresses",
  accountProfile: "/account/profile",
  accountSecurity: "/account/security",
  accountWishlist: "/account/wishlist",
  accountNotifications: "/account/notifications",
  privacy: "/privacy-policy",
  terms: "/terms-of-service",
  shipping: "/shipping-policy",
  refunds: "/returns-exchanges",
  cookies: "/cookie-policy",
} as const;

export const CACHE_TAGS = {
  products: "products",
  product: (handle: string) => `product-${handle}`,
  categories: "categories",
  collections: "collections",
  cart: "cart",
  posts: "posts",
} as const;

export const REVALIDATE = {
  product: 60 * 15,
  listing: 60 * 30,
  content: 60 * 60,
  static: 60 * 60 * 24,
} as const;

export const COOKIE_KEYS = {
  cartId: "_cefalu_cart_id",
  region: "_cefalu_region",
} as const;

export const STORAGE_KEYS = {
  cart: "cefalu-cart",
  announcementDismissed: "cefalu-announcement-dismissed",
  recentlyViewed: "cefalu-recently-viewed",
  wishlist: "cefalu-wishlist",
  savedForLater: "cefalu-saved-for-later",
  recentSearches: "cefalu-recent-searches",
  reviews: "cefalu-reviews",
  questions: "cefalu-questions",
  notifications: "cefalu-notification-prefs",
  preferredSize: "cefalu-preferred-size",
} as const;

export const COUPONS: Record<string, { percentOff: number; label: string }> = {
  WELCOME10: { percentOff: 10, label: "10% off your first order" },
  CEFALU15: { percentOff: 15, label: "15% off sitewide" },
};

/**
 * GST for readymade garments (Chapters 61/62), effective 22 Sep 2025:
 * 5% when the per-piece taxable value (after discount, excluding GST) is
 * ≤ ₹2,500; 18% above. Storefront prices are GST-inclusive. See lib/pricing.ts.
 */
export const GST_APPAREL = {
  thresholdTaxable: 2500,
  lowRate: 0.05,
  highRate: 0.18,
  /** GST on shipping / COD handling charges (freight follows the principal supply; 18% is the conservative default). */
  serviceRate: 0.18,
} as const;

export const COD_FEE = 49;
export const SHIPPING_FLAT = 79;
export const SHIPPING_EXPRESS = 149;
export const FREE_SHIPPING_THRESHOLD = 999;

/** Exchange-first returns policy (apparel). */
export const EXCHANGE_WINDOW_DAYS = 15;
export const RETURN_WINDOW_DAYS = 7;

export const PAGE_SIZE = 12;
