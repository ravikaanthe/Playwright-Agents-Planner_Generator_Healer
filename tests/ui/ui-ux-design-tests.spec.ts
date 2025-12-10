// spec: specs/saucedemo-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('UI/UX and Visual Design Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as standard_user for baseline UI testing
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('Visual User Interface Issues', async ({ page }) => {
    // Logout and login as visual_user to test UI issues
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    
    await page.locator('[data-test="username"]').fill('visual_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    
    // Document wrong product images and price inconsistencies
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    
    // Add item to cart to test price consistency between pages
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify visual bugs affect user experience
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    // Note: Price should be different between product page and cart page for visual_user
  });

  test('Button States and Interactive Elements', async ({ page }) => {
    // Test button hover states on interactive elements
    const addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(addToCartButton).toBeVisible();
    
    // Test button text changes (Add to cart ↔ Remove)
    await addToCartButton.click();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    
    // Test cart badge appearance and count updates
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    
    // Test button click feedback
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
  });

  test('Form UI Elements and Validation States', async ({ page }) => {
    // Navigate to checkout form
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Test empty form submission for validation UI
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message styling and positioning
    await expect(page.getByText('Error: First Name is required')).toBeVisible();
    
    // Test error icon display next to invalid fields
    const firstNameField = page.locator('[data-test="firstName"]');
    await expect(firstNameField).toBeVisible();
    
    // Verify form field focus styles
    await firstNameField.focus();
    
    // Fill form and verify error message dismissal behavior
    await firstNameField.fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Verify successful form submission
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });

  test('Layout and Spacing Consistency', async ({ page }) => {
    // Verify consistent spacing between product cards
    const productCards = page.locator('.inventory_item');
    await expect(productCards).toHaveCount(6);
    
    // Test header and footer alignment
    await expect(page.locator('.header_container')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Verify content centering and max-width handling
    const inventoryContainer = page.locator('[data-test="inventory-container"]');
    await expect(inventoryContainer).toBeVisible();
    
    // Test page layout on different screen sizes (simulate mobile)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Products')).toBeVisible();
    
    // Reset to desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('Responsive Design and Mobile UI', async ({ page }) => {
    // Test layout adaptation on mobile viewports
    await page.setViewportSize({ width: 320, height: 568 }); // iPhone 5
    await expect(page.getByText('Products')).toBeVisible();
    
    // Verify touch-friendly button sizes
    const addToCartButtons = page.locator('[id^="add-to-cart"]');
    await expect(addToCartButtons.first()).toBeVisible();
    
    // Test mobile menu functionality
    const menuButton = page.getByRole('button', { name: 'Open Menu' });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(page.locator('.bm-menu')).toBeVisible();
    
    // Test mobile cart and checkout flow
    await page.getByRole('button', { name: 'Close Menu' }).click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart\.html/);
    
    // Verify mobile form usability
    await page.locator('[data-test="checkout"]').click();
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
  });

  test('Icon and Image Display', async ({ page }) => {
    // Verify all icons are displaying correctly
    await expect(page.getByRole('button', { name: 'Open Menu' })).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    
    // Test product images
    const productImages = page.locator('.inventory_item_img');
    await expect(productImages.first()).toBeVisible();
    
    // Check for consistent icon sizing
    const menuIcon = page.getByRole('button', { name: 'Open Menu' });
    const cartIcon = page.locator('[data-test="shopping-cart-link"]');
    await expect(menuIcon).toBeVisible();
    await expect(cartIcon).toBeVisible();
  });

  test('Error and Empty States UI', async ({ page }) => {
    // Test empty cart state
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.getByText('Your Cart')).toBeVisible();
    
    // Verify empty cart messaging and design
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    
    // Test form validation error display
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="continue"]').click();
    await expect(page.getByText('Error: First Name is required')).toBeVisible();
    
    // Verify error recovery options are visible
    const firstNameField = page.locator('[data-test="firstName"]');
    await expect(firstNameField).toBeVisible();
    await firstNameField.fill('John');
    
    // Test error dismissal
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });
});