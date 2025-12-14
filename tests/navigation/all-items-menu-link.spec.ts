// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and User Interface', () => {
  test('All Items Menu Link', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Navigate to cart page
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart\.html/);

    // 3. Open hamburger menu and click 'All Items'
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="inventory-sidebar-link"]').click();

    // Verify user is redirected to inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Verify 'All Items' link functions from any page
    await expect(page.getByText('Products')).toBeVisible();

    // Verify product catalog is displayed correctly
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Verify menu closes after selection
    await expect(page.getByRole('link', { name: 'All Items' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).not.toBeVisible();
  });
});