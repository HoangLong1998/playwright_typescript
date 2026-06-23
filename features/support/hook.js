const { chromium } = require('playwright');
const { Before, After, AfterStep, Status, setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(60 * 1000);

Before(async function () {
    this.browser = await chromium.launch();
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
});

AfterStep( async function ({result}) {
    // This hook will be executed after all steps, and take a screenshot on step failure
    if (result.status === Status.FAILED && this.page) {
      const buffer = await this.page.screenshot({ path: 'screenshot1.png' });
      await this.attach(buffer, 'image/png');
      console.log("Screenshot logged")

    }
  });

After(async function () {
    await this.browser?.close();
}); 
