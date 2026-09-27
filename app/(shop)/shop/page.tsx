import type { Metadata } from "next";
import type { ProductCardData } from "@/types";
import { constructMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants";
import { listProducts } from "@/services/products";
import { enrichFallbackCards  } from "@/services/catalog";
import { cardWithEnrichment } from "@/services/catalog-server";
import { JsonLd } from "@/components/common/json-ld";
import { Section } from "@/components/layout/section";
import { Plp } from "@/components/product/plp";

export const revalidate = 900;

export const metadata: Metadata = constructMetadata({
  title: "Shop All Clothing",
  description:
    "Shop readymade shirts, t-shirts, trousers, kurtas, kurtis, dresses and co-ord sets. Filter by size, colour, fabric, fit and price.",
  pathname: "/shop",
});

export default async function ShopPage() {
  const { products } = await listProducts({ limit: 100 });
  const live = products.map(cardWithEnrichment).filter((p): p is ProductCardData => p !== null);
  const cards = live.length > 0 ? live : enrichFallbackCards();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: cards.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}${ROUTES.product(p.handle)}`,
      name: p.title,
    })),
  };

  return (
    <Section
      eyebrow="The full range"
      title="Shop all clothing"
      description="Filter by size, colour, fabric and fit — every piece has a measured size chart."
    >
      <JsonLd data={itemListJsonLd} />
      <Plp products={cards} emptyHint="Loosen a filter or two — the catalog is compact by design." />
    </Section>
  );
}
