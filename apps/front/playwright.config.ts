import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';
import { cucumberReporter, defineBddConfig } from 'playwright-bdd';

// For CI, you may want to set BASE_URL to the deployed application.
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
const baseURL =
  process.env['BASE_PLAYWRIGHT_URL'] ||
  process.env['PLAYWRIGHT_BASE_URL'] ||
  'http://localhost:4200';
const useBdd = process.env['PLAYWRIGHT_USE_BDD'] === '1';

const specs = useBdd
  ? defineBddConfig({
      features: ['e2e/features/**/*.feature'],
      steps: ['e2e/steps/**/*.ts', 'e2e/support/**/*.ts'],
      tags: '@Automated and @P0 or @P1 or @P2 or @P3',
    })
  : './e2e/specs';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: specs }),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    serviceWorkers: 'block',
  },
  /* Run your local dev server before starting the tests */
  webServer: baseURL.includes('localhost')
    ? {
        command: 'npx nx serve front',
        url: 'http://localhost:4200',
        reuseExistingServer: true,

        cwd: workspaceRoot,
      }
    : undefined,
  reporter: useBdd
    ? [
        cucumberReporter('html', {
          outputFile: '../../reports/cucumber-report/index.html',
        }),
      ]
    : 'html',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Uncomment for mobile browsers support
    /* {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }, */

    // Uncomment for branded browsers
    /* {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    } */
  ],
});
