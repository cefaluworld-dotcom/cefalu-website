import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PageProps, ProductCardData } from "@/types";
import { ROUTES } from "@/constants";
import { constructMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { listCategories, listCategoryHandles, listProducts } from "@/services/products";
import { cardWithEnrichment } from "@/services/catalog-server";
import { JsonLd } from "@/components/common/json-ld";
import { Section } from "@/components/layout/section";
import { Plp } from "@/components/product/plp";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const revalidate = 900;

export async function generateStaticParams() {
  const handles = await listCategoryHandles();
  return handles.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps<{ category: string }>): Promise<Metadata> {
  const { category } = await params;
  const categories = await listCategories();
  const match = categories.find((c) => c.handle === category);
  if (!match) return constructMetadata({ title: "Category", noIndex: true });

  return constructMetadata({
    title: `${match.name}`,
    description:
      match.description ??
      `Shop ${match.name.toLowerCase()} at Cefalu — measured size charts, free shipping above ₹999 and free 15-day exchanges.`,
    pathname: ROUTES.category(category),
  });
}

export default async function CategoryPage({ params }: PageProps<{ category: string }>) {
  const { category } = await params;
  const categories = await listCategories();
  const match = categories.find((c) => c.handle === category);
  if (!match) notFound();

  const { products } = await listProducts({ limit: 100, categoryId: match.id });
  const cards = products.map(cardWithEnrichment).filter((p): p is ProductCardData => p !== null);

  return (
    <Section eyebrow="Category" title={match.name} description={match.description ?? undefined}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: ROUTES.shop },
          { name: match.name, path: ROUTES.category(category) },
        ])}
      />
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink asChild><Link href={ROUTES.shop}>Shop</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{match.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Plp products={cards} emptyHint="No products in this category yet — run pnpm medusa:seed or browse the full shop." />
    </Section>
  );
}
