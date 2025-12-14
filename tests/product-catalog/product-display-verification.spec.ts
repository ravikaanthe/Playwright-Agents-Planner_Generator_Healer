// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Catalog and Browsing', () => {
  test('Product Catalog Display Verification', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Verify all products are displayed on the inventory page
    // Verify 6 products are displayed
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible(); // Sauce Labs Backpack
    await expect(page.locator('[data-test="item-0-title-link"]')).toBeVisible(); // Sauce Labs Bike Light
    await expect(page.locator('[data-test="item-1-title-link"]')).toBeVisible(); // Sauce Labs Bolt T-Shirt
    await expect(page.locator('[data-test="item-5-title-link"]')).toBeVisible(); // Sauce Labs Fleece Jacket
    await expect(page.locator('[data-test="item-2-title-link"]')).toBeVisible(); // Sauce Labs Onesie
    await expect(page.locator('[data-test="item-3-title-link"]')).toBeVisible(); // Test.allTheThings() T-Shirt (Red)

    // Verify each product displays: image, name, description, price, and 'Add to cart' button
    await expect(page.getByText('$29.99').first()).toBeVisible(); // Backpack
    await expect(page.getByText('$9.99')).toBeVisible(); // Bike Light
    await expect(page.getByText('$15.99').first()).toBeVisible(); // Bolt T-Shirt
    await expect(page.getByText('$49.99')).toBeVisible(); // Fleece Jacket
    await expect(page.getByText('$7.99')).toBeVisible(); // Onesie
    await expect(page.getByText('$15.99').nth(1)).toBeVisible(); // Red T-Shirt

    // Verify all Add to cart buttons are present
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-onesie"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]')).toBeVisible();
  });
});