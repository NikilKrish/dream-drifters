import { expect, test } from '@playwright/test';

const desktopScenes = [
  { width: 1424, height: 696 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
] as const;

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Visual-system geometry runs once in desktop Chrome');
});

test('keeps the hero and About compositions within each desktop viewport', async ({ page }) => {
  for (const viewport of desktopScenes) {
    await test.step(`${viewport.width}x${viewport.height}`, async () => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);

      const geometry = await page.evaluate(() => {
        const hero = document.querySelector<HTMLElement>('.editorial-hero')!;
        const title = document.querySelector<HTMLElement>('.editorial-hero__content h1')!;
        const finalLine = title.lastElementChild as HTMLElement;
        const lead = document.querySelector<HTMLElement>('.editorial-hero__lead')!;
        const about = document.querySelector<HTMLElement>('.editorial-about')!;
        const aboutMedia = document.querySelector<HTMLElement>('.editorial-about__media')!;
        const aboutTitle = document.querySelector<HTMLElement>('.editorial-about__copy h2')!;
        const titleStyle = getComputedStyle(title);
        return {
          heroHeight: hero.getBoundingClientRect().height,
          heroScrollHeight: hero.scrollHeight,
          heroFontSize: Number.parseFloat(titleStyle.fontSize),
          heroLineHeight: Number.parseFloat(titleStyle.lineHeight),
          heroLetterSpacing: Number.parseFloat(titleStyle.letterSpacing),
          leadClearance: lead.getBoundingClientRect().top - finalLine.getBoundingClientRect().bottom,
          aboutHeight: about.getBoundingClientRect().height,
          aboutMediaHeight: aboutMedia.getBoundingClientRect().height,
          aboutTitleSize: Number.parseFloat(getComputedStyle(aboutTitle).fontSize),
        };
      });

      expect.soft(geometry.heroHeight).toBeCloseTo(viewport.height, 0);
      expect.soft(geometry.heroScrollHeight).toBeLessThanOrEqual(viewport.height + 1);
      expect.soft(geometry.heroFontSize).toBeGreaterThanOrEqual(96);
      expect.soft(geometry.heroFontSize).toBeLessThanOrEqual(144);
      if (viewport.height <= 800) expect.soft(geometry.heroFontSize).toBeLessThanOrEqual(136);
      expect.soft(geometry.heroLineHeight / geometry.heroFontSize).toBeGreaterThanOrEqual(.85);
      expect.soft(geometry.heroLineHeight / geometry.heroFontSize).toBeLessThanOrEqual(.89);
      expect.soft(geometry.heroLetterSpacing / geometry.heroFontSize).toBeGreaterThanOrEqual(-.04);
      expect.soft(geometry.leadClearance).toBeGreaterThanOrEqual(12);
      expect.soft(geometry.aboutHeight).toBeLessThanOrEqual(viewport.height);
      expect.soft(geometry.aboutMediaHeight).toBeGreaterThanOrEqual(420);
      expect.soft(geometry.aboutMediaHeight).toBeLessThanOrEqual(620);
      if (viewport.height <= 800) {
        expect.soft(geometry.aboutTitleSize).toBeGreaterThanOrEqual(72);
        expect.soft(geometry.aboutTitleSize).toBeLessThanOrEqual(80);
      }
    });
  }
});

test('keeps the 768px About chapter in a stacked editorial flow', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);

  const layout = await page.evaluate(() => {
    const grid = document.querySelector<HTMLElement>('.editorial-about__grid')!;
    const copy = document.querySelector<HTMLElement>('.editorial-about__copy')!;
    const media = document.querySelector<HTMLElement>('.editorial-about__media')!;
    const gridRect = grid.getBoundingClientRect();
    const copyRect = copy.getBoundingClientRect();
    const mediaRect = media.getBoundingClientRect();
    return {
      copyWidthRatio: copyRect.width / gridRect.width,
      verticalGap: mediaRect.top - copyRect.bottom,
    };
  });

  expect(layout.copyWidthRatio).toBeGreaterThan(.9);
  expect(layout.verticalGap).toBeGreaterThanOrEqual(24);
});

test('keeps functional text at 14px and form text at 16px', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const sizes = await page.evaluate(() => {
    const functionalSelector = [
      '.site-menu > a', '.site-menu .button', '.kicker', '.chapter-index',
      '.editorial-hero__edition', '.editorial-proof__dock p',
      '.editorial-service-card > p:first-child', '.editorial-service-card li',
      '.depth-card__body > p', '.depth-card__body small', '.depth-card__body > strong',
      '.depth-card__actions button', '.depth-packages__controls span', '.depth-packages__note',
      '.enquiry-form__heading small', '.selection-banner span', '.selection-banner button',
      '.interest-picker legend', '.interest-picker span', '.field > span', '.consent',
      '.footer h2', '.footer__legal',
    ].join(',');
    const functional = [...document.querySelectorAll<HTMLElement>(functionalSelector)].map((element) => ({
      selector: element.className || element.tagName,
      size: Number.parseFloat(getComputedStyle(element).fontSize),
    }));
    const form = [...document.querySelectorAll<HTMLElement>('.field input, .field select, .field textarea')].map((element) => ({
      selector: element.tagName,
      size: Number.parseFloat(getComputedStyle(element).fontSize),
    }));
    return { functional, form };
  });

  expect(sizes.functional.length).toBeGreaterThan(20);
  expect(sizes.functional.filter(({ size }) => size < 14)).toEqual([]);
  expect(sizes.form.length).toBeGreaterThan(3);
  expect(sizes.form.filter(({ size }) => size < 16)).toEqual([]);
});

test('reveals a direct anchor immediately and keeps default content visible without enhancement', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.addInitScript(() => {
    class DormantIntersectionObserver {
      readonly root = null;
      readonly rootMargin = '0px';
      readonly thresholds = [0];
      disconnect() {}
      observe() {}
      takeRecords() { return []; }
      unobserve() {}
    }
    Object.defineProperty(window, 'IntersectionObserver', { value: DormantIntersectionObserver, configurable: true });
  });
  await page.goto('/#about');

  const anchoredCopy = page.locator('#about .content-reveal').first();
  await expect.poll(() => anchoredCopy.evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
  const anchorPosition = await page.evaluate(() => ({
    sectionTop: document.querySelector<HTMLElement>('#about')!.getBoundingClientRect().top,
    navBottom: document.querySelector<HTMLElement>('.site-nav__inner')!.getBoundingClientRect().bottom,
  }));
  expect(anchorPosition.sectionTop).toBeGreaterThanOrEqual(anchorPosition.navBottom);

  const defaultOpacity = await page.evaluate(() => {
    document.documentElement.classList.remove('editorial-motion-ready');
    const unrevealed = document.querySelector<HTMLElement>('#why-us .content-reveal')!;
    return getComputedStyle(unrevealed).opacity;
  });
  expect(defaultOpacity).toBe('1');
});

test('does not hide reveal content when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    class DormantIntersectionObserver {
      readonly root = null;
      readonly rootMargin = '0px';
      readonly thresholds = [0];
      disconnect() {}
      observe() {}
      takeRecords() { return []; }
      unobserve() {}
    }
    Object.defineProperty(window, 'IntersectionObserver', { value: DormantIntersectionObserver, configurable: true });
  });
  await page.goto('/');

  const opacity = await page.locator('#why-us .content-reveal').first().evaluate((element) => getComputedStyle(element).opacity);
  expect(opacity).toBe('1');
});
