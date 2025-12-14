// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Functionality', () => {
  test('Empty Cart Behavior', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Navigate to cart page without adding items
    await page.locator('[data-test="shopping-cart-link"]').click();

    // 3. Verify empty cart display
    await expect(page).toHaveURL(/.*cart\.html/);

    // Verify cart page displays with no items
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.getByText('Your Cart')).toBeVisible();

    // Verify cart icon shows no count or shows '0'
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();

    // Verify Continue Shopping and Checkout buttons are present
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();

    // Verify no error messages appear
    await expect(page.getByText('error', { exact: false })).not.toBeVisible();
    await expect(page.getByText('Error', { exact: false })).not.toBeVisible();

    // Verify basic cart structure is intact
    await expect(page.getByText('QTY')).toBeVisible();
    await expect(page.getByText('Description')).toBeVisible();
  });
});