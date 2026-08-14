import { describe, expect, it } from 'vitest';
import { packages } from './packages';

describe('journey catalogue', () => {
  it('contains six complete, uniquely addressable packages', () => {
    expect(packages).toHaveLength(6);
    expect(new Set(packages.map((item) => item.id)).size).toBe(6);
    packages.forEach((item) => {
      expect(item.itinerary.length).toBeGreaterThan(1);
      expect(item.inclusions.length).toBeGreaterThan(1);
      expect(item.image).toMatch(/^\/media\/.+\.webp$/);
      expect(item.imageAvif).toMatch(/^\/media\/.+\.avif$/);
      expect(item.imageAlt.length).toBeGreaterThan(10);
    });
  });
});
