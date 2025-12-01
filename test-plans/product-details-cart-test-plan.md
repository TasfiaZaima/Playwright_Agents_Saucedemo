# Product Details → Cart Test Plan

Version: 1.0
Date: 2025-12-01
Author: GitHub Copilot

**Executive Summary**

This test plan validates the workflows where users open a product's details page, add the product to the cart from that details page, and then remove the product (both from the product details page and from the cart page). The plan covers happy paths, negative and edge cases, session persistence, and UI/UX verifications suitable for manual and automated Playwright tests.

**Application Under Test**

- Demo site: `https://www.saucedemo.com/`
- Primary flows: product details view, add-to-cart from details, remove-from-cart from details, cart verification.

**Assumptions & Starting State**

- Tests start from a fresh browser session (no prior cookies, localStorage, or session state).
- The test user credentials: username `standard_user`, password `secret_sauce`.
- The site is reachable and no maintenance banner is displayed.
- Tests run against the default inventory (items and selectors are present as in the canonical Saucedemo site).
- Each scenario is independent; if not, include explicit seed/cleanup steps.

**Environment & Test Data**

- Browser: Chromium (or cross-browser runs for compatibility)
- Network: Stable connection; consider toggling throttling for negative tests
- Test account: `standard_user` / `secret_sauce`

**Selectors (examples used in scenarios)**

- Login username: `[data-test="username"]`
- Login password: `[data-test="password"]`
- Login button: `[data-test="login-button"]`
- Inventory container: `[data-test="inventory-container"]`
- Product card name: `.inventory_item_name` (or `[data-test="inventory-item-name"]` on cart)
- Product link (from inventory): use product name or first product anchor
- Add to cart on details: `[data-test="add-to-cart-sauce-labs-backpack"]` (replace for each product)
- Remove on details: `[data-test="remove-sauce-labs-backpack"]` (replace accordingly)
- Cart badge: `[data-test="shopping-cart-badge"]`
- Cart link: `[data-test="shopping-cart-link"]`
- Cart item name: `[data-test="inventory-item-name"]`
- Continue shopping: `[data-test="continue-shopping"]`

**Success Criteria (overall)**

- Items added from the product details page appear in the cart.
- Cart badge updates to reflect the correct count after add/remove actions.
- Removing items from the product details page removes them from the cart and updates UI accordingly.
- No leftover items remain in session after test cleanup.

---

## Test Scenarios

Notes for all scenarios:
- Start with a fresh browser (clear cookies/storage) unless scenario states otherwise.
- Log in as `standard_user` at the beginning of every scenario.

### 1. Add Single Product From Details (Happy Path)

Assumption: Inventory is visible and product detail pages load normally.

Steps:
1. Navigate to `https://www.saucedemo.com/`.
2. Log in using `standard_user` / `secret_sauce`.
3. Wait for inventory container to be visible.
4. Click the product name `Sauce Labs Backpack` to open its details page.
5. Verify the product details page shows the product title and "Add to cart" button.
6. Click `Add to cart` on the product details page.
7. Verify the cart badge shows `1`.
8. Click the cart link to open the cart page.
9. Verify the cart contains `Sauce Labs Backpack` with expected name text and quantity 1.

Expected Results:
- After step 6 the UI shows `Remove` on the details page (or the add button toggles to remove).
- Cart badge updates to `1` immediately.
- Cart page lists the product with the correct name.

Success Criteria:
- Product appears in the cart and cart badge is `1`.

Failure Conditions:
- Cart badge does not increment, or cart page does not list the product.

### 2. Remove Product From Details After Adding

Assumption: Same as scenario 1; item currently added to cart.

Steps:
1. Complete steps 1–6 from scenario 1 to add the product from details.
2. On the product details page, click `Remove` (the button that replaced `Add to cart`).
3. Verify cart badge is not visible (or equals `0`/is removed).
4. Click the cart link and confirm the cart is empty (no inventory item rows).

Expected Results:
- After removal the details page shows `Add to cart` again.
- Cart no longer lists the product and badge disappears or shows `0` (site-specific UI).

Success Criteria:
- Product removed from cart across all UI surfaces (details page and cart page).

Failure Conditions:
- Product still listed in cart or badge still shows `1`.

### 3. Add Multiple Different Products From Their Details Pages

Assumption: Inventory contains multiple distinct products (backpack, bike light, t-shirt).

Steps:
1. Log in.
2. Open details for product A (e.g., `Sauce Labs Backpack`) and click `Add to cart`.
3. Return to inventory (use breadcrumb or `Back`/`Continue Shopping`).
4. Open details for product B (e.g., `Sauce Labs Bike Light`) and click `Add to cart`.
5. Verify cart badge shows `2`.
6. Open cart and verify both products A and B are listed.

Expected Results:
- Cart badge increments to `2`.
- Cart lists both products; each listed product has correct name.

Success Criteria:
- Both products persist in the cart and are removable independently.

Failure Conditions:
- Duplicate product added instead of distinct items, or badge count mismatch.

### 4. Remove One Item From Details While Another Remains

Assumption: Two items were added via scenario 3.

Steps:
1. With both items added, open details page for product A.
2. Click `Remove` on product A details page.
3. Verify cart badge decreases to `1`.
4. Open cart and verify product B remains, product A is removed.

Expected Results:
- Badge and cart contents reflect only the remaining product.

Success Criteria:
- Removing one item does not unexpectedly remove others.

### 5. Add/Remove On Details Page Then Refresh (Persistence Check)

Assumption: The app persists cart state in session storage (or cookie).

Steps:
1. Add product from details page.
2. Refresh the details page.
3. Verify the UI still shows `Remove` and the cart badge remains consistent.
4. Navigate to cart and confirm product still listed.
5. Remove the product from details page, refresh again, and confirm product remains removed.

Expected Results:
- Adding persists through refresh; removing persists through refresh.

Failure Conditions:
- State resets unexpectedly on refresh.

### 6. Negative Case: Click Add Then Immediately Navigate Away (Race/Timing)

Assumption: Simulate slow network or fast user navigation.

Steps:
1. On product details, click `Add to cart` and immediately navigate back to inventory or another product.
2. Wait for UI stabilization.
3. Check cart badge and cart contents.

Expected Results:
- Either the add completes and badge increments, or there is a graceful failure with no partial state.

Success Criteria:
- No inconsistent state (half-added items) or broken UI.

### 7. Unauthorized Addition Attempt (Logged Out)

Assumption: If site requires login to add to cart, test behavior when not logged in.

Steps:
1. Ensure a fresh session and do not log in.
2. Attempt to open a product details page (if allowed) and click `Add to cart`.

Expected Results:
- Either redirect to login or a visible error/disabled action.

Success Criteria:
- User is prevented from adding to cart without authentication.

### 8. Accessibility & Usability Checks (Light)

Steps:
1. On the product details page, verify `Add to cart` / `Remove` buttons are reachable via keyboard (Tab + Enter/Space).
2. Confirm ARIA roles and label presence on critical buttons (where applicable).

Expected Results:
- Buttons are keyboard operable and have accessible labels.

---

## Test Execution Notes

- Each scenario is self-contained: perform cleanup after each scenario by removing items or starting a new incognito session.
- Where possible, automate with Playwright: use `page.goto`, `page.click`, `page.getByRole`, and `page.locator` assertions.
- Use explicit waits for critical UI changes (e.g., `toHaveText`, `toBeVisible`) with sensible timeouts.
- Add retries in CI for flakey network-dependent steps, but avoid masking real failures.

## Cleanup Steps (After Each Scenario)

1. If still logged in: open the menu and select `Logout`, or clear cookies/localStorage.
2. Ensure cart badge is cleared before next scenario.

## Reporting & Triage

- Log any UI mismatch (badges, missing buttons) as functional bugs.
- For intermittent failures, collect Playwright trace/screenshots and network logs.

---

End of Test Plan
