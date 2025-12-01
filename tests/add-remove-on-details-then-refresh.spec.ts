// spec: test-plans/product-details-cart-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Details → Cart', () => {
  test('Add/Remove On Details Page Then Refresh (Persistence Check)', async ({ page }) => {
    // 1. Navigate to `https://www.saucedemo.com/`.
    await page.goto('https://www.saucedemo.com/');

    // 2. Log in using `standard_user` / `secret_sauce`.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 3. Wait for inventory container to be visible.
    await expect(page.getByText('Products')).toBeVisible({ timeout: 10000 });

    // 4. Open details for Sauce Labs Backpack.
    await page.locator('[data-test="item-4-title-link"]').click();

    // If already added, remove to reset state, then ensure Add is visible.
    const removeIfPresent = page.locator('[data-test="remove-sauce-labs-backpack"]').first().or(page.locator('[data-test="remove"]').first());
    if (await removeIfPresent.count() > 0 && await removeIfPresent.isVisible()) {
      await removeIfPresent.click();
      await expect(page.getByText('Add to cart')).toBeVisible();
    }

    // 5. Click Add to cart on the details page.
    const addButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().or(page.locator('[data-test="add-to-cart"]').first());
    await expect(addButton).toBeVisible();
    await addButton.click();

    // 6. Refresh the details page (navigate to same URL to simulate refresh).
    await page.goto('https://www.saucedemo.com/inventory-item.html?id=4');

    // 7. Verify the details page still shows "Remove" and the cart badge remains consistent (1).
    await expect(page.getByText('Remove')).toBeVisible();
    await expect(page.getByText('1')).toBeVisible();

    // 8. Navigate to the cart and confirm the product is listed.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

    // 9. Return to the product details page, click Remove on details page.
    await page.locator('[data-test="continue-shopping"]').click();
    await page.locator('[data-test="item-4-title-link"]').click();
    const removeButton = page.locator('[data-test="remove-sauce-labs-backpack"]').first().or(page.locator('[data-test="remove"]').first());
    await expect(removeButton).toBeVisible();
    await removeButton.click();

    // 10. Refresh the details page and verify the product remains removed (Add button visible) and cart is empty.
    await page.goto('https://www.saucedemo.com/inventory-item.html?id=4');
    await expect(page.getByText('Add to cart')).toBeVisible();
    // Badge may be removed from DOM; check existence safely
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    if (await badge.count() > 0) {
      await expect(badge.first()).not.toHaveText('1');
    }

    // Final cleanup: ensure cart is empty by navigating to cart and removing any leftovers
    if (await page.locator('[data-test="shopping-cart-link"]').count() > 0) {
      await page.locator('[data-test="shopping-cart-link"]').click();
      const remaining = page.locator('[data-test="remove"]');
      if (await remaining.count() > 0) {
        await remaining.first().click();
      }
    }

    // Logout for isolation
    if (await page.getByRole('button', { name: 'Open Menu' }).count() > 0) {
      await page.getByRole('button', { name: 'Open Menu' }).click();
      if (await page.getByText('Logout').count() > 0) await page.getByText('Logout').click();
    }
  });
});
