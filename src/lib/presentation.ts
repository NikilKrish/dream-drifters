export type ServicePresentationMode = 'mobile' | 'pinned' | 'static';

export function getServicePresentationMode(width: number, reducedMotion: boolean): ServicePresentationMode {
  if (reducedMotion) return 'static';
  return width < 700 ? 'mobile' : 'pinned';
}
