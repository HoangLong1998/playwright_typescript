import { test, expect } from '@playwright/test';

let webContext: any;
test.beforeAll(async ({ browser }) => {
    const email = "anshika@gmail.com";
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill("Iamking@000");
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForLoadState('networkidle');
    //Save the session storage to a file, so that we can use it in other tests
    await context.storageState({ path: 'state.json' });
    webContext = await browser.newContext({ storageState: 'state.json' });

})

test('@API - Full flow to create order in Client Page', async () => {
    const productName = 'ZARA COAT 3';
    //Using the same session storage to create a new page, so that we don't have to login again in this test
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    const products = page.locator(".card-body");

    const titles = await page.locator(".card-body b").allTextContents();
    const productList = await products.all();
    for (let i = 0; i < productList.length; ++i) {
        if (await productList[i].locator("b").textContent() === productName) {
            await productList[i].locator("text=Add To Cart").click();
            break;
        }
    }
    await page.locator("[routerlink*='cart']").click();
    // await page.locator("div li").first().waitFor();
    await expect(page.locator('h3', { hasText: productName })).toBeVisible();
    await page.locator("text=Checkout").click();
    await page.locator("[placeholder*='Country']").pressSequentially("ind", { delay: 150 });
    await page.locator(".ta-results button").first().waitFor();
    const countryList = await page.locator(".ta-results button").all();
    console.log("Total countries: " + countryList.length);
    for (let i = 0; i < countryList.length; ++i) {
        console.log("Test");
        console.log(await countryList[i].textContent());
        if (await countryList[i].textContent() === " India") {
            await countryList[i].click();
            break;
        }
    }
    await page.locator(".action__submit").click();
    const orderConfirmation = await page.locator(".hero-primary").textContent();
    expect(orderConfirmation).toBe(" Thankyou for the order. ");
    const orderId = await page.locator("label.ng-star-inserted").textContent();
    console.log(orderId);


    await page.locator("button[routerlink*='myorders']").click();
    const orderTable = page.locator("tbody");
    if (orderId) {
        await orderTable.locator("tr").first().waitFor();
        const rows = await orderTable.locator("tr").all();
        console.log("Total rows: " + rows.length);
        for (let i = 0; i < rows.length; ++i) {

            const rowOrderId = await rows[i].locator("th").textContent();
            console.log("Row order id: " + rowOrderId);
            if (rowOrderId && orderId.includes(rowOrderId.trim())) {
                console.log("Found the order id: " + rowOrderId);
                await rows[i].locator("button").first().click();
                break;
            }
        }
    }

    const orderDetails = await page.locator(".col-text").textContent();
    console.log(orderDetails);
    if (orderDetails && orderId) {
        expect(orderId.includes(orderDetails)).toBeTruthy();
    }
})

test('@API - Get By Locator', async ({ }) => {
    //js file- Login js, DashboardPage
    const email = "anshika@gmail.com";
    const productName = 'ZARA COAT 3';
    //Using the same session storage to create a new page, so that we don't have to login again in this test
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    const products = page.locator(".card-body");
    const titles = await page.locator(".card-body b").allTextContents();
    await page.locator(".card-body").filter({ hasText: productName }).getByRole("button", { name: "Add To Cart" }).click();
    //await page.getByRole("button", { name: "Cart" }).click();
    await page.getByRole("listitem").getByRole("button", { name: "Cart" }).click();
    await expect(page.locator('h3', { hasText: productName })).toBeVisible();
    await page.getByRole("button", { name: "Checkout" }).click();
    await page.getByPlaceholder("Select Country").pressSequentially("ind", { delay: 150 });
    await page.getByRole("button", { name: "India" }).nth(1).click();
    await page.getByText("Place Order ").click();
    const orderConfirmation = await page.getByText("Thankyou for the order.").textContent();
    expect(orderConfirmation).toBe(" Thankyou for the order. ");
    const orderId = await page.locator("label.ng-star-inserted").textContent();
    console.log(orderId);
})