import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('Login with Valid Standard User', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');
    // 2. Enter username: standard_user
    await page.fill('[data-test="username"]', 'standard_user');
    // 3. Enter password: secret_sauce
    await page.fill('[data-test="password"]', 'secret_sauce');
    // 4. Click the Login button
    await page.click('[data-test="login-button"]');
    // Robust wait for login redirect and inventory page
    await expect(page).toHaveURL(/.*inventory/, { timeout: 10000 });
    await expect(page.locator('.inventory_list')).toBeVisible({ timeout: 10000 });
  });
});
