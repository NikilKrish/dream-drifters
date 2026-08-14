import { describe, expect, it } from 'vitest';
import { shouldLoadAmbientVideo } from './motion';

describe('ambient media policy', () => {
  it('loads video only when motion, bandwidth and viewport allow it', () => {
    expect(shouldLoadAmbientVideo({ hasSource: true, isWideScreen: true, saveData: false, reducedMotion: false })).toBe(true);
    expect(shouldLoadAmbientVideo({ hasSource: true, isWideScreen: true, saveData: false, reducedMotion: true })).toBe(false);
    expect(shouldLoadAmbientVideo({ hasSource: true, isWideScreen: true, saveData: true, reducedMotion: false })).toBe(false);
    expect(shouldLoadAmbientVideo({ hasSource: true, isWideScreen: false, saveData: false, reducedMotion: false })).toBe(false);
  });
});
