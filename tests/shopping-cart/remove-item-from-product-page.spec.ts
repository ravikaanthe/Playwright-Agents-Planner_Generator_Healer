// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Functionality', () => {
  test('Remove Item from Cart via Product Page', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Add 'Sauce Labs Backpack' to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Verify item is added
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();

    // 3. Click the 'Remove' button for the backpack
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    // 4. Verify cart updates
    // Verify cart icon count decreases or disappears if empty
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();

    // Verify 'Remove' button changes back to 'Add to cart'
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).not.toBeVisible();

    // Verify item is no longer in the cart by checking cart page
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('.cart_item')).toHaveCount(0);

    // Verify cart functionality remains intact
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
  });
});