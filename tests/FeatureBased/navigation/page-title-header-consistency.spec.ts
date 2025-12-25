import { test, expect } from '@playwright/test';

test.describe('Navigation & UI', () => {
  test('Responsive Layout', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    // 2. Resize browser window to various sizes
    const sizes = [
      { width: 375, height: 667 }, // mobile
      { width: 768, height: 1024 }, // tablet
      { width: 1440, height: 900 } // desktop
    ];
    for (const size of sizes) {
      await page.setViewportSize(size);
      // Assert: Layout adapts correctly for all tested screen sizes
      await expect(page.locator('.inventory_list')).toBeVisible();
    }
  });
});
