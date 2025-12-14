// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Error Handling and Edge Cases', () => {
  test('Direct URL Access Without Authentication', async ({ page }) => {
    // 1. Navigate directly to https://www.saucedemo.com/inventory.html without logging in
    await page.goto('https://www.saucedemo.com/inventory.html');

    // Verify user is redirected to login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // Verify no inventory content is accessible
    await expect(page.getByText('Products')).not.toBeVisible();
    await expect(page.getByText('Sauce Labs Backpack')).not.toBeVisible();

    // Verify proper authentication enforcement - login form is displayed
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    await expect(page.getByText('Swag Labs')).toBeVisible();

    // Verify no error messages in console by checking login page loads correctly
    await expect(page.getByText('Accepted usernames are:')).toBeVisible();
    await expect(page.getByText('Password for all users:')).toBeVisible();
  });
});