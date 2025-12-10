// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  test('Valid Login with Standard User', async ({ page }) => {
    // Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');
    
    // Enter 'standard_user' in username field
    await page.locator('[data-test="username"]').fill('standard_user');
    
    // Enter 'secret_sauce' in password field
    await page.locator('[data-test="password"]').fill('secret_sauce');
    
    // Click Login button
    await page.locator('[data-test="login-button"]').click();
    
    // Verify successful redirect to inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);
    
    // Verify Products heading is displayed
    await expect(page.getByText('Products')).toBeVisible();
    
    // Verify shopping cart icon is visible
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
  });
});