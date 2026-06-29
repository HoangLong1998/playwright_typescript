import { test, expect } from '../pagefixtures/worker-auth-fixture';
import PageObjectManager from '../pageobjects/PageObjectManager';
import * as allure from 'allure-playwright';

test('@Regression - Filter product by price range and place order', async ({ page }) => {
    const minPrice = 11500;
    const maxPrice = 55000;

    const pageObjectManager = new PageObjectManager(page);
    
    // Step 1: Login
    const loginPage = pageObjectManager.getLoginPage();
    await loginPage.goTo();

    // Step 2: Filter products by price range
    const dashboardPage = pageObjectManager.getDashboardPage();
    await dashboardPage.filterByPriceRange(minPrice, maxPrice);

    // Step 3: Select and add first product to cart
    await dashboardPage.selectAndAddFirstProduct();

    // Step 4: Navigate to cart and verify product
    await dashboardPage.goToCart();
    const cartPage = pageObjectManager.getCartPage();
    // Verify that at least one product is in the cart
    const cartItems = await page.locator('h3').count();
    expect(cartItems).toBeGreaterThan(0);

    // Step 5: Proceed to checkout
    await cartPage.goToCheckout();

    // Step 6: Place order
    const orderReviewPage = pageObjectManager.getOrderReviewPage();
    await orderReviewPage.selectCountry("ind", "India");
    await orderReviewPage.placeOrder();

    // Step 7: Verify order confirmation
    const orderConfirmation = await page.locator(".hero-primary").textContent();
    expect(orderConfirmation).toBe(" Thankyou for the order. ");
    
    console.log("Test completed successfully - Product filtered and order placed");
});
