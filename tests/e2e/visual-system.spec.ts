import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const desktopScenes = [
  { width: 1424, height: 696 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
] as const;

const requiredValidationViewports = [
  ...desktopScenes,
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
] as const;

test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Visual-system geometry runs once in desktop Chrome');
});

test('passes the integrated anchor, overflow, type-floor and axe gate at every required viewport', async ({ page }) => {
  test.setTimeout(90_000);
  for (const viewport of requiredValidationViewports) {
    await test.step(`${viewport.width}x${viewport.height}`, async () => {
      await page.setViewportSize(viewport);
      await page.goto('/#reviews', { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);

      const assurance = page.getByRole('heading', { name: 'Support you can see.' });
      await expect(assurance).toBeVisible();
      await expect.poll(() => page.evaluate((viewportHeight) => {
        const sectionTop = document.querySelector<HTMLElement>('#reviews')!.getBoundingClientRect().top;
        const navBottom = document.querySelector<HTMLElement>('.site-nav__inner')!.getBoundingClientRect().bottom;
        return sectionTop >= navBottom && sectionTop < viewportHeight;
      }, viewport.height)).toBe(true);
      const measurements = await page.evaluate(() => {
        const section = document.querySelector<HTMLElement>('#reviews')!;
        const heading = document.querySelector<HTMLElement>('#reviews-title')!;
        const nav = document.querySelector<HTMLElement>('.site-nav__inner')!;
        const functional = [...document.querySelectorAll<HTMLElement>('.site-menu > a, .button, .kicker, .chapter-index, .field > span, .consent, .depth-card__actions button')]
          .map((element) => Number.parseFloat(getComputedStyle(element).fontSize));
        return {
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          sectionTop: section.getBoundingClientRect().top,
          navBottom: nav.getBoundingClientRect().bottom,
          headingOpacity: getComputedStyle(heading).opacity,
          undersizedFunctionalText: functional.filter((size) => size < 14),
        };
      });

      expect(measurements.overflow).toBeLessThanOrEqual(1);
      expect(measurements.sectionTop).toBeGreaterThanOrEqual(measurements.navBottom);
      expect(measurements.sectionTop).toBeLessThan(viewport.height);
      expect(measurements.headingOpacity).toBe('1');
      expect(measurements.undersizedFunctionalText).toEqual([]);
      await page.goto(`/?axe=${viewport.width}x${viewport.height}`);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(800);
      const axe = await new AxeBuilder({ page }).analyze();
      expect(axe.violations.filter((issue) => ['serious', 'critical'].includes(issue.impact ?? ''))).toEqual([]);
    });
  }
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

test('gives Direction a calm compact frame and relinquishes media control before Services', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const direction = page.locator('.editorial-purpose');
  await direction.scrollIntoViewIfNeeded();
  await expect(direction.getByRole('button', { name: /background video/i })).toBeVisible();

  await page.setViewportSize({ width: 655, height: 729 });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    const section = document.querySelector<HTMLElement>('.editorial-purpose')!;
    window.scrollTo(0, section.offsetTop);
  });
  await page.waitForTimeout(500);

  const resting = await direction.evaluate((section) => {
    const rect = (selector: string) => section.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
    const nav = document.querySelector<HTMLElement>('.site-nav')!.getBoundingClientRect();
    const heading = rect('h2');
    const statements = rect('.editorial-purpose__statements');
    const control = section.querySelector<HTMLElement>('.cinematic-media__play')?.getBoundingClientRect();
    return {
      navBottom: nav.bottom,
      headingTop: heading.top,
      headingHeight: heading.height,
      statementsTop: statements.top,
      statementsBottom: statements.bottom,
      statementsHeight: statements.height,
      controlTop: control?.top ?? null,
      controlBottom: control?.bottom ?? null,
      mediaTransform: getComputedStyle(section.querySelector<HTMLElement>('.editorial-purpose__media')!).transform,
      viewportHeight: innerHeight,
    };
  });

  expect(resting.headingTop).toBeGreaterThanOrEqual(resting.navBottom + 24);
  expect(resting.headingHeight).toBeLessThanOrEqual(136);
  expect(resting.statementsHeight).toBeLessThanOrEqual(260);
  expect(resting.statementsBottom).toBeLessThanOrEqual(resting.viewportHeight - 64);
  if (resting.controlTop !== null && resting.controlBottom !== null) {
    expect(resting.controlTop).toBeLessThanOrEqual(resting.headingTop + 12);
    expect(resting.controlBottom).toBeLessThan(resting.statementsTop - 24);
  }
  expect(resting.mediaTransform).toBe('none');

  await direction.evaluate((section) => {
    const visibleHeight = section.getBoundingClientRect().height * .54;
    window.scrollTo(0, section.offsetTop + section.getBoundingClientRect().height - visibleHeight);
  });
  await page.waitForTimeout(400);

  await expect(direction.getByRole('button', { name: /background video/i })).toHaveCount(0);
  const handoff = await page.evaluate(() => {
    const section = document.querySelector<HTMLElement>('.editorial-purpose')!;
    const services = document.querySelector<HTMLElement>('.editorial-services')!;
    const statements = section.querySelector<HTMLElement>('.editorial-purpose__statements')!;
    return {
      statementsBottom: statements.getBoundingClientRect().bottom,
      servicesTop: services.getBoundingClientRect().top,
    };
  });
  expect(handoff.servicesTop - handoff.statementsBottom).toBeGreaterThanOrEqual(32);
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

test('keeps the adaptive enquiry action and control geometry in view', async ({ page }) => {
  for (const viewport of desktopScenes) {
    await test.step(`${viewport.width}x${viewport.height}`, async () => {
      await page.setViewportSize(viewport);
      await page.goto(`/?viewport=${viewport.width}x${viewport.height}#contact`);
      await page.evaluate(() => document.fonts.ready);

      const form = page.locator('.enquiry-form');
      await expect(form).toHaveAttribute('data-flow', viewport.height < 820 ? 'staged' : 'compact');
      if (viewport.height < 820) await form.getByRole('button', { name: /continue to contact details/i }).click();

      const submit = form.getByRole('button', { name: /send enquiry/i });
      await expect(submit).toBeVisible();
      const geometry = await form.evaluate((element) => {
        const controls = [...element.querySelectorAll<HTMLElement>('.field input, .field select')];
        const labels = [...element.querySelectorAll<HTMLElement>('.field > span')];
        const submitButton = element.querySelector<HTMLElement>('.enquiry-form__submit')!;
        return {
          controlHeights: controls.map((control) => control.getBoundingClientRect().height),
          inputSizes: controls.map((control) => Number.parseFloat(getComputedStyle(control).fontSize)),
          labelSizes: labels.map((label) => Number.parseFloat(getComputedStyle(label).fontSize)),
          submitHeight: submitButton.getBoundingClientRect().height,
          activeStageHeight: submitButton.getBoundingClientRect().bottom - element.getBoundingClientRect().top,
        };
      });

      expect(geometry.controlHeights.length).toBeGreaterThanOrEqual(3);
      expect(geometry.controlHeights.every((height) => Math.abs(height - 48) <= 1)).toBe(true);
      expect(geometry.inputSizes.every((size) => size >= 16)).toBe(true);
      expect(geometry.labelSizes.every((size) => size >= 14)).toBe(true);
      expect(geometry.submitHeight).toBeGreaterThanOrEqual(44);
      expect(geometry.activeStageHeight).toBeLessThanOrEqual(viewport.height);
    });
  }
});

test('keeps selected-package controls and package-sheet copy above their text floors', async ({ page }) => {
  for (const viewport of desktopScenes) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.locator('.site-nav a[href="#packages"]').click();
    await expect.poll(() => page.locator('#packages').evaluate((section) => Math.round(section.getBoundingClientRect().top))).toBeLessThanOrEqual(90);
    const geometry = await page.locator('#packages').evaluate((section) => {
      const card = section.querySelector<HTMLElement>('.depth-card.is-active')!;
      const actions = card.querySelector<HTMLElement>('.depth-card__actions')!;
      const controls = section.querySelector<HTMLElement>('.depth-packages__controls')!;
      return {
        cardCount: section.querySelectorAll('.depth-card').length,
        title: section.querySelector('.depth-card h3')?.textContent,
        sectionTop: section.getBoundingClientRect().top,
        cardBottom: card.getBoundingClientRect().bottom,
        actionsBottom: actions.getBoundingClientRect().bottom,
        controlsBottom: controls.getBoundingClientRect().bottom,
        viewportHeight: innerHeight,
      };
    });
    expect(geometry.cardCount).toBe(11);
    expect(geometry.title).toBe('Paradise, privately');
    expect(geometry.sectionTop).toBeGreaterThanOrEqual(0);
    expect(geometry.cardBottom).toBeLessThanOrEqual(geometry.viewportHeight);
    expect(geometry.actionsBottom).toBeLessThanOrEqual(geometry.viewportHeight);
    expect(geometry.controlsBottom).toBeLessThanOrEqual(geometry.viewportHeight);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const packagesSection = page.locator('#packages');
  await page.locator('.editorial-hero').getByRole('button', { name: 'Explore packages', exact: true }).click();
  await expect(packagesSection.locator('.depth-card')).toHaveCount(11);
  await expect(packagesSection.locator('.depth-packages__deck [aria-live="polite"]')).toHaveText('Maldives Paradise, 1 of 11');
  await packagesSection.locator('.depth-card.is-active').getByRole('button', { name: /view itinerary for maldives/i }).click();

  const sheet = page.getByRole('dialog', { name: /paradise, privately/i });
  await expect(sheet).toBeVisible();
  const sheetCopySizes = await sheet.locator('ul li, ol p').evaluateAll((elements) => elements.map((element) => ({
    text: element.textContent?.trim(),
    size: Number.parseFloat(getComputedStyle(element).fontSize),
  })));
  await sheet.getByRole('button', { name: /get a quote for maldives/i }).click();

  const selectionControl = page.getByRole('button', { name: /clear maldives paradise selection/i });
  await expect(selectionControl).toBeVisible();
  const functionalSizes = await page.evaluate(() => ({
    selectionControl: Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>('.selection-banner button')!).fontSize),
    navigationBrand: Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>('.brand-mark__words')!).fontSize),
  }));

  expect(sheetCopySizes.length).toBeGreaterThan(5);
  expect(sheetCopySizes.filter(({ size }) => size < 16)).toEqual([]);
  expect(functionalSizes.selectionControl).toBeGreaterThanOrEqual(14);
  expect(functionalSizes.navigationBrand).toBeGreaterThanOrEqual(14);
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
