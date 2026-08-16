import { ArrowLeft, ArrowRight, CheckCircle, List, PaperPlaneTilt, X } from '@phosphor-icons/react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import type { ActiveServiceId } from '../../shared/brief';
import { BrandMark } from '../components/BrandMark';
import { CinematicVideo } from '../components/CinematicVideo';
import { capabilities, companyStory, proofItems, trustReasons } from '../data/company';
import { packages } from '../data/packages';
import type { CapabilityId, TravelPackage } from '../types';
import './prototype.css';

type VariantId = 'A' | 'B' | 'C';
type Selection = { kind: 'package'; id: string; label: string } | { kind: 'service'; id: ActiveServiceId; label: string } | { kind: 'custom'; label: string };

const variantNames: Record<VariantId, string> = {
  A: 'Cinematic Chapters',
  B: 'Editorial Intelligence',
  C: 'Guided Explorer',
};

const navItems = [
  ['about', 'About'], ['services', 'Services'], ['packages', 'Packages'], ['reviews', 'Reviews'],
] as const;

function scrollToChapter(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

function PrototypeNavigation({ onQuote }: { onQuote: () => void }) {
  const [open, setOpen] = useState(false);
  return <header className={`proto-nav${open ? ' is-open' : ''}`}>
    <a className="proto-brand" href="#home" aria-label="Dream Drifters home"><BrandMark light /></a>
    <button className="proto-menu-button" type="button" aria-expanded={open} aria-controls="prototype-menu" onClick={() => setOpen((value) => !value)}>{open ? <X /> : <List />}<span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span></button>
    <nav id="prototype-menu" aria-label="Primary navigation">
      {navItems.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
      <button type="button" className="proto-pill proto-pill--cyan" onClick={() => { setOpen(false); onQuote(); }}>Get a quote</button>
    </nav>
  </header>;
}

function Hero({ variant, onPackages, onQuote }: { variant: VariantId; onPackages: () => void; onQuote: () => void }) {
  return <section id="home" className="proto-hero" data-section="hero" aria-labelledby="proto-hero-title">
    <CinematicVideo className="proto-media" poster="/media/hero.webp" posterAvif="/media/hero.avif" mobilePoster="/media/hero-mobile.webp" mobilePosterAvif="/media/hero-mobile.avif" mp4="/media/discovery.mp4" webm="/media/discovery.webm" mobileMp4="/media/discovery-mobile.mp4" mobileWebm="/media/discovery-mobile.webm" alt="Tropical shoreline seen from above" eager />
    <div className="proto-hero-shade" />
    <div className="proto-shell proto-hero-copy proto-reveal">
      <p className="proto-kicker">Leisure · Business · Groups</p>
      {variant === 'B' && <p className="proto-edition">A Chennai travel company<br />with a world of connections</p>}
      <h1 id="proto-hero-title"><span>Your journey.</span><span>Our passion.</span></h1>
      <p>Personal holidays, purposeful business travel and group experiences, all shaped by one attentive team.</p>
      <div className="proto-actions"><button className="proto-pill proto-pill--cyan" type="button" onClick={onPackages}>Explore packages</button><button className="proto-pill proto-pill--ghost" type="button" onClick={onQuote}>Get a quote</button></div>
    </div>
    {variant === 'C' && <div className="proto-hero-context"><span>Start with</span><button onClick={onPackages}>A destination</button><button onClick={() => scrollToChapter('services')}>A travel need</button></div>}
  </section>;
}

function Metrics() {
  return <section className="proto-proof" data-section="metrics" aria-label="Company facts"><div className="proto-shell proto-proof-grid">
    {proofItems.map((item) => <article className="proto-reveal" key={item.label}><strong>{item.label}</strong><p>{item.detail}</p></article>)}
  </div></section>;
}

function Story({ variant }: { variant: VariantId }) {
  return <>
    <section id="about" className="proto-section proto-about" data-section="about" aria-labelledby="proto-about-title"><div className="proto-shell proto-about-grid">
      <div className="proto-about-media proto-reveal"><picture><source type="image/avif" srcSet="/media/japan.avif" /><img src="/media/japan.webp" alt="Mount Fuji beyond a quiet landscape" width="1200" height="900" loading="lazy" /></picture></div>
      <div className="proto-story-copy proto-reveal"><p className="proto-index">01 / About</p><h2 id="proto-about-title">Travel shaped around people and purpose.</h2><p>{companyStory.about}</p>{variant === 'B' && <aside>Local attention.<br />International reach.<br />One clear point of contact.</aside>}</div>
    </div></section>
    <section className="proto-section proto-purpose" data-section="purpose" aria-labelledby="proto-purpose-title"><div className="proto-purpose-media"><picture><source type="image/avif" srcSet="/media/switzerland.avif" /><img src="/media/switzerland.webp" alt="A calm alpine lake beneath high mountains" width="1600" height="1000" loading="lazy" /></picture></div><div className="proto-purpose-wash" />
      <div className="proto-shell proto-purpose-content proto-reveal"><div><p className="proto-index">02 / Direction</p><h2 id="proto-purpose-title">A better way to move through the world.</h2></div><div className="proto-purpose-statements"><article><span>Vision</span><p>{companyStory.vision}</p></article><article><span>Mission</span><p>{companyStory.mission}</p></article></div></div>
    </section>
  </>;
}

function ServiceAction({ capabilityId, onSelect }: { capabilityId: CapabilityId; onSelect: (id: CapabilityId) => void }) {
  const capability = capabilities.find((item) => item.id === capabilityId)!;
  return <button className="proto-text-action" type="button" onClick={() => onSelect(capability.id)}>{capability.action.kind === 'packages' ? 'Explore packages' : 'Get a quote'}<ArrowRight /></button>;
}

function Services({ variant, onSelect }: { variant: VariantId; onSelect: (id: CapabilityId) => void }) {
  const [activeId, setActiveId] = useState<CapabilityId>('tour-packages');
  const cinematicRef = useRef<HTMLElement>(null);
  const active = capabilities.find((item) => item.id === activeId)!;
  useEffect(() => {
    if (variant !== 'A' || !cinematicRef.current || !matchMedia('(min-width: 1100px)').matches) return;
    const markers = Array.from(cinematicRef.current.querySelectorAll<HTMLElement>('[data-capability-marker]'));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveId(entry.target.getAttribute('data-capability-marker') as CapabilityId);
    }), { rootMargin: '-46% 0px -46%', threshold: 0 });
    markers.forEach((marker) => observer.observe(marker));
    return () => observer.disconnect();
  }, [variant]);
  if (variant === 'B') return <section id="services" className="proto-section proto-services proto-services--editorial" data-section="services" aria-labelledby="proto-services-title"><div className="proto-shell"><header className="proto-section-head"><p className="proto-kicker">Services</p><h2 id="proto-services-title">One network, six connected capabilities.</h2><p>Explore each travel need independently or bring us the whole brief.</p></header><div className="proto-service-ledger"><div role="tablist" aria-label="Travel capabilities">{capabilities.map((item) => <button key={item.id} role="tab" aria-selected={active.id === item.id} onClick={() => setActiveId(item.id)}><span>{item.shortTitle}</span><strong>{item.title}</strong><ArrowRight /></button>)}</div><article className="proto-service-detail" key={active.id}><picture><source type="image/avif" srcSet={active.imageAvif} /><img src={active.image} alt="" width="1000" height="760" loading="lazy" /></picture><div><p>{active.summary}</p><ul>{active.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><ServiceAction capabilityId={active.id} onSelect={onSelect} /></div></article></div></div></section>;

  if (variant === 'C') return <section id="services" className="proto-section proto-services proto-services--guided" data-section="services" aria-labelledby="proto-services-title"><div className="proto-shell"><header className="proto-section-head"><p className="proto-kicker">Services</p><h2 id="proto-services-title">What can we help you move forward?</h2><p>Choose a starting point. Your selection follows you to the enquiry.</p></header><div className="proto-guided-capabilities">{capabilities.map((item) => <article key={item.id} className={active.id === item.id ? 'is-active' : ''} onClick={() => setActiveId(item.id)}><button type="button" aria-pressed={active.id === item.id}><span>{item.shortTitle}</span><strong>{item.title}</strong></button>{active.id === item.id && <div className="proto-guided-answer"><p>{item.summary}</p><ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><ServiceAction capabilityId={item.id} onSelect={onSelect} /></div>}</article>)}</div></div></section>;

  return <section ref={cinematicRef} id="services" className="proto-section proto-services proto-services--cinematic" data-section="services" aria-labelledby="proto-services-title"><CinematicVideo className="proto-media" poster="/media/dubai.webp" posterAvif="/media/dubai.avif" mp4="/media/operations.mp4" webm="/media/operations.webm" mobileMp4="/media/operations-mobile.mp4" mobileWebm="/media/operations-mobile.webm" alt="Travel operations viewed across a city" /><div className="proto-services-shade" /><div className="proto-service-markers" aria-hidden="true">{capabilities.map((item) => <i key={item.id} data-capability-marker={item.id} />)}</div><div className="proto-shell proto-cinematic-stage"><header><p className="proto-kicker">Services</p><h2 id="proto-services-title">Every moving part, considered.</h2><p>Six capabilities. One accountable travel team.</p></header><div className="proto-service-index" role="tablist" aria-label="Travel capabilities">{capabilities.map((item) => <button key={item.id} role="tab" aria-selected={active.id === item.id} onClick={() => setActiveId(item.id)}><span>{item.shortTitle}</span><i /></button>)}</div><article className="proto-service-glass" key={active.id}><p className="proto-service-count">{String(capabilities.indexOf(active) + 1).padStart(2, '0')} / 06</p><h3>{active.title}</h3><p>{active.summary}</p><ul>{active.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><ServiceAction capabilityId={active.id} onSelect={onSelect} /></article></div></section>;
}

function Trust({ variant }: { variant: VariantId }) {
  return <section className={`proto-section proto-trust proto-trust--${variant.toLowerCase()}`} data-section="trust" aria-labelledby="proto-trust-title"><div className="proto-shell proto-trust-layout"><header className="proto-reveal"><p className="proto-index">04 / Why us</p><h2 id="proto-trust-title">Confidence is built into the journey.</h2><p>Clear choices, capable partners and a team that remains visible.</p></header><div className="proto-trust-list">{trustReasons.map((item) => <article className="proto-reveal" key={item.title}><h3>{item.title}</h3><p>{item.detail}</p></article>)}</div></div></section>;
}

function PackageCard({ item, index, onOpen, onSelect }: { item: TravelPackage; index: number; onOpen: (item: TravelPackage) => void; onSelect: (item: TravelPackage) => void }) {
  return <article className="proto-package-card proto-reveal"><button className="proto-package-image" type="button" onClick={() => onOpen(item)} aria-label={`View itinerary for ${item.title}`}><picture><source type="image/avif" srcSet={item.imageAvif} /><img src={item.image} alt={item.imageAlt} width="900" height="900" loading="lazy" /></picture><span>{String(index + 1).padStart(2, '0')}</span></button><div><p>{item.location} · {item.duration}</p><h3>{item.editorialTitle}</h3><span>{item.title}</span><div className="proto-package-actions"><button type="button" onClick={() => onOpen(item)}>View itinerary</button><button type="button" onClick={() => onSelect(item)}>Get a quote</button></div></div></article>;
}

function Packages({ variant, onOpen, onSelect }: { variant: VariantId; onOpen: (item: TravelPackage) => void; onSelect: (item: TravelPackage) => void }) {
  return <section id="packages" className={`proto-section proto-packages proto-packages--${variant.toLowerCase()}`} data-section="packages" aria-labelledby="proto-packages-title"><div className="proto-shell"><header className="proto-section-head"><p className="proto-kicker">Packages</p><h2 id="proto-packages-title">Six journeys. A thousand ways to make them yours.</h2><p>These starting points are adapted around your pace, people and priorities. Request a current quote for live pricing.</p></header><div className="proto-package-collection">{packages.map((item, index) => <PackageCard key={item.id} item={item} index={index} onOpen={onOpen} onSelect={onSelect} />)}</div></div></section>;
}

function Reviews() {
  return <section id="reviews" className="proto-section proto-reviews" data-section="reviews" aria-labelledby="proto-reviews-title"><CinematicVideo className="proto-media" poster="/media/bali.webp" posterAvif="/media/bali.avif" mp4="/media/travellers.mp4" webm="/media/travellers.webm" mobileMp4="/media/travellers-mobile.mp4" mobileWebm="/media/travellers-mobile.webm" alt="Travellers sharing a quiet moment" /><div className="proto-reviews-wash" /><div className="proto-shell proto-reviews-content"><header className="proto-reveal"><p className="proto-index">06 / References</p><h2 id="proto-reviews-title">Trust, without borrowed words.</h2><p>Client stories are published only after verification. References are available directly while that review is completed.</p></header><div className="proto-assurances">{['A named point of contact', 'Clear options before commitment', 'Support through the journey'].map((item) => <article className="proto-reveal" key={item}><CheckCircle /><h3>{item}</h3></article>)}</div></div></section>;
}

function Enquiry({ selection, onClear }: { selection: Selection | null; onClear: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { setSubmitted(false); }, [selection]);
  function submit(event: FormEvent) { event.preventDefault(); setSubmitted(true); requestAnimationFrame(() => headingRef.current?.focus()); }
  return <section id="contact" className="proto-section proto-enquiry" data-section="contact" aria-labelledby="proto-enquiry-title"><div className="proto-shell proto-enquiry-grid"><header><p className="proto-index">07 / Enquiry</p><h2 id="proto-enquiry-title">Tell us where the journey begins.</h2><p>This prototype keeps your selection in this browser only. No enquiry is sent.</p><address><a href="tel:+919363312124">+91 93633 12124</a><a href="mailto:info@dreamdrifters.in">info@dreamdrifters.in</a><span>68, Dhanalakshmi Nagar, 3rd Street<br />Nerkundram, Chennai 600 107</span></address></header>{submitted ? <div className="proto-form proto-success"><CheckCircle /><h3 ref={headingRef} tabIndex={-1}>Your handoff is clear.</h3><p>In the production version, this review state will lead to the existing explicit WhatsApp continuation. Nothing was sent from this prototype.</p><button className="proto-pill proto-pill--cyan" type="button" onClick={() => setSubmitted(false)}>Edit enquiry</button></div> : <form className="proto-form" onSubmit={submit}><div className={`proto-selection${selection ? ' has-selection' : ''}`} aria-live="polite"><span>Your starting point</span><strong>{selection?.label ?? 'A custom travel request'}</strong>{selection && <button type="button" onClick={onClear}>Change</button>}</div><div className="proto-field-row"><label><span>Name</span><input required name="name" autoComplete="name" /></label><label><span>Mobile</span><input required name="mobile" autoComplete="tel" /></label></div><label><span>Email</span><input required type="email" name="email" autoComplete="email" /></label><label><span>What should we know?</span><textarea name="notes" rows={4} placeholder="Timing, travellers, business requirements or the feeling you want from the trip" /></label><label className="proto-consent"><input required type="checkbox" /><span>I agree that Dream Drifters may contact me about this enquiry.</span></label><button className="proto-pill proto-pill--cyan proto-submit" type="submit"><PaperPlaneTilt />Review enquiry</button></form>}</div></section>;
}

function Itinerary({ item, onClose, onSelect }: { item: TravelPackage; onClose: () => void; onSelect: (item: TravelPackage) => void }) {
  useEffect(() => { const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); addEventListener('keydown', close); return () => removeEventListener('keydown', close); }, [onClose]);
  return <div className="proto-itinerary" role="dialog" aria-modal="true" aria-labelledby="proto-itinerary-title"><button className="proto-itinerary-backdrop" type="button" aria-label="Close itinerary" onClick={onClose} /><article><button className="proto-close" type="button" onClick={onClose}><X /><span className="sr-only">Close itinerary</span></button><picture><source type="image/avif" srcSet={item.imageAvif} /><img src={item.image} alt={item.imageAlt} /></picture><div className="proto-itinerary-copy"><p>{item.location} · {item.duration}</p><h2 id="proto-itinerary-title">{item.editorialTitle}</h2><p>{item.summary}</p><ol>{item.itinerary.map((day) => <li key={day.day}><span>{day.day}</span><div><strong>{day.title}</strong><p>{day.detail}</p></div></li>)}</ol><button className="proto-pill proto-pill--cyan" type="button" onClick={() => onSelect(item)}>Get a quote</button></div></article></div>;
}

function PrototypeFooter({ onQuote }: { onQuote: () => void }) {
  return <footer className="proto-footer"><div className="proto-shell"><BrandMark light /><p>Leisure, business and group travel shaped in Chennai and connected worldwide.</p><button className="proto-pill proto-pill--cyan" onClick={onQuote}>Get a quote</button><div><span>© {new Date().getFullYear()} DreamDrifters (OPC) Private Limited</span><span>GST 33AAMCD2807P1ZC</span></div></div></footer>;
}

function VariantSwitcher({ variant, onChange }: { variant: VariantId; onChange: (variant: VariantId) => void }) {
  const ids: VariantId[] = ['A', 'B', 'C'];
  const current = ids.indexOf(variant);
  useEffect(() => { const change = (event: KeyboardEvent) => { const target = event.target as HTMLElement; if (target.matches('input, textarea, select, [contenteditable]')) return; if (event.key === 'ArrowLeft') onChange(ids[(current + 2) % 3]); if (event.key === 'ArrowRight') onChange(ids[(current + 1) % 3]); }; addEventListener('keydown', change); return () => removeEventListener('keydown', change); }, [current, onChange]);
  return <aside className="proto-switcher" aria-label="Prototype variant switcher"><button aria-label="Previous variant" onClick={() => onChange(ids[(current + 2) % 3])}><ArrowLeft /></button><div><span>Prototype {variant}</span><strong>{variantNames[variant]}</strong></div>{ids.map((id) => <button key={id} className={id === variant ? 'is-active' : ''} aria-pressed={id === variant} onClick={() => onChange(id)}>{id}</button>)}<button aria-label="Next variant" onClick={() => onChange(ids[(current + 1) % 3])}><ArrowRight /></button></aside>;
}

export default function PrototypeApp() {
  const params = new URLSearchParams(location.search);
  const initial = (['A', 'B', 'C'].includes(params.get('variant') ?? '') ? params.get('variant') : 'A') as VariantId;
  const [variant, setVariant] = useState<VariantId>(initial);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [itinerary, setItinerary] = useState<TravelPackage | null>(null);

  const selectVariant = useMemo(() => (next: VariantId) => { setVariant(next); const query = new URLSearchParams(location.search); query.set('prototype', '1'); query.set('variant', next); history.replaceState(null, '', `${location.pathname}?${query}`); scrollTo({ top: 0, behavior: 'auto' }); }, []);
  useEffect(() => { const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }), { rootMargin: '0px 0px -8%', threshold: .08 }); document.querySelectorAll('.proto-reveal').forEach((node) => observer.observe(node)); return () => observer.disconnect(); }, [variant]);

  const quote = (next: Selection) => { setSelection(next); requestAnimationFrame(() => scrollToChapter('contact')); };
  const selectCapability = (id: CapabilityId) => { const item = capabilities.find((capability) => capability.id === id)!; if (item.action.kind === 'packages') scrollToChapter('packages'); else quote({ kind: 'service', id: item.action.serviceId, label: item.title }); };
  const selectPackage = (item: TravelPackage) => { setItinerary(null); quote({ kind: 'package', id: item.id, label: item.title }); };

  return <div className={`prototype prototype--${variant.toLowerCase()}`}><a className="skip-link" href="#prototype-main">Skip to main content</a><PrototypeNavigation onQuote={() => quote({ kind: 'custom', label: 'Custom travel request' })} /><main id="prototype-main"><Hero variant={variant} onPackages={() => scrollToChapter('packages')} onQuote={() => quote({ kind: 'custom', label: 'Custom travel request' })} /><Metrics /><Story variant={variant} /><Services variant={variant} onSelect={selectCapability} /><Trust variant={variant} /><Packages variant={variant} onOpen={setItinerary} onSelect={selectPackage} /><Reviews /><Enquiry selection={selection} onClear={() => setSelection(null)} /></main><PrototypeFooter onQuote={() => quote({ kind: 'custom', label: 'Custom travel request' })} />{itinerary && <Itinerary item={itinerary} onClose={() => setItinerary(null)} onSelect={selectPackage} />}<VariantSwitcher variant={variant} onChange={selectVariant} /></div>;
}
