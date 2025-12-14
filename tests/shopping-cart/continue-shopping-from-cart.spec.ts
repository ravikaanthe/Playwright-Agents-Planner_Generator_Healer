// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Functionality', () => {
  test('Continue Shopping from Cart', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Add items to cart and navigate to cart page
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    // Verify we're on cart page with items
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // 3. Click 'Continue Shopping' button
    await page.locator('[data-test="continue-shopping"]').click();

    // Verify user returns to inventory page (/inventory.html)
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Verify cart contents are preserved
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // Verify cart count remains unchanged
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();

    // Verify all products are still visible
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
  });
});