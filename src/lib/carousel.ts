export type CarouselInputMethod = 'scroll' | 'control' | 'keyboard' | 'pointer';

export interface CardPresentation {
  distance: number;
  xPercent: number;
  scale: number;
  opacity: number;
  zIndex: number;
  visible: boolean;
}

export function clampPackageIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return Math.max(0, Math.min(count - 1, Math.round(index)));
}

export function progressToPackagePosition(progress: number, count: number): number {
  if (count <= 1) return 0;
  return Math.max(0, Math.min(1, progress)) * (count - 1);
}

export function packagePositionToIndex(position: number, count: number): number {
  return clampPackageIndex(position, count);
}

export function getCardPresentation(index: number, position: number): CardPresentation {
  const distance = index - position;
  const magnitude = Math.abs(distance);
  const visible = magnitude < 1.7;
  return {
    distance,
    xPercent: distance * 58,
    scale: Math.max(0.78, 1 - Math.min(magnitude, 1.5) * 0.14),
    opacity: visible ? Math.max(0.16, 1 - magnitude * 0.48) : 0,
    zIndex: Math.max(1, 10 - Math.round(magnitude * 4)),
    visible,
  };
}

export function dragTargetIndex(activeIndex: number, deltaX: number, cardWidth: number, count: number): number {
  if (cardWidth <= 0 || Math.abs(deltaX) < cardWidth * 0.18) return clampPackageIndex(activeIndex, count);
  return clampPackageIndex(activeIndex + (deltaX < 0 ? 1 : -1), count);
}

export function getCarouselMode(width: number, reducedMotion: boolean): 'static' | 'mobile' | 'tablet' | 'depth' {
  if (reducedMotion) return 'static';
  if (width < 700) return 'mobile';
  if (width < 1100) return 'tablet';
  return 'depth';
}
