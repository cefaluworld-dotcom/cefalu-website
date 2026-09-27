import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { SanityPost } from "@/types";
import { urlForImage } from "@/sanity/lib/image";
import { formatDate } from "@/utils/format";
import { readingTimeMinutes } from "@/utils/reading-time";
import { Badge } from "@/components/ui/badge";

/** Hero card for the latest article on the blog landing page. */
export function FeaturedPost({ post }: { post: SanityPost }) {
  return (
    <article className="card-hover group relative grid overflow-hidden rounded-3xl border bg-card lg:grid-cols-2">
      <div className="relative aspect-[16/10] bg-surface lg:aspect-auto lg:min-h-[22rem]">
        {post.mainImage ? (
          <Image
            src={urlForImage(post.mainImage).width(1000).height(700).url()}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="bg-hero-radial h-full" aria-hidden="true" />
        )}
      </div>
      <div className="flex flex-col justify-center p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">Featured</Badge>
          {post.categories?.[0] && <Badge variant="secondary">{post.categories[0].title}</Badge>}
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold leading-snug md:text-3xl">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {post.title}
          </Link>
        </h2>
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {post.excerpt}
          </p>
        )}
        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {post.author?.name && <span>{post.author.name}</span>}
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {readingTimeMinutes(post.bodyWords)} min read
          </span>
        </p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Read article
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
