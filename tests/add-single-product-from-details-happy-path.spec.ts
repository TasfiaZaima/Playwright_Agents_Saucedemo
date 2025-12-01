// spec: test-plans/product-details-cart-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Details → Cart', () => {
  test('Add Single Product From Details (Happy Path)', async ({ page }) => {
    // 1. Navigate to `https://www.saucedemo.com/`.
    await page.goto('https://www.saucedemo.com/');

    // 2. Log in using `standard_user` / `secret_sauce`.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 3. Wait for inventory container to be visible.
    await expect(page.getByText('Products')).toBeVisible({ timeout: 10000 });

    // 4. Click the product name `Sauce Labs Backpack` to open its details page.
    await page.locator('[data-test="item-4-title-link"]').click();

    // 5. Verify the product details page shows the product title and "Add to cart" button.
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

    // Ensure we have an Add button available. If the product is already in-cart the page may show "Remove" —
    // clear it first so we can exercise the add-from-details action.
    const addButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().or(page.locator('[data-test="add-to-cart"]').first());
    const removeButton = page.locator('[data-test="remove-sauce-labs-backpack"]').first().or(page.locator('[data-test="remove"]').first());

    if (await removeButton.count() > 0 && await removeButton.isVisible()) {
      await removeButton.click();
      await expect(addButton).toBeVisible();
    }

    // 6. Click `Add to cart` on the product details page.
    await addButton.click();

    // 7. Verify the cart badge shows `1`.
    await expect(page.locator('[data-test="shopping-cart-badge"]').first()).toHaveText('1');

    // 8. Click the cart link to open the cart page.
    await page.locator('[data-test="shopping-cart-link"]').click();

    // 9. Verify the cart contains `Sauce Labs Backpack` with expected name text and quantity 1.
    await expect(page.locator('[data-test="inventory-item-name"]').first()).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.cart_quantity').first()).toHaveText('1');

    // Cleanup: remove item from cart to leave the session clean for subsequent tests.
    const cartRemove = page.locator('[data-test="remove-sauce-labs-backpack"]').first().or(page.locator('[data-test="remove"]').first());
    if (await cartRemove.count() > 0 && await cartRemove.isVisible()) {
      await cartRemove.click();
      // badge may disappear depending on UI; check presence first before asserting its text
      const badge = page.locator('[data-test="shopping-cart-badge"]');
      if (await badge.count() > 0) {
        await expect(badge.first()).not.toHaveText('1');
      }
    }
  });
});
