import { test, expect } from '@playwright/test';

test.describe('Business Rules Validation', () => {
  test('Tax Calculation on Order Summary', async ({ page }) => {
    // 1. Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory/);
    // 2. Add products to cart
    const addButtons = page.locator('button[data-test^="add-to-cart"]');
    if (await addButtons.count() > 0) await addButtons.first().click();
    // 3. Proceed to checkout overview
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    // Assert: Tax is calculated at 8% and displayed correctly
    const itemTotalText = await page.locator('.summary_subtotal_label').textContent();
    const taxText = await page.locator('.summary_tax_label').textContent();
    const itemTotal = parseFloat(itemTotalText?.replace(/[^\d.]/g, '') || '0');
    const tax = parseFloat(taxText?.replace(/[^\d.]/g, '') || '0');
    expect(tax).toBeCloseTo(itemTotal * 0.08, 2);
  });
});
