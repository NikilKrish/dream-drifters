import { BrandMark } from './BrandMark';

interface FooterProps { onQuote: () => void; }
export function Footer({ onQuote }: FooterProps) {
  return <footer className="footer"><div className="shell footer__grid"><div className="footer__brand"><BrandMark light /><p>Tailor-made leisure journeys and complete travel support from Chennai to the world.</p><button className="button button--accent" type="button" onClick={onQuote}>Get a quote</button></div><div><h2>Navigate</h2><a href="#about">About</a><a href="#services">Services</a><a href="#packages">Packages</a><a href="#reviews">Reviews</a></div><address><h2>Contact</h2><a href="tel:+919363312124">+91 93633 12124</a><a href="mailto:info@dreamdrifters.in">info@dreamdrifters.in</a><span>68, Dhanalakshmi Nagar, 3rd Street<br />Nerkundram, Chennai 600 107</span></address><div className="footer__legal"><span>© {new Date().getFullYear()} DreamDrifters (OPC) Private Limited</span><span>GST 33AAMCD2807P1ZC</span></div></div></footer>;
}
