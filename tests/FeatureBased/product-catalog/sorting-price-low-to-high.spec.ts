import { test, expect } from '@playwright/test';

test.describe('Product Catalog', () => {
  test('Product Sorting - Price Low-High', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    // Robust wait for inventory page
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible({ timeout: 10000 });
    // 2. Sort products by Price (low to high) with robust dropdown wait
    const sortDropdown = page.locator('[data-test="product_sort_container"]');
    try {
      await expect(sortDropdown).toBeVisible({ timeout: 5000 });
    } catch {
      // @ts-ignore
      throw new Error('Skip: Sort dropdown not found, skipping test.');
    }
    await expect(sortDropdown).toBeEnabled();
    await sortDropdown.selectOption('lohi');
    await page.waitForTimeout(300);
    // Assert: Products are sorted by price ascending
    const prices = await page.$$eval('.inventory_item_price', els => els.map(e => parseFloat(e.textContent?.replace('$','') || '0')));
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });
});
