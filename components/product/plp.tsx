"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import type { PlpSort, ProductCardData } from "@/types";
import {
  FILTER_KEYS,
  activeChips,
  applyListingState,
  facetOptions,
  parseListingState,
  type FacetOptions,
  type ListKey,
  type ListingState,
} from "@/lib/plp-filters";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductGrid } from "@/components/product/product-grid";
import { RatingStars } from "@/components/product/rating-stars";

const BASE_SORTS: Array<{ value: PlpSort; label: string }> = [
  { value: "-created_at", label: "Newest" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
  { value: "title", label: "Name: A–Z" },
];

const PAGE_SIZE = 12;
const DISCOUNT_STEPS = [10, 20, 30] as const;
const GENDER_LABEL = { men: "Men", women: "Women", unisex: "Unisex" } as const;

type Update = (patch: Record<string, string | null>) => void;

function FacetHeading({ children }: { children: React.ReactNode }) {
  return <legend className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</legend>;
}

function CheckboxFacet({
  id,
  label,
  options,
  selected,
  onToggle,
}: {
  id: string;
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (options.length < 2) return null;
  return (
    <>
      <fieldset>
        <FacetHeading>{label}</FacetHeading>
        <ul className="space-y-2">
          {options.map((o) => (
            <li key={o} className="flex items-center gap-2.5">
              <Checkbox id={`${id}-${o}`} checked={selected.includes(o)} onCheckedChange={() => onToggle(o)} />
              <Label htmlFor={`${id}-${o}`} className="cursor-pointer text-sm font-normal">{o}</Label>
            </li>
          ))}
        </ul>
      </fieldset>
      <Separator />
    </>
  );
}

function FilterPanel({
  filters,
  facets,
  update,
  reset,
}: {
  filters: ListingState;
  facets: FacetOptions;
  update: Update;
  reset: () => void;
}) {
  const [min, setMin] = useState(filters.minPrice?.toString() ?? "");
  const [max, setMax] = useState(filters.maxPrice?.toString() ?? "");

  const selectedFor: Record<ListKey, string[]> = {
    gender: filters.genders,
    cat: filters.categories,
    size: filters.sizes,
    color: filters.colors,
    fabric: filters.fabrics,
    fit: filters.fits,
  };
  const toggle = (key: ListKey, value: string) => {
    const current = selectedFor[key];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    update({ [key]: next.length ? next.join(",") : null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Filters</p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary"
        >
          <RotateCcw className="size-3" aria-hidden="true" /> Reset
        </button>
      </div>

      {facets.genders.length > 1 && (
        <>
          <fieldset>
            <FacetHeading>Department</FacetHeading>
            <div className="flex gap-2">
              {facets.genders.map((g) => (
                <button
                  key={g}
                  type="button"
                  aria-pressed={filters.genders.includes(g)}
                  onClick={() => toggle("gender", g)}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    filters.genders.includes(g) ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"
                  )}
                >
                  {GENDER_LABEL[g]}
                </button>
              ))}
            </div>
          </fieldset>
          <Separator />
        </>
      )}

      <CheckboxFacet id="cat" label="Category" options={facets.categories} selected={filters.categories} onToggle={(v) => toggle("cat", v)} />

      {facets.sizes.length > 0 && (
        <>
          <fieldset>
            <FacetHeading>Size</FacetHeading>
            <div className="grid grid-cols-4 gap-2">
              {facets.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={filters.sizes.includes(s)}
                  onClick={() => toggle("size", s)}
                  className={cn(
                    "rounded-lg border py-2 text-sm font-medium tabular-nums transition-colors",
                    filters.sizes.includes(s) ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
          <Separator />
        </>
      )}

      {facets.colors.length > 1 && (
        <>
          <fieldset>
            <FacetHeading>Colour</FacetHeading>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-2">
              {facets.colors.map((c) => {
                const on = filters.colors.includes(c.name);
                return (
                  <li key={c.name}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle("color", c.name)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-sm transition-colors",
                        on ? "bg-secondary font-semibold text-primary" : "hover:bg-muted"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn("size-4 shrink-0 rounded-full border border-black/15", on && "ring-2 ring-primary ring-offset-1")}
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </fieldset>
          <Separator />
        </>
      )}

      <CheckboxFacet id="fabric" label="Fabric" options={facets.fabrics} selected={filters.fabrics} onToggle={(v) => toggle("fabric", v)} />
      <CheckboxFacet id="fit" label="Fit" options={facets.fits} selected={filters.fits} onToggle={(v) => toggle("fit", v)} />

      <fieldset>
        <FacetHeading>Price (₹)</FacetHeading>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            update({ [FILTER_KEYS.min]: min || null, [FILTER_KEYS.max]: max || null });
          }}
        >
          <Input inputMode="numeric" placeholder="Min" aria-label="Minimum price" value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))} className="h-9" />
          <span aria-hidden="true" className="text-muted-foreground">–</span>
          <Input inputMode="numeric" placeholder="Max" aria-label="Maximum price" value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))} className="h-9" />
          <Button type="submit" size="sm" variant="outline" className="h-9">Go</Button>
        </form>
      </fieldset>

      <Separator />

      <fieldset>
        <FacetHeading>Discount</FacetHeading>
        <div className="flex gap-2">
          {DISCOUNT_STEPS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={filters.minDiscount === d}
              onClick={() => update({ [FILTER_KEYS.discount]: filters.minDiscount === d ? null : String(d) })}
              className={cn(
                "flex-1 rounded-lg border py-2 text-sm font-medium transition-colors",
                filters.minDiscount === d ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"
              )}
            >
              {d}%+
            </button>
          ))}
        </div>
      </fieldset>

      {facets.hasReviews && (
        <>
          <Separator />
          <fieldset>
            <FacetHeading>Rating</FacetHeading>
            <div className="space-y-1.5">
              {[4, 3].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => update({ [FILTER_KEYS.rating]: filters.minRating === r ? null : String(r) })}
                  aria-pressed={filters.minRating === r}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                    filters.minRating === r ? "bg-secondary font-semibold text-primary" : "hover:bg-muted"
                  )}
                >
                  <RatingStars rating={r} showCount={false} /> &amp; up
                </button>
              ))}
            </div>
          </fieldset>
        </>
      )}

      <Separator />

      <div className="flex items-center gap-2.5">
        <Checkbox
          id="stock-only"
          checked={filters.inStockOnly}
          onCheckedChange={(v) => update({ [FILTER_KEYS.stock]: v ? "1" : null })}
        />
        <Label htmlFor="stock-only" className="cursor-pointer text-sm font-normal">In stock only</Label>
      </div>
    </div>
  );
}

export function Plp({ products, emptyHint }: { products: ProductCardData[]; emptyHint?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseListingState(new URLSearchParams(searchParams.toString())), [searchParams]);
  const facets = useMemo(() => facetOptions(products), [products]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [pending, setPending] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => applyListingState(products, filters), [products, filters]);
  const chips = useMemo(() => activeChips(filters), [filters]);
  const sorts = facets.hasReviews ? [...BASE_SORTS, { value: "rating" as PlpSort, label: "Top rated" }] : BASE_SORTS;
  const shown = filtered.slice(0, visible);

  function update(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    }
    setVisible(PAGE_SIZE);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function removeChip(key: string, value: string) {
    if (key === "price") return update({ [FILTER_KEYS.min]: null, [FILTER_KEYS.max]: null });
    const current = searchParams.get(key)?.split(",").filter(Boolean) ?? [];
    const next = current.filter((v) => v !== value);
    update({ [key]: next.length ? next.join(",") : null });
  }

  function reset() {
    setVisible(PAGE_SIZE);
    const q = searchParams.get(FILTER_KEYS.q);
    router.push(q ? `${pathname}?${FILTER_KEYS.q}=${encodeURIComponent(q)}` : pathname, { scroll: false });
  }

  // Infinite scroll: reveal more when the sentinel enters the viewport.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || visible >= filtered.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPending(true);
          window.setTimeout(() => {
            setVisible((v) => v + PAGE_SIZE);
            setPending(false);
          }, 250);
        }
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, filtered.length]);

  const panel = <FilterPanel filters={filters} facets={facets} update={update} reset={reset} />;

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <aside className="hidden lg:block" aria-label="Product filters">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border bg-card p-5 pr-4">{panel}</div>
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal aria-hidden="true" />
                Filters{chips.length > 0 && ` (${chips.length})`}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">{panel}</div>
            </SheetContent>
          </Sheet>

          <p className="text-sm text-muted-foreground" aria-live="polite">
            {filtered.length} product{filtered.length === 1 ? "" : "s"}
          </p>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center rounded-full border p-0.5 sm:flex" role="group" aria-label="Layout">
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
                aria-label="Grid view"
                className={cn("flex size-8 items-center justify-center rounded-full", view === "grid" && "bg-secondary text-primary")}
              >
                <LayoutGrid className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                aria-label="List view"
                className={cn("flex size-8 items-center justify-center rounded-full", view === "list" && "bg-secondary text-primary")}
              >
                <List className="size-4" aria-hidden="true" />
              </button>
            </div>

            <label className="sr-only" htmlFor="plp-sort">Sort products</label>
            <select
              id="plp-sort"
              value={filters.sort}
              onChange={(e) => update({ [FILTER_KEYS.sort]: e.target.value })}
              className="h-9 rounded-full border bg-background px-3.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <button
                key={`${chip.key}-${chip.value}`}
                type="button"
                onClick={() => removeChip(chip.key, chip.value)}
                aria-label={`Remove filter: ${chip.label}`}
                className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary hover:bg-brand-200"
              >
                {chip.label}
                <X className="size-3" aria-hidden="true" />
              </button>
            ))}
            <button type="button" onClick={reset} className="text-xs font-semibold text-muted-foreground underline-offset-4 hover:underline">
              Clear all
            </button>
          </div>
        )}

        <ProductGrid products={shown} layout={view} />
        {shown.length === 0 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {emptyHint ?? "Nothing matches these filters. Try removing one."}
          </p>
        )}

        <div ref={sentinelRef} aria-hidden="true" />
        {pending && (
          <div className={cn("mt-6 grid gap-4", view === "grid" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1")}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className={view === "grid" ? "aspect-[3/4] rounded-2xl" : "h-36 rounded-2xl"} />
            ))}
          </div>
        )}
        {!pending && visible < filtered.length && (
          <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Load more ({filtered.length - visible} left)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
