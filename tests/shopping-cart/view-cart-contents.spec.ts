// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Functionality', () => {
  test('View Cart Contents', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    // 3. Click on the cart icon
    await page.locator('[data-test="shopping-cart-link"]').click();

    // 4. Verify cart page content
    // Verify user is redirected to cart page
    await expect(page).toHaveURL(/.*cart\.html/);

    // Verify cart displays 'Your Cart' heading
    await expect(page.getByText('Your Cart')).toBeVisible();

    // Verify both products are listed with quantity, description, and price
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Verify QTY column shows '1' for each item
    const qtyElements = page.locator('.cart_quantity');
    await expect(qtyElements.nth(0)).toHaveText('1');
    await expect(qtyElements.nth(1)).toHaveText('1');

    // Verify prices are displayed
    await expect(page.getByText('$29.99')).toBeVisible(); // Backpack
    await expect(page.getByText('$9.99')).toBeVisible(); // Bike Light

    // Verify 'Continue Shopping' and 'Checkout' buttons are present
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });
});