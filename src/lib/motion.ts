interface AmbientMediaPolicy {
  hasSource: boolean;
  isDeviceCapable: boolean;
  saveData: boolean;
  reducedMotion: boolean;
}

export function shouldLoadAmbientVideo(policy: AmbientMediaPolicy): boolean {
  return policy.hasSource && policy.isDeviceCapable && !policy.saveData && !policy.reducedMotion;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
