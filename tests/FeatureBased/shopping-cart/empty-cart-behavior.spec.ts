import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test('Empty Cart Behavior', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    // 2. Go to cart page with no items
    await page.click('.shopping_cart_link');
    // Assert: Cart page displays empty state (no cart items)
    await expect(page.locator('.cart_item')).toHaveCount(0);
    // Optionally, check that the cart list does not contain any product name
    const cartListText = await page.locator('.cart_list').textContent();
    expect(cartListText).not.toMatch(/Sauce Labs|Backpack|Bike|Bolt|Fleece|T-Shirt|Onesie|Test.allTheThings/);
  });
});
