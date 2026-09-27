"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Flame, Leaf, Search, TrendingUp, X } from "lucide-react";
import type { ProductCardData } from "@/types";
import { ROUTES } from "@/constants";
import { TRENDING_SEARCHES } from "@/constants/catalog-content";
import { useSearchStore } from "@/store/search-store";
import { FALLBACK_BESTSELLERS } from "@/constants/marketing";
import { useDebounce } from "@/hooks/use-debounce";
import { formatPrice } from "@/utils/format";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SearchResponse {
  products: ProductCardData[];
  suggestions: string[];
}

export function SearchOverlay() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse>({ products: [], suggestions: [] });
  const [popularItems, setPopularItems] = useState<ProductCardData[]>([]);
  const debounced = useDebounce(query, 250);
  const { recent, addRecent, clearRecent } = useSearchStore();

  // Cmd/Ctrl+K opens search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Load popular products once per open (bestseller handles)
  useEffect(() => {
    if (!open || popularItems.length > 0) return;
    const handles = FALLBACK_BESTSELLERS.map((p) => p.handle).join(",");
    fetch(`/api/products?handles=${encodeURIComponent(handles)}`)
      .then((r) => r.json() as Promise<{ products: ProductCardData[] }>)
      .then((data) => setPopularItems(data.products.slice(0, 4)))
      .catch(() => setPopularItems([]));
  }, [open, popularItems.length]);

  useEffect(() => {
    if (!open) return;
    const q = debounced.trim();
    if (q.length < 2) {
      setResults({ products: [], suggestions: [] });
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json() as Promise<SearchResponse>)
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .catch(() => {
        if (!cancelled) setResults({ products: [], suggestions: [] });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced, open]);

  const goToSearch = useCallback(
    (term: string) => {
      const q = term.trim();
      if (!q) return;
      addRecent(q);
      setOpen(false);
      setQuery("");
      router.push(`${ROUTES.search}?q=${encodeURIComponent(q)}`);
    },
    [addRecent, router]
  );

  const showIdle = query.trim().length < 2;
  const popular = useMemo(() => results.products, [results.products]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Search products (Ctrl+K)" onClick={() => setOpen(true)}>
            <Search className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Search · Ctrl K</TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-24 max-w-xl translate-y-0 gap-0 overflow-hidden p-0">
          <DialogTitle className="sr-only">Search the store</DialogTitle>
          <form
            className="flex items-center gap-2 border-b px-4"
            onSubmit={(e) => {
              e.preventDefault();
              goToSearch(query);
            }}
          >
            <Search className="size-4.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shirts, kurtis, linen, colours…"
              aria-label="Search"
              className="h-14 border-0 px-0 text-base shadow-none focus-visible:ring-0"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <X className="size-4 text-muted-foreground" />
              </button>
            )}
          </form>

          <div className="max-h-[60vh] overflow-y-auto p-3">
            {showIdle ? (
              <div className="space-y-5 p-2">
                {recent.length > 0 && (
                  <div>
                    <p className="flex items-center justify-between px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Clock className="size-3.5" aria-hidden="true" /> Recent</span>
                      <button type="button" onClick={clearRecent} className="font-semibold normal-case underline-offset-4 hover:underline">Clear</button>
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {recent.map((r) => (
                        <li key={r}>
                          <button type="button" onClick={() => goToSearch(r)} className="rounded-full border px-3.5 py-1.5 text-sm hover:border-primary hover:text-primary">
                            {r}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="flex items-center gap-1.5 px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    <TrendingUp className="size-3.5" aria-hidden="true" /> Trending
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((t) => (
                      <li key={t}>
                        <button type="button" onClick={() => goToSearch(t)} className="rounded-full bg-surface px-3.5 py-1.5 text-sm hover:bg-secondary hover:text-primary">
                          {t}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Popular right now</p>
                  <ul className="mt-2">
                    {popularItems.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={ROUTES.product(p.handle)}
                          onClick={() => { setOpen(false); setQuery(""); }}
                          className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none"
                        >
                          <span className="relative size-10 shrink-0 overflow-hidden rounded-lg border bg-surface">
                            {p.thumbnail ? (
                              <Image src={p.thumbnail} alt="" fill sizes="40px" className="object-cover" />
                            ) : (
                              <span className="flex h-full items-center justify-center"><Leaf className="size-4 text-brand-200" aria-hidden="true" /></span>
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-1 text-sm font-medium">{p.title}</span>
                            <span className="text-xs text-muted-foreground">{formatPrice(p.price.amount)}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="px-1 text-xs text-muted-foreground">
                  Tip: press <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-2xs">Ctrl K</kbd> anywhere to search.
                </p>
              </div>
            ) : loading ? (
              <ul className="space-y-2 p-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="flex items-center gap-3 p-2">
                    <Skeleton className="size-12 rounded-xl" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                {results.suggestions.length > 0 && (
                  <ul className="mb-2 flex flex-wrap gap-2 px-1">
                    {results.suggestions.map((s) => (
                      <li key={s}>
                        <button type="button" onClick={() => goToSearch(s)} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                          <Flame className="size-3" aria-hidden="true" /> {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {popular.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="font-display font-semibold">No matches for &ldquo;{query}&rdquo;</p>
                    <p className="mt-1 text-sm text-muted-foreground">Try &ldquo;linen&rdquo;, &ldquo;kurti&rdquo; or &ldquo;chinos&rdquo;.</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => goToSearch(query)}>
                      Search the full catalog
                    </Button>
                  </div>
                ) : (
                  <ul>
                    {popular.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={ROUTES.product(p.handle)}
                          onClick={() => {
                            addRecent(query);
                            setOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none"
                        >
                          <span className="relative size-12 shrink-0 overflow-hidden rounded-xl border bg-surface">
                            {p.thumbnail ? (
                              <Image src={p.thumbnail} alt="" fill sizes="48px" className="object-cover" />
                            ) : (
                              <span className="flex h-full items-center justify-center"><Leaf className="size-5 text-brand-200" aria-hidden="true" /></span>
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-1 text-sm font-semibold">{p.title}</span>
                            <span className="text-xs text-muted-foreground">{formatPrice(p.price.amount)}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                    <li className="mt-1 border-t pt-2">
                      <button type="button" onClick={() => goToSearch(query)} className="w-full rounded-xl p-2 text-center text-sm font-semibold text-primary hover:bg-surface">
                        See all results for &ldquo;{query}&rdquo; →
                      </button>
                    </li>
                  </ul>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
