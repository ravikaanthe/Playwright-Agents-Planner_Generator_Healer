import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Checkout Validation - Missing Postal Code', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    // 2. Add products to cart
    const addButtons = page.locator('button[data-test^="add-to-cart"]');
    if (await addButtons.count() > 0) await addButtons.first().click();
    // 3. Go to cart page
    await page.click('.shopping_cart_link');
    // 4. Click Checkout
    await page.click('[data-test="checkout"]');
    // 5. Leave postal code blank
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    // 6. Attempt to continue
    await page.click('[data-test="continue"]');
    // Assert: Error message for missing postal code is displayed
    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
  });
});
