// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Catalog and Browsing', () => {
  test('Product Image Link Navigation', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Click on the product image for 'Sauce Labs Bike Light'
    await page.locator('[data-test="item-0-img-link"]').click();

    // 3. Verify product detail page loads
    await expect(page).toHaveURL(/.*inventory-item\.html\?id=0/);

    // Verify product detail page loads correctly
    await expect(page.locator('.inventory_details_img')).toBeVisible();

    // Verify correct product information is displayed
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('A red light isn\'t the desired state in testing')).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();

    // Verify product image is enlarged
    await expect(page.locator('.inventory_details_img')).toBeVisible();

    // 4. Navigate back to products page
    await page.locator('[data-test="back-to-products"]').click();

    // Verify navigation functions properly
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });
});