import { test, expect } from '@playwright/test';

// test.describe('Test group', () => {
//   test('seed', async ({ page }) => {
//     // generate code here.
//   });
// });

test.describe('Sauce Demo E2E Test', () => {
  test("should login, add item to cart, verify cart contents, and logout", async ({ page }) => {
    // Navigate to login page
    await page.goto("https://www.saucedemo.com/");
    await page.waitForLoadState('networkidle');

    // Login with valid credentials
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await page.locator('[data-test="username"]').fill("standard_user");

    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await page.locator('[data-test="password"]').fill("secret_sauce");

    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    await page.locator('[data-test="login-button"]').click();

    // Verify successful login by checking if inventory page is displayed
    await expect(page.locator('[data-test="inventory-container"]')).toBeVisible({ timeout: 10000 });

    // Add backpack to cart
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Verify item was added to cart by checking cart badge
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    // Go to cart
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    await page.locator('[data-test="shopping-cart-link"]').click();

    // Verify item is in cart
    await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack');

    // Navigate back to inventory
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await page.locator('[data-test="continue-shopping"]').click();

    // Open menu and logout
    await expect(page.getByRole("button", { name: "Open Menu" })).toBeVisible();
    await page.getByRole("button", { name: "Open Menu" }).click();
    await expect(page.getByText("Logout")).toBeVisible();
    await page.getByText("Logout").click();

    // Verify successful logout by checking if login form is displayed
    await expect(page.locator('[data-test="login-button"]')).toBeVisible({ timeout: 10000 });
  });
});
