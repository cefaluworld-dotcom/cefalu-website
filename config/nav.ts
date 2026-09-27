import type { FooterNavGroup, NavItemWithChildren } from "@/types";
import { ROUTES } from "@/constants";

export const mainNav: NavItemWithChildren[] = [
  {
    title: "Men",
    href: `${ROUTES.shop}?gender=men`,
    items: [
      { title: "Shirts", href: ROUTES.category("men-shirts"), description: "Oxfords, linens and everyday checks" },
      { title: "T-Shirts", href: ROUTES.category("men-t-shirts"), description: "Crew necks, polos and henleys" },
      { title: "Trousers", href: ROUTES.category("men-trousers"), description: "Chinos, formals and joggers" },
      { title: "Kurtas", href: ROUTES.category("men-kurtas"), description: "Cotton and linen, festive to everyday" },
      { title: "Blazers", href: ROUTES.category("men-blazers"), description: "Unstructured and easy to wear" },
      { title: "Shop all men", href: `${ROUTES.shop}?gender=men`, description: "Everything in menswear" },
    ],
  },
  {
    title: "Women",
    href: `${ROUTES.shop}?gender=women`,
    items: [
      { title: "Kurtis", href: ROUTES.category("women-kurtis"), description: "Printed, straight and A-line" },
      { title: "Dresses", href: ROUTES.category("women-dresses"), description: "Midis, maxis and shirt dresses" },
      { title: "Co-ord Sets", href: ROUTES.category("women-co-ords"), description: "Two-piece sets, ready to go" },
      { title: "Tops", href: ROUTES.category("women-tops"), description: "Shirts, tunics and tees" },
      { title: "Shop all women", href: `${ROUTES.shop}?gender=women`, description: "Everything in womenswear" },
    ],
  },
  { title: "New In", href: ROUTES.newArrivals },
  { title: "Sale", href: ROUTES.sale },
  { title: "Size Guide", href: ROUTES.sizeGuide },
];

export const footerNav: FooterNavGroup[] = [
  {
    title: "Shop",
    items: [
      { title: "New in", href: ROUTES.newArrivals },
      { title: "Men", href: `${ROUTES.shop}?gender=men` },
      { title: "Women", href: `${ROUTES.shop}?gender=women` },
      { title: "Sale", href: ROUTES.sale },
      { title: "All products", href: ROUTES.shop },
    ],
  },
  {
    title: "Help",
    items: [
      { title: "Size guide", href: ROUTES.sizeGuide },
      { title: "Fabric care", href: ROUTES.fabricCare },
      { title: "Returns & exchanges", href: ROUTES.refunds },
      { title: "Shipping policy", href: ROUTES.shipping },
      { title: "FAQs", href: ROUTES.faq },
      { title: "Contact us", href: ROUTES.contact },
    ],
  },
  {
    title: "Company",
    items: [
      { title: "Our story", href: ROUTES.about },
      { title: "Journal", href: ROUTES.blog },
      { title: "Terms of service", href: ROUTES.terms },
      { title: "Privacy policy", href: ROUTES.privacy },
    ],
  },
];

export const legalNav = [
  { title: "Privacy", href: ROUTES.privacy },
  { title: "Terms", href: ROUTES.terms },
  { title: "Returns", href: ROUTES.refunds },
  { title: "Cookies", href: ROUTES.cookies },
] as const;
