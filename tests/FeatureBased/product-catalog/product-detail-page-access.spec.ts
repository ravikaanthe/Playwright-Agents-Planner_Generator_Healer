import { test, expect } from '@playwright/test';

test.describe('Product Catalog', () => {
  test('Product Detail Page Access', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    // 2. Click on a product name or image
    const firstProduct = page.locator('.inventory_item').first();
    await firstProduct.locator('.inventory_item_name').click();
    // Assert: Product detail page is displayed with correct information
    await expect(page.locator('.inventory_details_name')).toBeVisible();
    await expect(page.locator('.inventory_details_price')).toBeVisible();
    await expect(page.locator('.inventory_details_desc')).toBeVisible();
    await expect(page.locator('.inventory_details_img')).toBeVisible();
  });
});
