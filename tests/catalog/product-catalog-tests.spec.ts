// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Catalog Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as standard_user before each test
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('Product Listing Display', async ({ page }) => {
    // Verify all 6 products are displayed
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
    await expect(page.locator('[data-test="item-0-title-link"]')).toBeVisible();
    await expect(page.locator('[data-test="item-1-title-link"]')).toBeVisible();
    await expect(page.locator('[data-test="item-5-title-link"]')).toBeVisible();
    await expect(page.locator('[data-test="item-2-title-link"]')).toBeVisible();
    await expect(page.locator('[data-test="item-3-title-link"]')).toBeVisible();
    
    // Verify each product has Add to Cart button
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toBeVisible();
    
    // Check product prices are in correct format - verify at least some specific prices
    await expect(page.getByText('$29.99').first()).toBeVisible(); // Backpack
    await expect(page.getByText('$9.99').first()).toBeVisible();  // Bike Light
    await expect(page.getByText('$15.99').first()).toBeVisible(); // T-Shirt (note: multiple items have this price)
    
    // Verify total product count
    const productItems = page.locator('.inventory_item');
    await expect(productItems).toHaveCount(6);
  });

  test('Product Sorting Functionality', async ({ page }) => {
    // Test Name A-Z sorting (default)
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');
    
    // Select Name Z-A sorting
    await page.locator('[data-test="product-sort-container"]').selectOption('za');
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('za');
    
    // Select Price low to high sorting
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('lohi');
    
    // Select Price high to low sorting
    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('hilo');
  });

  test('Product Detail Page Navigation', async ({ page }) => {
    // Click on 'Sauce Labs Backpack' product name
    await page.locator('[data-test="item-4-title-link"]').click();
    
    // Verify product detail page displays
    await expect(page).toHaveURL(/.*inventory-item\.html/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('$29.99')).toBeVisible();
    
    // Verify Add to Cart button exists
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
    
    // Click 'Back to products' button
    await page.locator('[data-test="back-to-products"]').click();
    
    // Verify return to inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
});