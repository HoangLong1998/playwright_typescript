import { APIRequestContext } from "@playwright/test";

class APIutils {
    apiContext: APIRequestContext;
    loginPayLoad: any;

    constructor(apiContext: APIRequestContext, loginPayLoad: any) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getAccessToken() {
        let token: string;
        const response = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
            data: this.loginPayLoad
        });
        const responseJson = await response.json();
        return token = responseJson.token;        
    }

    async createOrder(orderPayload: any) {
        let response: any = {};
        response.token = await this.getAccessToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: orderPayload,
            headers: {
                'Authorization': response.token,
                'Content-Type': 'application/json'
            }
        });
        const responseJson = await orderResponse.json();
        const orderId = responseJson.orders[0];
        response.orderId = orderId;
        return response;
    }



}
export { APIutils };