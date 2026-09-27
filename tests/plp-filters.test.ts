import { describe, expect, it } from "vitest";
import { activeChips, applyListingState, facetOptions, parseListingState } from "@/lib/plp-filters";
import { FALLBACK_BESTSELLERS } from "@/constants/marketing";

const state = (qs: string) => parseListingState(new URLSearchParams(qs));
const handles = (qs: string) => applyListingState(FALLBACK_BESTSELLERS, state(qs)).map((p) => p.handle);

describe("parseListingState", () => {
  it("parses list, number and sort params", () => {
    const s = state("gender=men&size=M,L&min=500&discount=20&sort=price-asc&stock=1");
    expect(s.genders).toEqual(["men"]);
    expect(s.sizes).toEqual(["M", "L"]);
    expect(s.minPrice).toBe(500);
    expect(s.minDiscount).toBe(20);
    expect(s.sort).toBe("price-asc");
    expect(s.inStockOnly).toBe(true);
  });
  it("drops unknown genders and invalid sorts", () => {
    const s = state("gender=kids,women&sort=bogus");
    expect(s.genders).toEqual(["women"]);
    expect(s.sort).toBe("-created_at");
  });
  it("treats empty numbers as unset", () => {
    expect(state("min=").minPrice).toBeUndefined();
  });
});

describe("applyListingState", () => {
  it("filters by department", () => {
    const women = handles("gender=women");
    expect(women).toContain("printed-cotton-kurti");
    expect(women).not.toContain("oxford-cotton-shirt");
  });
  it("ORs within a facet and ANDs across facets", () => {
    expect(handles("cat=Shirts,Kurtis").sort()).toEqual(["oxford-cotton-shirt", "printed-cotton-kurti"]);
    expect(handles("cat=Shirts,Kurtis&gender=men")).toEqual(["oxford-cotton-shirt"]);
  });
  it("matches waist sizes only on bottoms", () => {
    expect(handles("size=32")).toEqual(["slim-stretch-chinos"]);
  });
  it("filters by colour name and fabric family", () => {
    expect(handles("color=Khaki")).toEqual(["slim-stretch-chinos"]);
    expect(handles("fabric=Linen")).toEqual(["linen-blazer"]);
  });
  it("supports multi-word search across fabric and category", () => {
    expect(handles("q=linen kurta")).toEqual(["linen-blend-kurta"]);
  });
  it("sale link (discount=20) keeps only 20%+ markdowns", () => {
    const sale = applyListingState(FALLBACK_BESTSELLERS, state("discount=20"));
    expect(sale.length).toBeGreaterThan(0);
    expect(sale.every((p) => p.compareAtPrice && (p.compareAtPrice.amount - p.price.amount) / p.compareAtPrice.amount >= 0.195)).toBe(true);
  });
  it("sorts by price", () => {
    const sorted = applyListingState(FALLBACK_BESTSELLERS, state("sort=price-asc"));
    expect(sorted[0]?.price.amount).toBe(599);
  });
});

describe("facetOptions / activeChips", () => {
  it("derives facets from the listing without reviews", () => {
    const f = facetOptions(FALLBACK_BESTSELLERS);
    expect(f.genders).toEqual(["men", "women"]);
    expect(f.sizes.slice(0, 2)).toEqual(["XS", "S"]);
    expect(f.hasReviews).toBe(false);
  });
  it("builds removable chips", () => {
    const chips = activeChips(state("gender=men&size=M&discount=20"));
    expect(chips.map((c) => c.label)).toEqual(["Men", "Size M", "20%+ off"]);
  });
});
