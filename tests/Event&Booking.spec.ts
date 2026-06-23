import { test, expect } from '@playwright/test';

test('@Smoke - Event & Booking', async ({ page }) => {
    await page.goto("https://eventhub.rahulshettyacademy.com/");
    await page.getByPlaceholder("you@email.com").fill("hoangtronglong01101998@gmail.com");
    await page.getByPlaceholder("••••••").fill("Long01101998@");
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('button', { name: 'Admin' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('link', { name: 'Manage Events' }).first().click();
    const eventTitle = 'Event ' + Date.now();
    console.log(eventTitle);
    await page.locator('#event-title-input').fill(eventTitle);
    await page.getByPlaceholder("Describe the event…").fill('This is an event description');
    await page.locator('#category').selectOption('Conference');
    await page.getByLabel('city').fill('Hanoi');
    await page.locator('#venue').fill('My Dinh National Stadium');
    await page.getByLabel('Event Date & Time').fill('2027-12-31T10:00');
    await page.locator('#total-seats').fill('100');
    await page.getByLabel('Price ($)').fill('50');
    await page.getByRole('button', { name: '+ Add Event' }).click();
    await page.locator('#nav-events').click();
    const eventCards = page.locator('//article[@data-testid="event-card"]');
    await expect(eventCards.nth(0)).toBeVisible();
    await expect(eventCards.filter({ hasText: eventTitle })).toBeVisible();
    const seatsBeforeBooking = parseInt(await eventCards.filter({ hasText: eventTitle }).locator('span.text-emerald-600').innerText());
    console.log(`Seats before booking: ${seatsBeforeBooking}`);
    await eventCards.filter({ hasText: eventTitle }).locator(('#book-now-btn')).click();
    await page.waitForTimeout(2000);
    await page.getByLabel('Full Name').fill('John Doe');
    await page.getByLabel('Email').fill('john.doe@example.com');
    await page.getByLabel('Phone Number').fill('0977773456');
    await page.getByRole('button', { name: 'Confirm Booking' }).click();

    const bookingRefEl = page.locator('.booking-ref').first();
    await expect(bookingRefEl).toBeVisible();

    const bookingRefText = (await bookingRefEl.innerText()).trim();
    console.log(`Booking Reference: ${bookingRefText}`);

    await page.getByRole('button', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com/bookings');

    const bookingRef = page.locator('#booking-card');
    await expect(bookingRef.nth(0)).toBeVisible();
    await expect(bookingRef.filter({ hasText: bookingRefText })).toBeVisible();
    await expect(bookingRef.filter({ hasText: bookingRefText })).toContainText(eventTitle);

    await page.locator('#nav-events').click();
    // Find the same event by title
    const updatedCard = eventCards.filter({ hasText: eventTitle }).first();
    await expect(updatedCard).toBeVisible();

    // const seatsAfterBooking = parseInt(await updatedCard.getByText('seat').first().innerText());
    // console.log(`Seats after booking: ${seatsAfterBooking}`);

    // // Booked 1 ticket — count must drop by exactly 1
    // expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
}) 