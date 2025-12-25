import { test, expect } from '@playwright/test';

test.describe('Product Catalog', () => {
  test('Product Sorting - Name Z-A', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    // Robust wait for inventory page
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible({ timeout: 10000 });
    // 2. Sort products by Name (Z to A) with robust dropdown wait
    const sortDropdown = page.locator('[data-test="product_sort_container"]');
    try {
      await expect(sortDropdown).toBeVisible({ timeout: 5000 });
    } catch {
      // @ts-ignore
      throw new Error('Skip: Sort dropdown not found, skipping test.');
    }
    await expect(sortDropdown).toBeEnabled();
    await sortDropdown.selectOption('za');
    await page.waitForTimeout(300);
    // Assert: Products are sorted alphabetically Z-A
    const names = await page.$$eval('.inventory_item_name', els => els.map(e => e.textContent || ''));
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });
});
