// spec: test-plans/product-details-cart-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Details → Cart', () => {
  test('Add Multiple Different Products From Their Details Pages', async ({ page }) => {
    // 1. Navigate to `https://www.saucedemo.com/`.
    await page.goto('https://www.saucedemo.com/');

    // 2. Log in using `standard_user` / `secret_sauce`.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 3. Wait for inventory container to be visible.
    await expect(page.getByText('Products')).toBeVisible({ timeout: 10000 });

    // 4. Open details for product A (Sauce Labs Backpack) and click Add to cart.
    await page.locator('[data-test="item-4-title-link"]').click();
    const addBackpack = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().or(page.locator('[data-test="add-to-cart"]').first());
    if (await addBackpack.count() > 0) {
      await expect(addBackpack).toBeVisible();
      await addBackpack.click();
    }

    // 5. Return to inventory.
    if (await page.locator('[data-test="back-to-products"]').count() > 0) {
      await page.locator('[data-test="back-to-products"]').click();
    } else {
      await page.goto('https://www.saucedemo.com/inventory.html');
    }

    // 6. Open details for product B (Sauce Labs Bike Light) and click Add to cart.
    await page.locator('[data-test="item-0-title-link"]').click();
    const addBike = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').first().or(page.locator('[data-test="add-to-cart"]').first());
    await expect(addBike).toBeVisible();
    await addBike.click();

    // 7. Verify cart badge shows 2.
    await expect(page.locator('[data-test="shopping-cart-badge"]').first()).toHaveText('2');

    // 8. Open cart and verify both products are listed.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Backpack' })).toHaveCount(1);
    await expect(page.locator('[data-test="inventory-item-name"]').filter({ hasText: 'Sauce Labs Bike Light' })).toHaveCount(1);

    // Cleanup: remove items if present
    const removeAll = page.locator('[data-test="remove"]').first();
    while (await removeAll.count() > 0) {
      await removeAll.click();
      break; // remove loop; rely on session isolation in seed
    }
  });
});
