import { describe, expect, it } from 'vitest';
import { getServicePresentationMode } from './presentation';

describe('service presentation mode', () => {
  it('uses the accordion below the 700px pinning boundary', () => {
    expect(getServicePresentationMode(699, false)).toBe('mobile');
  });

  it('uses a pinned chapter on wider motion-capable viewports', () => {
    expect(getServicePresentationMode(700, false)).toBe('pinned');
    expect(getServicePresentationMode(1440, false)).toBe('pinned');
  });

  it('uses a complete static stage when motion is reduced', () => {
    expect(getServicePresentationMode(699, true)).toBe('static');
    expect(getServicePresentationMode(1440, true)).toBe('static');
  });
});
