import { test, expect, Locator, Page } from "@playwright/test";

class loginPage {
    username: Locator;
    password: Locator;
    loginButton: Locator;
    page: Page;

constructor(page: Page) {
    this.page = page;
    this.username = page.locator("#userEmail");
    this.password = page.locator("#userPassword");
    this.loginButton = page.locator("[value='Login']");

}
 async goTo() {
    await this.page.goto("https://rahulshettyacademy.com/client");
    
}

    async login(username: string, password: string) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }
}

export default loginPage;