import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

describe('CinematicVideo playback recovery', () => {
  afterEach(() => vi.restoreAllMocks());

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
    expect(container.querySelector('.cinematic-media__play')).not.toBeInTheDocument();
  });

  it('lists MP4 before WebM so Chrome uses the broadly supported source first', async () => {
    const { container } = render(<CinematicVideo {...mediaProps} />);

    await act(async () => { await new Promise((resolve) => window.setTimeout(resolve, 380)); });
    const sourceTypes = Array.from(container.querySelectorAll('video source')).map((source) => source.getAttribute('type'));
    expect(sourceTypes).toEqual(['video/mp4', 'video/webm', 'video/mp4', 'video/webm']);
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
