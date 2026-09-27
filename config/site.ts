import type { SiteConfig } from "@/types";

/**
 * Brand + business identity for cefalu.in.
 * Contact phone and registered address must be replaced with the registered
 * business details before launch (they appear in invoices, JSON-LD and the footer).
 */
export const siteConfig: SiteConfig = {
  name: "Cefalu",
  legalName: "Cefalu Apparel Private Limited",
  tagline: "Everyday clothing, cut to fit",
  description:
    "Shop readymade shirts, t-shirts, trousers, kurtas, kurtis and dresses at Cefalu. Honest fabrics, true-to-size fits, free shipping above ₹999 and 7-day returns and exchanges across India.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cefalu.in",
  ogImage: "/opengraph-image",
  keywords: [
    "readymade garments",
    "online clothing store India",
    "men's shirts",
    "cotton kurtis",
    "women's dresses",
    "trousers and chinos",
    "Cefalu",
    "cefalu.in",
  ],
  locale: "en_IN",
  currency: "INR",
  contact: {
    email: "care@cefalu.in",
    phone: "+91-9000000000",
    address: {
      street: "Registered office address",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110001",
      country: "IN",
    },
  },
  links: {
    instagram: "https://instagram.com/cefalu.in",
    facebook: "https://facebook.com/cefalu.in",
    twitter: "https://x.com/cefalu_in",
    youtube: "https://youtube.com/@cefalu",
    linkedin: "https://linkedin.com/company/cefalu",
  },
  announcement: {
    message: "Free shipping above ₹999 · 7-day returns & exchanges · 10% off your first order with WELCOME10",
    href: "/shop",
  },
};
