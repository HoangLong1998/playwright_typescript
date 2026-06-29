import { test, expect } from '../pagefixtures/worker-auth-fixture';
import PageObjectManager from '../pageobjects/PageObjectManager';
import LoginTestData from '../LoginTestData.json';
import * as allure from 'allure-playwright';


//Use the test data from TestData.json to run the test with different sets of credentials and products
for(const data of LoginTestData) {
   test(`@Regression - Place order for product ${data.productName}`, async ({ page }) => {
   //js file- Login js, DashboardPage
   const productName = data.productName;
 //  const products = page.locator(".card-body");
   const pageObjectManager = new PageObjectManager(page);
   const loginPage = pageObjectManager.getLoginPage();
   await loginPage.goTo();
   const dashboardPage = pageObjectManager.getDashboardPage();
   await dashboardPage.searchAndAddProductToCart(data.productName);
   await dashboardPage.goToCart();
   const cartPage = pageObjectManager.getCartPage();
   await cartPage.verifyProductInCart(data.productName);
   await cartPage.goToCheckout();
   const orderReviewPage = pageObjectManager.getOrderReviewPage();
   await orderReviewPage.selectCountry("ind","India");
   await orderReviewPage.placeOrder();
   const orderConfirmation = await page.locator(".hero-primary").textContent();
   expect(orderConfirmation).toBe(" Thankyou for the order. ");
   const orderId = (await page.locator("label.ng-star-inserted").textContent())?.replace(/\|/g, "").trim();
   console.log(orderId);
   await dashboardPage.goToOrdersHistory();
   const orderHistoryPage = pageObjectManager.getOrderHistoryPage(); 
   await orderHistoryPage.viewOrderDetailsByOrderId(orderId!);
   await orderHistoryPage.verifyOrderDetails(orderId!);
    })
}


   test('@Regression - Place order with page object flow', async ({ page }) => {
       //js file- Login js, DashboardPage
   const productName = "ZARA COAT 3";
   const products = page.locator(".card-body");

   const pageObjectManager = new PageObjectManager(page);
   const loginPage = pageObjectManager.getLoginPage();
   

   await loginPage.goTo();

   const dashboardPage = pageObjectManager.getDashboardPage();
   await dashboardPage.searchAndAddProductToCart(productName);
   await dashboardPage.goToCart();
   const cartPage = pageObjectManager.getCartPage();
   await cartPage.verifyProductInCart(productName);
   await cartPage.goToCheckout();
   const orderReviewPage = pageObjectManager.getOrderReviewPage();
   await orderReviewPage.selectCountry("ind","India");
   await orderReviewPage.placeOrder();


   const orderConfirmation = await page.locator(".hero-primary").textContent();
   expect(orderConfirmation).toBe(" Thankyou for the order. ");
   const orderId = (await page.locator("label.ng-star-inserted").textContent())?.replace(/\|/g, "").trim();
   console.log(orderId);

   await dashboardPage.goToOrdersHistory();
   const orderHistoryPage = pageObjectManager.getOrderHistoryPage(); 
   await orderHistoryPage.viewOrderDetailsByOrderId(orderId!);
   await orderHistoryPage.verifyOrderDetails(orderId!);
    })



test('@Regression - Fixture Using', async ({ page }) => {
   //js file- Login js, DashboardPage
   const productName = 'iphone 13 pro';
   const products = page.locator(".card-body");
   await page.goto("https://rahulshettyacademy.com/client");
   await page.waitForLoadState('networkidle');
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
   const orderId = (await page.locator("label.ng-star-inserted").textContent())?.replace(/\|/g, "").trim();
   console.log(orderId);
})



/*
=== KIẾN THỨC PLAYWRIGHT & TYPESCRIPT CẦN HỌC ===

**PLAYWRIGHT:**
- .pressSequentially(text): Nhập text chậm (như người dùng)
- .all(): Lấy tất cả elements khớp → trả về array
- .allTextContents(): Lấy text của tất cả elements
- .waitFor(): Chờ element xuất hiện (không tự động)
- .waitForLoadState('networkidle'): Chờ trang load xong
- expect(...).toBeVisible(): Assert element hiển thị
- expect(...).toBe(text): Assert text khớp

**TYPESCRIPT:**
- string.includes(substring): Kiểm tra chứa chuỗi con

**LƯU Ý QUAN TRỌNG:**
- Locator.all() KHÔNG tự chờ → dùng waitFor() trước
- Locator vs Array: locator.all() trả array, dùng array.length
- Template literal: `text ${variable}` (dùng backtick)
- Assertions: expect() để kiểm tra kết quả
- Waits: Playwright có auto-wait, nhưng đôi khi cần manual wait
*/
