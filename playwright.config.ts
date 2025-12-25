import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
try {
  const dotenv = require('dotenv');
  const path = require('path');
  dotenv.config({ path: path.resolve(__dirname, '.env') });
} catch (error) {
  // dotenv is optional - continue without it if not installed
  console.log('dotenv not installed - using system environment variables only');
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Test timeout */
  timeout: 30000,
  /* Global test timeout */
  globalTimeout: 600000,
  /* Expect timeout */
  expect: {
    timeout: 5000,
  },
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI 
    ? [
        ['junit', { outputFile: 'test-results/results.xml' }],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['blob', { outputDir: 'test-results' }],
        ['list']
      ]
    : [
        ['html', { outputFolder: 'playwright-report', open: 'on-failure' }],
        ['list']
      ],
  /* Output directory for test artifacts */
  outputDir: 'test-results/',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: process.env.CI ? 'only-on-failure' : 'on-first-retry',
    
    /* Record video on failure */
    video: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    
    /* Browser viewport */
    viewport: { width: 1280, height: 720 },
    
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
    
    /* Action timeout */
    actionTimeout: 10000,
    
    /* Navigation timeout */
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // Increase timeouts for WebKit in CI as it can be slower
        actionTimeout: process.env.CI ? 15000 : 10000,
        navigationTimeout: process.env.CI ? 45000 : 30000,
      },
      // Skip WebKit tests only if explicitly set to 'true'
      testIgnore: process.env.SKIP_WEBKIT_TESTS === 'true' ? ['**/*'] : [],
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      //testMatch: ['**/responsive/*.spec.ts'],
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      //testMatch: ['**/responsive/*.spec.ts'],
    },

    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],

  /* Test match patterns */
  testMatch: [
    '**/tests/**/*.spec.ts',
    '**/tests/**/*.test.ts'
  ],

  /* Test ignore patterns */
  testIgnore: [
    '**/node_modules/**',
    '**/test-results/**',
    '**/playwright-report/**'
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
