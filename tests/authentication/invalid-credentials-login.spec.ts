// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and User Management', () => {
  test('Login with Invalid Credentials', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');

    // 2. Enter 'invalid_user' in the username field
    await page.locator('[data-test="username"]').fill('invalid_user');

    // 3. Enter 'wrong_password' in the password field
    await page.locator('[data-test="password"]').fill('wrong_password');

    // 4. Click the Login button
    await page.locator('[data-test="login-button"]').click();

    // Verify error message appears stating username and password do not match
    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();

    // Verify user remains on the login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // Verify login form is still visible and editable
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});