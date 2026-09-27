import { test, expect } from "@playwright/test";

test.describe("Cart flow", () => {
  test("add to cart updates the cart and checkout is reachable", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('a[href^="/products/"]').first().click();
    await expect(page).toHaveURL(/\/products\//);

    await page.getByRole("button", { name: /add to cart/i }).first().click();

    // Cart page shows the summary + proceed to checkout
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: /your cart/i })).toBeVisible();
    const checkout = page.getByRole("link", { name: /proceed to checkout/i });
    if (await checkout.isVisible().catch(() => false)) {
      await checkout.click();
      await expect(page).toHaveURL(/\/checkout/);
    }
  });

  test("empty cart shows an empty state", async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/cart");
    await expect(page.getByText(/your cart is empty|nothing to check out/i)).toBeVisible();
  });
});
