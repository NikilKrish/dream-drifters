import { describe, expect, it } from 'vitest';
import { clampPackageIndex, dragTargetIndex, getCardPresentation, getCarouselMode, packagePositionToIndex, progressToPackagePosition } from './carousel';

describe('package depth carousel', () => {
  it('maps scroll progress to a finite package position', () => {
    expect(progressToPackagePosition(0, 6)).toBe(0);
    expect(progressToPackagePosition(.5, 6)).toBe(2.5);
    expect(progressToPackagePosition(1.5, 6)).toBe(5);
    expect(packagePositionToIndex(2.6, 6)).toBe(3);
    expect(clampPackageIndex(8, 6)).toBe(5);
  });

  it('keeps the centre card dominant and adjacent cards behind it', () => {
    const centre = getCardPresentation(2, 2);
    const adjacent = getCardPresentation(3, 2);
    expect(centre).toMatchObject({ xPercent: 0, scale: 1, opacity: 1, visible: true });
    expect(adjacent.scale).toBeCloseTo(.86);
    expect(adjacent.opacity).toBeLessThan(centre.opacity);
    expect(adjacent.zIndex).toBeLessThan(centre.zIndex);
  });

  it('requires an eighteen percent drag before changing package', () => {
    expect(dragTargetIndex(2, -35, 300, 6)).toBe(2);
    expect(dragTargetIndex(2, -60, 300, 6)).toBe(3);
    expect(dragTargetIndex(0, 100, 300, 6)).toBe(0);
  });

  it('selects responsive and reduced-motion layouts', () => {
    expect(getCarouselMode(390, false)).toBe('mobile');
    expect(getCarouselMode(768, false)).toBe('tablet');
    expect(getCarouselMode(1440, false)).toBe('depth');
    expect(getCarouselMode(1440, true)).toBe('static');
  });
});
