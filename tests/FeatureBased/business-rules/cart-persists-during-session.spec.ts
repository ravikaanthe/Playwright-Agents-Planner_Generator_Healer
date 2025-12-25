import { test, expect } from '@playwright/test';

test.describe('Business Rules Validation', () => {
  test('Cart Persists During Session', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible({ timeout: 10000 });
    // 2. Add products to cart
    const addButtons = page.locator('button[data-test^="add-to-cart"]');
    if (await addButtons.count() > 0) await addButtons.first().click();
    // 3. Refresh or navigate within session with robust wait
    await page.reload();
    await expect(page.locator('.inventory_list')).toBeVisible({ timeout: 10000 });
    // Assert: Cart contents persist until logout or session end
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(1, { timeout: 5000 });
  });
});
