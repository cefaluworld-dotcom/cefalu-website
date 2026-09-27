import type { Metadata } from "next";
import type { PageProps } from "@/types";
import { constructMetadata } from "@/lib/seo";
import { listProducts, toProductCard } from "@/services/products";
import { Section } from "@/components/layout/section";
import { ProductGrid } from "@/components/product/product-grid";
import { SearchInput } from "@/components/product/search-input";

export const metadata: Metadata = constructMetadata({
  title: "Search",
  description: "Search Cefalu shirts, kurtas, kurtis, dresses and more.",
  pathname: "/search",
});

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = typeof params?.q === "string" ? params.q.trim() : "";

  const { products, count } = q ? await listProducts({ q, limit: 24 }) : { products: [], count: 0 };
  const cards = products.map(toProductCard).filter((p) => p !== null);

  return (
    <Section eyebrow="Search" title={q ? `Results for “${q}”` : "Search the catalog"} padding="sm">
      <SearchInput initialQuery={q} className="mb-8 max-w-xl" />
      {q ? (
        <>
          <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
            {count} result{count === 1 ? "" : "s"}
          </p>
          <ProductGrid products={cards} />
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Try “linen”, “kurti”, “white shirt” or a colour.
        </p>
      )}
    </Section>
  );
}
