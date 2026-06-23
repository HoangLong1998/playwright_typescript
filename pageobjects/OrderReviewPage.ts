import { test, expect, Locator, Page } from "@playwright/test";

class OrderReviewPage {
    page: Page;
    countryInput: Locator;
    placeOrderButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.countryInput = page.locator("[placeholder*='Country']");
        this.placeOrderButton = page.locator(".action__submit");

    }

    async selectCountry(countryCode: string, countryName: string) {
        await this.countryInput.pressSequentially(countryCode, { delay: 150 });
        await this.page.locator(".ta-results button").first().waitFor();
        const countryList = await this.page.locator(".ta-results button").count();
        for (let i = 0; i < countryList; ++i) {
            const country = await this.page.locator(".ta-results button").nth(i).textContent();
            if (country?.trim() === countryName) {
                await this.page.locator(".ta-results button").nth(i).click();
                break;
            }

        }


    }
    async placeOrder() {
        await this.placeOrderButton.click();

    }
}
export default OrderReviewPage;