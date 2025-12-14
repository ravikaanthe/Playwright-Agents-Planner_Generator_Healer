// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and User Management', () => {
  test('Login with Locked Out User', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');

    // 2. Enter 'locked_out_user' in the username field
    await page.locator('[data-test="username"]').fill('locked_out_user');

    // 3. Enter 'secret_sauce' in the password field
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // 4. Click the Login button
    await page.locator('[data-test="login-button"]').click();

    // Verify error message appears stating 'Sorry, this user has been locked out.'
    await expect(page.getByText('Epic sadface: Sorry, this user has been locked out.')).toBeVisible();

    // Verify user remains on the login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // Verify login form is still visible
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});