import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 2,
  workers: 2,
  expect: {
    timeout: 5000,
  },
 // reporter: 'html',
  reporter: [["line"], ["html", { outputFolder: "playwright-report", open: "never" }], ["allure-playwright"]],

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        headless: true,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
        },
        video: 'retain-on-failure',
      

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        // trace: 'retain-on-failure',
      },
    },
    // {
    //   name: 'safari',
    //   use: {
    //     browserName: 'webkit',
    //     headless: false,
    //     screenshot: 'only-on-failure',
    //     trace: 'retain-on-failure',
    //     viewport: { width: 1280, height: 720 },

    //     /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    //     // trace: 'retain-on-failure',
    //   },
    // }
  ],



});

export default config;
