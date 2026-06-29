import { test as base, expect } from '@playwright/test';
type TestData = {
    username: string;
    password: string;
    productName: string;
};

export const datatest = base.extend<{ testData: TestData }>({
    testData: async ({}, use) => {
        await use({
            username: 'anshika@gmail.com',
            password: 'Iamking@000',
            productName: 'iphone 13 pro',
        });
    },
});
