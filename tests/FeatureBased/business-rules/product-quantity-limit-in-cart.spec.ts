import { test, expect } from '@playwright/test';

test.describe('Business Rules Validation', () => {
  test('Product Quantity Limit in Cart', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    // 2. Attempt to add same product to cart multiple times
    const firstItem = page.locator('.inventory_item').first();
    const addBtn = firstItem.locator('button');
    // Add to cart if not already added
    if ((await addBtn.textContent())?.toLowerCase().includes('add')) {
      await addBtn.click();
    }
    // Try to add again (should not increase quantity)
    if ((await addBtn.textContent())?.toLowerCase().includes('add')) {
      await addBtn.click();
    }
    // Assert: Only one instance of product is in cart
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });
});
