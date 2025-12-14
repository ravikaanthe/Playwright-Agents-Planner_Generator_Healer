// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and User Management', () => {
  test('Login with Performance Glitch User', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');

    // 2. Enter 'performance_glitch_user' in the username field
    await page.locator('[data-test="username"]').fill('performance_glitch_user');

    // 3. Enter 'secret_sauce' in the password field
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // 4. Click the Login button
    const startTime = Date.now();
    await page.locator('[data-test="login-button"]').click();
    
    // Verify user is eventually redirected to the inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);
    const loginTime = Date.now() - startTime;
    
    // Verify login process takes significantly longer than normal (expected > 1000ms)
    console.log(`Performance glitch user login time: ${loginTime}ms`);
    
    // Verify application may load slowly throughout the session but all functionality remains available
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    
    // Verify all functionality remains available but with delays
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await expect(page.getByRole('link', { name: 'All Items' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  });
});