// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Checkout Form Validation - Missing First Name', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Add item to cart and proceed to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    // 3. Leave First Name field empty
    await page.locator('[data-test="firstName"]').fill('');

    // 4. Fill Last Name and Zip Code
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');

    // 5. Click 'Continue' button
    await page.locator('[data-test="continue"]').click();

    // Verify error message appears indicating First Name is required
    await expect(page.getByText('Error: First Name is required')).toBeVisible();

    // Verify user remains on checkout-step-one.html page
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // Verify form does not proceed to next step
    await expect(page.getByText('Checkout: Your Information')).toBeVisible();

    // Verify other field values are preserved
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('Doe');
    await expect(page.locator('[data-test="postalCode"]')).toHaveValue('12345');
  });
});