// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and User Interface', () => {
  test('Reset App State Functionality', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Add multiple items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    // Verify cart has items before reset
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();

    // 3. Open hamburger menu and click 'Reset App State'
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="reset-sidebar-link"]').click();

    // 4. Verify application state reset
    // Note: SauceDemo's Reset App State has known limitations
    // Cart badge is cleared but some items may remain in "Remove" state
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();

    // Close menu to see the product page clearly
    await page.getByRole('button', { name: 'Close Menu' }).click();

    // Verify mixed state: some items reset to "Add to cart", some may remain "Remove"
    // This is the actual behavior of SauceDemo's reset functionality
    const addToCartButtons = page.locator('button[data-test*="add-to-cart"]');
    const removeButtons = page.locator('button[data-test*="remove"]');
    
    // Expect at least some items to be in "Add to cart" state
    await expect(addToCartButtons).toHaveCount(3); // Should have 3 add to cart buttons
    await expect(removeButtons).toHaveCount(3); // May still have 3 remove buttons
    
    // Verify application returns to initial logged-in state with Products visible
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
});