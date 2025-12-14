// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Catalog and Browsing', () => {
  test('Product Sorting by Name Z to A', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Select 'Name (Z to A)' from the sort dropdown
    await page.locator('[data-test="product-sort-container"]').selectOption(['za']);

    // Verify products are sorted reverse alphabetically
    const productNames = page.locator('.inventory_item_name');
    await expect(productNames.nth(0)).toHaveText('Test.allTheThings() T-Shirt (Red)');
    await expect(productNames.nth(1)).toHaveText('Sauce Labs Onesie');
    await expect(productNames.nth(2)).toHaveText('Sauce Labs Fleece Jacket');
    await expect(productNames.nth(3)).toHaveText('Sauce Labs Bolt T-Shirt');
    await expect(productNames.nth(4)).toHaveText('Sauce Labs Bike Light');
    await expect(productNames.nth(5)).toHaveText('Sauce Labs Backpack');

    // Verify sort dropdown displays 'Name (Z to A)' as selected
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('za');

    // Verify all products remain visible
    await expect(page.locator('.inventory_item')).toHaveCount(6);

    // Verify product information remains accurate
    await expect(page.getByText('$15.99').first()).toBeVisible(); // Red T-Shirt price
    await expect(page.getByText('$7.99')).toBeVisible(); // Onesie price
  });
});