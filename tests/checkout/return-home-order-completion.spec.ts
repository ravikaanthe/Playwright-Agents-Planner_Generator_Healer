// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Return Home from Order Completion', async ({ page }) => {
    // 1. Complete full checkout process
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Add items and complete checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    // Fill checkout form and complete order
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();

    // Verify we're on order completion page
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(page.getByText('Thank you for your order!')).toBeVisible();

    // 2. On order completion page, click 'Back Home' button
    await page.locator('[data-test="back-to-products"]').click();

    // Verify user returns to inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();

    // Verify cart is empty
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();

    // Verify all products are available for new orders
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toBeVisible();

    // Verify application state is reset for new session
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).not.toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).not.toBeVisible();

    // Verify can start new shopping session
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });
});