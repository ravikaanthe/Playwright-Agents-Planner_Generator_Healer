import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test('Add Multiple Items to Cart', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.locator('.inventory_list')).toBeVisible({ timeout: 10000 });
    // 2. Add multiple products to the cart
    const addButtons = page.locator('button[data-test^="add-to-cart"]');
    const count = await addButtons.count();
    if (count < 6) {
      console.warn(`Only ${count} products found, adjusting assertions.`);
    }
    let added = 0;
    for (let i = 0; i < count; i++) {
      const btn = addButtons.nth(i);
      if (await btn.isVisible() && await btn.isEnabled()) {
        await btn.click();
        await page.waitForTimeout(200);
        added++;
      }
    }
    // Assert: Cart badge updates to correct number of items actually added
    const badge = page.locator('.shopping_cart_badge');
    await expect(badge).toBeVisible({ timeout: 2000 });
    const badgeCount = parseInt(await badge.textContent() || '0', 10);
    expect(badgeCount).toBe(added);
    // Assert: All selected products are listed in cart
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(added);
  });
});
