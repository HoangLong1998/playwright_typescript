import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { testUsers, type TestUser } from '../test-data/users';

type WorkerFixtures = {
  workerStorageState: string;
  testUser: TestUser;
};

export const test = base.extend<{}, WorkerFixtures>({
  storageState: async ({ workerStorageState }, use) => {
    const storageStateFile = workerStorageState;

    await use(storageStateFile);
  },

  testUser: [
    async ({}, use) => {
      const workerId = test.info().parallelIndex;
      const userForCurrentWorker = testUsers[workerId];

      if (!userForCurrentWorker) {
        throw new Error(
          `No test user configured for worker ${workerId}. Add TEST_USER_${workerId}_EMAIL and TEST_USER_${workerId}_PASSWORD, or lower the worker count.`,
        );
      }

      await use(userForCurrentWorker);
    },
    { scope: 'worker' },
  ],

  workerStorageState: [
    async ({ browser, testUser }, use) => {
      const workerId = test.info().parallelIndex;
      const authDir = path.resolve(test.info().project.outputDir, '.auth');
      const storageStateFile = path.join(authDir, `worker-${workerId}.json`);

      if (fs.existsSync(storageStateFile)) {
        await use(storageStateFile);
        return;
      }

      fs.mkdirSync(authDir, { recursive: true });

      const loginPage = await browser.newPage({ storageState: undefined });
      await loginPage.goto('https://rahulshettyacademy.com/client');
      await loginPage.locator('#userEmail').fill(testUser.username);
      await loginPage.locator('#userPassword').fill(testUser.password);
      await loginPage.locator("[value='Login']").click();
      await loginPage.waitForLoadState('networkidle');
      await expect(loginPage.locator('.card-body').first()).toBeVisible({ timeout: 15_000 });

      await loginPage.context().storageState({ path: storageStateFile });
      await loginPage.close();

      await use(storageStateFile);
    },
    { scope: 'worker' },
  ],
});

export { expect };
