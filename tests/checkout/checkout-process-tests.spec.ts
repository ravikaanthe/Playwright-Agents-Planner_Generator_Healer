// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as standard_user and add items to cart before each test
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  });

  test('Complete Checkout Flow', async ({ page }) => {
    // Navigate to cart and click Checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Fill in First Name: 'John'
    await page.locator('[data-test="firstName"]').fill('John');
    
    // Fill in Last Name: 'Doe'
    await page.locator('[data-test="lastName"]').fill('Doe');
    
    // Fill in Postal Code: '12345'
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify checkout overview page
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(page.getByText('Checkout: Overview')).toBeVisible();
    
    // Verify item details, payment info, shipping info
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('Payment Information:')).toBeVisible();
    await expect(page.getByText('Shipping Information:')).toBeVisible();
    
    // Verify total calculation (items + tax)
    await expect(page.locator('[data-test="subtotal-label"]')).toBeVisible();
    await expect(page.locator('[data-test="tax-label"]')).toBeVisible();
    await expect(page.locator('[data-test="total-label"]')).toBeVisible();
    
    // Click Finish
    await page.locator('[data-test="finish"]').click();
    
    // Verify order confirmation page
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
  });

  test('Checkout Form Validation', async ({ page }) => {
    // Navigate to checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Leave First Name empty and click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify validation error
    await expect(page.getByText('Error: First Name is required')).toBeVisible();
    
    // Fill First Name, leave Last Name empty
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="continue"]').click();
    
    // Verify validation error
    await expect(page.getByText('Error: Last Name is required')).toBeVisible();
    
    // Fill names, leave Postal Code empty
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="continue"]').click();
    
    // Verify validation error
    await expect(page.getByText('Error: Postal Code is required')).toBeVisible();
  });

  test('Checkout Cancellation', async ({ page }) => {
    // Navigate to checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Fill information form and click Cancel
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="cancel"]').click();
    
    // Verify return to cart page
    await expect(page).toHaveURL(/.*cart\.html/);
    
    // Proceed to overview and click Cancel
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="cancel"]').click();
    
    // Verify return to inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);
    
    // Verify cart items are preserved
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
  });
});