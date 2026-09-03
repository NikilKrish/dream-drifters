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

test('services use one active desktop capability and one open mobile accordion', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.locator('#services').scrollIntoViewIfNeeded();

  if (['compact-phone', 'mobile', 'webkit-mobile'].includes(testInfo.project.name)) {
    const toggles = page.locator('.editorial-services__mobile h3 button');
    await expect(toggles.nth(0)).toHaveAttribute('aria-expanded', 'false');
    await toggles.nth(0).click();
    await expect(toggles.nth(0)).toHaveAttribute('aria-expanded', 'true');
    await toggles.nth(1).click();
    await expect(toggles.nth(0)).toHaveAttribute('aria-expanded', 'false');
    await expect(toggles.nth(1)).toHaveAttribute('aria-expanded', 'true');
    const collapsedPanel = page.locator('#capability-tour-packages');
    const collapsedCta = collapsedPanel.locator('.text-action');
    await expect(collapsedPanel).toHaveAttribute('hidden', '');
    await expect(collapsedCta).toBeHidden();
    expect(await collapsedCta.evaluate((button) => {
      button.focus();
      return document.activeElement === button;
    })).toBe(false);
    return;
  }

  const activeTitle = page.locator('.editorial-services__capability h3');
  const initialTitle = await activeTitle.textContent();
  const next = page.getByRole('button', { name: 'Next service' });
  const control = await next.isEnabled() ? next : page.getByRole('button', { name: 'Previous service' });
  await control.click();
  await expect(activeTitle).not.toHaveText(initialTitle ?? '');
  await expect(page.locator('.editorial-services__capability')).toHaveCount(1);
});

test('navigation surface engages during the first deliberate scroll with hysteresis', async ({ page }) => {
  await page.goto('/');
  const navigation = page.locator('.site-nav');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(navigation).not.toHaveClass(/is-scrolled/);
  await page.evaluate(() => window.scrollTo(0, 8));
  await expect(navigation).not.toHaveClass(/is-scrolled/);
  await page.evaluate(() => window.scrollTo(0, 24));
  await expect(navigation).toHaveClass(/is-scrolled/);
  await page.evaluate(() => window.scrollTo(0, 16));
  await expect(navigation).toHaveClass(/is-scrolled/);
  await page.evaluate(() => window.scrollTo(0, 8));
  await expect(navigation).not.toHaveClass(/is-scrolled/);

  await page.goto('/#about');
  await expect(navigation).toHaveClass(/is-scrolled/);
  await page.reload();
  await expect(navigation).toHaveClass(/is-scrolled/);
});

test('services reduced motion keeps a static, non-pinned capability stage', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop reduced-motion service fallback');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const section = page.locator('#services');
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator('video')).toHaveCount(0);
  await expect(section.locator('.editorial-services__media img')).toBeVisible();
  await expect(section.locator('.editorial-services__capability h3')).toHaveText('Tour Packages');
  await page.getByRole('button', { name: 'Next service' }).click();
  await expect(section.locator('.editorial-services__capability h3')).toHaveText('Flights');
});

test('package carousel restores desktop depth motion from a complete rest state', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#packages');
  await page.locator('.editorial-hero').getByRole('button', { name: 'Explore packages', exact: true }).click();
  await expect.poll(() => section.evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBeLessThanOrEqual(90);
  const width = page.viewportSize()?.width ?? 1000;
  const deck = section.getByRole('region', { name: 'Travel packages' });
  const liveStatus = deck.locator('[aria-live="polite"]');
  const activeCard = section.locator('.depth-card.is-active');
  const viewportHeight = page.viewportSize()?.height ?? 1000;

  await expect(activeCard).toHaveCount(1);
  await expect(activeCard).toHaveAttribute('aria-current', 'true');
  await expect(activeCard.getByRole('heading', { level: 3 })).toHaveText('Paradise, privately');
  await expect(liveStatus).toHaveText('Maldives Paradise, 1 of 11');
  await expect(activeCard.locator('img')).toHaveAttribute('src', '/media/maldives.webp');
  await expect(activeCard.locator('source[type="image/avif"]')).toHaveAttribute('srcset', '/media/maldives-960.avif 960w, /media/maldives-1920.avif 1920w, /media/maldives.avif 3840w');
  await expect(activeCard.locator('source[type="image/webp"]')).toHaveAttribute('srcset', '/media/maldives-960.webp 960w, /media/maldives-1920.webp 1920w, /media/maldives.webp 3840w');
  await expect(activeCard.getByText('Request current quote', { exact: true })).toHaveCount(1);
  await expect(section.getByText('Request current quote', { exact: true })).toHaveCount(11);
  await expect(section.getByText('US $357', { exact: false })).toHaveCount(0);
  await expect(section.getByText('$1,513.00', { exact: false })).toHaveCount(0);
  await expect(section.getByText('$2,185 PP', { exact: false })).toHaveCount(0);
  const actionSizes = await activeCard.locator('.depth-card__actions button').evaluateAll((buttons) => buttons.map((button) => ({ width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height })));
  expect(Math.abs(actionSizes[0].width - actionSizes[1].width)).toBeLessThan(1);
  expect(actionSizes.every(({ height }) => height >= 44)).toBe(true);

  if (width >= 1100) {
    await expect(section).toHaveClass(/depth-packages--depth/);
    await expect(section.locator('.depth-card')).toHaveCount(11);
    await expect(section).not.toHaveAttribute('data-motion-engaged');
    await expect(section.locator('.depth-packages__destinations')).toHaveCount(0);
    expect(await section.locator('.depth-packages__stage').evaluate((stage) => getComputedStyle(stage).position)).toBe('sticky');
    expect(await section.evaluate((element) => element.getBoundingClientRect().height)).toBeCloseTo(viewportHeight * 5.4, 0);
    const restGeometry = await activeCard.evaluate((card) => {
      const actions = card.querySelector<HTMLElement>('.depth-card__actions')!;
      const rect = card.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, actionsBottom: actions.getBoundingClientRect().bottom, opacity: getComputedStyle(card).opacity };
    });
    expect(restGeometry.top).toBeGreaterThanOrEqual(80);
    expect(restGeometry.bottom).toBeLessThanOrEqual(viewportHeight);
    expect(restGeometry.actionsBottom).toBeLessThanOrEqual(viewportHeight);
    expect(restGeometry.opacity).toBe('1');

    await expect(section).toHaveAttribute('data-depth-ready', '');
    await activeCard.getByRole('button', { name: 'Open Maldives Paradise itinerary' }).focus();
    await page.mouse.wheel(0, 650);
    await page.waitForTimeout(750);
    await expect(section).toHaveAttribute('data-motion-engaged', '');
    await expect(liveStatus).toHaveText('Japan Cultural Journey, 2 of 11');
    await expect(activeCard).toHaveAttribute('aria-current', 'true');
    await expect(deck).toBeFocused();
    expect(await section.locator('.depth-card').evaluateAll((cards) => cards.filter((card) => card.getAttribute('data-depth-visible') === 'true').length)).toBeLessThanOrEqual(2);
    await deck.press('Home');
    await expect(liveStatus).toHaveText('Maldives Paradise, 1 of 11');
  } else {
    await expect(section).toHaveClass(/depth-packages--controlled/);
    await expect(section.locator('.depth-card')).toHaveCount(1);
    await expect(section.locator('.depth-packages__destinations')).toHaveCount(0);
    expect(await section.evaluate((element) => element.getBoundingClientRect().height)).toBeLessThan(viewportHeight * 2.2);
    const responsiveGeometry = await activeCard.evaluate((card) => {
      const actions = [...card.querySelectorAll<HTMLElement>('.depth-card__actions button')];
      const actionRects = actions.map((action) => action.getBoundingClientRect());
      return {
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        actionCount: actionRects.length,
        sameRow: actionRects.length === 2 && Math.abs(actionRects[0].top - actionRects[1].top) < 1,
        stacked: actionRects.length === 2 && actionRects[1].top >= actionRects[0].bottom,
        labelsUnwrapped: actions.every((action) => action.scrollWidth <= action.clientWidth + 1),
        controlsReachable: actionRects.every((rect) => rect.top >= 0 && rect.bottom <= document.documentElement.scrollHeight),
      };
    });
    expect(responsiveGeometry.documentOverflow).toBeLessThanOrEqual(1);
    expect(responsiveGeometry.actionCount).toBe(2);
    expect(responsiveGeometry.labelsUnwrapped).toBe(true);
    expect(responsiveGeometry.controlsReachable).toBe(true);
    if (width >= 360) expect(responsiveGeometry.sameRow).toBe(true);
    else expect(responsiveGeometry.stacked).toBe(true);
  }

  await expect(section.getByRole('heading', { level: 2 })).toHaveText('Journeys for every kind of traveller.');
  await expect(section.getByText('Availability and final pricing are confirmed before commitment.', { exact: true })).toHaveCount(1);

  const itineraryAction = activeCard.getByRole('button', { name: 'View itinerary for Maldives Paradise' });
  await itineraryAction.focus();
  await itineraryAction.press('ArrowRight');
  await expect(liveStatus).toHaveText('Maldives Paradise, 1 of 11');
  await expect(itineraryAction).toBeFocused();
  await itineraryAction.click();
  const packageDialog = page.getByRole('dialog', { name: /paradise, privately/i });
  await expect(packageDialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(packageDialog).toBeHidden();

  const previous = section.getByRole('button', { name: 'Show previous package' });
  const next = page.getByRole('button', { name: 'Show next package' });
  await expect(previous).toBeEnabled();
  await expect(next).toBeEnabled();
  await previous.dispatchEvent('click');
  await expect(liveStatus).toHaveText('Ramakkalmedu, 11 of 11');
  await expect(activeCard).toHaveAttribute('aria-current', 'true');
  await next.dispatchEvent('click');
  await expect(liveStatus).toHaveText('Maldives Paradise, 1 of 11');
  await page.evaluate(() => {
    (window as Window & { packageStageEvents?: unknown[] }).packageStageEvents = [];
    window.addEventListener('dreamdrifters:analytics', (event) => {
      const detail = (event as CustomEvent).detail;
      if (detail.event === 'package_stage_changed') (window as Window & { packageStageEvents?: unknown[] }).packageStageEvents?.push(detail);
    });
  });
  const scrollBeforeAction = await page.evaluate(() => window.scrollY);
  await next.dispatchEvent('click');
  await expect(activeCard.getByRole('heading', { level: 3 })).toHaveText('Culture in motion');
  await expect(liveStatus).toHaveText('Japan Cultural Journey, 2 of 11');
  const scrollAfterAction = await page.evaluate(() => window.scrollY);
  if (width >= 1100) expect(scrollAfterAction).not.toBe(scrollBeforeAction);
  expect(await page.evaluate(() => (window as Window & { packageStageEvents?: unknown[] }).packageStageEvents)).toEqual([
    { event: 'package_stage_changed', package_id: 'japan', input_method: 'control' },
  ]);

  await deck.press('ArrowLeft');
  await expect(liveStatus).toHaveText('Maldives Paradise, 1 of 11');
  await deck.press('End');
  await expect(liveStatus).toHaveText('Ramakkalmedu, 11 of 11');
  await expect(activeCard).toHaveAttribute('aria-current', 'true');
  await expect(next).toBeEnabled();
  await deck.press('Home');
  await expect(liveStatus).toHaveText('Maldives Paradise, 1 of 11');
  await expect(previous).toBeEnabled();
  await deck.press('ArrowLeft');
  await expect(liveStatus).toHaveText('Ramakkalmedu, 11 of 11');
  await deck.press('ArrowRight');
  await expect(liveStatus).toHaveText('Maldives Paradise, 1 of 11');
});

test('package depth transitions keep one readable card inside the right-hand stage', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop geometry regression coverage');
  test.setTimeout(120_000);

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const section = page.locator('#packages');
    await page.locator('.editorial-hero').getByRole('button', { name: 'Explore packages', exact: true }).click();
    await expect.poll(() => section.evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBeLessThanOrEqual(90);
    await expect(section.locator('.depth-packages__destinations')).toHaveCount(0);

    for (const progress of [.12, .24, .36, .5, .64, .76, .88]) {
      const scrollTarget = await section.evaluate((element, progressValue) => {
        const start = element.getBoundingClientRect().top + window.scrollY - 88;
        const end = element.getBoundingClientRect().top + window.scrollY + element.clientHeight - window.innerHeight;
        return start + (end - start) * progressValue;
      }, progress);
      await page.evaluate((top) => {
        const previousBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo({ top: window.scrollY, behavior: 'auto' });
        window.scrollTo({ top, behavior: 'auto' });
        window.requestAnimationFrame(() => { document.documentElement.style.scrollBehavior = previousBehavior; });
      }, scrollTarget);
      await expect(section.locator('.depth-card.is-active')).toHaveCount(1);

      const geometry = await section.evaluate((element) => {
        const deck = element.querySelector<HTMLElement>('.depth-packages__deck')!;
        const heading = element.querySelector<HTMLElement>('.depth-packages__heading')!;
        const footer = element.querySelector<HTMLElement>('.depth-packages__footer')!;
        const deckRect = deck.getBoundingClientRect();
        const headingRect = heading.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();
        const cards = [...element.querySelectorAll<HTMLElement>('.depth-card')];
        const visibleCards = cards.filter((card) => card.dataset.depthVisible === 'true');
        const activeCard = element.querySelector<HTMLElement>('.depth-card.is-active')!;
        const activeBody = activeCard.querySelector<HTMLElement>('.depth-card__body')!;
        const activeIndex = Number(activeCard.dataset.packageIndex);
        const mediaOpacity = (card: HTMLElement) => Number.parseFloat(getComputedStyle(card.querySelector<HTMLElement>('.depth-card__media')!).opacity);
        const mostOpaqueIndex = cards.reduce((winner, card, index) => (
          mediaOpacity(card) >= mediaOpacity(cards[winner]) ? index : winner
        ), 0);
        const readableBodies = cards.flatMap((card) => {
          const body = card.querySelector<HTMLElement>('.depth-card__body');
          if (!body) return [];
          const style = getComputedStyle(body);
          return style.visibility !== 'hidden' && Number.parseFloat(style.opacity) > .5 ? [body] : [];
        });
        const inside = (rect: DOMRect, container: DOMRect) => (
          rect.left >= container.left - 1
          && rect.right <= container.right + 1
          && rect.top >= container.top - 1
          && rect.bottom <= container.bottom + 1
        );

        return {
          visibleCount: visibleCards.length,
          visibleCardsInsideDeck: visibleCards.every((card) => inside(card.getBoundingClientRect(), deckRect)),
          visibleCardsClearHeading: visibleCards.every((card) => card.getBoundingClientRect().left >= headingRect.right + 16),
          readableBodyCount: readableBodies.length,
          activeBodyOpacity: Number.parseFloat(getComputedStyle(activeBody).opacity),
          activeBodyInsideDeck: inside(activeBody.getBoundingClientRect(), deckRect),
          actionsInsideViewport: [...activeBody.querySelectorAll<HTMLElement>('button')].every((button) => {
            const rect = button.getBoundingClientRect();
            return rect.left >= 0 && rect.right <= window.innerWidth && rect.top >= 88 && rect.bottom <= window.innerHeight;
          }),
          footerInsideViewport: footerRect.top >= 88 && footerRect.bottom <= window.innerHeight,
          activeIndex,
          mostOpaqueIndex,
          counter: element.querySelector('.depth-packages__controls strong')?.textContent,
        };
      });

      expect(geometry.visibleCount).toBeLessThanOrEqual(2);
      expect(geometry.visibleCardsInsideDeck).toBe(true);
      expect(geometry.visibleCardsClearHeading).toBe(true);
      expect(geometry.readableBodyCount).toBe(1);
      expect(geometry.activeBodyOpacity).toBe(1);
      expect(geometry.activeBodyInsideDeck).toBe(true);
      expect(geometry.actionsInsideViewport).toBe(true);
      expect(geometry.footerInsideViewport).toBe(true);
      expect(geometry.activeIndex).toBe(geometry.mostOpaqueIndex);
      expect(geometry.counter).toBe(String(geometry.activeIndex + 1).padStart(2, '0'));
    }
  }
});

test('package carousel touch swipe respects its threshold and wraps at an endpoint', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Chromium touch-input package check');
  await page.goto('/');
  const section = page.locator('#packages');
  await page.locator('.editorial-hero').getByRole('button', { name: 'Explore packages', exact: true }).click();
  await expect.poll(() => section.evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBeLessThanOrEqual(90);
  const deck = section.getByRole('region', { name: 'Travel packages' });
  const liveStatus = deck.locator('[aria-live="polite"]');
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });

  const swipe = async (deltaX: number) => {
    const target = section.locator('.depth-card.is-active .depth-card__body h3');
    const box = await target.boundingBox();
    if (!box) throw new Error('Active package heading has no swipe coordinates');
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + deltaX, y, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };

  const restingScroll = await page.evaluate(() => window.scrollY);
  await swipe(-47);
  await expect(liveStatus).toHaveText('Maldives Paradise, 1 of 11');
  expect(await page.evaluate(() => window.scrollY)).toBe(restingScroll);
  await swipe(-60);
  await expect(liveStatus).toHaveText('Japan Cultural Journey, 2 of 11');
  await deck.press('Home');
  await swipe(60);
  await expect(liveStatus).toHaveText('Ramakkalmedu, 11 of 11');
});

test('package selection survives responsive presentation changes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop responsive package lifecycle check');
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/');
  const section = page.locator('#packages');
  await section.scrollIntoViewIfNeeded();
  const deck = section.getByRole('region', { name: 'Travel packages' });
  const liveStatus = deck.locator('[aria-live="polite"]');

  await section.getByRole('button', { name: 'Show next package' }).click();
  await section.getByRole('button', { name: 'Show next package' }).click();
  await expect(liveStatus).toHaveText('Swiss Alps Adventure, 3 of 11');

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(section).toHaveClass(/depth-packages--depth/);
  await expect(liveStatus).toHaveText('Swiss Alps Adventure, 3 of 11');
  await expect(section.locator('.depth-card.is-active')).toHaveAttribute('data-package-index', '2');

  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(section).toHaveClass(/depth-packages--controlled/);
  await expect(liveStatus).toHaveText('Swiss Alps Adventure, 3 of 11');
  await expect(section.locator('.depth-card.is-active')).toHaveAttribute('data-package-index', '2');
});

test('package carousel transition is immediate with reduced motion', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop reduced-motion package check');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const section = page.locator('#packages');
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveClass(/depth-packages--controlled/);
  expect(await section.locator('.depth-packages__stage').evaluate((stage) => getComputedStyle(stage).position)).not.toBe('sticky');
  expect(await section.evaluate((element) => element.getBoundingClientRect().height)).toBeLessThan((page.viewportSize()?.height ?? 1000) * 2.2);
  await section.getByRole('button', { name: 'Show next package' }).dispatchEvent('click');
  const activeCard = section.locator('.depth-card');
  await expect(activeCard.getByRole('heading', { level: 3 })).toHaveText('Culture in motion');
  expect(await activeCard.evaluate((card) => getComputedStyle(card).animationName)).toBe('none');
});

test('capable phones use the mobile hero loop and reduced motion uses posters only', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Phone media policy');
  await page.goto('/');
  const video = page.locator('#home video');
  await expect(video).toHaveCount(1, { timeout: 5_000 });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentSrc)).toContain('hero-tropical-mobile-1080.mp4');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => `${element.videoWidth}x${element.videoHeight}`)).toBe('1080x1920');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.waitForTimeout(700);
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.locator('#home picture')).toBeVisible();
  await expect(page.locator('#home picture')).toBeVisible();
});

test('all Enhanced B video families are attached and playable in Chrome', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Desktop Chrome media attachment check');
  for (const file of ['hero-tropical-2160.mp4', 'hero-tropical-2160.webm', 'hero-tropical-1440.mp4', 'hero-tropical-1440.webm', 'hero-tropical-1080.mp4', 'hero-tropical-1080.webm', 'hero-tropical-mobile-1080.mp4', 'hero-tropical-mobile-1080.webm', 'direction-train.mp4', 'direction-train.webm', 'operations.mp4', 'operations.webm', 'travellers.mp4', 'travellers.webm']) {
    const response = await request.get(`/media/${file}`);
    expect(response.ok(), `${file} should be served`).toBe(true);
    expect(response.headers()['content-type']).toContain('video/');
  }

  await page.goto('/');
  await expect.poll(() => page.locator('#home video').evaluate((video: HTMLVideoElement) => video.currentSrc)).toContain('hero-tropical-1440.mp4');
  await expect.poll(() => page.locator('#home video').evaluate((video: HTMLVideoElement) => `${video.videoWidth}x${video.videoHeight}`)).toBe('2560x1440');
  await expect(page.locator('#home').getByRole('button', { name: 'Pause background video' })).toBeVisible();
  await page.locator('.editorial-purpose').scrollIntoViewIfNeeded();
  await expect(page.locator('.editorial-purpose video')).toHaveCount(1);
  await expect.poll(() => page.locator('.editorial-purpose video').evaluate((video: HTMLVideoElement) => video.currentSrc)).toContain('direction-train.mp4');
  await page.locator('#services').scrollIntoViewIfNeeded();
  await expect(page.locator('#services video')).toHaveCount(1);
  await expect.poll(() => page.locator('#services video').evaluate((video: HTMLVideoElement) => video.currentSrc)).toContain('operations.mp4');
  await expect.poll(() => page.locator('#services video').evaluate((video: HTMLVideoElement) => video.paused)).toBe(false);
  await page.locator('#services').getByRole('button', { name: 'Pause background video' }).click();
  await expect.poll(() => page.locator('#services video').evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
  await page.locator('#services').getByRole('button', { name: 'Play background video' }).click();
  await expect.poll(() => page.locator('#services video').evaluate((video: HTMLVideoElement) => video.paused)).toBe(false);
  await expect.poll(() => page.locator('#home video').evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
  await expect(page.locator('.editorial-services__cinematic')).toHaveCount(1);
  await expect(page.locator('.editorial-services__capability')).toBeVisible();
  await expect(page.locator('#services .prismatic-drift')).toHaveCount(0);
  await page.locator('#reviews').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('#services video').evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
  await expect(page.locator('#reviews video')).toHaveCount(1);
  await expect.poll(() => page.locator('#reviews video').evaluate((video: HTMLVideoElement) => video.currentSrc)).toContain('travellers.mp4');
});
