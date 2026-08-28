export type CarouselInputMethod = 'scroll' | 'control' | 'keyboard' | 'pointer';

export const SWIPE_THRESHOLD_PX = 48;
export const DEPTH_REST_PROGRESS = .08;

export type PackageCarouselMode = 'controlled' | 'depth';

export interface DepthCardPresentation {
  xPercent: number;
  scale: number;
  opacity: number;
  zIndex: number;
  visible: boolean;
  dominant: boolean;
}

export interface PackageDepthState {
  activeIndex: number;
  dominantIndex: number;
  motionEngaged: boolean;
  position: number;
  cards: DepthCardPresentation[];
}

const DEPTH_SHIFT_PERCENT = 12;
const DEPTH_MIN_SCALE = .94;
const DEPTH_VISIBLE_OPACITY = .01;
const roundDepthMetric = (value: number) => {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return Math.abs(rounded) < .000001 ? 0 : rounded;
};

export function wrapPackageIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  const rounded = Math.round(index);
  return ((rounded % count) + count) % count;
}

export function swipeTargetIndex(
  activeIndex: number,
  deltaX: number,
  count: number,
  threshold = SWIPE_THRESHOLD_PX,
): number {
  if (Math.abs(deltaX) < threshold) return wrapPackageIndex(activeIndex, count);
  return wrapPackageIndex(activeIndex + (deltaX < 0 ? 1 : -1), count);
}

export function getPackageCarouselMode(width: number, reducedMotion: boolean): PackageCarouselMode {
  return width >= 1100 && !reducedMotion ? 'depth' : 'controlled';
}

export function progressToPackagePosition(
  progress: number,
  count: number,
  restProgress = DEPTH_REST_PROGRESS,
): number {
  if (count <= 1) return 0;
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const safeRest = Math.max(0, Math.min(.24, restProgress));
  const motionProgress = Math.max(0, Math.min(1, (clampedProgress - safeRest) / (1 - safeRest * 2)));
  return motionProgress * (count - 1);
}

export function packageIndexToProgress(
  index: number,
  count: number,
  restProgress = DEPTH_REST_PROGRESS,
): number {
  if (count <= 1) return 0;
  const safeRest = Math.max(0, Math.min(.24, restProgress));
  const clampedIndex = Math.max(0, Math.min(count - 1, Math.round(index)));
  return safeRest + (clampedIndex / (count - 1)) * (1 - safeRest * 2);
}

export function getPackageDepthState(progress: number, count: number): PackageDepthState {
  const safeCount = Math.max(0, Math.floor(count));
  const position = roundDepthMetric(progressToPackagePosition(progress, safeCount));
  const cards = Array.from({ length: safeCount }, (): DepthCardPresentation => ({
    xPercent: 0,
    scale: DEPTH_MIN_SCALE,
    opacity: 0,
    zIndex: 1,
    visible: false,
    dominant: false,
  }));

  if (safeCount === 0) {
    return { activeIndex: 0, dominantIndex: 0, motionEngaged: false, position: 0, cards };
  }

  const outgoingIndex = Math.min(safeCount - 1, Math.floor(position));
  const incomingIndex = Math.min(safeCount - 1, outgoingIndex + 1);
  const transition = incomingIndex === outgoingIndex ? 0 : Math.max(0, Math.min(1, position - outgoingIndex));
  const activeIndex = transition >= .49999 ? incomingIndex : outgoingIndex;

  cards[outgoingIndex] = {
    xPercent: roundDepthMetric(-DEPTH_SHIFT_PERCENT * transition),
    scale: roundDepthMetric(1 - (1 - DEPTH_MIN_SCALE) * transition),
    opacity: roundDepthMetric(1 - transition),
    zIndex: activeIndex === outgoingIndex ? 20 : 10,
    visible: 1 - transition > DEPTH_VISIBLE_OPACITY,
    dominant: activeIndex === outgoingIndex,
  };

  if (incomingIndex !== outgoingIndex) {
    cards[incomingIndex] = {
      xPercent: roundDepthMetric(DEPTH_SHIFT_PERCENT * (1 - transition)),
      scale: roundDepthMetric(DEPTH_MIN_SCALE + (1 - DEPTH_MIN_SCALE) * transition),
      opacity: roundDepthMetric(transition),
      zIndex: activeIndex === incomingIndex ? 20 : 10,
      visible: transition > DEPTH_VISIBLE_OPACITY,
      dominant: activeIndex === incomingIndex,
    };
  }

  return {
    activeIndex,
    dominantIndex: activeIndex,
    motionEngaged: safeCount > 1 && progress > DEPTH_REST_PROGRESS,
    position,
    cards,
  };
}
