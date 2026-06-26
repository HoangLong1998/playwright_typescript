import {test, expect, Locator} from '@playwright/test';
 class DashboardPage {
    page: any;
    products: Locator;
    addToCart: Locator;
cart: Locator;
ordersHistory: Locator;
    minPriceFilter: Locator;
    maxPriceFilter: Locator;


    constructor(page: any) {
        this.page = page;
        this.products = page.locator(".card-body");
        this.addToCart = page.locator("text=Add To Cart");
        this.cart = page.locator("[routerlink*='cart']");
        this.ordersHistory = page.locator("button[routerlink*='myorders']");
        this.minPriceFilter = page.locator("input[name='minPrice']:not(#mobile-filter input)").first();
        this.maxPriceFilter = page.locator("input[name='maxPrice']:not(#mobile-filter input)").first();

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
    async filterByPriceRange(minPrice: number, maxPrice: number) {
        await this.page.waitForLoadState('networkidle');
        await this.minPriceFilter.fill(minPrice.toString());
        await this.maxPriceFilter.fill(maxPrice.toString());
        await this.page.waitForLoadState('networkidle');
    }
    async selectAndAddFirstProduct() {
        await this.page.waitForLoadState('networkidle');
        await this.page.locator(".card-body").first().waitFor();
        await this.page.locator(".card-body").first().getByRole("button", { name: "Add To Cart" }).click();
    }
    async goToCart() {
        await this.cart.click();
    }
    async goToOrdersHistory() {
        await this.ordersHistory.click();
    }

}
export default DashboardPage;