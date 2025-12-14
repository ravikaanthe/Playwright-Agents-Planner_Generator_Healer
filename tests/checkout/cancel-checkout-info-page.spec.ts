// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Cancel Checkout from Information Page', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Add items to cart and proceed to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    // Verify we're on checkout information page
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    await expect(page.getByText('Checkout: Your Information')).toBeVisible();

    // 3. Click 'Cancel' button on checkout information page
    await page.locator('[data-test="cancel"]').click();

    // Verify user returns to cart page
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();

    // Verify cart contents are preserved
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // Verify no checkout information is saved
    await page.locator('[data-test="checkout"]').click();
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('');
    await expect(page.locator('[data-test="postalCode"]')).toHaveValue('');

    // Verify cart functionality remains intact
    await page.locator('[data-test="cancel"]').click();
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });
});