interface AmbientMediaPolicy {
  hasSource: boolean;
  isWideScreen: boolean;
  saveData: boolean;
  reducedMotion: boolean;
}

export function shouldLoadAmbientVideo(policy: AmbientMediaPolicy): boolean {
  return policy.hasSource && policy.isWideScreen && !policy.saveData && !policy.reducedMotion;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
