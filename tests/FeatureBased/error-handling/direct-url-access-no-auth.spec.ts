import { test, expect } from '@playwright/test';

test.describe('Business Rules Validation', () => {
  test('Only Authenticated Users Can Access Inventory and Cart', async ({ page }) => {
    // 1. Attempt to access inventory or cart page without logging in
    await page.goto('https://www.saucedemo.com/inventory.html');
    // Assert: User is redirected to login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await page.goto('https://www.saucedemo.com/cart.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});
