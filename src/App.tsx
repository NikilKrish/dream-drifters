import { useEffect, useRef, useState } from 'react';
import { DepthPackagesSection } from './components/DepthPackagesSection';
import { EditorialHero, EditorialMetrics, EditorialReviews, EditorialServices, EditorialStory, EditorialTrust } from './components/EditorialSections';
import { EnquirySection } from './components/EnquirySection';
import { Footer } from './components/Footer';
import { Navigation } from './components/Navigation';
import { PackageSheet } from './components/PackageSheet';
import { useEditorialMotion } from './hooks/useEditorialMotion';
import { track } from './lib/analytics';
import type { EnquirySelection, TravelCapability, TravelPackage } from './types';
import './prototype/prototype.css';

export default function App() {
  const [activePackage, setActivePackage] = useState<TravelPackage | null>(null);
  const [sourceImage, setSourceImage] = useState<HTMLElement | null>(null);
  const [selection, setSelection] = useState<EnquirySelection | null>(null);
  const scrollRequestRef = useRef(0);
  useEditorialMotion();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const section = entry.target as HTMLElement;
      track('chapter_viewed', { chapter: section.dataset.section ?? 'unknown' });
      observer.unobserve(section);
    }), { rootMargin: '-20% 0px -55%', threshold: .01 });
    document.querySelectorAll<HTMLElement>('[data-section]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activePackage) return;
    const background = [document.querySelector('.site-nav'), document.querySelector('main'), document.querySelector('.footer')].filter((node): node is HTMLElement => Boolean(node));
    background.forEach((node) => { node.inert = true; });
    return () => background.forEach((node) => { node.inert = false; });
  }, [activePackage]);

  const scrollTo = (id: string) => requestAnimationFrame(() => {
    const target = document.getElementById(id);
    if (!target) return;
    const requestId = ++scrollRequestRef.current;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    if (!reducedMotion) {
      const interrupt = () => { if (scrollRequestRef.current === requestId) scrollRequestRef.current += 1; };
      const options = { once: true, passive: true } as const;
      window.addEventListener('wheel', interrupt, options);
      window.addEventListener('touchstart', interrupt, options);
      window.addEventListener('keydown', interrupt, { once: true });
      [850, 1800, 3200].forEach((delay) => window.setTimeout(() => {
        if (scrollRequestRef.current === requestId && Math.abs(target.getBoundingClientRect().top) > 8) {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }, delay));
      window.setTimeout(() => {
        window.removeEventListener('wheel', interrupt);
        window.removeEventListener('touchstart', interrupt);
        window.removeEventListener('keydown', interrupt);
      }, 3300);
    }
  });
  const selectCustom = () => { setSelection({ interestKind: 'custom', label: 'Custom travel request', requestId: Date.now() }); scrollTo('contact'); };
  const selectCapability = (capability: TravelCapability) => {
    if (capability.action.kind === 'packages') { scrollTo('packages'); return; }
    setSelection({ interestKind: 'service', serviceId: capability.action.serviceId, label: capability.title, requestId: Date.now() });
    track('service_selected', { service_id: capability.action.serviceId });
    scrollTo('contact');
  };
  const selectPackage = (item: TravelPackage) => { setSelection({ interestKind: 'package', packageId: item.id, label: item.title, requestId: Date.now() }); track('package_selected', { package_id: item.id }); setActivePackage(null); scrollTo('contact'); };
  const openPackage = (item: TravelPackage, image: HTMLElement | null) => { setSourceImage(image); setActivePackage(item); track('itinerary_opened', { package_id: item.id }); };

  return <div className="prototype editorial-production"><a className="skip-link" href="#main-content">Skip to main content</a><Navigation onQuote={selectCustom} onNavigate={scrollTo} /><main id="main-content"><EditorialHero onPackages={() => scrollTo('packages')} onQuote={selectCustom} /><EditorialMetrics /><EditorialStory /><EditorialServices onSelect={selectCapability} /><EditorialTrust /><DepthPackagesSection onOpen={openPackage} onEnquire={selectPackage} suspended={Boolean(activePackage)} /><EditorialReviews /><EnquirySection selection={selection} /></main><Footer onQuote={selectCustom} /><PackageSheet travelPackage={activePackage} sourceImage={sourceImage} onClose={() => setActivePackage(null)} onPlan={selectPackage} /></div>;
}
