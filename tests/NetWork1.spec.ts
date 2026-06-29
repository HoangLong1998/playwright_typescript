import { test, expect, request } from '@playwright/test';
import { APIutils } from '../utils/ApiUtils'
import { apiTestUser } from '../test-data/users';

const loginPayLoad = { userEmail: apiTestUser.username, userPassword: apiTestUser.password }
const orderPayLoad = { orders: [{ country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68" }] };

let response: any = {};
//Fake response to verify the frontend showing, we will intercept the API call and return this fake response, so that we can verify the frontend showing when there is no orders
const fakePayLoadOrders = { data: [], message: "No Orders" };

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIutils(apiContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);

});

test('@API -Intercept Network Responses', async ({ page }) => {
    await page.addInitScript(token => {
        window.localStorage.setItem('token', token);
    }, response.token);
    await page.goto("https://rahulshettyacademy.com/client");
    await page.waitForLoadState('networkidle');


    page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*", async route => {
        // Note: * is used to match any customer id (UserID) , we want to intercept all the orders api call and return fake response
        const response = await page.request.fetch(route.request());
        const body = JSON.stringify(fakePayLoadOrders);
        console.log("Fake response body: " + body);
        await route.fulfill({
            response,
            body
        });
        //intercepting response -APi response-> { playwright fakeresponse}->browser->render data on front end
    });


    await page.locator("button[routerlink*='myorders']").click();
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    console.log(await page.locator(".mt-4").textContent());

})
