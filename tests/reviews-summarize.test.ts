import { describe, expect, it } from "vitest";
import { summarize } from "@/services/reviews";
import type { ReviewEntry } from "@/types";

const review = (rating: ReviewEntry["rating"], id: string): ReviewEntry => ({
  id,
  productHandle: "oxford-cotton-shirt",
  author: "Test",
  rating,
  title: "t",
  body: "b",
  date: "2026-01-01T00:00:00.000Z",
  verified: true,
  photos: [],
  videos: [],
  helpful: 0,
});

describe("summarize", () => {
  it("averages to one decimal and buckets by stars", () => {
    const s = summarize([review(5, "a"), review(4, "b"), review(4, "c"), review(2, "d")]);
    expect(s.count).toBe(4);
    expect(s.average).toBe(3.8);
    const five = s.buckets.find((b) => b.stars === 5);
    const four = s.buckets.find((b) => b.stars === 4);
    expect(five?.count).toBe(1);
    expect(four?.count).toBe(2);
    expect(four?.pct).toBe(50);
  });

  it("handles the empty state", () => {
    const s = summarize([]);
    expect(s.count).toBe(0);
    expect(s.average).toBe(0);
    expect(s.buckets).toHaveLength(5);
  });
});
