import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";
import { FALLBACK_BESTSELLERS } from "@/constants/marketing";
import { listProducts } from "@/services/products";
import { cardWithEnrichment } from "@/services/catalog";
import { Section } from "@/components/layout/section";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";

/** Home §5 — bestsellers from Medusa, seed-matched fallback when offline. */
export async function FeaturedProducts() {
  const { products } = await listProducts({ limit: 8 });
  const live = products.map(cardWithEnrichment).filter((p) => p !== null);
  const cards = live.length > 0 ? live : FALLBACK_BESTSELLERS.slice(0, 8);

  return (
    <Section
      eyebrow="Most-picked"
      title="Wardrobe staples"
      description="The pieces people come back for — each with a measured size chart and 7-day returns and exchanges."
      className="border-t"
    >
      <ProductGrid products={cards} />
      <div className="mt-10 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href={ROUTES.shop}>
            Shop everything
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
