// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  test('Invalid Credentials Test', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com/');
    
    // Enter 'invalid_user' in username field
    await page.locator('[data-test="username"]').fill('invalid_user');
    
    // Enter 'wrong_password' in password field
    await page.locator('[data-test="password"]').fill('wrong_password');
    
    // Click Login button
    await page.locator('[data-test="login-button"]').click();
    
    // Verify error message for invalid credentials
    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();
    
    // User should remain on login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('Empty Credentials Test', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com/');
    
    // Leave username field empty
    await page.locator('[data-test="username"]').clear();
    
    // Leave password field empty
    await page.locator('[data-test="password"]').clear();
    
    // Click Login button
    await page.locator('[data-test="login-button"]').click();
    
    // Verify validation error messages
    await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();
    
    // User should remain on login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});