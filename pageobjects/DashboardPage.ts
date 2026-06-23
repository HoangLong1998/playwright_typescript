import {test, expect, Locator} from '@playwright/test';
 class DashboardPage {
    page: any;
    products: Locator;
    addToCart: Locator;
cart: Locator;
ordersHistory: Locator;


    constructor(page: any) {
        this.page = page;
        this.products = page.locator(".card-body");
        this.addToCart = page.locator("text=Add To Cart");
        this.cart = page.locator("[routerlink*='cart']");
        this.ordersHistory = page.locator("button[routerlink*='myorders']");


    }
    async searchAndAddProductToCart(productName: string) {
        await this.page.waitForLoadState('networkidle');
        await this.page.locator(".card-body b").first().waitFor();
        const titles = await this.page.locator(".card-body b").allTextContents();
        const productList = await this.products.all();
        for (let i = 0; i < productList.length; ++i) {
            if (await productList[i].locator("b").textContent() === productName) {
                await this.products.nth(i).getByRole("button", { name: "Add To Cart" }).click();
                break;
            }
        }
    }
    async goToCart() {
        await this.cart.click();
    }
    async goToOrdersHistory() {
        await this.ordersHistory.click();
    }

}
export default DashboardPage;