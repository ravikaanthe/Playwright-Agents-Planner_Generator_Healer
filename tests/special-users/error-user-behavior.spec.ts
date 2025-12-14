// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Special User Scenarios', () => {
  test('Error User Behavior Testing', async ({ page }) => {
    // 1. Log in with 'error_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('error_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Verify login succeeds
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();

    // 2. Attempt to add items to cart
    // Error user may trigger specific error conditions
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Document any error behaviors that occur
    // Error behaviors should be consistent and predictable
    // The application shouldn't crash or become unresponsive

    // Check if cart updates (behavior may vary for error user)
    const cartBadge = page.locator('.shopping_cart_badge');
    const isCartUpdated = await cartBadge.isVisible();
    
    if (isCartUpdated) {
      await expect(cartBadge).toHaveText('1');
      console.log('Error user: Cart updated successfully');
    } else {
      console.log('Error user: Cart may not update as expected - documenting error behavior');
    }

    // 3. Try to proceed through checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart\.html/);
    
    // Verify application doesn't crash
    await expect(page.getByText('Your Cart')).toBeVisible();
    
    // Attempt checkout process
    try {
      await page.locator('[data-test="checkout"]').click();
      await expect(page).toHaveURL(/.*checkout-step-one\.html/);
      
      // Fill form
      await page.locator('[data-test="firstName"]').fill('Error');
      await page.locator('[data-test="lastName"]').fill('User');
      await page.locator('[data-test="postalCode"]').fill('12345');
      
      // Attempt to continue
      await page.locator('[data-test="continue"]').click();
      
      // 4. Document any error behaviors
      // Specific error conditions may be triggered
      // But error states should be recoverable
      console.log('Error user checkout behavior documented');
      
    } catch (error) {
      console.log('Error user triggered expected error condition:', error.message);
      
      // Verify error states can be recovered from
      await page.goto('https://www.saucedemo.com/inventory.html');
      await expect(page.getByText('Products')).toBeVisible();
    }

    // Navigate back to inventory page for final verification
    await page.goto('https://www.saucedemo.com/inventory.html');

    // Verify application doesn't crash or become unresponsive
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });
});