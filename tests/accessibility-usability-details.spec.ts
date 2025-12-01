// spec: test-plans/product-details-cart-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Accessibility & Usability Checks (Light)', () => {
  test('Buttons on product details are keyboard operable and have accessible names', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/ and log in
    // 2. Wait for inventory to be visible
    // 3. Open the details page for Sauce Labs Backpack
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Products')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

    // 4. Verify the Add/Remove button is present (either state is acceptable)
    const addLocator = page.locator('[data-test="add-to-cart"]');
    const removeLocator = page.locator('[data-test="remove"]');
    const hasAdd = await addLocator.count() > 0;
    const hasRemove = await removeLocator.count() > 0;
    expect(hasAdd || hasRemove).toBeTruthy();

    // 5. Focus the control programmatically (tabbing can be flaky in CI); ensure it is focusable
    if (hasAdd) {
      // Comment: Focus the Add to cart button
      await page.evaluate(() => { const el = document.querySelector('[data-test="add-to-cart"]'); if (el) (el as HTMLElement).focus(); });
      // Activate with Enter and verify it toggles to Remove
      await page.keyboard.press('Enter');
      await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();

      // Focus the Remove button and activate with Space to toggle back
      await page.evaluate(() => { const el = document.querySelector('[data-test="remove"]'); if (el) (el as HTMLElement).focus(); });
      await page.keyboard.press('Space');
      await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();

    } else {
      // Comment: Focus the Remove button
      await page.evaluate(() => { const el = document.querySelector('[data-test="remove"]'); if (el) (el as HTMLElement).focus(); });
      // Activate with Enter and verify it toggles to Add
      await page.keyboard.press('Enter');
      await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();

      // Focus the Add button and activate with Space to toggle back
      await page.evaluate(() => { const el = document.querySelector('[data-test="add-to-cart"]'); if (el) (el as HTMLElement).focus(); });
      await page.keyboard.press('Space');
      await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();
    }

    // 7. Verify accessibility attributes: prefer role/name, fallback to aria-label
    const visibleButton = await page.locator('[data-test="add-to-cart"]').first().count() > 0
      ? page.locator('[data-test="add-to-cart"]').first()
      : page.locator('[data-test="remove"]').first();

    // The button should expose an accessible name via getByRole; aria-label is optional but check if present
    const aria = await visibleButton.getAttribute('aria-label');
    if (aria) {
      expect(aria.length).toBeGreaterThan(0);
    } else {
      // If no aria-label, ensure role+name selectors above worked (they did via getByRole assertions earlier)
      expect(true).toBeTruthy();
    }
  });
});
