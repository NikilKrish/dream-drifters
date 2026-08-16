import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { packages } from '../data/packages';
import { track } from '../lib/analytics';
import { clampPackageIndex, dragTargetIndex, getCardPresentation, getCarouselMode, packagePositionToIndex, progressToPackagePosition, type CarouselInputMethod } from '../lib/carousel';
import type { TravelPackage } from '../types';
import { getPackagePriceLabel } from './PackagesSection';

interface DepthPackagesSectionProps {
  onOpen: (travelPackage: TravelPackage, sourceImage: HTMLElement | null) => void;
  onEnquire: (travelPackage: TravelPackage) => void;
}

export function DepthPackagesSection({ onOpen, onEnquire }: DepthPackagesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const triggerRef = useRef<{ start: number; end: number; kill: () => void } | null>(null);
  const dragStartRef = useRef<number | null>(null);
  const activeRef = useRef(0);
  const sourceRef = useRef<CarouselInputMethod>('scroll');
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState(() => getCarouselMode(typeof window === 'undefined' ? 1440 : window.innerWidth, typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches));
  const activePackage = packages[activeIndex];

  const setActive = useCallback((index: number, source: CarouselInputMethod) => {
    const next = clampPackageIndex(index, packages.length);
    if (activeRef.current === next) return;
    activeRef.current = next;
    sourceRef.current = source;
    setActiveIndex(next);
    track('package_stage_changed', { package_id: packages[next].id, input_method: source });
  }, []);

  const renderDepth = useCallback((position: number, source: CarouselInputMethod = 'scroll') => {
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const presentation = getCardPresentation(index, position);
      card.style.setProperty('--depth-x', `${presentation.xPercent}%`);
      card.style.setProperty('--depth-scale', String(presentation.scale));
      card.style.setProperty('--depth-opacity', String(presentation.opacity));
      card.style.zIndex = String(presentation.zIndex);
      card.dataset.depthVisible = String(presentation.visible);
    });
    setActive(packagePositionToIndex(position, packages.length), source);
    stageRef.current?.style.setProperty('--destination-pan', `${position * -8}%`);
  }, [setActive]);

  useEffect(() => {
    const updateMode = () => setMode(getCarouselMode(window.innerWidth, matchMedia('(prefers-reduced-motion: reduce)').matches));
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    window.addEventListener('resize', updateMode, { passive: true });
    motion.addEventListener('change', updateMode);
    return () => { window.removeEventListener('resize', updateMode); motion.removeEventListener('change', updateMode); };
  }, []);

  useEffect(() => {
    if (mode !== 'depth') {
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.style.removeProperty('--depth-x');
        card.style.removeProperty('--depth-scale');
        card.style.removeProperty('--depth-opacity');
        card.style.removeProperty('z-index');
        delete card.dataset.depthVisible;
      });
      stageRef.current?.style.removeProperty('--destination-pan');
      return;
    }
    renderDepth(activeRef.current);
    if (!sectionRef.current || !stageRef.current) return;
    let cancelled = false;
    let contextCleanup = () => {};
    const approach = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      approach.disconnect();
      void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
        if (cancelled || !sectionRef.current || !stageRef.current) return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = triggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {
          const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: .7,
            invalidateOnRefresh: true,
            onUpdate: (self) => renderDepth(progressToPackagePosition(self.progress, packages.length), 'scroll'),
          });
          triggerRef.current = trigger;
        }, sectionRef);
        contextCleanup = () => { triggerRef.current = null; context.revert(); };
      });
    }, { rootMargin: '700px 0px', threshold: .01 });
    approach.observe(sectionRef.current);
    return () => { cancelled = true; approach.disconnect(); contextCleanup(); };
  }, [mode, renderDepth]);

  useEffect(() => {
    if ((mode !== 'mobile' && mode !== 'tablet') || !railRef.current) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.packageIndex), 'scroll');
    }), { root: railRef.current, threshold: .68 });
    cardRefs.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, [mode, setActive]);

  const goTo = (index: number, source: CarouselInputMethod) => {
    const next = clampPackageIndex(index, packages.length);
    setActive(next, source);
    if (mode === 'depth' && triggerRef.current) {
      const progress = next / (packages.length - 1);
      window.scrollTo({ top: triggerRef.current.start + progress * (triggerRef.current.end - triggerRef.current.start), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      return;
    }
    cardRefs.current[next]?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  };

  const openPackage = (event: MouseEvent<HTMLButtonElement>, item: TravelPackage) => {
    const card = event.currentTarget.closest<HTMLElement>('[data-package-card]');
    onOpen(item, card?.querySelector('img') ?? null);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (mode !== 'depth') return;
    if ((event.target as Element).closest('.depth-card__actions')) return;
    dragStartRef.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (mode !== 'depth' || dragStartRef.current === null) return;
    const target = dragTargetIndex(activeRef.current, event.clientX - dragStartRef.current, deckRef.current?.clientWidth ?? 0, packages.length);
    dragStartRef.current = null;
    goTo(target, 'pointer');
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    goTo(activeRef.current + (event.key === 'ArrowRight' ? 1 : -1), 'keyboard');
  };

  return (
    <section ref={sectionRef} id="packages" className={`depth-packages depth-packages--${mode}`} aria-labelledby="packages-title" data-section="packages">
      <div ref={stageRef} className="depth-packages__stage shell">
        <header className="depth-packages__heading content-reveal"><p className="kicker">Travel packages</p><h2 id="packages-title">Six journeys. One world in motion.</h2><p>Consider these a beginning. Every route, stay and experience can be shaped around you.</p></header>
        <div className="depth-packages__destinations" aria-hidden="true"><span>Maldives · Japan · Switzerland · Bali · Paris · Dubai · Maldives · Japan · Switzerland · Bali · Paris · Dubai</span></div>
        <div ref={deckRef} className="depth-packages__deck" role="region" aria-roledescription="carousel" aria-label="Travel packages" tabIndex={0} onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          <p className="sr-only" aria-live="polite">{activePackage.title}, package {activeIndex + 1} of {packages.length}</p>
          <div ref={railRef} className="depth-packages__rail">
            {packages.map((item, index) => {
              const isActive = index === activeIndex;
              const isAdjacent = Math.abs(index - activeIndex) === 1;
              return <article ref={(node) => { cardRefs.current[index] = node; }} key={item.id} className={`depth-card${isActive ? ' is-active' : ''}${isAdjacent ? ' is-adjacent' : ''}`} data-package-card data-package-index={index} aria-current={isActive ? 'true' : undefined}>
                <button className="depth-card__media" type="button" aria-label={isActive ? `Open ${item.title} itinerary` : `Show ${item.title}`} onClick={(event) => isActive ? openPackage(event, item) : goTo(index, 'pointer')}><picture><source type="image/avif" srcSet={item.imageAvif} /><img src={item.image} alt={item.imageAlt} width="1400" height="1100" loading={index < 2 ? 'eager' : 'lazy'} decoding="async" /></picture><span>{String(index + 1).padStart(2, '0')}</span></button>
                <div className="depth-card__body"><p>{item.location}<span>{item.duration}</span></p><h3>{item.editorialTitle}</h3><small>{item.title}</small><strong>{getPackagePriceLabel(item)}</strong><div className="depth-card__actions"><button type="button" aria-label={`View itinerary for ${item.title}`} onClick={(event) => openPackage(event, item)}>View itinerary <ArrowRight aria-hidden="true" /></button><button type="button" aria-label={`Get a quote for ${item.title}`} onClick={() => onEnquire(item)}>Get a quote</button></div></div>
              </article>;
            })}
          </div>
        </div>
        <div className="depth-packages__controls" aria-label="Package carousel controls"><button type="button" disabled={activeIndex === 0} aria-label="Show previous package" onClick={() => goTo(activeIndex - 1, 'control')}><ArrowLeft aria-hidden="true" /></button><span><strong>{String(activeIndex + 1).padStart(2, '0')}</strong> / {String(packages.length).padStart(2, '0')}</span><button type="button" disabled={activeIndex === packages.length - 1} aria-label="Show next package" onClick={() => goTo(activeIndex + 1, 'control')}><ArrowRight aria-hidden="true" /></button></div>
        <p className="depth-packages__note">Pricing is confirmed before commitment and remains subject to availability.</p>
      </div>
    </section>
  );
}
