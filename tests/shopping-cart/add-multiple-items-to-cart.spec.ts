// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Functionality', () => {
  test('Add Multiple Items to Cart', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Click 'Add to cart' for 'Sauce Labs Backpack'
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // 3. Click 'Add to cart' for 'Sauce Labs Bike Light'
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    // 4. Click 'Add to cart' for 'Sauce Labs Bolt T-Shirt'
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    // 5. Verify cart count updates
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

    // Verify all three 'Add to cart' buttons change to 'Remove' buttons
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]')).toBeVisible();

    // Verify cart icon displays '3' indicating three items
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
  });
});