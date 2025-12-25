import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Checkout with Valid Info', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    // 2. Add products to cart
    const addButtons = page.locator('button[data-test^="add-to-cart"]');
    const count = await addButtons.count();
    for (let i = 0; i < count; i++) {
      const btn = addButtons.nth(i);
      if (await btn.isVisible() && await btn.isEnabled()) {
        await btn.click();
        await page.waitForTimeout(200); // allow UI to update
      }
    }
    // 3. Go to cart page
    await page.click('.shopping_cart_link');
    // 4. Click Checkout
    await page.click('[data-test="checkout"]');
    // 5. Enter valid first name, last name, postal code
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    // 6. Continue to overview
    await page.click('[data-test="continue"]');
    // 7. Finish checkout
    await page.click('[data-test="finish"]');
    // Assert: Order is completed successfully
    await expect(page.locator('.complete-header')).toHaveText(/THANK YOU FOR YOUR ORDER/i);
    // Assert: Confirmation page is displayed
    await expect(page.locator('.complete-text')).toBeVisible();
  });
});
