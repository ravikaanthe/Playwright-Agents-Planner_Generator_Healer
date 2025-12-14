// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Error Handling and Edge Cases', () => {
  test('Session Timeout Handling', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Add items to cart to test session preservation
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // 2. Wait for extended period of inactivity
    // Note: SauceDemo doesn't implement actual session timeouts, 
    // so this test simulates the behavior
    
    // Simulate session timeout by waiting and then attempting actions
    await page.waitForTimeout(5000); // Simulate some inactivity

    // 3. Attempt to perform actions
    // Try to navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();

    // In a real application with session timeout, we would check for:
    // - Redirect to login page
    // - Clear indication of session status
    // For SauceDemo, verify session handling is graceful
    
    // Verify session remains active (SauceDemo behavior)
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();

    // Verify no data corruption occurs
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Test navigation and functionality still works
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
    
    // Verify session state is maintained
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });
});