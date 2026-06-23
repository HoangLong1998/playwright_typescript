import { test, expect, request } from '@playwright/test';
import { APIutils } from '../utils/ApiUtils'

const loginPayLoad = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" }
const orderPayLoad = { orders: [{ country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68" }] };

let response: any = {};

test.beforeAll(async () => {
    console.log("This will run before all tests");
    const apiContext = await request.newContext();
    const apiUtils = new APIutils(apiContext, loginPayLoad);

    response = await apiUtils.createOrder(orderPayLoad);
    console.log("Token: " + response.token);
    console.log("Order ID: " + response.orderId);


});

test('@API to login and order', async ({ page }) => {
    await page.addInitScript(token => {
        window.localStorage.setItem('token', token);
    }, response.token);
    await page.goto("https://rahulshettyacademy.com/client");
    await page.waitForLoadState('networkidle');
    await page.locator("button[routerlink*='myorders']").click();
    const orderTable = page.locator("tbody");
    if (response.orderId) {
        await orderTable.locator("tr").first().waitFor();
        const rows = await orderTable.locator("tr").all();
        console.log("Total rows: " + rows.length);
        for (let i = 0; i < rows.length; ++i) {

            const rowOrderId = await rows[i].locator("th").textContent();
            console.log("Row order id: " + rowOrderId);
            if (rowOrderId && response.orderId.includes(rowOrderId.trim())) {
                console.log("Found the order id: " + rowOrderId);
                await rows[i].locator("button").first().click();
                break;
            }
        }
    }

    const orderDetails = await page.locator(".col-text").textContent();
    console.log(orderDetails);
    if (orderDetails && response.orderId) {
        expect(response.orderId.includes(orderDetails)).toBeTruthy();
    }
})
