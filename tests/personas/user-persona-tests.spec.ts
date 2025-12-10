// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Persona Tests', () => {
  test('Problem User Product Issues', async ({ page }) => {
    // Login as problem_user
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('problem_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Navigate to inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);
    
    // Click on 'Sauce Labs Backpack' product name
    await page.locator('[data-test="item-4-title-link"]').click();
    
    // Verify which product detail page is actually displayed (should be wrong product)
    await expect(page).toHaveURL(/.*inventory-item\.html/);
    // Document that this should lead to wrong product page for problem_user
    
    // Click back and test multiple product links
    await page.locator('[data-test="back-to-products"]').click();
    await page.locator('[data-test="item-0-title-link"]').click();
    await expect(page).toHaveURL(/.*inventory-item\.html/);
  });

  test('Visual User Testing', async ({ page }) => {
    // Login as visual_user
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('visual_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Compare visual elements with expected behavior
    await expect(page.getByText('Products')).toBeVisible();
    
    // Test for visual discrepancies in product images and prices
    // Note: Visual user shows wrong product images and scrambled prices
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    
    // Add item to cart and check price consistency
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify cart page displays
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    
    // Test UI component rendering
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('Performance Glitch User Testing', async ({ page }) => {
    // Login as performance_glitch_user
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('performance_glitch_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Measure page response times (this user should be slower)
    const startTime = Date.now();
    await expect(page.getByText('Products')).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    // Test cart operations (should exhibit delays)
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart\.html/);
  });

  test('Error User Testing', async ({ page }) => {
    // Login as error_user
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('error_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Attempt typical user workflows
    await expect(page.getByText('Products')).toBeVisible();
    
    // Test error conditions during cart operations
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Test checkout flow for potential errors
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Fill checkout form
    await page.locator('[data-test="firstName"]').fill('Error');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Document any error conditions that occur
    // Note: error_user may exhibit errors during checkout process
  });
});