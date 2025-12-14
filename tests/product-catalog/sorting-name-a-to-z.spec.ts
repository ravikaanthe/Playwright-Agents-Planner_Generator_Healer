// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Catalog and Browsing', () => {
  test('Product Sorting by Name A to Z', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Select 'Name (A to Z)' from the sort dropdown
    await page.locator('[data-test="product-sort-container"]').selectOption(['az']);

    // Verify products are sorted alphabetically
    const productNames = page.locator('.inventory_item_name');
    await expect(productNames.nth(0)).toHaveText('Sauce Labs Backpack');
    await expect(productNames.nth(1)).toHaveText('Sauce Labs Bike Light');
    await expect(productNames.nth(2)).toHaveText('Sauce Labs Bolt T-Shirt');
    await expect(productNames.nth(3)).toHaveText('Sauce Labs Fleece Jacket');
    await expect(productNames.nth(4)).toHaveText('Sauce Labs Onesie');
    await expect(productNames.nth(5)).toHaveText('Test.allTheThings() T-Shirt (Red)');

    // Verify sort dropdown displays 'Name (A to Z)' as selected
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');

    // Verify all products remain visible
    await expect(page.locator('.inventory_item')).toHaveCount(6);

    // Verify product information remains accurate
    await expect(page.getByText('$29.99').first()).toBeVisible(); // Backpack price
    await expect(page.getByText('$9.99')).toBeVisible(); // Bike Light price
  });
});