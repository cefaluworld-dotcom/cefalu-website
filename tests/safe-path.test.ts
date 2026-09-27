import { describe, expect, it } from "vitest";
import { safeInternalPath } from "@/lib/utils";

describe("safeInternalPath", () => {
  it("allows same-origin relative paths", () => {
    expect(safeInternalPath("/account")).toBe("/account");
    expect(safeInternalPath("/shop?x=1#y")).toBe("/shop?x=1#y");
  });

  it("blocks absolute and protocol-relative URLs", () => {
    expect(safeInternalPath("https://evil.com")).toBe("/");
    expect(safeInternalPath("//evil.com")).toBe("/");
    expect(safeInternalPath("http://evil.com", "/login")).toBe("/login");
  });

  it("blocks backslash and control-char tricks", () => {
    expect(safeInternalPath("/\\evil.com")).toBe("/");
    expect(safeInternalPath("/\u0000/evil")).toBe("/");
  });

  it("falls back on empty input", () => {
    expect(safeInternalPath(null, "/account")).toBe("/account");
    expect(safeInternalPath(undefined)).toBe("/");
    expect(safeInternalPath("")).toBe("/");
  });
});
