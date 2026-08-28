import { describe, expect, it } from 'vitest';
import type { ResponsiveVideoOutput } from '../types';
import { selectResponsiveVideoOutput, shouldLoadAmbientVideo } from './motion';

const outputs: ResponsiveVideoOutput[] = [
  { label: 'mobile', dimensions: { width: 1080, height: 1920 }, formats: [], selection: { maxViewportWidth: 699 } },
  { label: 'standard', dimensions: { width: 1920, height: 1080 }, formats: [], selection: { minViewportWidth: 700 } },
  { label: 'desktop', dimensions: { width: 2560, height: 1440 }, formats: [], selection: { minViewportWidth: 1100 } },
  { label: 'ultra', dimensions: { width: 3840, height: 2160 }, formats: [], selection: { minViewportWidth: 1920, minEffectiveWidth: 2560, minDeviceMemory: 8 } },
];

describe('ambient media policy', () => {
  it('loads video only when motion, bandwidth and viewport allow it', () => {
    expect(shouldLoadAmbientVideo({ hasSource: true, isDeviceCapable: true, saveData: false, reducedMotion: false })).toBe(true);
    expect(shouldLoadAmbientVideo({ hasSource: true, isDeviceCapable: true, saveData: false, reducedMotion: true })).toBe(false);
    expect(shouldLoadAmbientVideo({ hasSource: true, isDeviceCapable: true, saveData: true, reducedMotion: false })).toBe(false);
    expect(shouldLoadAmbientVideo({ hasSource: true, isDeviceCapable: false, saveData: false, reducedMotion: false })).toBe(false);
  });
});

describe('responsive hero video selection', () => {
  it('uses the portrait crop on mobile and the 1440p encode on a capable desktop', () => {
    expect(selectResponsiveVideoOutput(outputs, { viewportWidth: 390, devicePixelRatio: 3, deviceMemory: 8, effectiveType: '4g', saveData: false, reducedMotion: false })?.label).toBe('mobile');
    expect(selectResponsiveVideoOutput(outputs, { viewportWidth: 1440, devicePixelRatio: 1, deviceMemory: 8, effectiveType: '4g', saveData: false, reducedMotion: false })?.label).toBe('desktop');
  });

  it('reserves 4K for large capable displays and constrains lower-capability desktops to 1080p', () => {
    expect(selectResponsiveVideoOutput(outputs, { viewportWidth: 1920, devicePixelRatio: 2, deviceMemory: 8, effectiveType: '4g', saveData: false, reducedMotion: false })?.label).toBe('ultra');
    expect(selectResponsiveVideoOutput(outputs, { viewportWidth: 1920, devicePixelRatio: 2, deviceMemory: 4, effectiveType: '3g', saveData: false, reducedMotion: false })?.label).toBe('standard');
  });

  it('returns poster-only for Save-Data, slow connections, reduced motion and low-memory devices', () => {
    const base = { viewportWidth: 1440, devicePixelRatio: 1, deviceMemory: 8, effectiveType: '4g', saveData: false, reducedMotion: false };
    expect(selectResponsiveVideoOutput(outputs, { ...base, saveData: true })).toBeUndefined();
    expect(selectResponsiveVideoOutput(outputs, { ...base, effectiveType: 'slow-2g' })).toBeUndefined();
    expect(selectResponsiveVideoOutput(outputs, { ...base, reducedMotion: true })).toBeUndefined();
    expect(selectResponsiveVideoOutput(outputs, { ...base, deviceMemory: 2 })).toBeUndefined();
  });
});
