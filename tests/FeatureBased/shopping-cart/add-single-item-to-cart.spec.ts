import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test('Add Single Item to Cart', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    // 2. Add a product to the cart from inventory page
    const firstAddBtn = page.locator('.inventory_item').first().locator('button');
    await firstAddBtn.click();
    // Assert: Cart badge updates to 1
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    // Assert: Product is listed in cart
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });
});
