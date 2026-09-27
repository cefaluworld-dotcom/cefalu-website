import { describe, expect, it } from "vitest";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows up to the limit then blocks within the window", () => {
    const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 10 });
    const key = "test-user";
    expect(limiter.check(3, key).success).toBe(true);
    expect(limiter.check(3, key).success).toBe(true);
    expect(limiter.check(3, key).success).toBe(true);
    expect(limiter.check(3, key).success).toBe(false);
  });

  it("buckets keys independently", () => {
    const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 10 });
    expect(limiter.check(1, "a").success).toBe(true);
    expect(limiter.check(1, "b").success).toBe(true);
    expect(limiter.check(1, "a").success).toBe(false);
  });
});

describe("getClientIp", () => {
  it("prefers the first x-forwarded-for hop", () => {
    const headers = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(getClientIp(headers)).toBe("1.2.3.4");
  });
});
