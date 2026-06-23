import { test, expect, Locator, Page } from "@playwright/test";

class OrderHistoryPage {
    page: Page;
    orderTable: Locator;



    constructor(page: Page) {
        this.page = page;   
        this.orderTable = page.locator("tbody");
    }

    async viewOrderDetailsByOrderId(orderId: string) {
        if (!orderId) {
            throw new Error('Order ID is missing when trying to view order details.');
        }

        await this.orderTable.locator("tr").first().waitFor();
        const rows = await this.orderTable.locator("tr").all();
        for (let i = 0; i < rows.length; ++i) {
            const rowOrderId = (await rows[i].locator("th").textContent())?.trim();
            if (rowOrderId === orderId) {
                await rows[i].locator("button").first().click();
                break;
            }
        }
    }

    async verifyOrderDetails(orderId: string) {
        const orderDetails = (await this.page.locator(".col-text").textContent())?.trim();
        expect(orderDetails).toContain(orderId);
    }
}
export default OrderHistoryPage;