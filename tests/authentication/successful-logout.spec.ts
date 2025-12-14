// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and User Management', () => {
  test('Successful Logout', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Navigate to the inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);

    // 3. Click the hamburger menu button
    await page.getByRole('button', { name: 'Open Menu' }).click();

    // 4. Click the 'Logout' link in the menu
    await page.locator('[data-test="logout-sidebar-link"]').click();

    // Verify user is redirected to the login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // Verify username and password fields are empty
    await expect(page.locator('[data-test="username"]')).toHaveValue('');
    await expect(page.locator('[data-test="password"]')).toHaveValue('');

    // Verify all session data is cleared and login form is visible
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    await expect(page.getByText('Swag Labs')).toBeVisible();

    // Verify navigation menu is no longer accessible
    await expect(page.getByRole('button', { name: 'Open Menu' })).not.toBeVisible();
  });
});