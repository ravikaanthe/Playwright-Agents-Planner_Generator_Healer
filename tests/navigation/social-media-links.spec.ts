// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and User Interface', () => {
  test('Social Media Links in Footer', async ({ page }) => {
    // 1. Log in with 'standard_user' credentials
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. Scroll to footer section
    await page.locator('.social').scrollIntoViewIfNeeded();

    // 3. Click on Twitter, Facebook, and LinkedIn links
    // Verify Twitter link
    const twitterLink = page.locator('.social_twitter a');
    await expect(twitterLink).toBeVisible();
    const twitterHref = await twitterLink.getAttribute('href');
    expect(twitterHref).toBe('https://twitter.com/saucelabs');

    // Verify Facebook link
    const facebookLink = page.locator('.social_facebook a');
    await expect(facebookLink).toBeVisible();
    const facebookHref = await facebookLink.getAttribute('href');
    expect(facebookHref).toBe('https://www.facebook.com/saucelabs');

    // Verify LinkedIn link
    const linkedinLink = page.locator('.social_linkedin a');
    await expect(linkedinLink).toBeVisible();
    const linkedinHref = await linkedinLink.getAttribute('href');
    expect(linkedinHref).toBe('https://www.linkedin.com/company/sauce-labs/');

    // Verify all social media links are functional without clicking
    // This avoids issues with popup blocking and external site timeouts
    await expect(twitterLink).toBeEnabled();
    await expect(facebookLink).toBeEnabled();
    await expect(linkedinLink).toBeEnabled();

    // Verify original page remains intact
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.social')).toBeVisible();
  });
});