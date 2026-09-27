import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import type { PageProps, SanityPost } from "@/types";
import { constructMetadata } from "@/lib/seo";
import { isSanityConfigured } from "@/sanity/env";
import { sanityClient } from "@/sanity/lib/client";
import {
  filteredPostsCountQuery,
  filteredPostsQuery,
  postCategoriesQuery,
} from "@/sanity/lib/queries";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { PostCard } from "@/components/blog/post-card";
import { FeaturedPost } from "@/components/blog/featured-post";
import { BlogToolbar } from "@/components/blog/blog-toolbar";
import { ShopPagination } from "@/components/product/shop-pagination";

export const revalidate = 1800;
const POSTS_PER_PAGE = 9;

export const metadata: Metadata = constructMetadata({
  title: "The Journal",
  description:
    "Style notes, fabric guides and fit advice from the Cefalu team.",
  pathname: "/blog",
});

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page ?? 1) || 1);
  const q = typeof params?.q === "string" ? params.q.trim() : "";
  const category = typeof params?.category === "string" ? params.category : "";

  let posts: SanityPost[] = [];
  let count = 0;
  let categories: Array<{ title: string; slug: string }> = [];

  if (isSanityConfigured) {
    try {
      const groqParams = {
        q: q ? `${q}*` : "*",
        category,
        start: (page - 1) * POSTS_PER_PAGE,
        end: page * POSTS_PER_PAGE,
      };
      [posts, count, categories] = await Promise.all([
        sanityClient.fetch<SanityPost[]>(filteredPostsQuery, groqParams),
        sanityClient.fetch<number>(filteredPostsCountQuery, {
          q: groqParams.q,
          category,
        }),
        sanityClient.fetch<Array<{ title: string; slug: string }>>(postCategoriesQuery),
      ]);
    } catch (error) {
      console.error("[blog] Sanity fetch failed:", error);
    }
  }

  const isDefaultView = page === 1 && q === "" && category === "";
  const [featured, ...rest] = posts;
  const gridPosts = isDefaultView && featured ? rest : posts;
  const totalPages = Math.max(1, Math.ceil(count / POSTS_PER_PAGE));

  return (
    <Section
      eyebrow="The journal"
      title="Read. Learn. Thrive."
      description="No fads — just referenced, practical nutrition science."
    >
      <BlogToolbar categories={categories} />

      {posts.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-20 text-center">
          <Newspaper className="size-10 text-muted-foreground" aria-hidden="true" />
          <p className="font-display text-lg font-semibold">
            {q || category ? "No matching articles" : "No articles yet"}
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {q || category ? (
              "Try clearing the search or picking a different category."
            ) : (
              <>
                Connect Sanity (set{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  NEXT_PUBLIC_SANITY_PROJECT_ID
                </code>
                ) and publish posts to see them here.
              </>
            )}
          </p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
            {count} article{count === 1 ? "" : "s"}
            {q && <> for &ldquo;{q}&rdquo;</>}
          </p>

          {isDefaultView && featured && (
            <div className="mt-6">
              <FeaturedPost post={featured} />
            </div>
          )}

          {gridPosts.length > 0 && (
            <Grid cols={3} as="ul" className="mt-8 list-none">
              {gridPosts.map((post) => (
                <li key={post._id}>
                  <PostCard post={post} />
                </li>
              ))}
            </Grid>
          )}

          <ShopPagination page={page} totalPages={totalPages} className="mt-10" />
        </>
      )}
    </Section>
  );
}
