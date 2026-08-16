import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('preserves the trust-first journey within responsive quality budgets', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /your journey.*our passion/i })).toBeVisible();
  const order = await page.locator('main > section').evaluateAll((sections) => sections.map((section) => section.getAttribute('data-section')));
  expect(order).toEqual(['hero', 'metrics', 'about', 'purpose', 'services', 'trust', 'packages', 'reviews', 'contact']);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  expect(await page.locator('.editorial-hero h1 > span').count()).toBe(2);
  expect(await page.locator('.kicker').count()).toBeLessThanOrEqual(3);
  expect(await page.locator('h1 br, h2 br, h3 br').count()).toBe(0);
  expect(await page.locator('.package-card__top, .chapter-cue').count()).toBe(0);
  expect(await page.locator('body').innerText()).not.toMatch(/[—–]/);

  const width = page.viewportSize()?.width ?? 1000;
  if (width === 390) expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(11_200);
  const serviceHeight = await page.locator('#services').evaluate((section) => section.getBoundingClientRect().height);
  if (width < 700) expect(serviceHeight).toBeLessThan(1_600);
  else if (width < 1100) expect(serviceHeight).toBeGreaterThan((page.viewportSize()?.height ?? 1000) * 2.3);
  else expect(serviceHeight).toBeGreaterThan((page.viewportSize()?.height ?? 1000) * 3.5);
  await page.locator('.editorial-hero').getByRole('button', { name: 'Explore packages', exact: true }).click();
  await expect.poll(() => page.locator('#packages-title').evaluate((heading) => Math.round(heading.getBoundingClientRect().top))).toBeLessThan((page.viewportSize()?.height ?? 1000) * .55);
  expect(await page.locator('#packages-title').evaluate((heading) => heading.getBoundingClientRect().top)).toBeGreaterThan(0);
  if (width <= 860) {
    const trigger = page.getByRole('button', { name: 'Menu' });
    await trigger.click();
    await expect(page.locator('#site-menu').getByRole('link', { name: 'About' })).toBeFocused();
    expect(await page.locator('main').evaluate((element) => element.inert)).toBe(true);
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#site-menu').getByRole('button', { name: 'Get a quote' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  }
});

test('has no serious accessibility violations and selects the right hero art', async ({ page }) => {
  test.setTimeout(45_000);
  await page.goto('/');
  const heroMedia = page.locator('.editorial-hero__media');
  await expect(heroMedia.locator('img')).toHaveAttribute('src', '/media/hero.webp');
  const currentSource = await heroMedia.locator('img').evaluate((image: HTMLImageElement) => image.currentSrc);
  if ((page.viewportSize()?.width ?? 1000) < 700) expect(currentSource).toMatch(/hero-mobile\.(avif|webp)/);
  else expect(currentSource).toMatch(/hero\.(avif|webp)/);
  if ((page.viewportSize()?.width ?? 1000) < 700) {
    const initialImages = await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => entry.name));
    expect(initialImages.some((name) => /hero-mobile\.(avif|webp)/.test(name))).toBe(true);
    expect(initialImages.some((name) => name.includes('bali.avif') || name.includes('dubai.avif'))).toBe(false);
  }
  await expect(heroMedia).toHaveAttribute('data-video-state', /poster|loading|playing|paused|blocked|failed/);
  await expect.poll(() => page.locator('.editorial-hero__actions').evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact ?? ''))).toEqual([]);
});

test('itinerary scene supports Escape and package-to-form prefilling', async ({ page }) => {
  await page.goto('/');
  const packagesSection = page.locator('#packages');
  await packagesSection.evaluate((section) => window.scrollTo(0, (section as HTMLElement).offsetTop - 300));
  if ((page.viewportSize()?.width ?? 1000) >= 1100) await expect.poll(() => page.locator('.depth-card[data-depth-visible]').count()).toBeGreaterThan(0);
  await packagesSection.evaluate((section) => window.scrollTo(0, (section as HTMLElement).offsetTop));
  await expect(page.locator('.depth-packages__deck [aria-live="polite"]')).toContainText('package 1 of 6');
  const card = page.locator('.depth-card.is-active');
  await card.locator('.depth-card__actions').getByRole('button', { name: /view itinerary for maldives/i }).click();
  const dialog = page.getByRole('dialog', { name: /paradise, privately/i });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await card.getByRole('button', { name: /view itinerary for maldives/i }).click();
  await dialog.getByRole('button', { name: /get a quote for maldives/i }).click();
  await expect(page.getByLabel(/select package/i)).toHaveValue('maldives');
  await expect(page.getByText(/maldives paradise/i).first()).toBeVisible();
});

test('service prefilling and WhatsApp fallback work inline', async ({ page }) => {
  await page.route('**/api/enquiry', (route) => route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ ok: false, fallback: 'whatsapp' }) }));
  await page.goto('/');
  const width = page.viewportSize()?.width ?? 1000;
  if (width < 700) {
    const corporate = page.locator('.editorial-services__mobile > article').filter({ hasText: 'Corporate Travel' });
    await corporate.getByRole('button', { name: 'Corporate Travel' }).click();
    await corporate.getByRole('button', { name: /get a quote/i }).click();
  } else {
    const services = page.locator('#services');
    await services.evaluate((section) => window.scrollTo(0, (section as HTMLElement).offsetTop - 300));
    await page.waitForTimeout(600);
    await services.evaluate((section) => window.scrollTo(0, (section as HTMLElement).offsetTop + section.getBoundingClientRect().height - innerHeight * 1.05));
    await expect(page.locator('.editorial-services__desktop .editorial-service-card h3')).toHaveText('Corporate Travel');
    await page.locator('.editorial-services__desktop').getByRole('button', { name: /get a quote for corporate travel/i }).click();
  }
  await expect(page.getByLabel(/select service/i)).toHaveValue('corporate-travel');
  await expect(page.getByText(/selected for this enquiry/i)).toBeVisible();
  await page.getByLabel(/full name/i).fill('Asha Kumar');
  await page.getByLabel(/mobile number/i).fill('+91 98765 43210');
  await page.getByLabel(/email address/i).fill('asha@example.com');
  await page.getByLabel(/i agree/i).check();
  await page.getByRole('button', { name: /send enquiry/i }).click();
  await expect(page.getByRole('link', { name: /continue in whatsapp/i })).toBeVisible({ timeout: 12_000 });
  await expect(page.getByText(/background notification was unavailable/i)).toBeVisible();
});

test('reduced motion keeps all service content static and disables video', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.locator('#home').getByRole('button', { name: 'Play background video' })).toBeVisible();
  const width = page.viewportSize()?.width ?? 1000;
  if (width >= 700) {
    await expect(page.locator('.editorial-services__static')).toBeVisible();
    await expect(page.locator('.editorial-services__static .editorial-service-card')).toHaveCount(6);
  } else {
    await expect(page.locator('.editorial-services__mobile > article')).toHaveCount(6);
  }
});

test('privacy notice opens in the top layer and closes with Escape', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /read privacy notice/i }).click();
  const dialog = page.getByRole('dialog', { name: 'Privacy notice' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});
