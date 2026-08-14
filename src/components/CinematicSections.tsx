import { ArrowDownRight, ArrowRight, CaretDown, Check, Compass, Headset, ShieldCheck } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { proofItems, services, trustReasons } from '../data/company';
import { verifiedTestimonials } from '../data/testimonials';
import type { TravelService } from '../types';
import { CinematicVideo } from './CinematicVideo';

interface HeroProps { onPackages: () => void; onTalk: () => void; }
interface ServicesProps { onEnquire: (service: TravelService) => void; }

export function CinematicHero({ onPackages, onTalk }: HeroProps) {
  return (
    <section id="home" className="film-hero chapter" aria-labelledby="hero-title" data-section="hero">
      <CinematicVideo eager className="film-hero__media" poster="/media/hero.webp" posterAvif="/media/hero.avif" mobilePoster="/media/hero-mobile.webp" mobilePosterAvif="/media/hero-mobile.avif" mp4="/media/discovery.mp4" webm="/media/discovery.webm" alt="A winding road entering a dramatic mountain landscape" />
      <div className="film-hero__wash" />
      <div className="shell film-hero__content">
        <p className="kicker hero-reveal">Tailor-made travel from Chennai</p>
        <h1 id="hero-title" className="hero-reveal"><span>Your journey.</span><span>Our passion.</span></h1>
        <p className="film-hero__lead hero-reveal">Considered holidays, corporate travel and practical support from one responsive team.</p>
        <div className="film-hero__actions hero-reveal">
          <button className="button button--accent" type="button" onClick={onPackages}>Explore packages <ArrowDownRight aria-hidden="true" weight="bold" /></button>
          <button className="button button--quiet" type="button" onClick={onTalk}>Get a quote</button>
        </div>
      </div>
    </section>
  );
}

export function MetricsSection() {
  const verifiedProof = proofItems.filter((item) => item.status === 'verified');
  return (
    <section id="metrics" className="proof chapter" aria-label="How Dream Drifters works" data-section="metrics">
      <div className="shell proof__dock glass-panel">
        {verifiedProof.map((item) => <article key={item.label} className="proof__item"><strong>{item.label}</strong><p>{item.detail}</p></article>)}
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="about chapter" aria-labelledby="about-title" data-section="about">
      <div className="shell about__grid">
        <div className="about__media"><picture><source type="image/avif" srcSet="/media/japan.avif" /><img src="/media/japan.webp" width="1600" height="1200" loading="lazy" decoding="async" alt="Mount Fuji beyond a quiet landscape" /></picture></div>
        <div className="about__copy content-reveal">
          <h2 id="about-title">Travel expertise, made personal.</h2>
          <p className="lead">Dream Drifters plans leisure, business and group travel across domestic and international destinations.</p>
          <p>From considered holidays and accommodation to visa guidance, corporate travel and events, one responsive team connects every moving part.</p>
          <div className="about__signature"><span>One brief</span><span>One accountable team</span><span>One clear journey</span></div>
        </div>
      </div>
    </section>
  );
}

export function VisionMissionSection() {
  return (
    <section className="purpose chapter" aria-labelledby="purpose-title" data-section="purpose">
      <div className="purpose__media"><picture><source type="image/avif" srcSet="/media/switzerland.avif" /><img src="/media/switzerland.webp" loading="lazy" decoding="async" width="1600" height="1100" alt="Alpine peaks reflected in a clear lake" /></picture></div>
      <div className="purpose__wash" />
      <div className="shell purpose__content">
        <h2 id="purpose-title" className="content-reveal">A wider world, made simpler.</h2>
        <div className="purpose__statements content-reveal">
          <article><span>Vision</span><h3>Be the travel partner people trust.</h3><p>Known for reliable guidance and thoughtful service across the world.</p></article>
          <article><span>Mission</span><h3>Create value at every step.</h3><p>Build travel and event solutions around personal dreams and business objectives.</p></article>
        </div>
      </div>
    </section>
  );
}

export function ServicesSection({ onEnquire }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openMobile, setOpenMobile] = useState(0);
  const [motionReady, setMotionReady] = useState(false);
  const activeService = services[activeIndex];
  const activePair = Math.floor(activeIndex / 2);

  useEffect(() => {
    if (!window.matchMedia('(min-width: 700px)').matches) return;
    const browser = window as Window & { requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number; cancelIdleCallback?: (handle: number) => void };
    if (browser.requestIdleCallback) {
      const handle = browser.requestIdleCallback(() => setMotionReady(true), { timeout: 600 });
      return () => browser.cancelIdleCallback?.(handle);
    }
    const handle = window.setTimeout(() => setMotionReady(true), 120);
    return () => window.clearTimeout(handle);
  }, []);

  useEffect(() => {
    if (!motionReady || !sectionRef.current || !pinRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const query = window.matchMedia('(min-width: 700px)');
    if (!query.matches) return;
    let cancelled = false;
    let cleanup: () => void = () => {};
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !sectionRef.current || !pinRef.current) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        const desktop = window.matchMedia('(min-width: 1100px)').matches;
        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          pin: pinRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pinSpacing: false,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = desktop ? Math.min(5, Math.round(self.progress * 5)) : Math.min(4, Math.round(self.progress * 2) * 2);
            setActiveIndex((current) => current === next ? current : next);
          },
        });
        cleanup = () => trigger.kill();
      }, sectionRef);
      cleanup = () => context.revert();
    });
    return () => { cancelled = true; cleanup(); };
  }, [motionReady]);

  return (
    <section ref={sectionRef} id="services" className="services chapter" aria-labelledby="services-title" data-section="services">
      <div ref={pinRef} className="services__pin">
        <div className="services__background"><CinematicVideo poster="/media/dubai.webp" posterAvif="/media/dubai.avif" mp4="/media/operations.mp4" webm="/media/operations.webm" alt="" /></div>
        <div className="services__wash" />
        <div className="shell services__stage">
          <header className="services__heading"><p className="kicker">Travel services</p><h2 id="services-title">Every moving part, managed.</h2><p>Choose one need or bring us the complete journey.</p></header>
          <div className="services__desktop" aria-live="polite">
            <div className="service-visual" aria-hidden="true">
              {services.map((service, index) => <picture key={service.id} className={activeIndex === index ? 'is-active' : ''}><source type="image/avif" srcSet={service.imageAvif} /><img src={service.image} alt="" width="1100" height="900" loading="lazy" decoding="async" /></picture>)}
              <div className="service-visual__caption"><span>{activeService.shortTitle}</span><small>{activeIndex + 1} of {services.length}</small></div>
            </div>
            <ServiceCard service={activeService} onEnquire={onEnquire} />
          </div>
          <div className="services__tablet" aria-live="polite">
            {services.map((service, index) => <div key={service.id} className={`service-pair-card${Math.floor(index / 2) === activePair ? ' is-active' : ''}`}><ServiceCard service={service} onEnquire={onEnquire} /></div>)}
          </div>
          <div className="services__mobile">
            {services.map((service, index) => {
              const open = openMobile === index;
              return (
                <article className={`service-accordion${open ? ' is-open' : ''}`} key={service.id}>
                  <h3><button type="button" aria-expanded={open} aria-controls={`service-panel-${service.id}`} onClick={() => setOpenMobile(open ? -1 : index)}><span>{service.title}</span><CaretDown aria-hidden="true" weight="bold" /></button></h3>
                  <div id={`service-panel-${service.id}`} className="service-accordion__body"><div><p>{service.summary}</p><ul>{service.features.map((feature) => <li key={feature}><Check aria-hidden="true" weight="bold" />{feature}</li>)}</ul><button className="text-action" type="button" aria-label={`Get a quote for ${service.title}`} onClick={() => onEnquire(service)}>Get a quote <ArrowRight aria-hidden="true" weight="bold" /></button></div></div>
                </article>
              );
            })}
          </div>
          <div className="services__static">
            {services.map((service) => <ServiceCard key={service.id} service={service} onEnquire={onEnquire} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, onEnquire }: { service: TravelService; onEnquire: (service: TravelService) => void }) {
  return (
    <article className="service-card glass-panel" key={service.id}>
      <p className="service-card__label">{service.shortTitle}</p><h3>{service.title}</h3><p>{service.summary}</p>
      <ul>{service.features.map((feature) => <li key={feature}><Check aria-hidden="true" weight="bold" />{feature}</li>)}</ul>
      <button className="button button--quiet" type="button" aria-label={`Get a quote for ${service.title}`} onClick={() => onEnquire(service)}>Get a quote <ArrowRight aria-hidden="true" weight="bold" /></button>
    </article>
  );
}

export function TrustSection() {
  return (
    <section id="why-us" className="trust chapter" aria-labelledby="trust-title" data-section="trust">
      <div className="shell trust__layout">
        <header><h2 id="trust-title">Confidence before take-off.</h2><p>Practical support, clear ownership and thoughtful recommendations at every stage.</p></header>
        <div className="trust-list">
          {trustReasons.map((reason) => <details key={reason.title} className="trust-item"><summary><span>{reason.title}</span><CaretDown aria-hidden="true" weight="bold" /></summary><p>{reason.detail}</p></details>)}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section id="reviews" className="reviews chapter" aria-labelledby="reviews-title" data-section="reviews">
      <CinematicVideo className="reviews__media" poster="/media/bali.webp" posterAvif="/media/bali.avif" mp4="/media/travellers.mp4" webm="/media/travellers.webm" alt="" />
      <div className="reviews__wash" />
      <div className="shell reviews__content">
        <header><h2 id="reviews-title">Travel built around real people.</h2><p>Verified client references are available directly from the Dream Drifters team.</p></header>
        {verifiedTestimonials.length > 0 ? (
          <div className="reviews__grid">{verifiedTestimonials.slice(0, 3).map((item) => <blockquote className="review" key={item.author}><p>“{item.quote}”</p><footer><strong>{item.author}</strong><span>{item.journey}</span></footer></blockquote>)}</div>
        ) : (
          <div className="assurance-grid" aria-label="Our service commitment">
            <article><Compass aria-hidden="true" weight="thin" /><h3>Brief before options</h3><p>We start with how you want to travel, then shape the recommendation.</p></article>
            <article><Headset aria-hidden="true" weight="thin" /><h3>A person to call</h3><p>One responsive contact stays visible as the journey takes shape.</p></article>
            <article><ShieldCheck aria-hidden="true" weight="thin" /><h3>Support through return</h3><p>Practical guidance continues before, during and after travel.</p></article>
          </div>
        )}
      </div>
    </section>
  );
}
