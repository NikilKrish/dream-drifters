import { useEffect, useState } from 'react';
import { CinematicHero, MetricsSection, AboutSection, VisionMissionSection, ServicesSection, TrustSection, ReviewsSection } from './components/CinematicSections';
import { EnquirySection } from './components/EnquirySection';
import { Footer } from './components/Footer';
import { Navigation } from './components/Navigation';
import { PackageSheet } from './components/PackageSheet';
import { PackagesSection } from './components/PackagesSection';
import { track } from './lib/analytics';
import type { EnquirySelection, TravelPackage, TravelService } from './types';

export default function App() {
  const [activePackage, setActivePackage] = useState<TravelPackage | null>(null);
  const [sourceImage, setSourceImage] = useState<HTMLElement | null>(null);
  const [selection, setSelection] = useState<EnquirySelection | null>(null);

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), { rootMargin: '0px 0px -10%', threshold: 0.08 });
    document.querySelectorAll('.content-reveal').forEach((element) => revealObserver.observe(element));

    const analyticsObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { const section = entry.target as HTMLElement; track('chapter_viewed', { chapter: section.dataset.section ?? 'unknown' }); analyticsObserver.unobserve(entry.target); }
    }), { rootMargin: '-20% 0px -55%', threshold: 0.01 });
    document.querySelectorAll<HTMLElement>('[data-section]').forEach((section) => analyticsObserver.observe(section));
    return () => { revealObserver.disconnect(); analyticsObserver.disconnect(); };
  }, []);

  useEffect(() => {
    if (!activePackage) return;
    const background = [document.querySelector('.site-nav'), document.querySelector('main'), document.querySelector('.footer')].filter((node): node is HTMLElement => Boolean(node));
    background.forEach((node) => { node.inert = true; });
    return () => background.forEach((node) => { node.inert = false; });
  }, [activePackage]);

  const scrollTo = (id: string) => window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }));
  const selectCustom = () => { setSelection({ interestKind: 'custom', label: 'Custom journey', requestId: Date.now() }); scrollTo('contact'); };
  const selectService = (service: TravelService) => { setSelection({ interestKind: 'service', serviceId: service.id, label: service.title, requestId: Date.now() }); track('service_selected', { service_id: service.id }); scrollTo('contact'); };
  const selectPackage = (travelPackage: TravelPackage) => { setSelection({ interestKind: 'package', packageId: travelPackage.id, label: travelPackage.title, requestId: Date.now() }); track('package_selected', { package_id: travelPackage.id }); setActivePackage(null); scrollTo('contact'); };
  const openPackage = (travelPackage: TravelPackage, image: HTMLElement | null) => { setSourceImage(image); setActivePackage(travelPackage); track('itinerary_opened', { package_id: travelPackage.id }); };

  return <><a className="skip-link" href="#main-content">Skip to main content</a><Navigation onQuote={selectCustom} /><main id="main-content"><CinematicHero onPackages={() => scrollTo('packages')} onTalk={selectCustom} /><MetricsSection /><AboutSection /><VisionMissionSection /><ServicesSection onEnquire={selectService} /><TrustSection /><PackagesSection onOpen={openPackage} onEnquire={selectPackage} /><ReviewsSection /><EnquirySection selection={selection} /></main><Footer onQuote={selectCustom} /><PackageSheet travelPackage={activePackage} sourceImage={sourceImage} onClose={() => setActivePackage(null)} onPlan={selectPackage} /></>;
}
