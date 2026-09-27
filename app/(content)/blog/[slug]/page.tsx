import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PageProps, SanityPost } from "@/types";
import { constructMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { isSanityConfigured } from "@/sanity/env";
import { sanityClient } from "@/sanity/lib/client";
import { postBySlugQuery, postSlugsQuery, relatedPostsQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { formatDate, slugify } from "@/utils/format";
import { readingTimeMinutes } from "@/utils/reading-time";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/common/json-ld";
import { PostCard } from "@/components/blog/post-card";
import { ShareButtons } from "@/components/blog/share-buttons";
import { TableOfContents, type TocEntry } from "@/components/blog/table-of-contents";
import { NewsletterCta } from "@/components/home/newsletter-cta";

export const revalidate = 1800;

type PortableBlock = { _type: string; style?: string; children?: Array<{ text?: string }> };

function blockText(block: PortableBlock): string {
  return (block.children ?? []).map((c) => c.text ?? "").join("");
}

function extractToc(body: SanityPost["body"]): TocEntry[] {
  if (!body) return [];
  return (body as PortableBlock[])
    .filter((b) => b._type === "block" && b.style === "h2")
    .map((b) => {
      const text = blockText(b);
      return { id: slugify(text), text };
    })
    .filter((e) => e.text.length > 0);
}

const portableComponents: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => (
      <h2 id={slugify(blockText(value as PortableBlock))} className="scroll-mt-28">
        {children}
      </h2>
    ),
  },
};

export async function generateStaticParams() {
  if (!isSanityConfigured) return [];
  try {
    const slugs = await sanityClient.fetch<string[]>(postSlugsQuery);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

async function getPost(slug: string): Promise<SanityPost | null> {
  if (!isSanityConfigured) return null;
  try {
    return await sanityClient.fetch<SanityPost | null>(postBySlugQuery, { slug });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return constructMetadata({ title: "Article", noIndex: true });

  return constructMetadata({
    title: post.title,
    description: post.excerpt ?? undefined,
    pathname: `/blog/${slug}`,
    image: post.mainImage ? urlForImage(post.mainImage).width(1200).height(630).url() : undefined,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: PageProps<{ slug: string }>) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const canonicalUrl = `${siteConfig.url}/blog/${slug}`;
  const toc = extractToc(post.body);
  const categorySlugs = (post.categories ?? []).map((c) => c.slug);

  let related: SanityPost[] = [];
  if (categorySlugs.length > 0) {
    try {
      related = await sanityClient.fetch<SanityPost[]>(relatedPostsQuery, {
        slug,
        categories: categorySlugs,
      });
    } catch {
      related = [];
    }
  }

  return (
    <>
      <article className="py-10 md:py-16">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt ?? undefined,
            datePublished: post.publishedAt ?? undefined,
            author: post.author?.name
              ? { "@type": "Person", name: post.author.name }
              : { "@type": "Organization", name: siteConfig.name },
            publisher: { "@type": "Organization", name: siteConfig.name },
            image: post.mainImage ? [urlForImage(post.mainImage).width(1200).url()] : undefined,
            mainEntityOfPage: canonicalUrl,
          }}
        />
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${slug}` },
          ])}
        />

        <Container size="prose">
          {post.categories?.[0] && <Badge variant="secondary">{post.categories[0].title}</Badge>}
          <h1 className="mt-4 text-display-md md:text-display-lg">{post.title}</h1>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {post.author?.name && <span>{post.author.name}</span>}
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              )}
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" />
                {readingTimeMinutes(post.bodyWords)} min read
              </span>
            </p>
            <ShareButtons url={canonicalUrl} title={post.title} />
          </div>
        </Container>

        {post.mainImage && (
          <Container size="md" className="mt-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border">
              <Image
                src={urlForImage(post.mainImage).width(1400).height(788).url()}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 960px"
                className="object-cover"
              />
            </div>
          </Container>
        )}

        <Container size="prose" className="mt-10">
          <TableOfContents entries={toc} />
          <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary">
            {post.body ? (
              <PortableText value={post.body} components={portableComponents} />
            ) : (
              <p>{post.excerpt}</p>
            )}
          </div>
          <div className="mt-10 flex items-center justify-between gap-4 border-t pt-6">
            <p className="text-sm font-semibold">Found this useful? Share it.</p>
            <ShareButtons url={canonicalUrl} title={post.title} />
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <Section eyebrow="Keep reading" title="Related articles" className="border-t bg-surface" padding="sm">
          <Grid cols={3} as="ul" className="list-none">
            {related.map((p) => (
              <li key={p._id}>
                <PostCard post={p} />
              </li>
            ))}
          </Grid>
        </Section>
      )}

      <NewsletterCta />
    </>
  );
}
