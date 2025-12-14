// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Functionality', () => {
  test('Remove Item from Cart Page', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Add items to cart and navigate to cart page
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    // Verify both items are in cart
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // 3. Click 'Remove' button next to an item
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    // 4. Verify item removal
    // Verify item is removed from cart page
    await expect(page.getByText('Sauce Labs Backpack')).not.toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(1);

    // Verify cart count decreases
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Verify other items remain in cart
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();

    // Verify page updates without refresh - cart functionality intact
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
  });
});