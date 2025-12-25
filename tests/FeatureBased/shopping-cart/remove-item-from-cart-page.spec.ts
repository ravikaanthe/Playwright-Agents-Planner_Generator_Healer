import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test('Remove Item from Cart Page', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    // 2. Add a product to the cart
    const firstAddBtn = page.locator('.inventory_item').first().locator('button');
    await firstAddBtn.click();
    // 3. Go to cart page
    await page.click('.shopping_cart_link');
    // 4. Remove the product
    const removeBtn = page.locator('.cart_item').first().locator('button');
    await removeBtn.click();
    // Assert: Product is removed from cart
    await expect(page.locator('.cart_item')).toHaveCount(0);
    // Assert: Cart badge updates
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});
