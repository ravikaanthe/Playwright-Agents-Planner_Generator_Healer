// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Functionality', () => {
  test('Add Single Item to Cart', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Click 'Add to cart' button for 'Sauce Labs Backpack'
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // 3. Verify cart icon updates
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    // 4. Verify button text changes
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).not.toBeVisible();

    // Verify cart icon displays '1' indicating one item
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Verify product remains visible on the page
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  });
});