import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('Logout Functionality', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    // 2. Open main menu
    await page.click('#react-burger-menu-btn');
    // 3. Click Logout
    await page.click('#logout_sidebar_link');
    // Assert: User is redirected to login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});
