import { useEffect } from 'react';

export function useEditorialMotion() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }), { rootMargin: '0px 0px -8%', threshold: .08 });
    document.querySelectorAll('.content-reveal').forEach((node) => revealObserver.observe(node));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => revealObserver.disconnect();

    let cancelled = false;
    let cleanup = () => {};
    const hero = document.getElementById('home');
    const approach = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      approach.disconnect();
      void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
        if (cancelled) return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = triggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {
          gsap.to('.editorial-hero__media', { scale: 1.07, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: .65 } });
          gsap.to('.editorial-hero__content', { yPercent: -8, opacity: .25, ease: 'none', scrollTrigger: { trigger: '#home', start: '45% top', end: 'bottom top', scrub: .65 } });
          gsap.fromTo('.editorial-about__media', { yPercent: 7, scale: .94 }, { yPercent: 0, scale: 1, ease: 'power4.out', scrollTrigger: { trigger: '.editorial-about', start: 'top 80%', end: '55% 55%', scrub: .7 } });
          gsap.to('.editorial-purpose__media', { scale: 1.065, ease: 'none', scrollTrigger: { trigger: '.editorial-purpose', start: 'top bottom', end: 'bottom top', scrub: .75 } });
          gsap.fromTo('.editorial-services__pin', { opacity: .7 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: '.editorial-services', start: 'top bottom', end: 'top top', scrub: .6 } });
          gsap.fromTo('.depth-packages__deck', { xPercent: 4 }, { xPercent: 0, ease: 'power4.out', scrollTrigger: { trigger: '.depth-packages', start: 'top 80%', end: 'top 20%', scrub: .7 } });
          gsap.to('.editorial-reviews__wash', { opacity: .94, ease: 'none', scrollTrigger: { trigger: '.editorial-reviews', start: '55% 55%', end: 'bottom top', scrub: .7 } });
        });
        cleanup = () => context.revert();
      });
    }, { rootMargin: '600px 0px', threshold: .01 });
    if (hero) approach.observe(hero);
    return () => { cancelled = true; revealObserver.disconnect(); approach.disconnect(); cleanup(); };
  }, []);
}
