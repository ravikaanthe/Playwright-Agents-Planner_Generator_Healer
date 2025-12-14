// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and User Management', () => {
  test('Login with Empty Credentials', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');

    // 2. Leave username field empty
    await page.locator('[data-test="username"]').fill('');

    // 3. Leave password field empty
    await page.locator('[data-test="password"]').fill('');

    // 4. Click the Login button
    await page.locator('[data-test="login-button"]').click();

    // Verify error message appears indicating username is required
    await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();

    // Verify user remains on the login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // Verify form validation prevents submission
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
  });
});