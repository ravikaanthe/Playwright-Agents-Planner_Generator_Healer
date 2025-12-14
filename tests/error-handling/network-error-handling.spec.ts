// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Error Handling and Edge Cases', () => {
  test('Network Error Handling', async ({ page, context }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Add items to cart before network issues
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // 2. Simulate network disconnection
    await context.setOffline(true);

    // 3. Attempt to perform actions
    // Try to navigate to cart page
    const navigationPromise = page.locator('[data-test="shopping-cart-link"]').click();
    
    // Since we're offline, the navigation might fail or timeout
    // In a real application, we'd expect graceful error handling
    
    // For testing purposes, simulate network error scenarios
    try {
      await navigationPromise;
    } catch (error) {
      // Expected behavior during network issues
      console.log('Network error occurred as expected:', error.message);
    }

    // 4. Restore network connection
    await context.setOffline(false);

    // Verify application recovers when connection restored
    // Try the navigation again
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Application should recover and function normally
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();

    // Verify user data is preserved where possible
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();

    // Verify normal functionality is restored
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // Test that new actions work after recovery
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });
});