// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Catalog and Browsing', () => {
  test('Product Sorting by Price High to Low', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Select 'Price (high to low)' from the sort dropdown
    await page.locator('[data-test="product-sort-container"]').selectOption(['hilo']);

    // Verify products are sorted by price descending
    const productPrices = page.locator('.inventory_item_price');
    await expect(productPrices.nth(0)).toHaveText('$49.99'); // Fleece Jacket
    await expect(productPrices.nth(1)).toHaveText('$29.99'); // Backpack
    await expect(productPrices.nth(2)).toHaveText('$15.99'); // Bolt T-Shirt
    await expect(productPrices.nth(3)).toHaveText('$15.99'); // Red T-Shirt
    await expect(productPrices.nth(4)).toHaveText('$9.99');  // Bike Light
    await expect(productPrices.nth(5)).toHaveText('$7.99');  // Onesie

    // Verify sort dropdown displays 'Price (high to low)' as selected
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('hilo');

    // Verify all products remain visible
    await expect(page.locator('.inventory_item')).toHaveCount(6);

    // Verify price order is mathematically correct
    const productNames = page.locator('.inventory_item_name');
    await expect(productNames.nth(0)).toHaveText('Sauce Labs Fleece Jacket');
    await expect(productNames.nth(1)).toHaveText('Sauce Labs Backpack');
    await expect(productNames.nth(5)).toHaveText('Sauce Labs Onesie');
  });
});