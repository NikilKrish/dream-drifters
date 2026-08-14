import { ArrowRight, CheckCircle, CircleNotch, WhatsappLogo, X } from '@phosphor-icons/react';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import type { BudgetBand, EnquiryBrief, InterestKind, ServiceId, ValidationErrors } from '../../shared/brief';
import { formatBrief, normalizeBrief, validateBrief } from '../../shared/brief';
import { services } from '../data/company';
import { packages } from '../data/packages';
import { track } from '../lib/analytics';
import type { EnquirySelection } from '../types';

interface EnquirySectionProps { selection: EnquirySelection | null; }
type FormStatus = 'idle' | 'submitting' | 'success';

const initialBrief = (): EnquiryBrief => ({ interestKind: 'custom', name: '', mobile: '', email: '', consent: false, website: '', startedAt: Date.now() });
const budgetOptions: Array<{ value: BudgetBand; label: string }> = [
  { value: 'under-100k', label: 'Under ₹1 lakh per person' },
  { value: '100k-200k', label: '₹1 to ₹2 lakh per person' },
  { value: '200k-400k', label: '₹2 to ₹4 lakh per person' },
  { value: '400k-plus', label: '₹4 lakh or more per person' },
  { value: 'discuss', label: 'Let’s discuss' },
];

export function EnquirySection({ selection }: EnquirySectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const [brief, setBrief] = useState<EnquiryBrief>(initialBrief);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [notified, setNotified] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [privacyOpen, setPrivacyOpen] = useState(false);

  useEffect(() => {
    if (!selection) return;
    const item = selection.packageId ? packages.find((entry) => entry.id === selection.packageId) : undefined;
    setBrief((current) => normalizeBrief({ ...current, interestKind: selection.interestKind, packageId: selection.packageId, serviceId: selection.serviceId, durationDays: item?.durationDays, startedAt: Date.now() }));
    setErrors({}); setStatus('idle'); setAnnouncement(`${selection.label} selected. The enquiry form has been updated.`);
  }, [selection]);

  useEffect(() => { if (status === 'success') successRef.current?.focus(); }, [status]);

  const setField = <K extends keyof EnquiryBrief>(key: K, value: EnquiryBrief[K]) => {
    setBrief((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };
  const validateField = (key: keyof EnquiryBrief) => {
    const message = validateBrief(normalizeBrief(brief))[key] ?? '';
    setErrors((current) => ({ ...current, [key]: message }));
  };
  const chooseKind = (kind: InterestKind) => {
    setBrief((current) => ({ ...current, interestKind: kind, packageId: undefined, serviceId: undefined, travelWindow: kind === 'package' ? current.travelWindow : undefined, budgetBand: kind === 'package' ? current.budgetBand : undefined, startedAt: Date.now() }));
    setErrors({}); setStatus('idle'); setAnnouncement(`${kind === 'custom' ? 'Custom journey' : kind} selected.`);
  };

  const selectedLabel = brief.interestKind === 'package' ? packages.find((item) => item.id === brief.packageId)?.title : brief.interestKind === 'service' ? services.find((item) => item.id === brief.serviceId)?.title : undefined;
  const whatsappText = useMemo(() => formatBrief(normalizeBrief(brief)), [brief]);
  const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || '919363312124').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
  const errorEntries = Object.entries(errors).filter(([, message]) => Boolean(message));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const normalized = normalizeBrief(brief);
    const validation = validateBrief(normalized);
    if (Object.keys(validation).length) {
      setErrors(validation); setAnnouncement('Please review the highlighted fields.');
      window.setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }
    setStatus('submitting'); setAnnouncement('Sending your enquiry securely.');
    try {
      const response = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(normalized) });
      const result = await response.json() as { ok?: boolean };
      const backendNotified = response.ok && result.ok === true;
      setNotified(backendNotified);
      track('enquiry_submitted', { backend_notified: backendNotified, interest_kind: normalized.interestKind });
    } catch {
      setNotified(false); track('enquiry_submitted', { backend_notified: false, interest_kind: normalized.interestKind });
    }
    setBrief(normalized); setStatus('success'); setAnnouncement('Your enquiry brief is ready to continue in WhatsApp.');
  };

  return (
    <section id="contact" className="enquiry chapter" aria-labelledby="enquiry-title" data-section="contact">
      <div className="enquiry__backdrop"><picture><source type="image/avif" srcSet="/media/dubai.avif" /><img src="/media/dubai.webp" width="1600" height="1100" loading="lazy" decoding="async" alt="" /></picture></div><div className="enquiry__wash" />
      <div className="shell enquiry__layout">
        <div className="enquiry__intro"><h2 id="enquiry-title">Plan your trip with us.</h2><p>Tell us what you need. A Dream Drifters travel expert will respond with clear next steps and considered options.</p><address><a href="tel:+919363312124">+91 93633 12124</a><a href="mailto:info@dreamdrifters.in">info@dreamdrifters.in</a><span>68, Dhanalakshmi Nagar, 3rd Street<br />Nerkundram, Chennai 600 107</span><small>GST 33AAMCD2807P1ZC</small></address></div>
        <form ref={formRef} className="enquiry-form glass-panel" onSubmit={submit} noValidate aria-busy={status === 'submitting'}>
          <div className="sr-status" aria-live="polite">{announcement}</div>
          {status === 'success' ? (
            <div className="enquiry-success"><CheckCircle aria-hidden="true" weight="thin" /><h3 ref={successRef} tabIndex={-1}>Your enquiry is ready.</h3><p>{notified ? 'Our team has also received a secure notification.' : 'The background notification was unavailable, but your prepared WhatsApp brief is ready.'}</p><pre>{whatsappText}</pre><a className="button button--accent" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_continued', { interest_kind: brief.interestKind })}>Continue in WhatsApp <WhatsappLogo aria-hidden="true" weight="fill" /></a><button className="button button--text-light" type="button" onClick={() => { setBrief(initialBrief()); setStatus('idle'); setAnnouncement('The form is ready for a new enquiry.'); }}>Start another enquiry</button></div>
          ) : (
            <>
              <div className="enquiry-form__heading"><h3>Send us an enquiry</h3><small>Required fields are marked *</small></div>
              {selectedLabel && <div className="selection-banner"><div><span>Selected for this enquiry</span><strong>{selectedLabel}</strong></div><button type="button" onClick={() => chooseKind('custom')} aria-label={`Clear ${selectedLabel} selection`}><X aria-hidden="true" weight="bold" />Change</button></div>}
              {errorEntries.length > 0 && <div ref={errorRef} className="error-summary" role="alert" tabIndex={-1}><strong>Please check the following:</strong><ul>{errorEntries.map(([key, message]) => <li key={key}>{message}</li>)}</ul></div>}
              <fieldset className="interest-picker"><legend>What can we help with? *</legend>{(['package', 'service', 'custom'] as InterestKind[]).map((kind) => <label key={kind} className={brief.interestKind === kind ? 'is-selected' : ''}><input type="radio" name="interestKind" value={kind} checked={brief.interestKind === kind} onChange={() => chooseKind(kind)} /><span>{kind === 'package' ? 'Travel package' : kind === 'service' ? 'Travel service' : 'Custom journey'}</span></label>)}</fieldset>
              {brief.interestKind === 'package' && <div className="conditional-fields">
                <Field label="Select package *" error={errors.packageId} errorId="package-error" wide><select aria-label="Select package" value={brief.packageId ?? ''} aria-invalid={Boolean(errors.packageId)} aria-describedby={errors.packageId ? 'package-error' : undefined} onBlur={() => validateField('packageId')} onChange={(event) => { const item = packages.find((entry) => entry.id === event.target.value); setField('packageId', event.target.value || undefined); if (item) setField('durationDays', item.durationDays); }}><option value="">Choose a journey</option>{packages.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></Field>
                <Field label="Travel window *" error={errors.travelWindow} errorId="window-error"><input aria-label="Travel window" value={brief.travelWindow ?? ''} placeholder="October 2026 or flexible" aria-invalid={Boolean(errors.travelWindow)} aria-describedby={errors.travelWindow ? 'window-error' : undefined} onBlur={() => validateField('travelWindow')} onChange={(event) => setField('travelWindow', event.target.value)} /></Field>
                <Field label="Duration"><input aria-label="Duration" type="number" min="1" max="60" value={brief.durationDays ?? ''} onChange={(event) => setField('durationDays', event.target.value ? Number(event.target.value) : undefined)} /></Field>
                <Field label="Adults *" error={errors.adults} errorId="adults-error"><input aria-label="Adults" type="number" min="1" max="20" value={brief.adults ?? ''} aria-invalid={Boolean(errors.adults)} aria-describedby={errors.adults ? 'adults-error' : undefined} onBlur={() => validateField('adults')} onChange={(event) => setField('adults', event.target.value ? Number(event.target.value) : undefined)} /></Field>
                <Field label="Children"><input aria-label="Children" type="number" min="0" max="20" value={brief.children ?? 0} onChange={(event) => setField('children', Number(event.target.value))} /></Field>
                <Field label="Budget per person *" error={errors.budgetBand} errorId="budget-error" wide><select aria-label="Budget per person" value={brief.budgetBand ?? ''} aria-invalid={Boolean(errors.budgetBand)} aria-describedby={errors.budgetBand ? 'budget-error' : undefined} onBlur={() => validateField('budgetBand')} onChange={(event) => setField('budgetBand', (event.target.value || undefined) as BudgetBand | undefined)}><option value="">Choose a range</option>{budgetOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
              </div>}
              {brief.interestKind === 'service' && <Field label="Select service *" error={errors.serviceId} errorId="service-error" wide><select aria-label="Select service" value={brief.serviceId ?? ''} aria-invalid={Boolean(errors.serviceId)} aria-describedby={errors.serviceId ? 'service-error' : undefined} onBlur={() => validateField('serviceId')} onChange={(event) => setField('serviceId', (event.target.value || undefined) as ServiceId | undefined)}><option value="">Choose a service</option>{services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}</select></Field>}
              <div className="contact-fields">
                <Field label="Full name *" error={errors.name} errorId="name-error"><input aria-label="Full name" autoComplete="name" value={brief.name} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} onBlur={() => validateField('name')} onChange={(event) => setField('name', event.target.value)} /></Field>
                <Field label="Mobile number *" error={errors.mobile} errorId="mobile-error"><input aria-label="Mobile number" type="tel" autoComplete="tel" placeholder="+91 98765 43210" value={brief.mobile} aria-invalid={Boolean(errors.mobile)} aria-describedby={errors.mobile ? 'mobile-error' : undefined} onBlur={() => validateField('mobile')} onChange={(event) => setField('mobile', event.target.value)} /></Field>
                <Field label="Email address *" error={errors.email} errorId="email-error" wide><input aria-label="Email address" type="email" autoComplete="email" placeholder="name@example.com" value={brief.email} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} onBlur={() => validateField('email')} onChange={(event) => setField('email', event.target.value)} /></Field>
                <Field label="Message" wide><textarea aria-label="Message" rows={4} placeholder="Tell us about your requirements" value={brief.notes ?? ''} onChange={(event) => setField('notes', event.target.value)} /></Field>
              </div>
              <label className="honeypot" aria-hidden="true"><span>Website</span><input tabIndex={-1} autoComplete="off" value={brief.website ?? ''} onChange={(event) => setField('website', event.target.value)} /></label>
              <label className="consent"><input type="checkbox" checked={brief.consent} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'consent-error' : undefined} onBlur={() => validateField('consent')} onChange={(event) => setField('consent', event.target.checked)} /><span>I agree that Dream Drifters may contact me about this enquiry. <button type="button" onClick={() => setPrivacyOpen(true)}>Read privacy notice</button>. *</span></label>{errors.consent && <small id="consent-error" className="field-error field-error--block">{errors.consent}</small>}
              <button className="button button--accent enquiry-form__submit" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? <>Preparing your enquiry <CircleNotch className="spin" aria-hidden="true" /></> : <>Send enquiry <ArrowRight aria-hidden="true" weight="bold" /></>}</button>
            </>
          )}
        </form>
      </div>
      <PrivacyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </section>
  );
}

function Field({ label, error, errorId, wide = false, children }: { label: string; error?: string; errorId?: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={`field${wide ? ' field--wide' : ''}`}><span>{label}</span>{children}{error && errorId && <small id={errorId} className="field-error">{error}</small>}</label>;
}

function PrivacyDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (open && !ref.current?.open) ref.current?.showModal(); if (!open && ref.current?.open) ref.current.close(); }, [open]);
  return <dialog ref={ref} className="privacy-dialog" aria-labelledby="privacy-title" onCancel={onClose} onClose={onClose}><button className="icon-button" type="button" onClick={onClose} aria-label="Close privacy notice"><X aria-hidden="true" weight="bold" /></button><h2 id="privacy-title">Privacy notice</h2><p>We use the details in this form only to respond to your enquiry and prepare the requested travel support.</p><p>The website does not persist or log your personal information. If you continue in WhatsApp, your message is handled under WhatsApp’s own privacy terms.</p><p>Contact <a href="mailto:info@dreamdrifters.in">info@dreamdrifters.in</a> to ask about information you have shared with Dream Drifters.</p><button className="button button--accent" type="button" onClick={onClose}>Close privacy notice</button></dialog>;
}
