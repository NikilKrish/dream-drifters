import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { useRef, type MouseEvent } from 'react';
import { packages } from '../data/packages';
import type { TravelPackage } from '../types';

interface PackagesSectionProps {
  onOpen: (travelPackage: TravelPackage, sourceImage: HTMLElement | null) => void;
  onEnquire: (travelPackage: TravelPackage) => void;
}

export function getPackagePriceLabel(item: TravelPackage): string {
  return item.priceStatus === 'verified' || item.priceStatus === 'indicative' ? `From ${item.price}` : 'Request current quote';
}

export function PackagesSection({ onOpen, onEnquire }: PackagesSectionProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const openPackage = (event: MouseEvent<HTMLButtonElement>, travelPackage: TravelPackage) => {
    const card = event.currentTarget.closest<HTMLElement>('.package-card');
    onOpen(travelPackage, card?.querySelector('img') ?? null);
  };
  const moveRail = (direction: -1 | 1) => railRef.current?.scrollBy({ left: direction * Math.min(railRef.current.clientWidth * 0.86, 380), behavior: 'smooth' });

  return (
    <section id="packages" className="packages chapter" aria-labelledby="packages-title" data-section="packages">
      <div className="shell">
        <header className="chapter-heading"><p className="kicker">Travel packages</p><h2 id="packages-title">Six journeys to begin with.</h2><p>Use these itineraries as a starting point. Every detail can be shaped around you.</p></header>
        <div className="package-rail__controls" aria-label="Package carousel controls">
          <button type="button" aria-label="Show previous package" onClick={() => moveRail(-1)}><ArrowLeft aria-hidden="true" weight="bold" /></button>
          <button type="button" aria-label="Show next package" onClick={() => moveRail(1)}><ArrowRight aria-hidden="true" weight="bold" /></button>
        </div>
        <div ref={railRef} className="packages__grid">
          {packages.map((item) => (
            <article className={`package-card package-card--${item.layout}`} key={item.id}>
              <div className="package-card__media"><picture><source type="image/avif" srcSet={item.imageAvif} /><img src={item.image} width="1400" height="1100" loading="lazy" decoding="async" alt={item.imageAlt} /></picture></div>
              <div className="package-card__body">
                <p className="package-card__location">{item.location}<span>{item.duration}</span></p>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <strong className="package-card__price">{getPackagePriceLabel(item)}</strong>
                <div className="package-card__actions">
                  <button className="text-action" type="button" aria-label={`View itinerary for ${item.title}`} onClick={(event) => openPackage(event, item)}>View itinerary <ArrowRight aria-hidden="true" weight="bold" /></button>
                  <button className="button button--quiet button--small" type="button" aria-label={`Get a quote for ${item.title}`} onClick={() => onEnquire(item)}>Get a quote</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="packages__note">Package pricing is shown only after confirmation and remains subject to availability.</p>
      </div>
    </section>
  );
}
