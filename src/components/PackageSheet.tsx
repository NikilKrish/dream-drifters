import { ArrowRight, X } from '@phosphor-icons/react';
import { useCallback, useEffect, useRef } from 'react';
import { getPackageResponsiveImageSrcSet } from '../data/media';
import type { TravelPackage } from '../types';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { prefersReducedMotion } from '../lib/motion';
import { getPackagePriceLabel } from './PackagesSection';

interface PackageSheetProps {
  travelPackage: TravelPackage | null;
  sourceImage: HTMLElement | null;
  returnFocus?: HTMLElement | null;
  onClose: () => void;
  onPlan: (travelPackage: TravelPackage) => void;
}

interface DetailListSectionProps {
  id: string;
  title: string;
  items: string[];
}

function DetailListSection({ id, title, items }: DetailListSectionProps) {
  if (items.length === 0) return null;
  return (
    <section className="package-sheet__section" aria-labelledby={id}>
      <h3 id={id}>{title}</h3>
      <ul>{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
    </section>
  );
}

export function PackageSheet({ travelPackage, sourceImage, returnFocus, onClose, onPlan }: PackageSheetProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const shouldRestoreFocusRef = useRef(true);
  const close = useCallback(() => {
    shouldRestoreFocusRef.current = true;
    onClose();
  }, [onClose]);
  const plan = useCallback((item: TravelPackage) => {
    shouldRestoreFocusRef.current = false;
    onPlan(item);
  }, [onPlan]);
  useFocusTrap(dialogRef, Boolean(travelPackage), close, returnFocus, shouldRestoreFocusRef);

  useEffect(() => {
    if (travelPackage) shouldRestoreFocusRef.current = true;
  }, [travelPackage]);

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
  const brochure = travelPackage.brochure;
  const departureSchedule = brochure?.departureSchedule;
  const headingId = (section: string) => `${travelPackage.id}-${section}-title`;
  return (
    <div className="package-sheet" role="dialog" aria-modal="true" aria-labelledby="package-title" ref={dialogRef}>
      <button className="package-sheet__backdrop" type="button" onClick={close} aria-label="Close journey details" />
      <article className="package-sheet__panel">
        <button className="icon-button package-sheet__close" type="button" onClick={close} aria-label="Close journey details"><X aria-hidden="true" weight="bold" /></button>
        <div className="package-sheet__media"><picture><source type="image/avif" srcSet={getPackageResponsiveImageSrcSet(travelPackage.id, 'avif')} sizes="(min-width: 900px) 50vw, 100vw" /><source type="image/webp" srcSet={getPackageResponsiveImageSrcSet(travelPackage.id, 'webp')} sizes="(min-width: 900px) 50vw, 100vw" /><img ref={imageRef} src={travelPackage.image} width="3840" height="2160" alt={travelPackage.imageAlt} decoding="async" /></picture></div>
        <div className="package-sheet__body">
          <p className="package-sheet__meta">{travelPackage.location}<span>{travelPackage.duration}</span></p>
          <h2 id="package-title">{travelPackage.editorialTitle}</h2>
          <p className="package-sheet__summary">{travelPackage.summary}</p>
          <div className="package-sheet__details">
            <section className="package-sheet__section package-sheet__key-facts" aria-labelledby={headingId('key-facts')}>
              <h3 id={headingId('key-facts')}>Key facts</h3>
              <dl className="package-sheet__facts">
                <div><dt>Current pricing</dt><dd><strong>{getPackagePriceLabel(travelPackage)}</strong><small>Confirmed before you commit</small></dd></div>
                <div><dt>Designed for</dt><dd><strong>{travelPackage.mood}</strong><small>Fully customisable</small></dd></div>
                {brochure?.minimumTravellers !== undefined && <div><dt>Minimum travellers</dt><dd><strong>{brochure.minimumTravellers}</strong><small>Minimum group size</small></dd></div>}
              </dl>
              {brochure?.commercialNotes && brochure.commercialNotes.length > 0 && (
                <div className="package-sheet__commercial-notes">
                  <h4>Commercial notes</h4>
                  <ul>{brochure.commercialNotes.map((note, index) => <li key={`${note}-${index}`}>{note}</li>)}</ul>
                </div>
              )}
            </section>

            {departureSchedule && departureSchedule.programmes.length > 0 && (
              <section className="package-sheet__section" aria-labelledby={headingId('departures')}>
                <h3 id={headingId('departures')}>Departure schedule</h3>
                <div className="package-sheet__table-scroll" role="region" aria-label={`${departureSchedule.caption} table`} tabIndex={0}>
                  <table>
                    <caption>{departureSchedule.caption}</caption>
                    <thead>
                      <tr>
                        <th scope="col">Programme</th>
                        <th scope="col">Duration</th>
                        {departureSchedule.months.map((month, index) => <th scope="col" key={`${month}-${index}`}>{month}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {departureSchedule.programmes.map((programme) => (
                        <tr key={programme.name}>
                          <th scope="row">{programme.name}</th>
                          <td>{programme.duration}</td>
                          {departureSchedule.months.map((month, index) => {
                            const departure = programme.departures[index];
                            return <td key={`${programme.name}-${month}-${index}`}>{departure ?? <span aria-label="No departure">—</span>}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            <DetailListSection id={headingId('highlights')} title="Highlights" items={brochure?.highlights ?? []} />
            <DetailListSection id={headingId('accommodation')} title="Accommodation" items={brochure?.accommodation ?? []} />
            <DetailListSection id={headingId('inclusions')} title="Inclusions" items={travelPackage.inclusions} />
            <DetailListSection id={headingId('exclusions')} title="Exclusions" items={brochure?.exclusions ?? []} />

            {travelPackage.itinerary.length > 0 && (
              <section className="package-sheet__section package-sheet__itinerary" aria-labelledby={headingId('itinerary')}>
                <h3 id={headingId('itinerary')}>Day-by-day itinerary</h3>
                <ol>{travelPackage.itinerary.map((item) => <li key={`${item.day}-${item.title}`}><span>{item.day}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div></li>)}</ol>
              </section>
            )}

            {brochure?.contentNotice && (
              <section className="package-sheet__section package-sheet__notice" aria-labelledby={headingId('content-notice')}>
                <h3 id={headingId('content-notice')}>Content notice</h3>
                <p>{brochure.contentNotice}</p>
              </section>
            )}
          </div>
          <button className="button button--accent package-sheet__plan" type="button" aria-label={`Get a quote for ${travelPackage.title}`} onClick={() => plan(travelPackage)}>Get a quote <ArrowRight aria-hidden="true" weight="bold" /></button>
        </div>
      </article>
    </div>
  );
}
