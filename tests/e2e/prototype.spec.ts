import { expect, test } from '@playwright/test';

const variants = ['A', 'B', 'C'] as const;
const expectedOrder = ['hero', 'metrics', 'about', 'purpose', 'services', 'trust', 'packages', 'reviews', 'contact'];

for (const variant of variants) {
  test(`prototype ${variant} preserves the corrected full-page journey`, async ({ page }) => {
    await page.goto(`/?prototype=1&variant=${variant}`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Your journey.Our passion.');
    const order = await page.locator('main [data-section]').evaluateAll((sections) => sections.map((section) => section.getAttribute('data-section')));
    expect(order).toEqual(expectedOrder);
    await expect(page.getByText('Leisure and Corporate', { exact: true })).toBeVisible();
    if (variant === 'A') await page.getByRole('tab', { name: 'MICE' }).click();
    await expect(page.getByText('Meeting Incentive, Conference Event (MICE)', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Travel Insurance', { exact: true })).toHaveCount(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('package and service choices carry context into the in-memory enquiry', async ({ page }) => {
  await page.goto('/?prototype=1&variant=C');
  const flights = page.locator('.proto-guided-capabilities article').filter({ hasText: 'Flights' });
  await flights.locator('button').first().click();
  await flights.getByRole('button', { name: 'Get a quote' }).click();
  await expect(page.locator('.proto-selection')).toContainText('Flights');
  await page.locator('.proto-package-card').first().getByRole('button', { name: 'Get a quote' }).click();
  await expect(page.locator('.proto-selection')).toContainText('Maldives Paradise');
});

test('capable phones mount the budgeted hero loop after the poster', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Phone policy check');
  await page.goto('/?prototype=1&variant=A');
  const video = page.locator('#home video');
  await expect(video).toHaveCount(1, { timeout: 5_000 });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentSrc)).toContain('discovery-mobile');
});

test('reduced motion retains the poster and never mounts video', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Phone policy check');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?prototype=1&variant=A');
  await page.waitForTimeout(700);
  await expect(page.locator('#home video')).toHaveCount(0);
  await expect(page.locator('#home picture')).toBeVisible();
});
