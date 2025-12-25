import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test('Continue Shopping from Cart', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    // 2. Go to cart page
    await page.click('.shopping_cart_link');
    // 3. Click Continue Shopping
    await page.click('[data-test="continue-shopping"]');
    // Assert: User is redirected to inventory page
    await expect(page).toHaveURL(/.*inventory/);
  });
});
