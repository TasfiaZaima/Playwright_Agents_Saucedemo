// spec: test-plans/product-details-cart-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Details → Cart', () => {
  test('Remove One Item From Details While Another Remains', async ({ page }) => {
    // 1. Navigate to `https://www.saucedemo.com/`.
    await page.goto('https://www.saucedemo.com/');

    // 2. Log in using `standard_user` / `secret_sauce`.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 3. Wait for inventory container to be visible.
    await expect(page.getByText('Products')).toBeVisible({ timeout: 10000 });

    // 4. Add product A (Sauce Labs Backpack) from its details page.
    await page.locator('[data-test="item-4-title-link"]').click();
    // If already in-cart, remove first to ensure consistent starting state.
    const removeA = page.locator('[data-test="remove-sauce-labs-backpack"]').first().or(page.locator('[data-test="remove"]').first());
    if (await removeA.count() > 0 && await removeA.isVisible()) {
      await removeA.click();
      await expect(page.getByText('Add to cart')).toBeVisible();
    }
    const addA = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().or(page.locator('[data-test="add-to-cart"]').first());
    await expect(addA).toBeVisible();
    await addA.click();

    // 5. Return to inventory and add product B (Sauce Labs Bike Light) from its details page.
    if (await page.locator('[data-test="back-to-products"]').count() > 0) {
      await page.locator('[data-test="back-to-products"]').click();
    } else {
      await page.goto('https://www.saucedemo.com/inventory.html');
    }
    await page.locator('[data-test="item-0-title-link"]').click();
    const addB = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').first().or(page.locator('[data-test="add-to-cart"]').first());
    await expect(addB).toBeVisible();
    await addB.click();

    // 6. Verify the cart badge shows 2.
    await expect(page.locator('[data-test="shopping-cart-badge"]').first()).toHaveText('2');

    // 7. Open details page for product A and click Remove on its details page.
    // navigate back to inventory and open A details
    if (await page.locator('[data-test="back-to-products"]').count() > 0) {
      await page.locator('[data-test="back-to-products"]').click();
    } else {
      await page.goto('https://www.saucedemo.com/inventory.html');
    }
    await page.locator('[data-test="item-4-title-link"]').click();
    const removeAfter = page.locator('[data-test="remove-sauce-labs-backpack"]').first().or(page.locator('[data-test="remove"]').first());
    await expect(removeAfter).toBeVisible();
    await removeAfter.click();

    // 8. Verify cart badge decreases to 1.
    await expect(page.getByText('1')).toBeVisible();

    // 9. Open cart and verify product B remains and product A is removed.
    if (await page.locator('[data-test="shopping-cart-link"]').count() > 0) {
      await page.locator('[data-test="shopping-cart-link"]').click();
    } else {
      await page.goto('https://www.saucedemo.com/cart.html');
    }
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    // Ensure backpack is not present in cart
    await page.getByText('Sauce Labs Backpack').first().waitFor({ state: 'hidden' });

    // Cleanup: remove remaining items and logout
    const removeButtons = page.locator('[data-test="remove"]');
    if (await removeButtons.count() > 0) {
      await removeButtons.first().click();
    }
    if (await page.getByRole('button', { name: 'Open Menu' }).count() > 0) {
      await page.getByRole('button', { name: 'Open Menu' }).click();
      if (await page.getByText('Logout').count() > 0) await page.getByText('Logout').click();
    }
  });
});
