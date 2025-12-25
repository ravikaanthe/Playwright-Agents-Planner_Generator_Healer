import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('Login with Locked Out User', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');
    // 2. Enter username: locked_out_user
    await page.fill('[data-test="username"]', 'locked_out_user');
    // 3. Enter password: secret_sauce
    await page.fill('[data-test="password"]', 'secret_sauce');
    // 4. Click the Login button
    await page.click('[data-test="login-button"]');
    // Assert: Error message is displayed indicating user is locked out
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
    // Assert: User remains on login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});
