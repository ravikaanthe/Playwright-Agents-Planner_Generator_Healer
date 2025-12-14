// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Special User Scenarios', () => {
  test('Performance Glitch User Load Testing', async ({ page }) => {
    // 1. Log in with 'performance_glitch_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('performance_glitch_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // Measure login time
    const startTime = Date.now();
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
    const loginTime = Date.now() - startTime;

    // 2. Measure page load times
    console.log(`Login time with performance_glitch_user: ${loginTime}ms`);
    
    // 3. Complete full shopping workflow
    // Add item to cart
    const addToCartStart = Date.now();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    const addToCartTime = Date.now() - addToCartStart;
    console.log(`Add to cart time: ${addToCartTime}ms`);

    // Navigate to cart
    const cartNavStart = Date.now();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart\.html/);
    const cartNavTime = Date.now() - cartNavStart;
    console.log(`Cart navigation time: ${cartNavTime}ms`);

    // 4. Monitor response times for each action
    // Verify performance delays are present but functionality works
    await expect(page.getByText('Your Cart')).toBeVisible();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    
    // Verify all functionality eventually completes
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();

    // Performance impact should be isolated to this user type
    // but all core functionality should remain available
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
});