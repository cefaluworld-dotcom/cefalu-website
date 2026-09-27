"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchInput({
  initialQuery = "",
  className,
}: {
  initialQuery?: string;
  className?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  return (
    <form
      role="search"
      className={cn("flex gap-2", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const q = query.trim();
        router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
      }}
    >
      <Input
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search shirts, kurtis, linen, colours…"
        aria-label="Search products"
        autoFocus
      />
      <Button type="submit" aria-label="Search">
        <Search aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
}
