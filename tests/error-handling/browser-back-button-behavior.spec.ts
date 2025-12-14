// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Error Handling and Edge Cases', () => {
  test('Browser Back Button Behavior', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Add item to cart to test state preservation
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // 2. Navigate to product detail page
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/.*inventory-item\.html\?id=4/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

    // 3. Use browser back button
    await page.goBack();

    // Verify back navigation works correctly
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();

    // Verify session state is maintained
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();

    // Verify cart contents are preserved
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // 4. Navigate to cart page and use back button
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart\.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Verify no broken page states occur
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });
});