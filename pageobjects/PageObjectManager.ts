import LoginPage from '../pageobjects/LoginPage';
import DashboardPage from '../pageobjects/DashboardPage';
import CartPage from '../pageobjects/CartPage';
import OrderReviewPage from '../pageobjects/OrderReviewPage';
import OrderHistoryPage from '../pageobjects/OrderHistoryPage';


class PageObjectManager {
    private page: any
    private loginPage: any;
    private dashboardPage: any;
    private cartPage: any;
    private orderReviewPage: any;
    private orderHistoryPage: any;

    constructor(page: any) {
        this.page = page;
        this.loginPage =  new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.cartPage = new CartPage(this.page);
        this.orderReviewPage = new OrderReviewPage(this.page);
        this.orderHistoryPage = new OrderHistoryPage(this.page);
    }

    getLoginPage() {
        return this.loginPage;
    }

    getDashboardPage() {
        return this.dashboardPage;
    }

    getCartPage() {
        return this.cartPage;
    }

    getOrderReviewPage() {
        return this.orderReviewPage;
    }

    getOrderHistoryPage() {
        return this.orderHistoryPage;
    }
}

export default PageObjectManager;