// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test('Complete Checkout Process with Valid Information', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Add 'Sauce Labs Backpack' to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // 3. Navigate to cart and click 'Checkout'
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    // 4. Fill in First Name: 'John', Last Name: 'Doe', Zip: '12345'
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');

    // 5. Click 'Continue' button
    await page.locator('[data-test="continue"]').click();

    // Verify user progresses through checkout-step-one.html to checkout-step-two.html
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);

    // Verify order summary page displays correctly
    await expect(page.getByText('Checkout: Overview')).toBeVisible();

    // Verify payment info shows 'SauceCard #31337'
    await expect(page.getByText('SauceCard #31337')).toBeVisible();

    // Verify shipping shows 'Free Pony Express Delivery!'
    await expect(page.getByText('Free Pony Express Delivery!')).toBeVisible();

    // Verify price breakdown shows item total, tax, and final total
    await expect(page.getByText('Item total: $29.99')).toBeVisible();
    await expect(page.getByText(/Tax: \$\d+\.\d{2}/)).toBeVisible();
    await expect(page.getByText(/Total: \$\d+\.\d{2}/)).toBeVisible();

    // 6. Review order summary and click 'Finish'
    await page.locator('[data-test="finish"]').click();

    // 7. Verify order completion
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
    await expect(page.getByText('Your order has been dispatched')).toBeVisible();

    // Verify cart is cleared after order completion
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});