// spec: test-plans/product-details-cart-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Unauthorized Addition Attempt (Logged Out)', () => {
  test('Attempt to add from product details while logged out should be prevented', async ({ page }) => {
    // 1. Start with a fresh browser session (no login).
    // 2. Attempt to open the product details page directly
    // Navigate directly to the details page without logging in
    await page.goto('https://www.saucedemo.com/inventory-item.html?id=4');

    // 3. If redirected to login, verify login message/button is visible
    // This site returns an error message on the login page when attempting to access inventory-item while logged out.
    await expect(page.getByText("Epic sadface: You can only access '/inventory-item.html' when you are logged in.")).toBeVisible();

    // Alternative verification if the site allowed details: attempt to click Add and expect a redirect to login
    const addBtn = page.locator('[data-test="add-to-cart"]');
    if (await addBtn.count() > 0) {
      await addBtn.click();
      // After attempting to add while logged out, site should show login form/button
      await expect(page.locator('[data-test="login-button"]').first()).toBeVisible();
    }
  });
});
