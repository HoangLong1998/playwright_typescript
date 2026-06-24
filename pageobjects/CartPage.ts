import { test, expect, Locator, Page } from "@playwright/test";


//Code for CartPage.ts
class CartPage {
    page: Page;
    checkoutButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = this.page.locator("text=Checkout");
    }
    async verifyProductInCart(productName: string) {
        await this.page.waitForLoadState('networkidle');
        await expect(this.page.locator('h3', { hasText: productName })).toBeVisible();
    }

    async goToCheckout() {
        await this.checkoutButton.click();
    }

}
export default CartPage;