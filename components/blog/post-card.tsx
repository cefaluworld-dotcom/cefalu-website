import Image from "next/image";
import Link from "next/link";
import type { SanityPost } from "@/types";
import { urlForImage } from "@/sanity/lib/image";
import { formatDate } from "@/utils/format";
import { readingTimeMinutes } from "@/utils/reading-time";
import { Badge } from "@/components/ui/badge";

export function PostCard({ post }: { post: SanityPost }) {
  return (
    <article className="card-hover group relative flex flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="relative aspect-[16/9] overflow-hidden bg-surface">
        {post.mainImage ? (
          <Image
            src={urlForImage(post.mainImage).width(800).height(450).url()}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="bg-hero-radial h-full" aria-hidden="true" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {post.categories?.[0] && (
          <Badge variant="secondary" className="mb-3 w-fit">
            {post.categories[0].title}
          </Badge>
        )}
        <h3 className="line-clamp-2 font-display text-lg font-bold leading-snug">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none group-hover:text-primary"
          >
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          {post.author?.name && <span>{post.author.name} · </span>}
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          )}
          <span> · {readingTimeMinutes(post.bodyWords)} min read</span>
        </p>
      </div>
    </article>
  );
}
