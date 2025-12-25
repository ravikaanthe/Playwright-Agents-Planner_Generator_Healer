import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('Login with Invalid Credentials', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');
    // 2. Enter invalid username and/or password
    await page.fill('[data-test="username"]', 'invalid_user');
    await page.fill('[data-test="password"]', 'invalid_pass');
    // 3. Click the Login button
    await page.click('[data-test="login-button"]');
    // Assert: Error message is displayed
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    // Assert: User remains on login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});
