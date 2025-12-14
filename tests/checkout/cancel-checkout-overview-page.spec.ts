// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Cancel Checkout from Overview Page', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Add items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    // 2. Complete checkout information form
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    // Verify we're on checkout overview page
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(page.getByText('Checkout: Overview')).toBeVisible();

    // 3. On checkout overview page, click 'Cancel' button
    await page.locator('[data-test="cancel"]').click();

    // Verify user returns to inventory page (actual SauceDemo behavior)
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();

    // Verify cart items remain unchanged (check cart badge)
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    
    // Navigate to cart to verify items are still there
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // Verify no order is processed
    await expect(page.getByText('Thank you for your order!')).not.toBeVisible();
    await expect(page).not.toHaveURL(/.*checkout-complete\.html/);

    // Verify checkout can be restarted
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    await expect(page.getByText('Checkout: Your Information')).toBeVisible();
  });
});