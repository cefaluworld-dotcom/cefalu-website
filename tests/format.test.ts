import { describe, expect, it } from "vitest";
import { formatPrice, getInitials, slugify } from "@/utils/format";

describe("formatPrice", () => {
  it("formats INR with Indian digit grouping and no paise", () => {
    expect(formatPrice(1299)).toBe("₹1,299");
    expect(formatPrice(125000)).toBe("₹1,25,000");
  });
});

describe("slugify", () => {
  it("lowercases, strips symbols and hyphenates", () => {
    expect(slugify("Oxford Shirt: Slim Fit!")).toBe("oxford-shirt-slim-fit");
  });
});

describe("getInitials", () => {
  it("takes first letters of the first two words", () => {
    expect(getInitials("Priya Sharma")).toBe("PS");
    expect(getInitials("Arjun")).toBe("A");
  });
});
