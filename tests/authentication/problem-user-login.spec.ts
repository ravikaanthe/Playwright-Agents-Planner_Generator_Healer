// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and User Management', () => {
  test('Login with Problem User', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');

    // 2. Enter 'problem_user' in the username field
    await page.locator('[data-test="username"]').fill('problem_user');

    // 3. Enter 'secret_sauce' in the password field
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // 4. Click the Login button
    await page.locator('[data-test="login-button"]').click();

    // Verify user is redirected to the inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Verify products page may display with visual issues or broken images
    // (Product functionality remains but may have visual problems)
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    
    // Verify application functionality may be impaired but basic navigation works
    // (Problem user may have broken links or images)
    
    // Verify user can still access the menu and navigate
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await expect(page.getByRole('link', { name: 'All Items' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Reset App State' })).toBeVisible();
  });
});