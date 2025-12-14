// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and User Interface', () => {
  test('Navigation Menu Accessibility', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Click the hamburger menu button
    await page.getByRole('button', { name: 'Open Menu' }).click();

    // 3. Verify menu options are displayed
    await expect(page.getByRole('link', { name: 'All Items' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Reset App State' })).toBeVisible();

    // Verify all menu items are clickable
    await expect(page.getByRole('link', { name: 'All Items' })).toBeEnabled();
    await expect(page.getByRole('link', { name: 'About' })).toBeEnabled();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeEnabled();
    await expect(page.getByRole('link', { name: 'Reset App State' })).toBeEnabled();

    // 4. Click 'Close Menu' button
    await page.getByRole('button', { name: 'Close Menu' }).click();

    // Verify close button properly closes menu
    await expect(page.getByRole('link', { name: 'All Items' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).not.toBeVisible();
  });
});