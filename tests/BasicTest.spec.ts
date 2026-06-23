import { test, expect } from '@playwright/test';

test('@UI - Basic test', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  await console.log('Title of the page is: ' + await page.title());
  await expect(page).toHaveTitle('LoginPage Practise | Rahul Shetty Academy');
});

test('@UI - Handle child windows', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const navigationurl = page.locator("[href*='documents-request']");
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

  // Listen for the new page event and click the link to open the new page
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    navigationurl.click()
  ]);
  // Wait for the new page to load
  await newPage.waitForLoadState('domcontentloaded');
  const text = await newPage.locator('.red').textContent();
  if (!text) {
    throw new Error('Text content is null');
  }
  const array = text.split('@');
  const domain = array[1].split(' ')[0];
  //console.log(domain);
  await page.locator('#username').fill(domain);

  //inputValue() is used to get the value of the input field, different from textContent() which is used to get the text content of an element.
  const getusername = await page.locator('#username').inputValue();
  console.log('The username is: ' + getusername);

})

