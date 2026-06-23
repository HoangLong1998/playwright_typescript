import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import PageObjectManager from '../../pageobjects/PageObjectManager';

Given('User login to the system successfully with username {string} and password {string}', async function (this: any, username: string, password: string) {
    this.poManager = new PageObjectManager(this.page);
    const loginPage = this.poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.login(username, password);
});


When('User add the product {string} to the cart', async function (productName: string) {
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.searchAndAddProductToCart(productName);
    await this.dashboardPage.goToCart();
});


Then('User verify the product {string} is added to the cart successfully', async function (productName: string) {
    this.cartPage = this.poManager.getCartPage();
    await this.cartPage.verifyProductInCart(productName);
    await this.cartPage.goToCheckout();


});


When('User proceed to checkout and place the order', async function () {
    this.orderReviewPage = this.poManager.getOrderReviewPage();
    await this.orderReviewPage.selectCountry("ind", "India");
    await this.orderReviewPage.placeOrder();
    const orderConfirmation = (await this.page.locator(".hero-primary").textContent())?.trim();
    expect(orderConfirmation).toBe("Thankyou for the order.");

    const orderIdText = await this.page.locator("label.ng-star-inserted").first().textContent();
    this.orderId = orderIdText?.replace(/\|/g, "").trim();
    expect(this.orderId).toBeTruthy();
    console.log(this.orderId);
});


Then('User verify the order is displayed in the order history successfully', async function () {
    this.dashboardpage = this.poManager.getDashboardPage();
    await this.dashboardpage.goToOrdersHistory();
    this.orderHistoryPage = this.poManager.getOrderHistoryPage();
    await this.orderHistoryPage.viewOrderDetailsByOrderId(this.orderId!);
    await this.orderHistoryPage.verifyOrderDetails(this.orderId!);
});