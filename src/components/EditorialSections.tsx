import { ArrowDownRight, ArrowLeft, ArrowRight, CaretDown, Check, Compass, Headset, ShieldCheck } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { capabilities, companyStory, proofItems, trustReasons } from '../data/company';
import { getChapterMedia, getMediaPath, getResponsiveImageSrcSet } from '../data/media';
import { verifiedTestimonials } from '../data/testimonials';
import type { TravelCapability } from '../types';
import { getServicePresentationMode, type ServicePresentationMode } from '../lib/presentation';
import { CinematicVideo } from './CinematicVideo';

interface HeroProps { onPackages: () => void; onQuote: () => void; }
interface ServicesProps { onSelect: (capability: TravelCapability) => void; }

const heroMedia = getChapterMedia('hero');
const aboutMedia = getChapterMedia('about');
const directionMedia = getChapterMedia('direction');
const servicesMedia = getChapterMedia('services');
const assuranceMedia = getChapterMedia('assurance');

export function EditorialHero({ onPackages, onQuote }: HeroProps) {
  return <section id="home" className="editorial-hero" aria-labelledby="hero-title" data-section="hero">
    <CinematicVideo eager className="editorial-hero__media" poster={getMediaPath(heroMedia, 'webp', 'posters')!} posterAvif={getMediaPath(heroMedia, 'avif', 'posters')!} mobilePoster={getMediaPath(heroMedia, 'webp', 'mobileSources')} mobilePosterAvif={getMediaPath(heroMedia, 'avif', 'mobileSources')} posterSrcSet={getResponsiveImageSrcSet(heroMedia, 'webp')} posterAvifSrcSet={getResponsiveImageSrcSet(heroMedia, 'avif')} responsiveVideoOutputs={heroMedia.productionMetadata?.videoOutputs} mp4={getMediaPath(heroMedia, 'mp4')!} webm={getMediaPath(heroMedia, 'webm')!} alt="A quiet tropical shoreline seen from the air" />
    <div className="editorial-hero__wash" /><div className="shell editorial-hero__content"><p className="kicker hero-reveal">Leisure · Business · Groups</p><p className="editorial-hero__edition">A Chennai travel company<br />with a world of connections</p><h1 id="hero-title" className="hero-reveal"><span>Your journey.</span><span>Our passion.</span></h1><p className="editorial-hero__lead hero-reveal">Personal holidays, purposeful business travel and group experiences, all shaped by one attentive team.</p><div className="editorial-hero__actions hero-reveal"><button className="button button--accent" type="button" onClick={onPackages}>Explore packages <ArrowDownRight aria-hidden="true" /></button><button className="button button--quiet" type="button" onClick={onQuote}>Get a quote</button></div></div>
  </section>;
}

export function EditorialMetrics() {
  return <section id="metrics" className="editorial-proof" aria-label="How Dream Drifters works" data-section="metrics"><div className="shell editorial-proof__dock glass-panel">{proofItems.filter((item) => item.status === 'verified').map((item) => <article className="content-reveal" key={item.label}><strong>{item.label}</strong><p>{item.detail}</p></article>)}</div></section>;
}

export function EditorialStory() {
  return <>
    <section id="about" className="editorial-about" aria-labelledby="about-title" data-section="about"><div className="shell editorial-about__grid"><div className="editorial-about__copy content-reveal"><p className="chapter-index">About</p><h2 id="about-title">Travel shaped around people and purpose.</h2><p>{companyStory.about}</p><aside>Local attention.<br />International reach.<br />One clear point of contact.</aside></div><div className="editorial-about__media content-reveal"><picture><source type="image/avif" srcSet={getResponsiveImageSrcSet(aboutMedia, 'avif')} sizes="(min-width: 1000px) 50vw, 100vw" /><source type="image/webp" srcSet={getResponsiveImageSrcSet(aboutMedia, 'webp')} sizes="(min-width: 1000px) 50vw, 100vw" /><img src={getMediaPath(aboutMedia, 'webp')} alt="A travel advisor meeting with two clients at a desk" width="4096" height="3072" loading="lazy" decoding="async" style={{ objectPosition: `${aboutMedia.focalPoint.x}% ${aboutMedia.focalPoint.y}%` }} /></picture></div></div></section>
    <section className="editorial-purpose" aria-labelledby="purpose-title" data-section="purpose"><CinematicVideo ownershipThreshold={.55} className="editorial-purpose__media" poster={getMediaPath(directionMedia, 'webp', 'posters')!} posterAvif={getMediaPath(directionMedia, 'avif', 'posters')!} mobilePoster={getMediaPath(directionMedia, 'webp', 'mobileSources')} mobilePosterAvif={getMediaPath(directionMedia, 'avif', 'mobileSources')} mp4={getMediaPath(directionMedia, 'mp4')!} webm={getMediaPath(directionMedia, 'webm')!} alt="Golden clouds and countryside passing a train window" /><div className="editorial-purpose__wash" /><div className="shell editorial-purpose__content content-reveal"><div className="editorial-purpose__heading"><p className="chapter-index">Direction</p><h2 id="purpose-title">A better way to move through the world.</h2></div><div className="editorial-purpose__statements"><article><span>Vision</span><p>{companyStory.vision}</p></article><article><span>Mission</span><p>{companyStory.mission}</p></article></div></div></section>
  </>;
}

export function EditorialServices({ onSelect }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const scrollRangeRef = useRef<{ start: number; end: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openMobile, setOpenMobile] = useState(-1);
  const [presentationMode, setPresentationMode] = useState<ServicePresentationMode>(() => getServicePresentationMode(
    typeof window === 'undefined' ? 1440 : window.innerWidth,
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ));
  const active = capabilities[activeIndex];

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPresentationMode(getServicePresentationMode(window.innerWidth, motion.matches));
    window.addEventListener('resize', update, { passive: true });
    motion.addEventListener('change', update);
    update();
    return () => {
      window.removeEventListener('resize', update);
      motion.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (presentationMode !== 'pinned' || !sectionRef.current || !pinRef.current) {
      scrollRangeRef.current = null;
      return;
    }
    let cancelled = false;
    let cleanup = () => {};
    const approach = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      approach.disconnect();
      void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
        if (cancelled || !sectionRef.current || !pinRef.current) return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = triggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        const syncScene = (progress: number) => setActiveIndex(Math.min(capabilities.length - 1, Math.floor(progress * capabilities.length)));
        const context = gsap.context(() => {
          const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            pin: pinRef.current,
            start: 'top top',
            end: 'bottom bottom',
            pinSpacing: false,
            scrub: .65,
            invalidateOnRefresh: true,
            onRefresh: (self) => syncScene(self.progress),
            onUpdate: (self) => syncScene(self.progress),
          });
          scrollRangeRef.current = trigger;
          ScrollTrigger.refresh();
          trigger.update();
          syncScene(trigger.progress);
        }, sectionRef);
        cleanup = () => {
          scrollRangeRef.current = null;
          context.revert();
        };
      });
    }, { rootMargin: '700px 0px', threshold: .01 });
    approach.observe(sectionRef.current);
    return () => { cancelled = true; approach.disconnect(); cleanup(); };
  }, [presentationMode]);

  const selectCapability = (index: number) => {
    const nextIndex = Math.max(0, Math.min(capabilities.length - 1, index));
    setActiveIndex(nextIndex);
    const range = scrollRangeRef.current;
    if (!range) return;
    const progress = (nextIndex + .5) / capabilities.length;
    window.scrollTo({ top: range.start + ((range.end - range.start) * progress), behavior: 'auto' });
  };

  return <section ref={sectionRef} id="services" className="editorial-services" aria-labelledby="services-title" data-section="services" data-presentation={presentationMode}><div ref={pinRef} className="editorial-services__pin"><div className="shell editorial-services__stage"><header><p className="kicker">Services</p><h2 id="services-title">Every moving part, considered.</h2><p>Six connected capabilities. One accountable travel team.</p><div className="editorial-services__controls" aria-label="Service controls"><p aria-live="polite"><strong>{String(activeIndex + 1).padStart(2, '0')}</strong><span aria-hidden="true"> / {String(capabilities.length).padStart(2, '0')}</span><span className="sr-only"> of {capabilities.length}: {active.title}</span></p><button type="button" aria-label="Previous service" disabled={activeIndex === 0} onClick={() => selectCapability(activeIndex - 1)}><ArrowLeft aria-hidden="true" /></button><button type="button" aria-label="Next service" disabled={activeIndex === capabilities.length - 1} onClick={() => selectCapability(activeIndex + 1)}><ArrowRight aria-hidden="true" /></button></div></header><div className="editorial-services__cinematic"><CinematicVideo className="editorial-services__media" poster={getMediaPath(servicesMedia, 'webp', 'posters')!} posterAvif={getMediaPath(servicesMedia, 'avif', 'posters')!} mp4={getMediaPath(servicesMedia, 'mp4')!} webm={getMediaPath(servicesMedia, 'webm')!} mobileMp4={getMediaPath(servicesMedia, 'mp4', 'mobileSources')} mobileWebm={getMediaPath(servicesMedia, 'webm', 'mobileSources')} alt="Aircraft ground operations coordinated beside an airport terminal" /><div className="editorial-services__wash" /><div className="editorial-services__capability-wrap"><CapabilityStage key={active.id} capability={active} onSelect={onSelect} /></div></div><div className="editorial-services__mobile">{capabilities.map((item, index) => { const open = openMobile === index; return <article className={open ? 'is-open' : ''} key={item.id}><h3><button type="button" aria-expanded={open} aria-controls={`capability-${item.id}`} onClick={() => setOpenMobile(open ? -1 : index)}><span>{item.title}</span><CaretDown aria-hidden="true" /></button></h3><div id={`capability-${item.id}`} className="editorial-service-accordion" hidden={!open}><div><p>{item.summary}</p><ul>{item.features.map((feature) => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul><button className="text-action" type="button" onClick={() => onSelect(item)}>{item.action.kind === 'packages' ? 'Explore packages' : 'Get a quote'} <ArrowRight aria-hidden="true" /></button></div></div></article>; })}</div></div></div></section>;
}

function CapabilityStage({ capability, onSelect }: { capability: TravelCapability; onSelect: (capability: TravelCapability) => void }) {
  return <article className="editorial-services__capability"><p>{capability.shortTitle}</p><h3>{capability.title}</h3><p>{capability.summary}</p><ul>{capability.features.map((feature) => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul><button className="button button--quiet" type="button" aria-label={`${capability.action.kind === 'packages' ? 'Explore packages' : 'Get a quote'} for ${capability.title}`} onClick={() => onSelect(capability)}>{capability.action.kind === 'packages' ? 'Explore packages' : 'Get a quote'} <ArrowRight aria-hidden="true" /></button></article>;
}

export function EditorialTrust() {
  return <section id="why-us" className="editorial-trust" aria-labelledby="trust-title" data-section="trust"><div className="shell editorial-trust__layout"><header className="content-reveal"><p className="chapter-index">Why us</p><h2 id="trust-title">Confidence is built into the journey.</h2><p>Clear choices, capable partners and a team that remains visible.</p></header><div className="editorial-trust__list">{trustReasons.map((reason) => <details key={reason.title} className="content-reveal"><summary><span>{reason.title}</span><CaretDown aria-hidden="true" /></summary><p>{reason.detail}</p></details>)}</div></div></section>;
}

export function EditorialReviews() {
  return <section id="reviews" className="editorial-reviews" aria-labelledby="reviews-title" data-section="reviews"><CinematicVideo className="editorial-reviews__media" poster={getMediaPath(assuranceMedia, 'webp', 'posters')!} posterAvif={getMediaPath(assuranceMedia, 'avif', 'posters')!} mp4={getMediaPath(assuranceMedia, 'mp4')!} webm={getMediaPath(assuranceMedia, 'webm')!} mobileMp4={getMediaPath(assuranceMedia, 'mp4', 'mobileSources')} mobileWebm={getMediaPath(assuranceMedia, 'webm', 'mobileSources')} alt="" /><div className="editorial-reviews__wash" /><div className="shell editorial-reviews__content"><header className="content-reveal"><p className="chapter-index">Assurance</p><h2 id="reviews-title">Support you can see.</h2><p>Clear choices, one accountable contact and practical support from first conversation to return.</p></header><div className="editorial-assurances"><article><Compass aria-hidden="true" weight="thin" /><h3>A named point of contact</h3></article><article><Headset aria-hidden="true" weight="thin" /><h3>Clear options before commitment</h3></article><article><ShieldCheck aria-hidden="true" weight="thin" /><h3>Support through the journey</h3></article></div>{verifiedTestimonials.length > 0 && <div className="reviews__grid">{verifiedTestimonials.slice(0, 3).map((item) => <blockquote className="review" key={item.author}><p>“{item.quote}”</p><footer><strong>{item.author}</strong><span>{item.journey}</span></footer></blockquote>)}</div>}</div></section>;
}
