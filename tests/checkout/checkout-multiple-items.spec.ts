// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Checkout with Multiple Items', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Add multiple items to cart (Backpack, Bike Light, T-Shirt)
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    // 3. Proceed through complete checkout process
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    // Fill out checkout form
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    // Verify all items appear in checkout overview
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bolt T-Shirt').first()).toBeVisible();

    // Verify individual prices
    await expect(page.getByText('$29.99')).toBeVisible(); // Backpack
    await expect(page.getByText('$9.99')).toBeVisible();  // Bike Light
    await expect(page.getByText('$15.99')).toBeVisible(); // T-Shirt

    // Verify total price calculation is correct (29.99 + 9.99 + 15.99 = 55.97)
    await expect(page.getByText('Item total: $55.97')).toBeVisible();

    // Verify tax calculation is accurate
    await expect(page.getByText(/Tax: \$\d+\.\d{2}/)).toBeVisible();

    // Verify final total
    await expect(page.getByText(/Total: \$\d+\.\d{2}/)).toBeVisible();

    // Complete order
    await page.locator('[data-test="finish"]').click();

    // Verify order completion succeeds for multiple items
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});