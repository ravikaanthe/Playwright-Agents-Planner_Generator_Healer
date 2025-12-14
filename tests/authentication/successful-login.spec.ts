// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and User Management', () => {
  test('Successful Login with Valid Credentials', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');

    // 2. Enter 'standard_user' in the username field
    await page.locator('[data-test="username"]').fill('standard_user');

    // 3. Enter 'secret_sauce' in the password field
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // 4. Click the Login button
    await page.locator('[data-test="login-button"]').click();

    // Verify user is redirected to the inventory page (/inventory.html)
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Verify products page displays with 'Products' heading
    await expect(page.getByText('Products')).toBeVisible();

    // Verify all 6 products are visible on the page
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible(); // Sauce Labs Backpack
    await expect(page.locator('[data-test="item-0-title-link"]')).toBeVisible(); // Sauce Labs Bike Light
    await expect(page.locator('[data-test="item-1-title-link"]')).toBeVisible(); // Sauce Labs Bolt T-Shirt
    await expect(page.locator('[data-test="item-5-title-link"]')).toBeVisible(); // Sauce Labs Fleece Jacket
    await expect(page.locator('[data-test="item-2-title-link"]')).toBeVisible(); // Sauce Labs Onesie
    await expect(page.locator('[data-test="item-3-title-link"]')).toBeVisible(); // Test.allTheThings() T-Shirt (Red)

    // Verify user menu is accessible via hamburger menu
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await expect(page.getByRole('link', { name: 'All Items' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Reset App State' })).toBeVisible();
  });
});