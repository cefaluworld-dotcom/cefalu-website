import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants";
import { listProductHandles, listCategoryHandles } from "@/services/products";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...[
      ROUTES.shop,
      ROUTES.about,
      ROUTES.sizeGuide,
      ROUTES.fabricCare,
      ROUTES.blog,
      ROUTES.contact,
      ROUTES.faq,
      ROUTES.privacy,
      ROUTES.terms,
      ROUTES.shipping,
      ROUTES.refunds,
      ROUTES.cookies,
    ].map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === ROUTES.shop ? 0.9 : 0.6,
    })),
  ];

  const [productHandles, categoryHandles] = await Promise.all([
    listProductHandles(),
    listCategoryHandles(),
  ]);

  const productRoutes: MetadataRoute.Sitemap = productHandles.map((handle) => ({
    url: `${siteConfig.url}${ROUTES.product(handle)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categoryHandles.map((handle) => ({
    url: `${siteConfig.url}${ROUTES.category(handle)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
