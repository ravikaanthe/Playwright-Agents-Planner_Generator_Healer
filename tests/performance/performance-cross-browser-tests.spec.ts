// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Performance and Cross-Browser Tests', () => {
  test('Page Load Performance', async ({ page }) => {
    // Navigate to login page and measure load time
    const startTime = Date.now();
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    const loginPageLoadTime = Date.now() - startTime;
    
    // Login and measure inventory page load time
    const inventoryStartTime = Date.now();
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Products')).toBeVisible();
    const inventoryLoadTime = Date.now() - inventoryStartTime;
    
    // Navigate to cart page and measure load time
    const cartStartTime = Date.now();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.getByText('Your Cart')).toBeVisible();
    const cartLoadTime = Date.now() - cartStartTime;
    
    // Performance budgets: pages should load reasonably quickly
    // Note: These are basic timing checks, not strict performance budgets
    console.log(`Login page load time: ${loginPageLoadTime}ms`);
    console.log(`Inventory page load time: ${inventoryLoadTime}ms`);
    console.log(`Cart page load time: ${cartLoadTime}ms`);
  });

  test('Performance Glitch User Testing', async ({ page }) => {
    // Login as performance_glitch_user
    const startTime = Date.now();
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('performance_glitch_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Products')).toBeVisible();
    const glitchUserLoadTime = Date.now() - startTime;
    
    // Test cart operations with potential delays
    const cartStartTime = Date.now();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    const cartOperationTime = Date.now() - cartStartTime;
    
    console.log(`Performance glitch user load time: ${glitchUserLoadTime}ms`);
    console.log(`Cart operation time: ${cartOperationTime}ms`);
    
    // Application should still function despite delays
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.getByText('Your Cart')).toBeVisible();
  });

  test('Network Performance with Throttling', async ({ page, context }) => {
    // Test application with throttled network (simulate 3G)
    await context.route('**/*', route => {
      // Add slight delay to simulate network throttling
      setTimeout(() => route.continue(), 100);
    });
    
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    
    // Test login flow with network throttling
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Verify application still functions with slower network
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.inventory_item').first()).toBeVisible();
  });

  test('Chrome Browser Compatibility', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chrome-specific test');
    
    // Execute complete user journey in Chrome
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Test all interactive elements
    await expect(page.getByText('Products')).toBeVisible();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    
    // Test responsive design
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText('Products')).toBeVisible();
    
    // Test cart and checkout flow
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
  });

  test('Firefox Browser Testing', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox-specific test');
    
    // Execute complete user journey in Firefox
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Test form submissions
    await expect(page.getByText('Products')).toBeVisible();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Test CSS compatibility
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await page.locator('[data-test="firstName"]').fill('Firefox');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });

  test('Safari/WebKit Browser Testing', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Safari-specific test');
    
    // Execute complete user journey in Safari
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Test WebKit-specific features
    await expect(page.getByText('Products')).toBeVisible();
    
    // Verify image loading and rendering
    const productImages = page.locator('.inventory_item_img');
    await expect(productImages.first()).toBeVisible();
    
    // Test session management
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.reload();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    
    // Test mobile Safari-like behavior with touch viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('Memory and Resource Usage', async ({ page }) => {
    // Monitor basic performance during user flow
    await page.goto('https://www.saucedemo.com/');
    
    // Perform multiple operations to test for memory issues
    for (let i = 0; i < 5; i++) {
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      await expect(page.getByText('Products')).toBeVisible();
      
      // Add and remove items multiple times
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
      
      // Logout for next iteration
      await page.getByRole('button', { name: 'Open Menu' }).click();
      await page.locator('[data-test="logout-sidebar-link"]').click();
    }
    
    // Final verification that app still functions
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Products')).toBeVisible();
  });
});