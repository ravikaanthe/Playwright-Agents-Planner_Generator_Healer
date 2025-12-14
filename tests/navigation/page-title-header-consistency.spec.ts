// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and User Interface', () => {
  test('Page Title and Header Consistency', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Navigate through different pages (inventory, cart, checkout)
    // Verify inventory page
    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.getByText('Swag Labs').first()).toBeVisible();
    await expect(page.getByText('Products')).toBeVisible();

    // Navigate to cart page
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.getByText('Swag Labs').first()).toBeVisible();
    await expect(page.getByText('Your Cart')).toBeVisible();

    // Add item to enable checkout
    await page.locator('[data-test="continue-shopping"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    // Navigate to checkout page
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.getByText('Swag Labs').first()).toBeVisible();
    await expect(page.getByText('Checkout: Your Information')).toBeVisible();

    // Navigate to checkout overview
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.getByText('Swag Labs').first()).toBeVisible();
    await expect(page.getByText('Checkout: Overview')).toBeVisible();

    // 3. Verify page titles and headers
    // All pages show 'Swag Labs' title
    await expect(page).toHaveTitle('Swag Labs');

    // Page headers update appropriately
    await expect(page.getByText('Checkout: Overview')).toBeVisible();

    // Branding remains consistent across pages
    await expect(page.getByText('Swag Labs').first()).toBeVisible();

    // Navigation elements are always accessible
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await expect(page.getByRole('link', { name: 'All Items' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  });
});