import { ArrowDownRight, ArrowRight, CaretDown, Check, Compass, Headset, ShieldCheck } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { capabilities, companyStory, proofItems, trustReasons } from '../data/company';
import { verifiedTestimonials } from '../data/testimonials';
import type { TravelCapability } from '../types';
import { CinematicVideo } from './CinematicVideo';

interface HeroProps { onPackages: () => void; onQuote: () => void; }
interface ServicesProps { onSelect: (capability: TravelCapability) => void; }

export function EditorialHero({ onPackages, onQuote }: HeroProps) {
  return <section id="home" className="editorial-hero" aria-labelledby="hero-title" data-section="hero">
    <CinematicVideo eager className="editorial-hero__media" poster="/media/hero.webp" posterAvif="/media/hero.avif" mobilePoster="/media/hero-mobile.webp" mobilePosterAvif="/media/hero-mobile.avif" mp4="/media/discovery.mp4" webm="/media/discovery.webm" mobileMp4="/media/discovery-mobile.mp4" mobileWebm="/media/discovery-mobile.webm" alt="A winding road entering a dramatic mountain landscape" />
    <div className="editorial-hero__wash" /><div className="shell editorial-hero__content"><p className="kicker hero-reveal">Leisure · Business · Groups</p><p className="editorial-hero__edition">A Chennai travel company<br />with a world of connections</p><h1 id="hero-title" className="hero-reveal"><span>Your journey.</span><span>Our passion.</span></h1><p className="editorial-hero__lead hero-reveal">Personal holidays, purposeful business travel and group experiences, all shaped by one attentive team.</p><div className="editorial-hero__actions hero-reveal"><button className="button button--accent" type="button" onClick={onPackages}>Explore packages <ArrowDownRight aria-hidden="true" /></button><button className="button button--quiet" type="button" onClick={onQuote}>Get a quote</button></div></div>
  </section>;
}

export function EditorialMetrics() {
  return <section id="metrics" className="editorial-proof" aria-label="How Dream Drifters works" data-section="metrics"><div className="shell editorial-proof__dock glass-panel">{proofItems.filter((item) => item.status === 'verified').map((item) => <article className="content-reveal" key={item.label}><strong>{item.label}</strong><p>{item.detail}</p></article>)}</div></section>;
}

export function EditorialStory() {
  return <>
    <section id="about" className="editorial-about" aria-labelledby="about-title" data-section="about"><div className="shell editorial-about__grid"><div className="editorial-about__copy content-reveal"><p className="chapter-index">01 / About</p><h2 id="about-title">Travel shaped around people and purpose.</h2><p>{companyStory.about}</p><aside>Local attention.<br />International reach.<br />One clear point of contact.</aside></div><div className="editorial-about__media content-reveal"><picture><source type="image/avif" srcSet="/media/japan.avif" /><img src="/media/japan.webp" alt="Mount Fuji beyond a quiet landscape" width="1200" height="900" loading="lazy" /></picture></div></div></section>
    <section className="editorial-purpose" aria-labelledby="purpose-title" data-section="purpose"><div className="editorial-purpose__media"><picture><source type="image/avif" srcSet="/media/switzerland.avif" /><img src="/media/switzerland.webp" alt="A calm alpine lake beneath high mountains" width="1600" height="1000" loading="lazy" /></picture></div><div className="editorial-purpose__wash" /><div className="shell editorial-purpose__content content-reveal"><div><p className="chapter-index">02 / Direction</p><h2 id="purpose-title">A better way to move through the world.</h2></div><div className="editorial-purpose__statements"><article><span>Vision</span><p>{companyStory.vision}</p></article><article><span>Mission</span><p>{companyStory.mission}</p></article></div></div></section>
  </>;
}

export function EditorialServices({ onSelect }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openMobile, setOpenMobile] = useState(0);
  const active = capabilities[activeIndex];

  useEffect(() => {
    if (!sectionRef.current || !pinRef.current || matchMedia('(max-width: 699px)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
        const syncScene = (progress: number) => setActiveIndex(Math.min(capabilities.length - 1, Math.round(progress * (capabilities.length - 1))));
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
          ScrollTrigger.refresh();
          trigger.update();
          syncScene(trigger.progress);
        }, sectionRef);
        cleanup = () => context.revert();
      });
    }, { rootMargin: '700px 0px', threshold: .01 });
    approach.observe(sectionRef.current);
    return () => { cancelled = true; approach.disconnect(); cleanup(); };
  }, []);

  return <section ref={sectionRef} id="services" className="editorial-services" aria-labelledby="services-title" data-section="services"><div ref={pinRef} className="editorial-services__pin"><CinematicVideo className="editorial-services__media" poster="/media/dubai.webp" posterAvif="/media/dubai.avif" mp4="/media/operations.mp4" webm="/media/operations.webm" mobileMp4="/media/operations-mobile.mp4" mobileWebm="/media/operations-mobile.webm" alt="" /><div className="editorial-services__wash" /><div className="shell editorial-services__stage"><header><p className="kicker">Services</p><h2 id="services-title">Every moving part, considered.</h2><p>Six connected capabilities. One accountable travel team.</p></header><div className="editorial-services__desktop"><div className="editorial-services__visual" aria-hidden="true">{capabilities.map((item, index) => <picture className={activeIndex === index ? 'is-active' : ''} key={item.id}><source type="image/avif" srcSet={item.imageAvif} /><img src={item.image} alt="" width="1200" height="900" loading="lazy" /></picture>)}<div><span>{active.shortTitle}</span><small>{String(activeIndex + 1).padStart(2, '0')} / 06</small></div></div><CapabilityCard capability={active} onSelect={onSelect} /></div><div className="editorial-services__mobile">{capabilities.map((item, index) => { const open = openMobile === index; return <article className={open ? 'is-open' : ''} key={item.id}><h3><button type="button" aria-expanded={open} aria-controls={`capability-${item.id}`} onClick={() => setOpenMobile(open ? -1 : index)}><span>{item.title}</span><CaretDown aria-hidden="true" /></button></h3><div id={`capability-${item.id}`} className="editorial-service-accordion"><div><p>{item.summary}</p><ul>{item.features.map((feature) => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul><button className="text-action" type="button" onClick={() => onSelect(item)}>{item.action.kind === 'packages' ? 'Explore packages' : 'Get a quote'} <ArrowRight aria-hidden="true" /></button></div></div></article>; })}</div><div className="editorial-services__static">{capabilities.map((item) => <CapabilityCard key={item.id} capability={item} onSelect={onSelect} />)}</div></div></div></section>;
}

function CapabilityCard({ capability, onSelect }: { capability: TravelCapability; onSelect: (capability: TravelCapability) => void }) {
  return <article className="editorial-service-card glass-panel" key={capability.id}><p>{capability.shortTitle}</p><h3>{capability.title}</h3><p>{capability.summary}</p><ul>{capability.features.map((feature) => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul><button className="button button--quiet" type="button" aria-label={`${capability.action.kind === 'packages' ? 'Explore packages' : 'Get a quote'} for ${capability.title}`} onClick={() => onSelect(capability)}>{capability.action.kind === 'packages' ? 'Explore packages' : 'Get a quote'} <ArrowRight aria-hidden="true" /></button></article>;
}

export function EditorialTrust() {
  return <section id="why-us" className="editorial-trust" aria-labelledby="trust-title" data-section="trust"><div className="shell editorial-trust__layout"><header className="content-reveal"><p className="chapter-index">04 / Why us</p><h2 id="trust-title">Confidence is built into the journey.</h2><p>Clear choices, capable partners and a team that remains visible.</p></header><div className="editorial-trust__list">{trustReasons.map((reason) => <details key={reason.title} className="content-reveal"><summary><span>{reason.title}</span><CaretDown aria-hidden="true" /></summary><p>{reason.detail}</p></details>)}</div></div></section>;
}

export function EditorialReviews() {
  return <section id="reviews" className="editorial-reviews" aria-labelledby="reviews-title" data-section="reviews"><CinematicVideo className="editorial-reviews__media" poster="/media/bali.webp" posterAvif="/media/bali.avif" mp4="/media/travellers.mp4" webm="/media/travellers.webm" mobileMp4="/media/travellers-mobile.mp4" mobileWebm="/media/travellers-mobile.webm" alt="" /><div className="editorial-reviews__wash" /><div className="shell editorial-reviews__content"><header className="content-reveal"><p className="chapter-index">06 / References</p><h2 id="reviews-title">Trust, without borrowed words.</h2><p>Client stories are published only after verification. References are available directly while that review is completed.</p></header>{verifiedTestimonials.length ? <div className="reviews__grid">{verifiedTestimonials.slice(0, 3).map((item) => <blockquote className="review" key={item.author}><p>“{item.quote}”</p><footer><strong>{item.author}</strong><span>{item.journey}</span></footer></blockquote>)}</div> : <div className="editorial-assurances"><article><Compass aria-hidden="true" weight="thin" /><h3>A named point of contact</h3></article><article><Headset aria-hidden="true" weight="thin" /><h3>Clear options before commitment</h3></article><article><ShieldCheck aria-hidden="true" weight="thin" /><h3>Support through the journey</h3></article></div>}</div></section>;
}
