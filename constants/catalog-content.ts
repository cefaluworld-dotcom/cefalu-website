import type { ColorOption, Gender, ProductEnrichment, QuestionEntry, ReviewEntry, SizeChart } from "@/types";

/* ------------------------------------------------------------------ */
/* Colours (shared swatch palette — names are the filter values)       */
/* ------------------------------------------------------------------ */

export const COLORS = {
  white: { name: "White", hex: "#FFFFFF" },
  skyBlue: { name: "Sky Blue", hex: "#A9C8EA" },
  navy: { name: "Navy", hex: "#1C2E4A" },
  indigo: { name: "Indigo", hex: "#2E3A87" },
  heatherGrey: { name: "Heather Grey", hex: "#B7BBC0" },
  charcoal: { name: "Charcoal", hex: "#3A3D42" },
  olive: { name: "Olive", hex: "#6B7152" },
  khaki: { name: "Khaki", hex: "#C3AE86" },
  beige: { name: "Beige", hex: "#D8C8A8" },
  black: { name: "Black", hex: "#141414" },
  mustard: { name: "Mustard", hex: "#D4A017" },
  rose: { name: "Rose", hex: "#D9899A" },
  cobaltPrint: { name: "Cobalt Print", hex: "#1F4E9E" },
} satisfies Record<string, ColorOption>;

/* ------------------------------------------------------------------ */
/* Size charts (garment measurements, inches)                          */
/* ------------------------------------------------------------------ */

const TOP_MEASURE = [
  { label: "Chest / Bust", description: "Measure around the fullest part of the chest, keeping the tape level under the arms." },
  { label: "Length", description: "From the highest point of the shoulder down to the hem." },
  { label: "Shoulder", description: "Straight across the back, from one shoulder seam to the other." },
];
const BOTTOM_MEASURE = [
  { label: "Waist", description: "Around your natural waistline, where you normally wear your trousers." },
  { label: "Hip", description: "Around the fullest part of the hips, feet together." },
  { label: "Inseam", description: "From the crotch seam down to the bottom of the leg." },
];

export const SIZE_CHARTS: Record<string, SizeChart> = {
  "men-tops": {
    id: "men-tops",
    title: "Men's shirts, t-shirts & blazers",
    unit: "in",
    columns: ["Chest", "Length", "Shoulder", "Sleeve"],
    rows: [
      { size: "S", values: ["38", "27.5", "17", "24.5"] },
      { size: "M", values: ["40", "28", "17.5", "25"] },
      { size: "L", values: ["42", "28.5", "18", "25.5"] },
      { size: "XL", values: ["44", "29", "18.5", "26"] },
      { size: "XXL", values: ["46", "29.5", "19", "26.5"] },
    ],
    howToMeasure: TOP_MEASURE,
    fitNote: "Garment measurements. For a relaxed fit, pick the size whose chest is 2–4 in more than your body chest.",
  },
  "men-kurtas": {
    id: "men-kurtas",
    title: "Men's kurtas",
    unit: "in",
    columns: ["Chest", "Length", "Shoulder", "Sleeve"],
    rows: [
      { size: "S", values: ["39", "40", "17", "24"] },
      { size: "M", values: ["41", "40.5", "17.5", "24.5"] },
      { size: "L", values: ["43", "41", "18", "25"] },
      { size: "XL", values: ["45", "41.5", "18.5", "25.5"] },
      { size: "XXL", values: ["47", "42", "19", "26"] },
    ],
    howToMeasure: TOP_MEASURE,
  },
  "men-bottoms": {
    id: "men-bottoms",
    title: "Men's trousers & chinos",
    unit: "in",
    columns: ["Waist", "Hip", "Inseam", "Rise"],
    rows: [
      { size: "28", values: ["28", "37", "31", "10"] },
      { size: "30", values: ["30", "39", "31", "10.25"] },
      { size: "32", values: ["32", "41", "32", "10.5"] },
      { size: "34", values: ["34", "43", "32", "10.75"] },
      { size: "36", values: ["36", "45", "32", "11"] },
      { size: "38", values: ["38", "47", "32", "11.25"] },
    ],
    howToMeasure: BOTTOM_MEASURE,
    fitNote: "Waist sizes match your body waist in inches. Between sizes? Take the larger one — the stretch fabric gives a close fit.",
  },
  "women-tops": {
    id: "women-tops",
    title: "Women's kurtis, dresses & co-ords",
    unit: "in",
    columns: ["Bust", "Waist", "Hip", "Length"],
    rows: [
      { size: "XS", values: ["32", "26", "35", "44"] },
      { size: "S", values: ["34", "28", "37", "44"] },
      { size: "M", values: ["36", "30", "39", "45"] },
      { size: "L", values: ["38", "32", "41", "45"] },
      { size: "XL", values: ["40", "34", "43", "46"] },
      { size: "XXL", values: ["42", "36", "45", "46"] },
    ],
    howToMeasure: [
      { label: "Bust", description: "Around the fullest part of the bust, keeping the tape parallel to the floor." },
      { label: "Waist", description: "Around the narrowest part of your waist." },
      { label: "Hip", description: "Around the fullest part of the hips." },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Per-product apparel enrichment (keyed by Medusa handle)             */
/* ------------------------------------------------------------------ */

const MEN_TOP_SIZES = ["S", "M", "L", "XL", "XXL"];
const WOMEN_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const WAIST_SIZES = ["28", "30", "32", "34", "36", "38"];

const CARE_COTTON = ["Machine wash cold with similar colours", "Do not bleach", "Tumble dry low or line dry in shade", "Warm iron"];
const CARE_DELICATE = ["Gentle hand wash in cold water", "Wash dark colours separately", "Dry flat in shade", "Iron on reverse, low heat"];

type EnrichmentInput = Omit<ProductEnrichment, "brand" | "rating" | "reviewCount" | "faqs" | "tags"> &
  Partial<Pick<ProductEnrichment, "faqs" | "tags">>;

const E = (p: EnrichmentInput): ProductEnrichment => ({
  brand: "Cefalu",
  rating: 0,
  reviewCount: 0,
  faqs: [],
  tags: [],
  ...p,
});

export const CATALOG_ENRICHMENT: Record<string, ProductEnrichment> = {
  "oxford-cotton-shirt": E({
    gender: "men",
    subcategory: "Shirts",
    shortDescription: "A crisp everyday Oxford that works tucked into chinos or open over a tee.",
    highlights: ["Soft-washed so it's comfortable from day one", "Button-down collar keeps its shape", "Curved hem looks neat tucked or untucked"],
    fabric: "100% cotton Oxford weave, 140 GSM",
    fabricFamily: "Cotton",
    fit: "Regular fit",
    fitFamily: "Regular",
    pattern: "Solid",
    occasion: ["Office", "Casual"],
    sleeve: "Full sleeve",
    neck: "Button-down collar",
    closure: "Front button placket",
    care: CARE_COTTON,
    sizeChartId: "men-tops",
    modelInfo: "Model is 6'0\" and wears size M",
    fitAdvice: "True to size. Size down for a closer fit.",
    colors: [COLORS.white, COLORS.skyBlue, COLORS.navy],
    sizes: MEN_TOP_SIZES,
    hsnCode: "6205",
    tags: ["Bestseller"],
    faqs: [
      { question: "Will it shrink after washing?", answer: "The fabric is pre-washed, so shrinkage is minimal (under 2%) when washed cold and line dried." },
      { question: "Is the white see-through?", answer: "No — the Oxford weave is dense enough to wear on its own." },
    ],
  }),
  "everyday-crew-tee": E({
    gender: "men",
    subcategory: "T-Shirts",
    shortDescription: "A mid-weight crew-neck tee that holds its shape wash after wash.",
    highlights: ["Combed cotton for a smooth, soft hand-feel", "Rib-knit collar that doesn't stretch out", "Side-seamed body for a clean drape"],
    fabric: "100% combed cotton jersey, 180 GSM",
    fabricFamily: "Cotton",
    fit: "Regular fit",
    fitFamily: "Regular",
    pattern: "Solid",
    occasion: ["Casual", "Lounge"],
    sleeve: "Half sleeve",
    neck: "Crew neck",
    care: CARE_COTTON,
    sizeChartId: "men-tops",
    modelInfo: "Model is 5'11\" and wears size M",
    fitAdvice: "True to size. Size up for a relaxed look.",
    colors: [COLORS.white, COLORS.navy, COLORS.heatherGrey, COLORS.olive],
    sizes: MEN_TOP_SIZES,
    hsnCode: "6109",
    tags: ["New"],
  }),
  "slim-stretch-chinos": E({
    gender: "men",
    subcategory: "Trousers",
    shortDescription: "Slim chinos with a little stretch, so they move with you through a full day.",
    highlights: ["2% stretch for comfort at the knee and seat", "Tapered leg with a clean ankle", "Deep front pockets that phones don't fall out of"],
    fabric: "98% cotton, 2% elastane twill, 260 GSM",
    fabricFamily: "Cotton stretch",
    fit: "Slim fit",
    fitFamily: "Slim",
    pattern: "Solid",
    occasion: ["Office", "Casual"],
    length: "Full length (32\" inseam)",
    closure: "Zip fly with button",
    care: CARE_COTTON,
    sizeChartId: "men-bottoms",
    modelInfo: "Model is 6'0\" and wears size 32",
    fitAdvice: "True to waist size. Between sizes, size up.",
    colors: [COLORS.khaki, COLORS.navy, COLORS.charcoal],
    sizes: WAIST_SIZES,
    hsnCode: "6203",
    tags: ["Bestseller"],
  }),
  "linen-blend-kurta": E({
    gender: "men",
    subcategory: "Kurtas",
    shortDescription: "A breathable linen-blend kurta for festive days and long summer evenings.",
    highlights: ["Linen blend that stays cool in the heat", "Mandarin collar with a concealed placket", "Side slits for easy movement"],
    fabric: "55% linen, 45% cotton",
    fabricFamily: "Linen blend",
    fit: "Straight fit",
    fitFamily: "Straight",
    pattern: "Solid",
    occasion: ["Festive", "Casual"],
    sleeve: "Full sleeve",
    neck: "Mandarin collar",
    length: "Knee length",
    care: CARE_DELICATE,
    sizeChartId: "men-kurtas",
    modelInfo: "Model is 6'0\" and wears size M",
    fitAdvice: "True to size.",
    colors: [COLORS.white, COLORS.indigo, COLORS.beige],
    sizes: MEN_TOP_SIZES,
    hsnCode: "6211",
  }),
  "printed-cotton-kurti": E({
    gender: "women",
    subcategory: "Kurtis",
    shortDescription: "An easy block-printed cotton kurti — pair with palazzos, jeans or leggings.",
    highlights: ["Hand block-inspired print", "Three-quarter sleeves", "Pure cotton that softens with every wash"],
    fabric: "100% cotton cambric",
    fabricFamily: "Cotton",
    fit: "A-line",
    fitFamily: "A-Line",
    pattern: "Printed",
    occasion: ["Office", "Casual"],
    sleeve: "Three-quarter sleeve",
    neck: "Round neck with keyhole",
    length: "Calf length",
    care: CARE_DELICATE,
    sizeChartId: "women-tops",
    modelInfo: "Model is 5'7\" and wears size S",
    fitAdvice: "True to size.",
    colors: [COLORS.cobaltPrint, COLORS.mustard, COLORS.rose],
    sizes: WOMEN_SIZES,
    hsnCode: "6211",
    tags: ["Bestseller"],
  }),
  "tiered-midi-dress": E({
    gender: "women",
    subcategory: "Dresses",
    shortDescription: "A swingy tiered midi that goes from brunch to evening plans.",
    highlights: ["Three tiers for movement", "Adjustable tie at the waist", "Fully lined bodice"],
    fabric: "100% cotton voile with cotton lining",
    fabricFamily: "Cotton",
    fit: "Flared",
    fitFamily: "Flared",
    pattern: "Solid",
    occasion: ["Casual", "Party"],
    sleeve: "Short puff sleeve",
    neck: "Square neck",
    length: "Midi",
    care: CARE_DELICATE,
    sizeChartId: "women-tops",
    modelInfo: "Model is 5'7\" and wears size S",
    fitAdvice: "True to size. The waist tie adjusts the fit.",
    colors: [COLORS.cobaltPrint, COLORS.white, COLORS.black],
    sizes: WOMEN_SIZES,
    hsnCode: "6204",
    tags: ["New"],
  }),
  "rayon-coord-set": E({
    gender: "women",
    subcategory: "Co-ord Sets",
    shortDescription: "A relaxed shirt-and-palazzo set that looks put-together with zero effort.",
    highlights: ["Two-piece set — wear together or separately", "Elasticated palazzo waist with drawstring", "Fluid rayon drapes well"],
    fabric: "100% rayon",
    fabricFamily: "Rayon",
    fit: "Relaxed fit",
    fitFamily: "Relaxed",
    pattern: "Solid",
    occasion: ["Casual", "Travel"],
    sleeve: "Full sleeve",
    neck: "Shirt collar",
    care: CARE_DELICATE,
    sizeChartId: "women-tops",
    modelInfo: "Model is 5'7\" and wears size S",
    fitAdvice: "Relaxed by design. Size down for a closer fit.",
    colors: [COLORS.skyBlue, COLORS.olive, COLORS.beige],
    sizes: WOMEN_SIZES,
    hsnCode: "6204",
  }),
  "linen-blazer": E({
    gender: "men",
    subcategory: "Blazers",
    shortDescription: "An unstructured linen blazer — sharp enough for meetings, easy enough for weddings.",
    highlights: ["Unlined and unstructured, so it breathes", "Two-button front with notch lapel", "Patch pockets and a single back vent"],
    fabric: "100% linen, 210 GSM",
    fabricFamily: "Linen",
    fit: "Tailored fit",
    fitFamily: "Tailored",
    pattern: "Solid",
    occasion: ["Office", "Festive", "Party"],
    sleeve: "Full sleeve",
    neck: "Notch lapel",
    closure: "Two-button front",
    care: ["Dry clean recommended", "Steam to release creases", "Store on a wide hanger"],
    sizeChartId: "men-tops",
    modelInfo: "Model is 6'0\" and wears size M",
    fitAdvice: "True to size. Leave room for a shirt underneath.",
    colors: [COLORS.navy, COLORS.beige],
    sizes: MEN_TOP_SIZES,
    hsnCode: "6203",
    tags: ["Premium"],
  }),
};

export const DEFAULT_ENRICHMENT: ProductEnrichment = E({
  gender: "unisex",
  subcategory: "Clothing",
  shortDescription: "Everyday clothing in honest fabrics, cut to fit.",
  highlights: ["Quality-checked before dispatch", "7-day returns & exchanges"],
  fabric: "See product label",
  fabricFamily: "Cotton",
  fit: "Regular fit",
  fitFamily: "Regular",
  pattern: "Solid",
  occasion: ["Casual"],
  care: CARE_COTTON,
  sizeChartId: "men-tops",
  fitAdvice: "True to size.",
  colors: [],
  sizes: MEN_TOP_SIZES,
  hsnCode: "6205",
});

/* ------------------------------------------------------------------ */
/* Filter facets                                                       */
/* ------------------------------------------------------------------ */

/** Canonical size ordering for filters and selectors. */
export const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "28", "30", "32", "34", "36", "38", "40"] as const;

export function sortSizes(sizes: string[]): string[] {
  const rank = (s: string) => {
    const i = (SIZE_ORDER as readonly string[]).indexOf(s);
    return i === -1 ? 999 : i;
  };
  return [...sizes].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

const all = <T,>(pick: (e: ProductEnrichment) => T[]) => Object.values(CATALOG_ENRICHMENT).flatMap(pick);

export const ALL_SIZES = sortSizes([...new Set(all((e) => e.sizes))]);
export const ALL_COLORS: ColorOption[] = [...new Map(all((e) => e.colors).map((c) => [c.name, c])).values()];
export const ALL_FABRICS = [...new Set(all((e) => [e.fabricFamily]))].sort();
export const ALL_FITS = [...new Set(all((e) => [e.fitFamily]))].sort();
export const ALL_GENDERS: Array<{ value: Gender; label: string }> = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
];

/* ------------------------------------------------------------------ */
/* Community content — intentionally empty until real customers post.  */
/* Seeding named reviews or Q&A would be fabricated social proof.      */
/* ------------------------------------------------------------------ */

export const SEED_REVIEWS: ReviewEntry[] = [];
export const SEED_QUESTIONS: QuestionEntry[] = [];

export const TRENDING_SEARCHES = ["linen shirts", "kurtis", "chinos", "co-ord sets", "white shirt", "midi dress"] as const;
