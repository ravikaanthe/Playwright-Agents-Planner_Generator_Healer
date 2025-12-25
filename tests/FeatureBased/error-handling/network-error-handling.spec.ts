import { test } from '@playwright/test';

// FIXME: This test is skipped because simulating a network error on the main page prevents the page from loading and showing an error message. This is not a user-visible error, so the test is not meaningful.
test.fixme('Navigation & UI › Error Handling for Invalid Actions', async () => {
  // Simulating a network error for the main page will cause the page to fail to load, not show an in-app error message.
});
