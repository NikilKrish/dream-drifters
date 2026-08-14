import { ArrowRight, X } from '@phosphor-icons/react';
import { useCallback, useEffect, useRef } from 'react';
import type { TravelPackage } from '../types';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { prefersReducedMotion } from '../lib/motion';
import { getPackagePriceLabel } from './PackagesSection';

interface PackageSheetProps {
  travelPackage: TravelPackage | null;
  sourceImage: HTMLElement | null;
  onClose: () => void;
  onPlan: (travelPackage: TravelPackage) => void;
}

export function PackageSheet({ travelPackage, sourceImage, onClose, onPlan }: PackageSheetProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const close = useCallback(onClose, [onClose]);
  useFocusTrap(dialogRef, Boolean(travelPackage), close);

  useEffect(() => {
    if (!travelPackage) return;
    document.body.classList.add('overlay-open');
    let cancelled = false;
    let cleanup: () => void = () => {};
    const reduceMotion = prefersReducedMotion();
    void Promise.all([import('gsap'), import('gsap/Flip')]).then(([gsapModule, flipModule]) => {
      if (cancelled || !dialogRef.current) return;
      const gsap = gsapModule.gsap;
      const Flip = flipModule.Flip;
      gsap.registerPlugin(Flip);
      const context = gsap.context(() => {
        gsap.fromTo('.package-sheet__backdrop', { autoAlpha: 0 }, { autoAlpha: 1, duration: reduceMotion ? 0 : 0.28 });
        gsap.fromTo('.package-sheet__panel', { yPercent: reduceMotion ? 0 : 4, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: reduceMotion ? 0 : 0.56, ease: 'power4.out' });
        if (!reduceMotion && sourceImage && imageRef.current) {
          Flip.fit(imageRef.current, sourceImage, { scale: true });
          gsap.to(imageRef.current, { clearProps: 'transform', duration: 0.72, ease: 'power4.inOut' });
        }
      }, dialogRef);
      cleanup = () => context.revert();
    });
    return () => { cancelled = true; cleanup(); document.body.classList.remove('overlay-open'); };
  }, [sourceImage, travelPackage]);

  if (!travelPackage) return null;
  return (
    <div className="package-sheet" role="dialog" aria-modal="true" aria-labelledby="package-title" ref={dialogRef}>
      <button className="package-sheet__backdrop" type="button" onClick={onClose} aria-label="Close journey details" />
      <article className="package-sheet__panel">
        <button className="icon-button package-sheet__close" type="button" onClick={onClose} aria-label="Close journey details"><X aria-hidden="true" weight="bold" /></button>
        <div className="package-sheet__media"><picture><source type="image/avif" srcSet={travelPackage.imageAvif} /><img ref={imageRef} src={travelPackage.image} width="1400" height="1100" alt={travelPackage.imageAlt} /></picture></div>
        <div className="package-sheet__body">
          <p className="package-sheet__meta">{travelPackage.location}<span>{travelPackage.duration}</span></p>
          <h2 id="package-title">{travelPackage.editorialTitle}</h2>
          <p className="package-sheet__summary">{travelPackage.summary}</p>
          <div className="package-sheet__facts"><div><span>Current pricing</span><strong>{getPackagePriceLabel(travelPackage)}</strong><small>Confirmed before you commit</small></div><div><span>Designed for</span><strong>{travelPackage.mood}</strong><small>Fully customisable</small></div></div>
          <div className="package-sheet__columns">
            <div><h3>Journey includes</h3><ul>{travelPackage.inclusions.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h3>Day by day</h3><ol>{travelPackage.itinerary.map((item) => <li key={`${item.day}-${item.title}`}><span>{item.day}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div></li>)}</ol></div>
          </div>
          <button className="button button--accent package-sheet__plan" type="button" aria-label={`Get a quote for ${travelPackage.title}`} onClick={() => onPlan(travelPackage)}>Get a quote <ArrowRight aria-hidden="true" weight="bold" /></button>
        </div>
      </article>
    </div>
  );
}
