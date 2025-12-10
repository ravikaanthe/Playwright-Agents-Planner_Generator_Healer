// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as standard_user before each test
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('Add Items to Cart', async ({ page }) => {
    // Click 'Add to cart' for Sauce Labs Backpack
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Verify cart badge shows '1'
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    
    // Verify button changes to 'Remove'
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    
    // Add Sauce Labs Bike Light to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Verify cart badge shows '2'
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    
    // Add one more item
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    // Verify cart badge updates correctly
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
  });

  test('Remove Items from Cart', async ({ page }) => {
    // Login and add 3 items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    // Click 'Remove' button for first item
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    
    // Verify cart badge decrements
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    
    // Verify button changes back to 'Add to cart'
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    
    // Remove all items
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
    
    // Verify cart badge disappears
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
  });

  test('Cart Page Navigation and Display', async ({ page }) => {
    // Login and add multiple items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Click on shopping cart icon
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify cart page displays
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();
    
    // Verify all added items are listed
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    
    // Verify QTY column shows '1' for each item
    await expect(page.getByText('1').first()).toBeVisible();
    
    // Test 'Continue Shopping' button
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
    
    // Go back to cart and test 'Checkout' button visibility
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('Empty Cart Behavior', async ({ page }) => {
    // Click on shopping cart icon without adding items
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify empty cart page displays
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();
    
    // Test 'Continue Shopping' functionality
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
});