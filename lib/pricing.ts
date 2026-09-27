import {
  COD_FEE,
  COUPONS,
  FREE_SHIPPING_THRESHOLD,
  GST_APPAREL,
  SHIPPING_EXPRESS,
  SHIPPING_FLAT,
} from "@/constants";

export interface PriceLine {
  /** GST-inclusive selling price of one piece, in whole rupees. */
  unitPrice: number;
  quantity: number;
}

export interface QuoteInput {
  items: PriceLine[];
  couponCode?: string | null;
  shippingMethod?: "standard" | "express";
  paymentMethod?: "razorpay" | "cashfree" | "cod";
}

export interface LineTax {
  /** Line value after its share of the coupon discount (GST-inclusive). */
  net: number;
  /** Effective GST-inclusive price per piece after discount. */
  netPerPiece: number;
  rate: number;
  taxable: number;
  tax: number;
}

export interface GstBucket {
  rate: number;
  taxable: number;
  tax: number;
}

export interface Quote {
  subtotal: number;
  discount: number;
  couponCode: string | null;
  afterDiscount: number;
  shipping: number;
  codFee: number;
  total: number;
  totalPaise: number;
  /** Total GST contained in `total` (rounded to whole rupees for display). */
  gstIncluded: number;
  /** Per-line tax detail, index-aligned with `input.items`. */
  lines: LineTax[];
  /** Tax summary grouped by rate (for invoices / GSTR-1 rate-wise summary). */
  gstBreakdown: GstBucket[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * GST rate for one garment given its GST-inclusive, post-discount price.
 *
 * The statutory test is on the taxable (pre-GST) value: ≤ ₹2,500 → 5%, else 18%.
 * Because storefront prices include GST, we test `price / 1.05 ≤ 2500`
 * (i.e. inclusive ≤ ₹2,625). Inclusive prices in (₹2,625, ₹2,950] are
 * inherently ambiguous — under 18% their taxable value is ≤ ₹2,500 — so this
 * resolves them to 18% (the conservative reading). Merchandising should avoid
 * pricing inside that band; see isInAmbiguousGstBand().
 */
export function gstRateForPiece(inclusivePrice: number): number {
  const taxableAtLow = inclusivePrice / (1 + GST_APPAREL.lowRate);
  return taxableAtLow <= GST_APPAREL.thresholdTaxable ? GST_APPAREL.lowRate : GST_APPAREL.highRate;
}

/** True when a GST-inclusive price sits in the ambiguous slab band (₹2,626–₹2,950). */
export function isInAmbiguousGstBand(inclusivePrice: number): boolean {
  const lowCeiling = GST_APPAREL.thresholdTaxable * (1 + GST_APPAREL.lowRate);
  const highCeiling = GST_APPAREL.thresholdTaxable * (1 + GST_APPAREL.highRate);
  return inclusivePrice > lowCeiling && inclusivePrice <= highCeiling;
}

/**
 * Splits an integer discount across lines in proportion to line value using
 * largest-remainder rounding, so the parts always sum exactly to `discount`.
 */
export function allocateDiscount(lineValues: number[], discount: number): number[] {
  const total = lineValues.reduce((s, v) => s + v, 0);
  if (discount <= 0 || total <= 0) return lineValues.map(() => 0);
  const raw = lineValues.map((v) => (v / total) * discount);
  const result = raw.map(Math.floor);
  let remainder = discount - result.reduce((s, v) => s + v, 0);
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  for (const { i } of order) {
    if (remainder <= 0) break;
    result[i] = (result[i] ?? 0) + 1;
    remainder -= 1;
  }
  return result;
}

/** Single source of truth for order math — used by cart UI, checkout UI and payment APIs. */
export function quoteOrder(input: QuoteInput): Quote {
  const lineValues = input.items.map((i) => i.unitPrice * i.quantity);
  const subtotal = lineValues.reduce((s, v) => s + v, 0);

  const code = input.couponCode?.trim().toUpperCase() || null;
  const coupon = code ? COUPONS[code] : undefined;
  const discount = coupon ? Math.round((subtotal * coupon.percentOff) / 100) : 0;
  const afterDiscount = subtotal - discount;

  const shipping =
    afterDiscount === 0
      ? 0
      : input.shippingMethod === "express"
        ? SHIPPING_EXPRESS
        : afterDiscount >= FREE_SHIPPING_THRESHOLD
          ? 0
          : SHIPPING_FLAT;
  const codFee = input.paymentMethod === "cod" && afterDiscount > 0 ? COD_FEE : 0;
  const total = afterDiscount + shipping + codFee;

  const shares = allocateDiscount(lineValues, discount);
  const lines: LineTax[] = input.items.map((item, idx) => {
    const net = (lineValues[idx] ?? 0) - (shares[idx] ?? 0);
    const netPerPiece = item.quantity > 0 ? net / item.quantity : 0;
    const rate = gstRateForPiece(netPerPiece);
    const taxable = net / (1 + rate);
    return { net, netPerPiece: round2(netPerPiece), rate, taxable: round2(taxable), tax: round2(net - taxable) };
  });

  const buckets = new Map<number, { rate: number; taxable: number; tax: number }>();
  const add = (rate: number, gross: number) => {
    if (gross <= 0) return;
    const taxable = gross / (1 + rate);
    const b = buckets.get(rate) ?? { rate, taxable: 0, tax: 0 };
    b.taxable += taxable;
    b.tax += gross - taxable;
    buckets.set(rate, b);
  };
  for (const l of lines) add(l.rate, l.net);
  add(GST_APPAREL.serviceRate, shipping + codFee);

  const gstBreakdown = [...buckets.values()]
    .map((b) => ({ rate: b.rate, taxable: round2(b.taxable), tax: round2(b.tax) }))
    .sort((a, b) => a.rate - b.rate);
  const gstTotal = gstBreakdown.reduce((s, b) => s + b.tax, 0);

  return {
    subtotal,
    discount,
    couponCode: coupon ? code : null,
    afterDiscount,
    shipping,
    codFee,
    total,
    totalPaise: total * 100,
    gstIncluded: Math.round(gstTotal),
    lines,
    gstBreakdown,
  };
}

export function validateCoupon(code: string): { valid: boolean; percentOff?: number; label?: string } {
  const c = COUPONS[code.trim().toUpperCase()];
  return c ? { valid: true, percentOff: c.percentOff, label: c.label } : { valid: false };
}
