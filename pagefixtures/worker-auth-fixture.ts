import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { testUsers, type TestUser } from '../test-data/users';

type WorkerFixtures = {
  workerStorageState: string;
  testUser: TestUser;
};

export const test = base.extend<{}, WorkerFixtures>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  testUser: [
    async ({}, use) => {
      const workerId = test.info().parallelIndex;
      const user = testUsers[workerId];

      if (!user) {
        throw new Error(
          `No test user configured for worker ${workerId}. Add TEST_USER_${workerId}_EMAIL and TEST_USER_${workerId}_PASSWORD, or lower the worker count.`,
        );
      }

      await use(user);
    },
    { scope: 'worker' },
  ],

  workerStorageState: [
    async ({ browser, testUser }, use) => {
      const workerId = test.info().parallelIndex;
      const authDir = path.resolve(test.info().project.outputDir, '.auth');
      const authFile = path.join(authDir, `worker-${workerId}.json`);

      if (fs.existsSync(authFile)) {
        await use(authFile);
        return;
      }

      fs.mkdirSync(authDir, { recursive: true });

      const page = await browser.newPage({ storageState: undefined });
      await page.goto('https://rahulshettyacademy.com/client');
      await page.locator('#userEmail').fill(testUser.username);
      await page.locator('#userPassword').fill(testUser.password);
      await page.locator("[value='Login']").click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('.card-body').first()).toBeVisible({ timeout: 15_000 });

      await page.context().storageState({ path: authFile });
      await page.close();
      await use(authFile);
    },
    { scope: 'worker' },
  ],
});

export { expect };
