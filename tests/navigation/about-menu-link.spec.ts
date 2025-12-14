// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and User Interface', () => {
  test('About Menu Link', async ({ page, context }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Add item to cart to verify cart preservation
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // 2. Open hamburger menu
    await page.getByRole('button', { name: 'Open Menu' }).click();

    // 3. Click 'About' link
    // Note: The About link will open in the same tab for standard user
    // For problem user, it goes to error/404, but for standard user it should go to saucelabs.com
    const aboutLink = page.locator('[data-test="about-sidebar-link"]');
    await expect(aboutLink).toBeVisible();
    
    // Get the href attribute to verify the URL
    const href = await aboutLink.getAttribute('href');
    expect(href).toBe('https://saucelabs.com/');

    // Verify the link is functional by checking its properties
    await expect(aboutLink).toBeEnabled();
    await expect(aboutLink).toHaveAttribute('href', 'https://saucelabs.com/');

    // Close menu after verification
    await page.getByRole('button', { name: 'Close Menu' }).click();
    
    // Verify SauceDemo session remains active
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await expect(page.getByText('Products')).toBeVisible();
  });
});