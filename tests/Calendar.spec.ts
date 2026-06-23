import { test, expect } from '@playwright/test';

test("@UI - Calendar validations", async ({ page }) => {

    const monthNumber = "6";
    const date = "15";
    const year = "2027";
    const expectedList = [monthNumber, date, year];

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__decade-view__years__year").nth(1).waitFor();
    await page.locator(".react-calendar__decade-view__years button")
        .filter({ hasText: year })
        .click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber) - 1).click();
    await page.locator("//abbr[text()='"+date+"']").nth(0).click();
    await page.waitForTimeout(2000);
    //console.log(await page.locator(".react-date-picker__inputGroup").locator("input").getAttribute("value"));

    const inputs = page.locator('.react-date-picker__inputGroup__input')

    for (let i = 0; i < expectedList.length; i++) {
        const value = await inputs.nth(i).inputValue();
        expect(value).toEqual(expectedList[i]);

    }
})