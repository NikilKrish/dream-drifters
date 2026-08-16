import { expect, test } from '@playwright/test';

test('publishes the selected editorial direction without prototype routing', async ({ page }) => {
  await page.goto('/?prototype=1&variant=C');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your journey.Our passion.');
  await expect(page.locator('.proto-switcher')).toHaveCount(0);
  await expect(page.getByText('Leisure and Corporate', { exact: true })).toBeVisible();
  await expect(page.getByText('Travel Insurance', { exact: true })).toHaveCount(0);
  const order = await page.locator('main [data-section]').evaluateAll((sections) => sections.map((section) => section.getAttribute('data-section')));
  expect(order).toEqual(['hero', 'metrics', 'about', 'purpose', 'services', 'trust', 'packages', 'reviews', 'contact']);
});

test('primary navigation lands on the requested cinematic chapter', async ({ page }) => {
  await page.goto('/');
  if ((page.viewportSize()?.width ?? 1000) <= 860) await page.getByRole('button', { name: 'Menu' }).click();
  await page.locator('#site-menu').getByRole('link', { name: 'Services' }).click();
  await expect.poll(() => page.locator('#services-title').evaluate((heading) => Math.round(heading.getBoundingClientRect().top))).toBeLessThan((page.viewportSize()?.height ?? 1000) * .55);
  expect(await page.locator('#services-title').evaluate((heading) => heading.getBoundingClientRect().top)).toBeGreaterThan(0);
});

test('package carousel adapts by breakpoint and supports direct controls', async ({ page }) => {
  await page.goto('/');
  const width = page.viewportSize()?.width ?? 1000;
  const section = page.locator('#packages');
  if (width >= 1100) {
    await expect(section).toHaveClass(/depth-packages--depth/);
  } else if (width >= 700) await expect(section).toHaveClass(/depth-packages--tablet/);
  else await expect(section).toHaveClass(/depth-packages--mobile/);

  await section.evaluate((element) => window.scrollTo(0, (element as HTMLElement).offsetTop - 300));
  if (width >= 1100) await expect.poll(() => page.locator('.depth-card[data-depth-visible]').count()).toBeGreaterThan(0);
  await section.evaluate((element) => window.scrollTo(0, (element as HTMLElement).offsetTop));
  await expect(page.locator('.depth-packages__deck [aria-live="polite"]')).toContainText('package 1 of 6');

  const next = page.getByRole('button', { name: 'Show next package' });
  await next.click();
  await expect(page.locator('.depth-packages__deck [aria-live="polite"]')).toContainText('package 2 of 6');
  await page.locator('.depth-packages__deck').press('ArrowLeft');
  await expect(page.locator('.depth-packages__deck [aria-live="polite"]')).toContainText('package 1 of 6');

  if (width >= 1100) {
    await section.evaluate((element) => window.scrollTo(0, (element as HTMLElement).offsetTop + element.getBoundingClientRect().height * .48));
    await expect.poll(() => page.locator('.depth-card[data-depth-visible="true"]').count()).toBeGreaterThanOrEqual(3);
  }
});

test('capable phones use the mobile hero loop and reduced motion uses posters only', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Phone media policy');
  await page.goto('/');
  const video = page.locator('#home video');
  await expect(video).toHaveCount(1, { timeout: 5_000 });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentSrc)).toContain('discovery-mobile');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.waitForTimeout(700);
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.locator('#home picture')).toBeVisible();
  await expect(page.locator('#home').getByRole('button', { name: 'Play background video' })).toBeVisible();
});

test('all Enhanced B video families are attached and playable in Chrome', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop Chrome media attachment check');
  for (const file of ['discovery.mp4', 'discovery.webm', 'operations.mp4', 'operations.webm', 'travellers.mp4', 'travellers.webm']) {
    const response = await request.get(`/media/${file}`);
    expect(response.ok(), `${file} should be served`).toBe(true);
    expect(response.headers()['content-type']).toContain('video/');
  }

  await page.goto('/');
  await expect.poll(() => page.locator('#home video').evaluate((video: HTMLVideoElement) => video.currentSrc)).toContain('discovery.mp4');
  await page.locator('#services').scrollIntoViewIfNeeded();
  await expect(page.locator('#services video')).toHaveCount(1);
  await expect.poll(() => page.locator('#services video').evaluate((video: HTMLVideoElement) => video.currentSrc)).toContain('operations.mp4');
  await page.locator('#reviews').scrollIntoViewIfNeeded();
  await expect(page.locator('#reviews video')).toHaveCount(1);
  await expect.poll(() => page.locator('#reviews video').evaluate((video: HTMLVideoElement) => video.currentSrc)).toContain('travellers.mp4');
});
