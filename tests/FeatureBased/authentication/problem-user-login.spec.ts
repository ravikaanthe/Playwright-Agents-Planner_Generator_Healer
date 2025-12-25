import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('Login with Problem User', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');
    // 2. Enter username: problem_user
    await page.fill('[data-test="username"]', 'problem_user');
    // 3. Enter password: secret_sauce
    await page.fill('[data-test="password"]', 'secret_sauce');
    // 4. Click the Login button
    await page.click('[data-test="login-button"]');
    // Assert: User is redirected to the inventory page
    await expect(page).toHaveURL(/.*inventory/);
    // Assert: Inventory page is visible (check for UI issues)
    await expect(page.locator('.inventory_list')).toBeVisible();
  });
});
