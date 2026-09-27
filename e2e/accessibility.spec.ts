import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/shop", "/about", "/contact", "/faq"];

test.describe("Accessibility (axe-core)", () => {
  for (const path of PAGES) {
    test(`no serious/critical violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical"
      );
      expect(serious, JSON.stringify(serious.map((v) => v.id), null, 2)).toEqual([]);
    });
  }
});
