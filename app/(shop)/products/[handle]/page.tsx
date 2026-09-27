import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MessageCircle, RefreshCcw } from "lucide-react";
import type { PageProps, GalleryMedia } from "@/types";
import { EXCHANGE_WINDOW_DAYS, ROUTES } from "@/constants";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, constructMetadata } from "@/lib/seo";
import {
  getProductByHandle,
  listProductHandles,
  listProducts,
} from "@/services/products";
import { enrichFallbackCards, getEnrichment, getFallbackProduct  } from "@/services/catalog";
import { cardWithEnrichment } from "@/services/catalog-server";
import { SEED_REVIEWS, SIZE_CHARTS } from "@/constants/catalog-content";
import { JsonLd } from "@/components/common/json-ld";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductGallery } from "@/components/product/product-gallery";
import { BuyBox } from "@/components/product/buy-box";
import { SizeChartTable } from "@/components/product/size-chart-table";
import { ProductCarousel } from "@/components/product/product-carousel";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { TrackView } from "@/components/product/track-view";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { QaSection } from "@/components/reviews/qa-section";

export const revalidate = 900;

export async function generateStaticParams() {
  const handles = await listProductHandles();
  return handles.map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: PageProps<{ handle: string }>): Promise<Metadata> {
  const { handle } = await params;
  const product = (await getProductByHandle(handle)) ?? getFallbackProduct(handle);
  if (!product) return constructMetadata({ title: "Product", noIndex: true });
  const e = getEnrichment(handle);

  return constructMetadata({
    title: product.title,
    description: e.shortDescription,
    pathname: ROUTES.product(handle),
    image: product.thumbnail ?? undefined,
  });
}

export default async function ProductPage({ params }: PageProps<{ handle: string }>) {
  const { handle } = await params;
  const product = (await getProductByHandle(handle)) ?? getFallbackProduct(handle);
  if (!product) notFound();

  const enrichment = getEnrichment(handle, product.metadata);
  const card = cardWithEnrichment(product);
  const category = product.categories?.[0];

  const media: GalleryMedia[] = (product.images ?? []).map((img, i) => ({
    id: img.id, type: "image", url: img.url, alt: `${product.title} — image ${i + 1}`,
  }));
  if (media.length === 0 && product.thumbnail) {
    media.push({ id: "thumbnail", type: "image", url: product.thumbnail });
  }
  if (enrichment.video) media.push({ id: "video", type: "video", url: enrichment.video });

  // Recommendations: same department, then "complete the look" across categories.
  const { products: pool } = await listProducts({ limit: 24 });
  const poolCards = pool.map(cardWithEnrichment).filter((p) => p !== null);
  const others = (poolCards.length > 0 ? poolCards : enrichFallbackCards()).filter((p) => p.handle !== handle);
  const sameDept = others.filter((p) => getEnrichment(p.handle).gender === enrichment.gender);
  const completeTheLook = sameDept
    .filter((p) => getEnrichment(p.handle).subcategory !== enrichment.subcategory)
    .slice(0, 4);
  const similar = sameDept.filter((p) => getEnrichment(p.handle).subcategory === enrichment.subcategory);
  const alsoLike = (similar.length > 0 ? similar : others.filter((p) => !completeTheLook.includes(p))).slice(0, 8);

  const sizeChart = SIZE_CHARTS[enrichment.sizeChartId];
  // Only real, published reviews may feed structured data.
  const publishedReviews = SEED_REVIEWS.filter((r) => r.productHandle === handle);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: enrichment.shortDescription,
    image: media.filter((m) => m.type === "image").map((m) => m.url),
    sku: product.variants?.[0]?.sku ?? undefined,
    brand: { "@type": "Brand", name: enrichment.brand },
    material: enrichment.fabric,
    ...(enrichment.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: enrichment.rating,
            reviewCount: enrichment.reviewCount,
          },
        }
      : {}),
    review: publishedReviews.slice(0, 3).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: { "@type": "Rating", ratingValue: r.rating },
      name: r.title,
      reviewBody: r.body,
      datePublished: r.date,
    })),
    offers: card
      ? {
          "@type": "Offer",
          url: `${siteConfig.url}${ROUTES.product(handle)}`,
          priceCurrency: card.price.currencyCode,
          price: card.price.amount,
          availability: card.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        }
      : undefined,
  };

  const faqJsonLd = enrichment.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: enrichment.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={productJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: ROUTES.shop },
          ...(category ? [{ name: category.name, path: ROUTES.category(category.handle ?? "") }] : []),
          { name: product.title, path: ROUTES.product(handle) },
        ])}
      />
      {card && (
        <TrackView handle={handle} title={product.title} thumbnail={product.thumbnail ?? null} price={card.price} />
      )}

      <Container size="xl" className="py-8 md:py-12">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link href={ROUTES.shop}>Shop</Link></BreadcrumbLink></BreadcrumbItem>
            {category && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={ROUTES.category(category.handle ?? "")}>{category.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{product.title}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery media={media} title={product.title} />

          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {enrichment.tags.slice(0, 2).map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
              <Badge variant="outline">{category?.name ?? enrichment.subcategory}</Badge>
              <Badge variant="outline">{enrichment.fit}</Badge>
            </div>
            <h1 className="text-display-sm md:text-display-md">{product.title}</h1>
            <p className="mt-2 text-base text-muted-foreground">{enrichment.shortDescription}</p>
            <div className="mt-6">
              <BuyBox product={product} enrichment={enrichment} />
            </div>
          </div>
        </div>

        {/* Product details */}
        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section aria-labelledby="highlights-h">
              <h2 id="highlights-h" className="text-2xl">Highlights</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {enrichment.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 rounded-xl border bg-card p-4 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            <Accordion type="multiple" defaultValue={["description", "fabric", "fit"]}>
              <AccordionItem value="description">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent className="whitespace-pre-line leading-relaxed">
                  {product.description ?? enrichment.shortDescription}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="fabric">
                <AccordionTrigger>Fabric &amp; care</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold">Fabric:</span> {enrichment.fabric}
                  </p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                    {enrichment.care.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                  <Link href={ROUTES.fabricCare} className="link-underline mt-3 inline-block text-sm font-medium text-primary">
                    Fabric care guide
                  </Link>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="fit">
                <AccordionTrigger>Fit &amp; sizing</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold">{enrichment.fit}.</span> {enrichment.fitAdvice}
                    {enrichment.modelInfo ? ` ${enrichment.modelInfo}.` : ""}
                  </p>
                  {sizeChart && <SizeChartTable chart={sizeChart} />}
                  {sizeChart?.fitNote && <p className="text-xs text-muted-foreground">{sizeChart.fitNote}</p>}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="specs">
                <AccordionTrigger>Specifications</AccordionTrigger>
                <AccordionContent>
                  <dl className="grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-6 gap-y-2 text-sm">
                    {(
                      [
                        ["Pattern", enrichment.pattern],
                        ["Occasion", enrichment.occasion.join(", ")],
                        ["Sleeve", enrichment.sleeve],
                        ["Neck / collar", enrichment.neck],
                        ["Length", enrichment.length],
                        ["Closure", enrichment.closure],
                      ] as const
                    )
                      .filter(([, v]) => Boolean(v))
                      .map(([k, v]) => (
                        <div key={k} className="contents">
                          <dt className="text-muted-foreground">{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="exchanges">
                <AccordionTrigger>Exchanges &amp; returns</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed">
                  Request a return or exchange within {EXCHANGE_WINDOW_DAYS} days of delivery, subject to the policy. A ₹100 reverse pickup charge applies to returns per order and to COD exchanges.{" "}
                  <Link href={ROUTES.refunds} className="link-underline font-medium text-primary">
                    Full policy
                  </Link>
                </AccordionContent>
              </AccordionItem>
              {enrichment.faqs.length > 0 && (
                <AccordionItem value="faqs">
                  <AccordionTrigger>Questions about this product</AccordionTrigger>
                  <AccordionContent>
                    <dl className="space-y-4">
                      {enrichment.faqs.map((f) => (
                        <div key={f.question}>
                          <dt className="text-sm font-semibold">{f.question}</dt>
                          <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.answer}</dd>
                        </div>
                      ))}
                    </dl>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border bg-surface p-6">
              <RefreshCcw className="size-6 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-lg">Wrong size? Request an exchange.</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Request an exchange within {EXCHANGE_WINDOW_DAYS} days of delivery. A ₹100 reverse pickup fee applies to COD exchanges. See the full policy for exclusions.
              </p>
            </div>
            <div className="rounded-2xl border p-6">
              <MessageCircle className="size-6 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-lg">Unsure between two sizes?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Send us your measurements and we&apos;ll tell you which one to pick.
              </p>
              <Link href={ROUTES.contact} className="link-underline mt-3 inline-block text-sm font-medium text-primary">
                Ask our team
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-16 space-y-14">
          <ReviewsSection handle={handle} />
          <QaSection handle={handle} />
        </div>
      </Container>

      {completeTheLook.length > 0 && (
        <Section eyebrow="Complete the look" title="Wear it with" className="border-t bg-surface">
          <ProductCarousel products={completeTheLook} label="Complete the look" />
        </Section>
      )}
      {alsoLike.length > 0 && (
        <Section eyebrow="More like this" title="You may also like" className="border-t">
          <ProductCarousel products={alsoLike} label="Similar products" />
        </Section>
      )}
      <RecentlyViewed excludeHandle={handle} />
    </>
  );
}
