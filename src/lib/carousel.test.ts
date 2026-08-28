import { describe, expect, it } from 'vitest';
import {
  DEPTH_REST_PROGRESS,
  SWIPE_THRESHOLD_PX,
  getPackageDepthState,
  getPackageCarouselMode,
  packageIndexToProgress,
  progressToPackagePosition,
  swipeTargetIndex,
  wrapPackageIndex,
} from './carousel';

describe('package controlled carousel', () => {
  it('wraps navigation in both directions', () => {
    expect(wrapPackageIndex(-1, 6)).toBe(5);
    expect(wrapPackageIndex(3, 6)).toBe(3);
    expect(wrapPackageIndex(6, 6)).toBe(0);
    expect(wrapPackageIndex(7, 6)).toBe(1);
    expect(wrapPackageIndex(1, 0)).toBe(0);
  });

  it('changes one package only when a horizontal swipe reaches the threshold', () => {
    expect(swipeTargetIndex(2, -(SWIPE_THRESHOLD_PX - 1), 6)).toBe(2);
    expect(swipeTargetIndex(2, -SWIPE_THRESHOLD_PX, 6)).toBe(3);
    expect(swipeTargetIndex(2, SWIPE_THRESHOLD_PX, 6)).toBe(1);
  });

  it('wraps qualifying swipes at the first and last package', () => {
    expect(swipeTargetIndex(0, SWIPE_THRESHOLD_PX * 2, 6)).toBe(5);
    expect(swipeTargetIndex(5, -SWIPE_THRESHOLD_PX * 2, 6)).toBe(0);
  });

  it('returns one complete first card throughout the resting plateau', () => {
    for (const progress of [0, .04, DEPTH_REST_PROGRESS]) {
      const state = getPackageDepthState(progress, 6);
      expect(state).toMatchObject({ activeIndex: 0, dominantIndex: 0, motionEngaged: false, position: 0 });
      expect(state.cards[0]).toMatchObject({ xPercent: 0, scale: 1, opacity: 1, visible: true, dominant: true });
      expect(state.cards.slice(1).every((card) => !card.visible && card.opacity === 0)).toBe(true);
    }
  });

  it('synchronizes the active package with the visually dominant card at a transition midpoint', () => {
    const state = getPackageDepthState(.164, 6);
    const visibleCards = state.cards.filter((card) => card.visible);

    expect(state).toMatchObject({ activeIndex: 1, dominantIndex: 1, motionEngaged: true, position: .5 });
    expect(visibleCards).toHaveLength(2);
    expect(state.cards[0]).toMatchObject({ xPercent: -6, scale: .97, opacity: .5, dominant: false });
    expect(state.cards[1]).toMatchObject({ xPercent: 6, scale: .97, opacity: .5, dominant: true });
  });

  it('does not flicker back to the outgoing card from sub-pixel midpoint rounding', () => {
    const state = getPackageDepthState(.499999, 6);
    expect(state.position).toBeCloseTo(2.5, 4);
    expect(state.activeIndex).toBe(3);
    expect(state.dominantIndex).toBe(3);
  });

  it('returns one centered card at every exact package stop', () => {
    const state = getPackageDepthState(.584, 6);
    expect(state).toMatchObject({ activeIndex: 3, dominantIndex: 3, position: 3 });
    expect(state.cards.filter((card) => card.visible)).toHaveLength(1);
    expect(state.cards[3]).toMatchObject({ xPercent: 0, scale: 1, opacity: 1, visible: true, dominant: true });
  });

  it('keeps every transition bounded to two cards and twelve percent movement', () => {
    for (const progress of [0, .08, .1, .164, .248, .332, .416, .5, .584, .668, .752, .836, .92, 1]) {
      const state = getPackageDepthState(progress, 6);
      expect(state.activeIndex).toBe(state.dominantIndex);
      expect(state.cards.filter((card) => card.visible).length).toBeLessThanOrEqual(2);
      expect(state.cards.every((card) => Math.abs(card.xPercent) <= 12)).toBe(true);
      expect(state.cards.every((card) => card.scale >= .94 && card.scale <= 1)).toBe(true);
      expect(state.cards.every((card) => card.opacity >= 0 && card.opacity <= 1)).toBe(true);
    }
  });

  it('holds a complete final card after the motion range finishes', () => {
    const state = getPackageDepthState(1, 6);
    expect(state).toMatchObject({ activeIndex: 5, dominantIndex: 5, motionEngaged: true, position: 5 });
    expect(state.cards.filter((card) => card.visible)).toHaveLength(1);
    expect(state.cards[5]).toMatchObject({ xPercent: 0, scale: 1, opacity: 1, visible: true, dominant: true });
  });

  it('uses depth motion only on capable desktop viewports', () => {
    expect(getPackageCarouselMode(1440, false)).toBe('depth');
    expect(getPackageCarouselMode(1024, false)).toBe('controlled');
    expect(getPackageCarouselMode(1440, true)).toBe('controlled');
  });
});
