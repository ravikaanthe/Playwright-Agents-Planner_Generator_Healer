// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Checkout Form Validation - Missing Postal Code', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Add item to cart and proceed to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    // 3. Fill First Name and Last Name
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');

    // 4. Leave Zip/Postal Code field empty
    await page.locator('[data-test="postalCode"]').fill('');

    // 5. Click 'Continue' button
    await page.locator('[data-test="continue"]').click();

    // Verify error message appears indicating Postal Code is required
    await expect(page.getByText('Error: Postal Code is required')).toBeVisible();

    // Verify user remains on checkout form
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Verify form validation works correctly
    await expect(page.getByText('Checkout: Your Information')).toBeVisible();

    // Verify no progression to overview page
    await expect(page.getByText('Checkout: Overview')).not.toBeVisible();

    // Verify field values are maintained
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('John');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('Doe');
    await expect(page.locator('[data-test="postalCode"]')).toHaveValue('');
  });
});