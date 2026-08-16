import { List, X } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { BrandMark } from './BrandMark';

interface NavigationProps { onQuote: () => void; onNavigate: (id: string) => void; }

const links = [
  { href: '#about', label: 'About', id: 'about' },
  { href: '#services', label: 'Services', id: 'services' },
  { href: '#packages', label: 'Packages', id: 'packages' },
  { href: '#reviews', label: 'Reviews', id: 'reviews' },
];

const focusable = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Navigation({ onQuote, onNavigate }: NavigationProps) {
  const [pastHero, setPastHero] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), { rootMargin: '-72px 0px 0px', threshold: 0.02 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = ['home', 'about', 'services', 'packages', 'reviews', 'contact']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: '-25% 0px -60%', threshold: [0.01, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    const background = [document.querySelector('main'), document.querySelector('.footer')].filter((node): node is HTMLElement => Boolean(node));
    background.forEach((node) => { node.inert = true; });
    document.body.classList.add('menu-open');
    const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>(focusable));
    items[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setMenuOpen(false); return; }
      if (event.key !== 'Tab' || items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      background.forEach((node) => { node.inert = false; });
      document.body.classList.remove('menu-open');
      triggerRef.current?.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 861px)');
    const closeDesktop = () => { if (query.matches) setMenuOpen(false); };
    query.addEventListener('change', closeDesktop);
    return () => query.removeEventListener('change', closeDesktop);
  }, []);

  const afterMenuClose = (action: () => void) => {
    if (!menuOpen) { action(); return; }
    setMenuOpen(false);
    requestAnimationFrame(() => requestAnimationFrame(action));
  };
  return (
    <header className={`site-nav${pastHero || menuOpen ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}>
      <div className="site-nav__inner">
        <a className="site-nav__brand" href="#home" aria-label="Dream Drifters home" onClick={(event) => { event.preventDefault(); afterMenuClose(() => onNavigate('home')); }}><BrandMark light /></a>
        <button ref={triggerRef} className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen((open) => !open)}>
          <span>{menuOpen ? 'Close' : 'Menu'}</span>{menuOpen ? <X aria-hidden="true" weight="bold" /> : <List aria-hidden="true" weight="bold" />}
        </button>
        <nav ref={menuRef} id="site-menu" className="site-menu" aria-label="Primary navigation">
          {links.map((link) => <a key={link.id} href={link.href} aria-current={activeSection === link.id ? 'page' : undefined} onClick={(event) => { event.preventDefault(); afterMenuClose(() => onNavigate(link.id)); }}>{link.label}</a>)}
          <button className="button button--accent button--small" type="button" onClick={() => afterMenuClose(onQuote)}>Get a quote</button>
        </nav>
      </div>
    </header>
  );
}
