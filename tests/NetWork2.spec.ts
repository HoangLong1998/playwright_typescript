import { test, expect } from '@playwright/test';
import { apiTestUser } from '../test-data/users';

// This file is used to test the network interception in playwright, Request sent from browser -> server, intercepting request > Change request url > Render data on front end
test('@API - Intercept Network Requests', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(apiTestUser.username);
    await page.locator("#userPassword").fill(apiTestUser.password);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    await page.locator("button[routerlink*='myorders']").click();
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*", route => {
        route.continue({
            // * is used to match any order id, we want to intercept all the orders api call and return fake response?
            url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6a17b3e717ee3e78baa275045'
        })
    });
    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");

})
