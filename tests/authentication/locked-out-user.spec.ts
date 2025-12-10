// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  test('Locked Out User Error Handling', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com/');
    
    // Enter 'locked_out_user' in username field
    await page.locator('[data-test="username"]').fill('locked_out_user');
    
    // Enter 'secret_sauce' in password field
    await page.locator('[data-test="password"]').fill('secret_sauce');
    
    // Click Login button
    await page.locator('[data-test="login-button"]').click();
    
    // Verify error message is displayed
    await expect(page.getByText('Epic sadface: Sorry, this user has been locked out.')).toBeVisible();
    
    // Verify user remains on login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // Verify username and password fields should retain entered values
    await expect(page.locator('[data-test="username"]')).toHaveValue('locked_out_user');
    await expect(page.locator('[data-test="password"]')).toHaveValue('secret_sauce');
  });
});