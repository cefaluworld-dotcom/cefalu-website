import { test, expect } from "@playwright/test";

test.describe("Storefront smoke", () => {
  test("home renders hero and primary nav", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Cefalu/i);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("link", { name: /shop/i }).first()).toBeVisible();
  });

  test("shop lists products and filters are present", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByRole("heading", { name: /shop all clothing/i })).toBeVisible();
    // At least one product card links to a PDP
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await expect(firstProduct).toBeVisible();
  });

  test("product page shows buy box and add-to-cart", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/products/"]').first().click();
    await expect(page).toHaveURL(/\/products\//);
    await expect(page.getByRole("button", { name: /add to cart/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /buy now/i })).toBeVisible();
  });

  test("footer legal links resolve", async ({ page }) => {
    await page.goto("/");
    const privacy = page.getByRole("link", { name: /privacy policy/i }).first();
    await expect(privacy).toHaveAttribute("href", /privacy-policy/);
  });
});
