import { test, expect } from '@playwright/test';

test.describe('Product Catalog', () => {
  test('View All Products', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    // 2. Verify all products are displayed on inventory page
    const products = page.locator('.inventory_item');
    await expect(products).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      const product = products.nth(i);
      await expect(product.locator('.inventory_item_name')).toBeVisible();
      await expect(product.locator('.inventory_item_price')).toBeVisible();
      await expect(product.locator('.inventory_item_desc')).toBeVisible();
      await expect(product.locator('img')).toBeVisible();
    }
  });
});
