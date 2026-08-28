import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CinematicVideo } from './CinematicVideo';

const mediaProps = {
  poster: '/media/hero.webp',
  posterAvif: '/media/hero.avif',
  mp4: '/media/discovery.mp4',
  webm: '/media/discovery.webm',
  mobileMp4: '/media/discovery-mobile.mp4',
  mobileWebm: '/media/discovery-mobile.webm',
  alt: 'Mountain road',
  eager: true,
};

const responsiveVideoOutputs = [
  { label: 'mobile' as const, dimensions: { width: 1080, height: 1920 }, formats: [{ kind: 'mp4' as const, path: '/media/hero-mobile-1080.mp4' }, { kind: 'webm' as const, path: '/media/hero-mobile-1080.webm' }], selection: { maxViewportWidth: 699 } },
  { label: 'standard' as const, dimensions: { width: 1920, height: 1080 }, formats: [{ kind: 'mp4' as const, path: '/media/hero-1080.mp4' }, { kind: 'webm' as const, path: '/media/hero-1080.webm' }], selection: { minViewportWidth: 700 } },
  { label: 'desktop' as const, dimensions: { width: 2560, height: 1440 }, formats: [{ kind: 'mp4' as const, path: '/media/hero-1440.mp4' }, { kind: 'webm' as const, path: '/media/hero-1440.webm' }], selection: { minViewportWidth: 1100 } },
  { label: 'ultra' as const, dimensions: { width: 3840, height: 2160 }, formats: [{ kind: 'mp4' as const, path: '/media/hero-2160.mp4' }, { kind: 'webm' as const, path: '/media/hero-2160.webm' }], selection: { minViewportWidth: 1920, minEffectiveWidth: 2560, minDeviceMemory: 8 } },
];

describe('CinematicVideo playback recovery', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('lets a chapter require majority viewport ownership before exposing playback controls', async () => {
    let observerOptions: IntersectionObserverInit | undefined;
    class MajorityOwnershipObserver {
      constructor(private readonly callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        observerOptions = options;
      }
      observe(target: Element) {
        this.callback([{ isIntersecting: true, intersectionRatio: .52, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      unobserve() {}
      disconnect() {}
      takeRecords() { return []; }
      readonly root = null;
      readonly rootMargin = '0px';
      readonly thresholds = [0, .55];
    }
    vi.stubGlobal('IntersectionObserver', MajorityOwnershipObserver);
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);

    const { container } = render(<CinematicVideo {...mediaProps} ownershipThreshold={.55} />);
    await act(async () => { await new Promise((resolve) => window.setTimeout(resolve, 380)); });
    fireEvent.canPlay(container.querySelector('video')!);

    expect(observerOptions?.threshold).toEqual([0, .55]);
    expect(within(container).queryByRole('button', { name: /background video/i })).toBeNull();
  });

  it('keeps the video available and offers playback when Chrome blocks autoplay', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValueOnce(new DOMException('Autoplay blocked', 'NotAllowedError'));
    const { container } = render(<CinematicVideo {...mediaProps} />);

    await act(async () => { await new Promise((resolve) => window.setTimeout(resolve, 380)); });
    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    fireEvent.canPlay(video!);

    await waitFor(() => expect(screen.getByRole('button', { name: 'Play background video' })).toBeVisible());
    expect(container.querySelector('video')).not.toBeNull();
    expect(container.querySelector('.cinematic-media')).toHaveAttribute('data-video-state', 'blocked');
  });

  it('retries playback after a visitor presses the play control', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValueOnce(new DOMException('Autoplay blocked', 'NotAllowedError'))
      .mockResolvedValueOnce(undefined);
    const { container } = render(<CinematicVideo {...mediaProps} />);

    await act(async () => { await new Promise((resolve) => window.setTimeout(resolve, 380)); });
    fireEvent.canPlay(container.querySelector('video')!);
    const control = await waitFor(() => {
      const button = container.querySelector<HTMLButtonElement>('.cinematic-media__play');
      expect(button).not.toBeNull();
      return button!;
    });
    fireEvent.click(control);

    await waitFor(() => expect(container.querySelector('.cinematic-media')).toHaveAttribute('data-video-state', 'playing'));
    expect(play).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('button', { name: 'Pause background video' })).toBeVisible();
  });

  it('lets a visitor pause and resume ambient playback', async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    const { container } = render(<CinematicVideo {...mediaProps} />);

    await act(async () => { await new Promise((resolve) => window.setTimeout(resolve, 380)); });
    fireEvent.canPlay(container.querySelector('video')!);
    const pauseControl = await waitFor(() => {
      const button = container.querySelector<HTMLButtonElement>('[aria-label="Pause background video"]');
      expect(button).not.toBeNull();
      return button!;
    });
    fireEvent.click(pauseControl);

    await waitFor(() => expect(container.querySelector('.cinematic-media')).toHaveAttribute('data-video-state', 'paused'));
    expect(pause).toHaveBeenCalled();
    fireEvent.click(container.querySelector<HTMLButtonElement>('[aria-label="Play background video"]')!);
    await waitFor(() => expect(container.querySelector('.cinematic-media')).toHaveAttribute('data-video-state', 'playing'));
    expect(play).toHaveBeenCalledTimes(2);
  });

  it('lists MP4 before WebM so Chrome uses the broadly supported source first', async () => {
    const { container } = render(<CinematicVideo {...mediaProps} />);

    await act(async () => { await new Promise((resolve) => window.setTimeout(resolve, 380)); });
    const sourceTypes = Array.from(container.querySelectorAll('video source')).map((source) => source.getAttribute('type'));
    expect(sourceTypes).toEqual(['video/mp4', 'video/webm', 'video/mp4', 'video/webm']);
  });

  it('mounts only the adaptively selected encode pair with MP4 first', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 });
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 1 });
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, value: 8 });
    const { container } = render(<CinematicVideo {...mediaProps} responsiveVideoOutputs={responsiveVideoOutputs} />);

    await act(async () => { await new Promise((resolve) => window.setTimeout(resolve, 380)); });
    expect(Array.from(container.querySelectorAll('video source')).map((source) => source.getAttribute('src'))).toEqual([
      '/media/hero-1440.mp4',
      '/media/hero-1440.webm',
    ]);
  });

  it('keeps an accessible pause control available while a responsive hero loop is playing', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 });
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 1 });
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, value: 8 });
    const { container } = render(<CinematicVideo {...mediaProps} responsiveVideoOutputs={responsiveVideoOutputs} />);

    await act(async () => { await new Promise((resolve) => window.setTimeout(resolve, 380)); });
    const video = container.querySelector('video')!;
    fireEvent.canPlay(video);
    fireEvent.loadedData(video);
    await waitFor(() => expect(within(container).getByRole('button', { name: 'Pause background video' })).toBeVisible());
  });

  it('does not offer an inert play control when responsive policy requires poster-only media', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as MediaQueryList);
    const { container } = render(<CinematicVideo {...mediaProps} responsiveVideoOutputs={responsiveVideoOutputs} />);

    expect(container.querySelector('video')).toBeNull();
    expect(within(container).queryByRole('button', { name: 'Play background video' })).toBeNull();
  });

  it('crossfades only after the browser presents the first decoded frame', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    const { container } = render(<CinematicVideo {...mediaProps} />);

    await act(async () => { await new Promise((resolve) => window.setTimeout(resolve, 380)); });
    const video = container.querySelector('video')!;
    fireEvent.canPlay(video);
    expect(container.querySelector('.cinematic-media')).not.toHaveClass('is-video-ready');
    fireEvent.loadedData(video);
    expect(container.querySelector('.cinematic-media')).toHaveClass('is-video-ready');
  });

  it('does not treat an unused responsive source error as failure of the video element', async () => {
    const { container } = render(<CinematicVideo {...mediaProps} />);

    await act(async () => { await new Promise((resolve) => window.setTimeout(resolve, 380)); });
    fireEvent.error(container.querySelector('video source')!);

    expect(container.querySelector('video')).not.toBeNull();
    expect(container.querySelector('.cinematic-media')).not.toHaveAttribute('data-video-state', 'failed');
  });

  it('starts paused but remains playable when reduced motion disables autoplay', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as MediaQueryList);
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    const { container } = render(<CinematicVideo {...mediaProps} />);

    const control = await waitFor(() => {
      const button = container.querySelector<HTMLButtonElement>('.cinematic-media__play');
      expect(button).not.toBeNull();
      return button!;
    });
    expect(container.querySelector('video')).toBeNull();
    fireEvent.click(control);
    const video = await waitFor(() => container.querySelector('video'));
    fireEvent.canPlay(video!);

    await waitFor(() => expect(container.querySelector('.cinematic-media')).toHaveAttribute('data-video-state', 'playing'));
  });
});
