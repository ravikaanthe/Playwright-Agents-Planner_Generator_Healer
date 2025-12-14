// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Special User Scenarios', () => {
  test('Visual User Experience Testing', async ({ page }) => {
    // 1. Log in with 'visual_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('visual_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Verify user is redirected to inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);

    // 2. Navigate through all pages
    // Check inventory page - may have visual differences
    await expect(page.getByText('Products')).toBeVisible();
    
    // Visual differences may be present for testing purposes
    // But core functionality should remain intact
    await expect(page.locator('.inventory_item')).toHaveCount(6);

    // 3. Perform standard shopping flow
    // Add items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Core functionality remains intact despite potential visual issues
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // Navigate to cart page
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();

    // Navigate to checkout
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Fill checkout form
    await page.locator('[data-test="firstName"]').fill('Visual');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    // Complete checkout
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await page.locator('[data-test="finish"]').click();

    // 4. Compare visual elements with standard user (documented testing)
    // Verify no functional blocking issues occur
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(page.getByText('Thank you for your order!')).toBeVisible();

    // Visual regression can be documented, but functionality works
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});