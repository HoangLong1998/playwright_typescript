import { test, expect } from '../pagefixtures/worker-auth-fixture';

test('@Regression - MCP full flow creates and verifies two orders', async ({ page }) => {
  test.setTimeout(60_000);

  const productNames = ['ADIDAS ORIGINAL', 'ZARA COAT 3'];

  await page.goto('https://rahulshettyacademy.com/client');
  await page.waitForLoadState('networkidle');

  const cartButton = page.getByRole('listitem').getByRole('button', { name: /Cart/ });

  for (const productName of productNames) {
    await page
      .locator('.card-body')
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add To Cart' })
      .click();
    await expect(cartButton).toContainText(String(productNames.indexOf(productName) + 1), {
      timeout: 15_000,
    });
  }

  await cartButton.click();

  for (const productName of productNames) {
    await expect(page.locator('h3', { hasText: productName })).toBeVisible();
  }

  await page.getByRole('button', { name: 'Checkout' }).click();

  await page.getByPlaceholder('Select Country').pressSequentially('ind', { delay: 150 });
  await page.locator('.ta-results button').filter({ hasText: /^ India$/ }).click();
  await page.locator('.action__submit').click();

  await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');

  const orderIds = (await page.locator('label.ng-star-inserted').allTextContents())
    .map((orderId) => orderId.replace(/\|/g, '').trim())
    .filter(Boolean);

  expect(orderIds).toHaveLength(productNames.length);

  for (const productName of productNames) {
    await expect(page.getByText(productName, { exact: true })).toBeVisible();
  }

  await page.getByRole('button', { name: /ORDERS/ }).click();
  const orderRows = page.locator('tbody tr');
  await expect(orderRows.first()).toBeVisible();

  const placedOrderRows = [];

  for (const orderId of orderIds) {
    const orderRow = orderRows.filter({ has: page.locator('th', { hasText: orderId }) });
    await expect(orderRow).toBeVisible();
    placedOrderRows.push(await orderRow.textContent());
  }

  for (const productName of productNames) {
    expect(placedOrderRows.some((rowText) => rowText?.includes(productName))).toBeTruthy();
  }
});
