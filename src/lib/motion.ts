interface AmbientMediaPolicy {
  hasSource: boolean;
  isDeviceCapable: boolean;
  saveData: boolean;
  reducedMotion: boolean;
}

import type { ResponsiveVideoOutput } from '../types';

export interface ResponsiveVideoPolicy {
  viewportWidth: number;
  devicePixelRatio: number;
  deviceMemory?: number;
  effectiveType?: string;
  saveData: boolean;
  reducedMotion: boolean;
}

export function shouldLoadAmbientVideo(policy: AmbientMediaPolicy): boolean {
  return policy.hasSource && policy.isDeviceCapable && !policy.saveData && !policy.reducedMotion;
}

export function selectResponsiveVideoOutput(outputs: ResponsiveVideoOutput[], policy: ResponsiveVideoPolicy): ResponsiveVideoOutput | undefined {
  const effectiveType = policy.effectiveType?.toLowerCase();
  if (policy.saveData || policy.reducedMotion || effectiveType === '2g' || effectiveType === 'slow-2g' || (typeof policy.deviceMemory === 'number' && policy.deviceMemory < 4)) return undefined;

  const effectiveWidth = policy.viewportWidth * Math.max(1, policy.devicePixelRatio || 1);
  return outputs
    .filter(({ selection }) => {
      if (selection.minViewportWidth !== undefined && policy.viewportWidth < selection.minViewportWidth) return false;
      if (selection.maxViewportWidth !== undefined && policy.viewportWidth > selection.maxViewportWidth) return false;
      if (selection.minEffectiveWidth !== undefined && effectiveWidth < selection.minEffectiveWidth) return false;
      if (selection.minDeviceMemory !== undefined && (policy.deviceMemory ?? 0) < selection.minDeviceMemory) return false;
      if (effectiveType && selection.excludedEffectiveTypes?.includes(effectiveType)) return false;
      return true;
    })
    .filter((output) => effectiveType !== '3g' || output.dimensions.width <= 1920)
    .sort((a, b) => (b.dimensions.width * b.dimensions.height) - (a.dimensions.width * a.dimensions.height))[0];
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
