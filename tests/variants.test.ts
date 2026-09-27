import { describe, expect, it } from "vitest";
import {
  findVariant,
  isVariantInStock,
  optionValues,
  resolveOptionIds,
  sizeAvailability,
  type ProductOptionLike,
  type VariantLike,
} from "@/lib/variants";

const options: ProductOptionLike[] = [
  { id: "opt_size", title: "Size", values: [{ value: "S" }, { value: "M" }, { value: "L" }] },
  { id: "opt_color", title: "Colour", values: [{ value: "White" }, { value: "Navy" }] },
];

const v = (id: string, size: string, color: string, qty: number, managed = true): VariantLike => ({
  id,
  manage_inventory: managed,
  inventory_quantity: qty,
  options: [
    { option_id: "opt_size", value: size },
    { option_id: "opt_color", value: color },
  ],
});

const variants = [
  v("w-s", "S", "White", 10),
  v("w-m", "M", "White", 2),
  v("w-l", "L", "White", 0),
  v("n-s", "S", "Navy", 0),
  v("n-m", "M", "Navy", 5),
  v("n-l", "L", "Navy", 1, false),
];

describe("variant resolution", () => {
  it("finds size and colour options by title (British spelling too)", () => {
    expect(resolveOptionIds(options)).toEqual({ size: "opt_size", color: "opt_color" });
  });
  it("lists option values", () => {
    expect(optionValues(options, "opt_size")).toEqual(["S", "M", "L"]);
    expect(optionValues(options, null)).toEqual([]);
  });
  it("finds the exact variant for a selection", () => {
    const ids = resolveOptionIds(options);
    expect(findVariant(variants, ids, { size: "M", color: "Navy" })?.id).toBe("n-m");
    expect(findVariant(variants, ids, { size: "XL", color: "Navy" })).toBeUndefined();
  });
  it("treats unmanaged inventory as always in stock", () => {
    expect(isVariantInStock(v("x", "L", "Navy", 0, false))).toBe(true);
    expect(isVariantInStock(v("y", "L", "Navy", 0))).toBe(false);
  });
  it("computes per-colour size availability with low-stock counts", () => {
    const ids = resolveOptionIds(options);
    const white = sizeAvailability(variants, ids, ["S", "M", "L"], "White");
    expect(white).toEqual({
      S: { available: true, lowStock: null },
      M: { available: true, lowStock: 2 },
      L: { available: false, lowStock: null },
    });
    const navy = sizeAvailability(variants, ids, ["S", "M", "L"], "Navy");
    expect(navy.S?.available).toBe(false);
    expect(navy.L).toEqual({ available: true, lowStock: null });
  });
});
