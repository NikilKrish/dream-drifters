import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type TouchEvent,
} from 'react';
import { packages } from '../data/packages';
import { getPackageResponsiveImageSrcSet } from '../data/media';
import { track } from '../lib/analytics';
import {
  getPackageDepthState,
  getPackageCarouselMode,
  packageIndexToProgress,
  SWIPE_THRESHOLD_PX,
  swipeTargetIndex,
  wrapPackageIndex,
  type CarouselInputMethod,
  type PackageCarouselMode,
} from '../lib/carousel';
import type { TravelPackage } from '../types';
import { getPackagePriceLabel } from './PackagesSection';

interface DepthPackagesSectionProps {
  onOpen: (travelPackage: TravelPackage, sourceImage: HTMLElement | null) => void;
  onEnquire: (travelPackage: TravelPackage) => void;
  suspended?: boolean;
}

const PACKAGE_PIN_OFFSET = 88;

const scrollToExact = (top: number) => {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo({ top: window.scrollY, behavior: 'auto' });
  window.scrollTo({ top, behavior: 'auto' });
  window.requestAnimationFrame(() => { root.style.scrollBehavior = previousBehavior; });
};

const initialMode = (): PackageCarouselMode => getPackageCarouselMode(
  typeof window === 'undefined' ? 1440 : window.innerWidth,
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
);

export function DepthPackagesSection({ onOpen, onEnquire, suspended = false }: DepthPackagesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const pointerStartRef = useRef<number | null>(null);
  const didSwipeRef = useRef(false);
  const activeRef = useRef(0);
  const pendingNavigationRef = useRef<{ index: number; source: CarouselInputMethod } | null>(null);
  const progressRef = useRef(0);
  const suspendedRef = useRef(suspended);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mode, setMode] = useState<PackageCarouselMode>(initialMode);
  const activePackage = packages[activeIndex];

  const setActive = useCallback((index: number, source: CarouselInputMethod) => {
    const next = wrapPackageIndex(index, packages.length);
    if (next === activeRef.current) return;
    if (source === 'scroll') {
      const currentCard = cardRefs.current[activeRef.current];
      if (currentCard?.contains(document.activeElement)) deckRef.current?.focus({ preventScroll: true });
    }
    activeRef.current = next;
    setActiveIndex(next);
    track('package_stage_changed', { package_id: packages[next].id, input_method: source });
  }, []);

  const renderDepth = useCallback((progress: number, source: CarouselInputMethod = 'scroll') => {
    const state = getPackageDepthState(progress, packages.length);
    progressRef.current = progress;
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const presentation = state.cards[index];
      card.style.setProperty('--depth-x', `${presentation.xPercent}%`);
      card.style.setProperty('--depth-scale', String(presentation.scale));
      card.style.setProperty('--depth-opacity', String(presentation.opacity));
      card.style.zIndex = String(presentation.zIndex);
      card.dataset.depthVisible = String(presentation.visible);
      card.dataset.depthDominant = String(presentation.dominant);
    });

    setActive(state.activeIndex, source);
    sectionRef.current?.toggleAttribute('data-motion-engaged', state.motionEngaged);
  }, [setActive]);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMode = () => setMode(getPackageCarouselMode(window.innerWidth, motion.matches));
    window.addEventListener('resize', updateMode, { passive: true });
    motion.addEventListener('change', updateMode);
    return () => {
      window.removeEventListener('resize', updateMode);
      motion.removeEventListener('change', updateMode);
    };
  }, []);

  useEffect(() => {
    const wasSuspended = suspendedRef.current;
    suspendedRef.current = suspended;
    if (wasSuspended && !suspended && mode === 'depth') renderDepth(progressRef.current, 'scroll');
  }, [mode, renderDepth, suspended]);

  useEffect(() => {
    if (mode !== 'depth') {
      sectionRef.current?.removeAttribute('data-motion-engaged');
      sectionRef.current?.removeAttribute('data-depth-ready');
      return;
    }

    const preservedProgress = packageIndexToProgress(activeRef.current, packages.length);
    renderDepth(preservedProgress, 'control');
    if (!sectionRef.current) return;
    const sectionWasVisible = (() => {
      const bounds = sectionRef.current!.getBoundingClientRect();
      return bounds.bottom > PACKAGE_PIN_OFFSET && bounds.top < window.innerHeight;
    })();

    let cancelled = false;
    let contextCleanup = () => {};
    const approach = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      approach.disconnect();
      void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
        if (cancelled || !sectionRef.current) return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = triggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        let acceptsScrollUpdates = false;
        const context = gsap.context(() => {
          const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: `top ${PACKAGE_PIN_OFFSET}px`,
            end: 'bottom bottom',
            scrub: .65,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (suspendedRef.current || !acceptsScrollUpdates) return;
              const nextState = getPackageDepthState(self.progress, packages.length);
              const pending = pendingNavigationRef.current;
              const inputSource = pending && pending.index === nextState.activeIndex ? pending.source : 'scroll';
              renderDepth(self.progress, inputSource);
              if (pending && pending.index === nextState.activeIndex) pendingNavigationRef.current = null;
            },
          });
          if (sectionWasVisible && sectionRef.current) {
            const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
            const triggerStart = sectionTop - PACKAGE_PIN_OFFSET;
            const triggerEnd = sectionTop + sectionRef.current.offsetHeight - window.innerHeight;
            scrollToExact(triggerStart + preservedProgress * Math.max(1, triggerEnd - triggerStart));
            acceptsScrollUpdates = true;
            trigger.update();
          } else {
            renderDepth(preservedProgress, 'control');
            acceptsScrollUpdates = true;
          }
          sectionRef.current?.setAttribute('data-depth-ready', '');
        }, sectionRef);
        contextCleanup = () => {
          sectionRef.current?.removeAttribute('data-depth-ready');
          context.revert();
        };
      });
    }, { rootMargin: '650px 0px', threshold: .01 });
    approach.observe(sectionRef.current);

    return () => {
      cancelled = true;
      approach.disconnect();
      contextCleanup();
    };
  }, [mode, renderDepth]);

  const goTo = useCallback((index: number, source: CarouselInputMethod) => {
    const next = wrapPackageIndex(index, packages.length);
    setHasInteracted(true);

    if (mode === 'depth' && sectionRef.current) {
      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      const triggerStart = sectionTop - PACKAGE_PIN_OFFSET;
      const triggerEnd = sectionTop + sectionRef.current.offsetHeight - window.innerHeight;
      const scrollRange = Math.max(1, triggerEnd - triggerStart);
      const progress = packageIndexToProgress(next, packages.length);
      if (next === activeRef.current) {
        scrollToExact(triggerStart + progress * scrollRange);
        renderDepth(progress, source);
        return;
      }
      pendingNavigationRef.current = { index: next, source };
      scrollToExact(triggerStart + progress * scrollRange);
      return;
    }

    setActive(next, source);
  }, [mode, renderDepth, setActive]);

  const openPackage = (event: MouseEvent<HTMLButtonElement>, item: TravelPackage) => {
    if (didSwipeRef.current) {
      didSwipeRef.current = false;
      return;
    }
    const card = event.currentTarget.closest<HTMLElement>('[data-package-card]');
    onOpen(item, card?.querySelector('img') ?? null);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.target as Element).closest('.depth-card__actions')) return;
    didSwipeRef.current = false;
    pointerStartRef.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStartRef.current === null) return;
    const deltaX = event.clientX - pointerStartRef.current;
    pointerStartRef.current = null;
    const target = swipeTargetIndex(activeRef.current, deltaX, packages.length);
    didSwipeRef.current = Math.abs(deltaX) >= SWIPE_THRESHOLD_PX;
    if (target === activeRef.current) return;
    if (didSwipeRef.current) window.setTimeout(() => { didSwipeRef.current = false; }, 0);
    goTo(target, 'pointer');
  };

  const onPointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    pointerStartRef.current = null;
    didSwipeRef.current = false;
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest('.depth-card__actions')) return;
    didSwipeRef.current = false;
    pointerStartRef.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (pointerStartRef.current === null) return;
    const deltaX = (event.changedTouches[0]?.clientX ?? pointerStartRef.current) - pointerStartRef.current;
    pointerStartRef.current = null;
    const target = swipeTargetIndex(activeRef.current, deltaX, packages.length);
    didSwipeRef.current = Math.abs(deltaX) >= SWIPE_THRESHOLD_PX;
    if (target === activeRef.current) return;
    if (didSwipeRef.current) window.setTimeout(() => { didSwipeRef.current = false; }, 0);
    goTo(target, 'pointer');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    let target: number | undefined;
    if (event.key === 'ArrowLeft') target = activeRef.current - 1;
    if (event.key === 'ArrowRight') target = activeRef.current + 1;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = packages.length - 1;
    if (target === undefined) return;
    event.preventDefault();
    goTo(target, 'keyboard');
  };

  const renderCard = (item: TravelPackage, index: number, depth: boolean) => {
    const isActive = index === activeIndex;
    return (
      <article
        ref={depth ? (node) => { cardRefs.current[index] = node; } : undefined}
        key={item.id}
        className={`depth-card${isActive ? ' is-active' : ''}${!depth && hasInteracted ? ' is-transitioning' : ''}`}
        data-package-card
        data-package-id={item.id}
        data-package-index={index}
        aria-current={isActive ? 'true' : undefined}
        aria-hidden={depth && !isActive ? 'true' : undefined}
      >
        <button
          className="depth-card__media"
          type="button"
          tabIndex={depth && !isActive ? -1 : undefined}
          aria-label={isActive ? `Open ${item.title} itinerary` : `Show ${item.title}`}
          onClick={(event) => isActive ? openPackage(event, item) : goTo(index, 'pointer')}
        >
          <picture>
            <source type="image/avif" srcSet={getPackageResponsiveImageSrcSet(item.id, 'avif')} sizes="(min-width: 1100px) 56vw, 100vw" />
            <source type="image/webp" srcSet={getPackageResponsiveImageSrcSet(item.id, 'webp')} sizes="(min-width: 1100px) 56vw, 100vw" />
            <img
              src={item.image}
              alt={item.imageAlt}
              width="3840"
              height="2160"
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </picture>
        </button>
        <div className="depth-card__body" aria-hidden={depth && !isActive ? 'true' : undefined} inert={depth && !isActive ? true : undefined}>
          <p>{item.location}<span>{item.duration}</span></p>
          <h3>{item.editorialTitle}</h3>
          <small>{item.title}</small>
          <strong>{getPackagePriceLabel(item)}</strong>
          <div className="depth-card__actions">
            <button type="button" tabIndex={depth && !isActive ? -1 : undefined} aria-label={`View itinerary for ${item.title}`} onClick={(event) => openPackage(event, item)}>View itinerary <ArrowRight aria-hidden="true" /></button>
            <button type="button" tabIndex={depth && !isActive ? -1 : undefined} aria-label={`Get a quote for ${item.title}`} onClick={() => onEnquire(item)}>Get a quote</button>
          </div>
        </div>
      </article>
    );
  };

  const isDepth = mode === 'depth';

  return (
    <section ref={sectionRef} id="packages" className={`depth-packages depth-packages--${mode}`} aria-labelledby="packages-title" data-section="packages">
      <div className="depth-packages__stage shell">
        <header className="depth-packages__heading content-reveal">
          <p className="kicker">Travel packages</p>
          <h2 id="packages-title">Six journeys. One world in motion.</h2>
          <p>Consider these a beginning. Every route, stay and experience can be shaped around you.</p>
        </header>

        <div ref={deckRef} className="depth-packages__deck" role="region" aria-roledescription="carousel" aria-label="Travel packages" tabIndex={0} onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <p className="sr-only" aria-live="polite" aria-atomic="true">{activePackage.title}, {activeIndex + 1} of {packages.length}</p>
          <div className="depth-packages__rail">
            {isDepth ? packages.map((item, index) => renderCard(item, index, true)) : renderCard(activePackage, activeIndex, false)}
          </div>
        </div>

        <footer className="depth-packages__footer">
          <p className="depth-packages__note">Pricing is confirmed before commitment and remains subject to availability.</p>
          <div className="depth-packages__controls" aria-label="Package carousel controls">
            <button type="button" aria-label="Show previous package" onClick={() => goTo(activeRef.current - 1, 'control')}><ArrowLeft aria-hidden="true" /></button>
            <span><strong>{String(activeIndex + 1).padStart(2, '0')}</strong> / {String(packages.length).padStart(2, '0')}</span>
            <button type="button" aria-label="Show next package" onClick={() => goTo(activeRef.current + 1, 'control')}><ArrowRight aria-hidden="true" /></button>
          </div>
        </footer>
      </div>
    </section>
  );
}
