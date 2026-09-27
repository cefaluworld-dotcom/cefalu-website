import type { ProductCardData } from "@/types";
import { Grid } from "@/components/layout/grid";
import { ProductCard } from "@/components/product/product-card";
import { PackageSearch } from "lucide-react";

export function ProductGrid({
  products,
  layout = "grid",
}: {
  products: ProductCardData[];
  layout?: "grid" | "list";
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-20 text-center">
        <PackageSearch className="size-10 text-muted-foreground" aria-hidden="true" />
        <p className="font-display text-lg font-semibold">No products found</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          The catalog is empty or the Medusa backend isn&apos;t connected yet. Run{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">pnpm medusa:seed</code> and set
          the publishable key.
        </p>
      </div>
    );
  }

  if (layout === "list") {
    return (
      <ul className="list-none space-y-4">
        {products.map((product, i) => (
          <li key={product.id}>
            <ProductCard product={product} priority={i < 3} layout="list" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Grid cols={4} as="ul" className="list-none">
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} priority={i < 4} />
        </li>
      ))}
    </Grid>
  );
}
