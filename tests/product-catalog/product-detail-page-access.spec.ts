// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Catalog and Browsing', () => {
  test('Individual Product Detail Page Access', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Click on the 'Sauce Labs Backpack' product name link
    await page.locator('[data-test="item-4-title-link"]').click();

    // 3. Verify product detail page content
    // Verify user is redirected to product detail page
    await expect(page).toHaveURL(/.*inventory-item\.html\?id=4/);

    // Verify large product image is displayed
    await expect(page.locator('.inventory_details_img')).toBeVisible();

    // Verify product name, description, and price are shown
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('carry.allTheThings() with the sleek, streamlined Sly Pack')).toBeVisible();
    await expect(page.getByText('$29.99')).toBeVisible();

    // Verify 'Add to cart' button is present
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();

    // 4. Click 'Back to products' button
    await page.locator('[data-test="back-to-products"]').click();

    // Verify 'Back to products' button returns to inventory page
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });
});