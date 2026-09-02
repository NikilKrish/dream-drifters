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
  await expect(heroMedia.locator('img')).toHaveAttribute('src', '/media/hero-tropical-2160.webp');
  const currentSource = await heroMedia.locator('img').evaluate((image: HTMLImageElement) => image.currentSrc);
  if ((page.viewportSize()?.width ?? 1000) < 700) expect(currentSource).toMatch(/hero-tropical-mobile-1080\.(avif|webp)/);
  else expect(currentSource).toMatch(/hero-tropical-(1080|1440|2160)\.(avif|webp)/);
  if ((page.viewportSize()?.width ?? 1000) < 700) {
    const initialImages = await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => entry.name));
    expect(initialImages.some((name) => /hero-tropical-mobile-1080\.(avif|webp)/.test(name))).toBe(true);
    expect(initialImages.some((name) => name.includes('bali.avif') || name.includes('dubai.avif'))).toBe(false);
  }
  await expect(heroMedia).toHaveAttribute('data-video-state', /poster|loading|playing|paused|blocked|failed/);
  await expect.poll(() => page.locator('.editorial-hero__actions').evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact ?? ''))).toEqual([]);
});

test('itinerary scene restores dismissal focus and sends quote focus to the selected enquiry', async ({ page }) => {
  await page.goto('/');
  const packagesSection = page.locator('#packages');
  await page.locator('.editorial-hero').getByRole('button', { name: 'Explore packages', exact: true }).click();
  await expect.poll(() => packagesSection.evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBeLessThanOrEqual(90);
  if ((page.viewportSize()?.width ?? 1000) >= 1100) await expect(packagesSection).toHaveAttribute('data-depth-ready', '');
  await expect(packagesSection.locator('.depth-packages__deck [aria-live="polite"]')).toHaveText('Maldives Paradise, 1 of 11');
  const card = packagesSection.locator('.depth-card.is-active');
  const itineraryButton = card.locator('.depth-card__actions').getByRole('button', { name: /view itinerary for maldives/i });
  await itineraryButton.click();
  const dialog = page.getByRole('dialog', { name: /paradise, privately/i });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(itineraryButton).toBeFocused();

  await itineraryButton.click();
  await dialog.locator('.package-sheet__close').click();
  await expect(dialog).toBeHidden();
  await expect(itineraryButton).toBeFocused();

  await itineraryButton.click();
  await dialog.locator('.package-sheet__backdrop').click({ position: { x: 2, y: 2 } });
  await expect(dialog).toBeHidden();
  await expect(itineraryButton).toBeFocused();

  await itineraryButton.click();
  await dialog.getByRole('button', { name: /get a quote for maldives/i }).click();
  const contact = page.locator('#contact');
  const packageSelect = contact.getByLabel(/select package/i);
  await expect(packageSelect).toHaveValue('maldives');
  await expect(packageSelect.locator('option:checked')).toHaveText('Maldives Paradise');
  await expect(contact.locator('strong').getByText('Maldives Paradise', { exact: true })).toBeVisible();
  await expect(packageSelect).toBeFocused();
});

test('service prefilling and WhatsApp fallback work inline', async ({ page }) => {
  await page.route('**/api/enquiry', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, stored: true, notified: false }) }));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const width = page.viewportSize()?.width ?? 1000;
  if (width < 700) {
    const corporate = page.locator('.editorial-services__mobile > article').filter({ hasText: 'Corporate Travel' });
    await corporate.getByRole('button', { name: 'Corporate Travel' }).click();
    await corporate.getByRole('button', { name: /get a quote/i }).click();
  } else {
    const services = page.locator('#services');
    await services.scrollIntoViewIfNeeded();
    const activeTitle = services.locator('.editorial-services__capability h3');
    const nextService = services.getByRole('button', { name: 'Next service' });
    for (let index = 0; index < 6 && await activeTitle.textContent() !== 'Corporate Travel'; index += 1) {
      if (!await nextService.isEnabled()) break;
      await nextService.click();
    }
    await expect(activeTitle).toHaveText('Corporate Travel');
    await services.getByRole('button', { name: /get a quote for corporate travel/i }).click();
  }
  await expect(page.getByLabel(/select service/i)).toHaveValue('corporate-travel');
  await expect(page.getByText(/selected for this enquiry/i)).toBeVisible();
  const next = page.getByRole('button', { name: /continue to contact details/i });
  if (await next.isVisible()) await next.click();
  await page.getByLabel(/full name/i).fill('Asha Kumar');
  await page.getByLabel(/mobile number/i).fill('+91 98765 43210');
  await page.getByLabel(/email address/i).fill('asha@example.com');
  await page.getByLabel(/i agree/i).check();
  await page.getByRole('button', { name: /send enquiry/i }).click();
  await expect(page.getByRole('link', { name: /continue in whatsapp/i })).toBeVisible({ timeout: 12_000 });
  await expect(page.getByText(/saved successfully.*email notification is pending and will retry/i)).toBeVisible();
});

test('reduced motion keeps all service content static and disables video', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.locator('#home picture')).toBeVisible();
  const width = page.viewportSize()?.width ?? 1000;
  if (width >= 700) {
    const services = page.locator('#services');
    await expect(services.locator('.editorial-services__media img')).toBeVisible();
    await expect(services.locator('.editorial-services__capability')).toHaveCount(1);
    await expect(services.locator('.editorial-services__capability h3')).toHaveText('Tour Packages');
    await services.getByRole('button', { name: 'Next service' }).click();
    await expect(services.locator('.editorial-services__capability h3')).toHaveText('Flights');
  } else {
    await expect(page.locator('.editorial-services__mobile > article')).toHaveCount(6);
  }
});

test('privacy notice opens in the top layer and closes with Escape', async ({ page }) => {
  await page.goto('/');
  const next = page.getByRole('button', { name: /continue to contact details/i });
  if (await next.isVisible()) await next.click();
  await page.getByRole('button', { name: /read privacy notice/i }).click();
  const dialog = page.getByRole('dialog', { name: 'Privacy notice' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});
