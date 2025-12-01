// spec: test-plans/product-details-cart-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Negative Case: Click Add Then Immediately Navigate Away', () => {
  test('Click Add then immediately navigate away and verify cart consistency', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/ and log in
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Wait for inventory container / Products to be visible
    await expect(page.getByText('Products')).toBeVisible();

    // 3. Open details for Sauce Labs Backpack
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

    // 4. Ensure clean state: if "Remove" is present, click it so we have an Add button
    const removeBtn = page.locator('[data-test="remove"]');
    if (await removeBtn.count() > 0) {
      await removeBtn.click();
      await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    }

    // 5. Click Add to cart on details then immediately navigate back to inventory
    // (simulate a fast user who clicks add then navigates away)
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.goto('https://www.saucedemo.com/inventory.html');

    // 6. Wait for UI stabilization: products header visible
    await expect(page.getByText('Products')).toBeVisible();

    // 7. Check cart state: badge may be present with '1' or not present at all.
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    const badgeCount = await badge.count();
    if (badgeCount > 0) {
      await expect(badge).toHaveText(/1/);
    }

    // Open cart and inspect contents
    await page.locator('[data-test="shopping-cart-link"]').click();
    const backpackInCartCount = await page.getByText('Sauce Labs Backpack').count();

    // Accept either: backpack is present once, or backpack is not present (0).
    // Fail if multiple entries or other inconsistent state is observed.
    if (!(backpackInCartCount === 0 || backpackInCartCount === 1)) {
      // capture a diagnostic screenshot on unexpected state
      await page.screenshot({ path: 'artifacts/negative-add-then-navigate-unexpected.png', fullPage: true });
    }
    expect(backpackInCartCount === 0 || backpackInCartCount === 1).toBeTruthy();
  });
});
