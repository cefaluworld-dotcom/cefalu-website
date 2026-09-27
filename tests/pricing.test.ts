import { describe, expect, it } from "vitest";
import {
  allocateDiscount,
  gstRateForPiece,
  isInAmbiguousGstBand,
  quoteOrder,
  validateCoupon,
} from "@/lib/pricing";
import { COD_FEE, FREE_SHIPPING_THRESHOLD, SHIPPING_EXPRESS, SHIPPING_FLAT } from "@/constants";

describe("gstRateForPiece (apparel slabs, GST-inclusive prices)", () => {
  it("applies 5% to everyday garments", () => {
    expect(gstRateForPiece(799)).toBe(0.05);
    expect(gstRateForPiece(1999)).toBe(0.05);
  });
  it("treats ₹2,625 inclusive (₹2,500 taxable) as the 5% ceiling", () => {
    expect(gstRateForPiece(2625)).toBe(0.05);
    expect(gstRateForPiece(2626)).toBe(0.18);
  });
  it("applies 18% to premium garments", () => {
    expect(gstRateForPiece(4999)).toBe(0.18);
  });
  it("flags the ambiguous ₹2,626–₹2,950 band", () => {
    expect(isInAmbiguousGstBand(2625)).toBe(false);
    expect(isInAmbiguousGstBand(2799)).toBe(true);
    expect(isInAmbiguousGstBand(2950)).toBe(true);
    expect(isInAmbiguousGstBand(2951)).toBe(false);
  });
});

describe("allocateDiscount", () => {
  it("always sums exactly to the discount", () => {
    const parts = allocateDiscount([999, 1499, 333], 283);
    expect(parts.reduce((s, v) => s + v, 0)).toBe(283);
  });
  it("is proportional to line value", () => {
    const [a, b] = allocateDiscount([1000, 3000], 400);
    expect(a).toBe(100);
    expect(b).toBe(300);
  });
  it("returns zeros for no discount or empty cart", () => {
    expect(allocateDiscount([500, 500], 0)).toEqual([0, 0]);
    expect(allocateDiscount([], 50)).toEqual([]);
  });
});

describe("quoteOrder", () => {
  it("taxes per piece, not per order (four ₹2,200 kurtas stay at 5%)", () => {
    const q = quoteOrder({ items: [{ unitPrice: 2200, quantity: 4 }] });
    expect(q.subtotal).toBe(8800);
    expect(q.lines[0]?.rate).toBe(0.05);
  });

  it("lets a coupon move a premium piece into the 5% slab", () => {
    // ₹3,000 jacket − 15% = ₹2,550 inclusive → taxable ≈ ₹2,428.57 → 5%
    const without = quoteOrder({ items: [{ unitPrice: 3000, quantity: 1 }] });
    const withCoupon = quoteOrder({ items: [{ unitPrice: 3000, quantity: 1 }], couponCode: "cefalu15" });
    expect(without.lines[0]?.rate).toBe(0.18);
    expect(withCoupon.discount).toBe(450);
    expect(withCoupon.lines[0]?.rate).toBe(0.05);
    expect(withCoupon.lines[0]?.netPerPiece).toBe(2550);
  });

  it("handles mixed-slab carts with a rate-wise breakdown", () => {
    const q = quoteOrder({
      items: [
        { unitPrice: 999, quantity: 2 },
        { unitPrice: 4499, quantity: 1 },
      ],
    });
    const rates = q.gstBreakdown.map((b) => b.rate);
    expect(rates).toContain(0.05);
    expect(rates).toContain(0.18);
    const fivePct = q.gstBreakdown.find((b) => b.rate === 0.05);
    expect(fivePct?.tax).toBeCloseTo(1998 - 1998 / 1.05, 2);
  });

  it("charges flat shipping below the free threshold and taxes it", () => {
    const q = quoteOrder({ items: [{ unitPrice: 599, quantity: 1 }] });
    expect(q.shipping).toBe(SHIPPING_FLAT);
    expect(q.total).toBe(599 + SHIPPING_FLAT);
    expect(q.totalPaise).toBe(q.total * 100);
    expect(q.gstBreakdown.find((b) => b.rate === 0.18)).toBeDefined();
  });

  it("gives free standard shipping at the threshold", () => {
    expect(quoteOrder({ items: [{ unitPrice: FREE_SHIPPING_THRESHOLD, quantity: 1 }] }).shipping).toBe(0);
  });

  it("applies the coupon before the free-shipping check", () => {
    const q = quoteOrder({ items: [{ unitPrice: 1050, quantity: 1 }], couponCode: "WELCOME10" });
    expect(q.discount).toBe(105);
    expect(q.shipping).toBe(SHIPPING_FLAT);
  });

  it("adds express shipping and the COD fee", () => {
    const q = quoteOrder({
      items: [{ unitPrice: 2499, quantity: 1 }],
      shippingMethod: "express",
      paymentMethod: "cod",
    });
    expect(q.total).toBe(2499 + SHIPPING_EXPRESS + COD_FEE);
  });

  it("ignores unknown coupons", () => {
    const q = quoteOrder({ items: [{ unitPrice: 1000, quantity: 1 }], couponCode: "NOPE" });
    expect(q.discount).toBe(0);
    expect(q.couponCode).toBeNull();
  });

  it("returns zeros for an empty cart", () => {
    const q = quoteOrder({ items: [], paymentMethod: "cod" });
    expect(q).toMatchObject({ subtotal: 0, shipping: 0, codFee: 0, total: 0, gstIncluded: 0 });
  });
});

describe("validateCoupon", () => {
  it("accepts known codes case-insensitively", () => {
    expect(validateCoupon("cefalu15")).toMatchObject({ valid: true, percentOff: 15 });
  });
  it("rejects unknown codes", () => {
    expect(validateCoupon("FAKE").valid).toBe(false);
  });
});
