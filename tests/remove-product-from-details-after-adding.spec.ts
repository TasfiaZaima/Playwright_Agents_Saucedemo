// spec: test-plans/product-details-cart-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Details → Cart', () => {
  test('Remove Product From Details After Adding', async ({ page }) => {
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

    // 5. If the product is already in-cart, click "Remove" to reset state.
    const removeOnDetails = page.locator('[data-test="remove-sauce-labs-backpack"]').first().or(page.locator('[data-test="remove"]').first());
    if (await removeOnDetails.count() > 0 && await removeOnDetails.isVisible()) {
      await removeOnDetails.click();
      await expect(page.getByText('Add to cart')).toBeVisible();
    }

    // 6. Click Add to cart on the product details page.
    const addOnDetails = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().or(page.locator('[data-test="add-to-cart"]').first());
    await expect(addOnDetails).toBeVisible();
    await addOnDetails.click();

    // 7. Verify the cart badge shows `1`.
    await expect(page.locator('[data-test="shopping-cart-badge"]').first()).toHaveText('1');

    // 8. On the product details page, click Remove (the button that replaced Add to cart).
    const removeAfterAdd = page.locator('[data-test="remove-sauce-labs-backpack"]').first().or(page.locator('[data-test="remove"]').first());
    await expect(removeAfterAdd).toBeVisible();
    await removeAfterAdd.click();

    // 9. Verify cart badge is not visible (or not equal to 1).
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    if (await badge.count() > 0) {
      await expect(badge.first()).not.toHaveText('1');
    }

    // 10. Click the cart link and confirm the cart is empty (no inventory item rows).
    // If the cart link is not directly present, navigate back to inventory and open cart from there.
    if (await page.locator('[data-test="shopping-cart-link"]').count() > 0) {
      await page.locator('[data-test="shopping-cart-link"]').click();
    } else {
      // go back to inventory then click cart link
      await page.getByRole('button', { name: 'Open Menu' }).click();
      // if the menu contains links we can use, try to go back to All Items and then cart
      if (await page.locator('[data-test="shopping-cart-link"]').count() > 0) {
        await page.locator('[data-test="shopping-cart-link"]').click();
      } else {
        await page.goto('https://www.saucedemo.com/cart.html');
      }
    }

    // Assert cart is empty by ensuring there are no inventory item name elements
    const cartItems = page.locator('[data-test="inventory-item-name"]');
    await expect(cartItems).toHaveCount(0);

    // Cleanup: ensure we're logged out for isolation
    if (await page.getByRole('button', { name: 'Open Menu' }).count() > 0) {
      await page.getByRole('button', { name: 'Open Menu' }).click();
      if (await page.getByText('Logout').count() > 0) {
        await page.getByText('Logout').click();
      }
    }
  });
});
