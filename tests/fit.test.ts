import { describe, expect, it } from "vitest";
import { recommendSize } from "@/lib/fit";
import { SIZE_CHARTS, sortSizes } from "@/constants/catalog-content";

const menTops = SIZE_CHARTS["men-tops"]!;
const womenTops = SIZE_CHARTS["women-tops"]!;

describe("recommendSize", () => {
  it("adds ease for garment-measured charts (men's shirts)", () => {
    // 38in chest + 2in ease → needs a 40in garment → M
    expect(recommendSize(menTops, 38, { ease: 2 })?.size).toBe("M");
  });
  it("matches exactly on the boundary", () => {
    expect(recommendSize(menTops, 40, { ease: 2 })?.size).toBe("L");
    expect(recommendSize(womenTops, 36)?.size).toBe("M");
  });
  it("picks the smallest size for small measurements", () => {
    expect(recommendSize(womenTops, 30)?.size).toBe("XS");
  });
  it("flags out-of-range measurements with the largest size", () => {
    const r = recommendSize(menTops, 50, { ease: 2 });
    expect(r).toMatchObject({ size: "XXL", outOfRange: true });
  });
  it("reads other columns (waist on bottoms)", () => {
    expect(recommendSize(SIZE_CHARTS["men-bottoms"]!, 33)?.size).toBe("34");
  });
  it("rejects invalid input", () => {
    expect(recommendSize(menTops, 0)).toBeNull();
    expect(recommendSize(menTops, Number.NaN)).toBeNull();
  });
});

describe("sortSizes", () => {
  it("orders alpha then waist sizes canonically", () => {
    expect(sortSizes(["XL", "S", "32", "M", "28", "XXL"])).toEqual(["S", "M", "XL", "XXL", "28", "32"]);
  });
});
