"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BlogToolbarProps {
  categories: Array<{ title: string; slug: string }>;
}

/** Search box + category chips; state lives in the URL (?q, ?category). */
export function BlogToolbar({ categories }: BlogToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function apply(next: { q?: string; category?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }
    if (next.category !== undefined) {
      if (next.category) params.set("category", next.category);
      else params.delete("category");
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <form
        role="search"
        className="flex w-full max-w-sm gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          apply({ q: query.trim() });
        }}
      >
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles…"
          aria-label="Search articles"
        />
        <Button type="submit" size="icon" aria-label="Search">
          <Search aria-hidden="true" />
        </Button>
      </form>

      {categories.length > 0 && (
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => apply({ category: "" })}
            aria-pressed={activeCategory === ""}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              activeCategory === ""
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:border-primary/50"
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => apply({ category: c.slug })}
              aria-pressed={activeCategory === c.slug}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                activeCategory === c.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:border-primary/50"
              )}
            >
              {c.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
