import { ArrowLeft, ArrowRight, CheckCircle, CircleNotch, WhatsappLogo, X } from '@phosphor-icons/react';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import type { BudgetBand, EnquiryBrief, InterestKind, ServiceId, ValidationErrors } from '../../shared/brief';
import { formatBrief, normalizeBrief, validateBrief } from '../../shared/brief';
import { activeEnquiryServices } from '../data/company';
import { getChapterMedia, getMediaPath } from '../data/media';
import { packages } from '../data/packages';
import { track } from '../lib/analytics';
import { getEnquirySequence, getPreviousEnquiryStep, type EnquiryStep } from '../lib/enquiry-flow';
import type { EnquirySelection } from '../types';

interface EnquirySectionProps { selection: EnquirySelection | null; }
type FormStatus = 'idle' | 'submitting' | 'success' | 'pending-notification' | 'error';
type EnquiryResponse = {
  ok?: boolean;
  stored?: boolean;
  notified?: boolean;
  error?: string;
};

const tallDesktopQuery = '(min-width: 861px) and (min-height: 820px)';
const enquiryMedia = getChapterMedia('enquiry');

const initialBrief = (): EnquiryBrief => ({ interestKind: 'custom', name: '', mobile: '', email: '', consent: false, website: '', startedAt: Date.now() });
const budgetOptions: Array<{ value: BudgetBand; label: string }> = [
  { value: 'under-100k', label: 'Under ₹1 lakh per person' },
  { value: '100k-200k', label: '₹1 to ₹2 lakh per person' },
  { value: '200k-400k', label: '₹2 to ₹4 lakh per person' },
  { value: '400k-plus', label: '₹4 lakh or more per person' },
  { value: 'discuss', label: 'Let’s discuss' },
];

function useTallDesktop() {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(tallDesktopQuery).matches === true);
  useEffect(() => {
    const media = window.matchMedia?.(tallDesktopQuery);
    if (!media) return;
    const update = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return matches;
}

export function EnquirySection({ selection }: EnquirySectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const stageHeadingRef = useRef<HTMLHeadingElement>(null);
  const isTallDesktop = useTallDesktop();
  const previousTallDesktop = useRef(isTallDesktop);
  const [brief, setBrief] = useState<EnquiryBrief>(initialBrief);
  const [step, setStep] = useState<EnquiryStep>('interest');
  const [kindConfirmed, setKindConfirmed] = useState(false);
  const [stageFocusRequest, setStageFocusRequest] = useState(0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [notified, setNotified] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [privacyOpen, setPrivacyOpen] = useState(false);

  useEffect(() => {
    if (!selection) return;
    const item = selection.packageId ? packages.find((entry) => entry.id === selection.packageId) : undefined;
    setBrief((current) => normalizeBrief({ ...current, interestKind: selection.interestKind, packageId: selection.packageId, serviceId: selection.serviceId, durationDays: item?.durationDays, startedAt: Date.now() }));
    setStep('interest'); setKindConfirmed(true); setErrors({}); setSubmissionError(''); setStatus('idle'); setAnnouncement(`${selection.label} selected. The enquiry form has been updated.`);
  }, [selection]);

  useEffect(() => {
    if (status === 'success' || status === 'pending-notification') successRef.current?.focus();
    if (status === 'error') errorRef.current?.focus();
  }, [status]);

  const sequence = getEnquirySequence(brief.interestKind, isTallDesktop);
  const staged = sequence.length > 1;
  const activeStep: EnquiryStep = sequence.includes(step) ? step : 'interest';
  const stepNumber = Math.max(1, sequence.indexOf(activeStep) + 1);

  useEffect(() => {
    const changed = previousTallDesktop.current !== isTallDesktop;
    previousTallDesktop.current = isTallDesktop;
    if (!changed || brief.interestKind === 'package' || status !== 'idle') return;
    setStep('interest');
    setErrors({});
    setSubmissionError('');
    setAnnouncement(isTallDesktop ? 'Compact enquiry form. All details are shown.' : 'Step 1 of 2: choose your enquiry.');
    setStageFocusRequest((current) => current + 1);
  }, [brief.interestKind, isTallDesktop, status]);

  useEffect(() => {
    if (stageFocusRequest === 0) return;
    stageHeadingRef.current?.focus();
  }, [activeStep, stageFocusRequest]);

  const setField = <K extends keyof EnquiryBrief>(key: K, value: EnquiryBrief[K]) => {
    setBrief((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
    setSubmissionError('');
  };
  const validateField = (key: keyof EnquiryBrief) => {
    const message = validateBrief(normalizeBrief(brief))[key] ?? '';
    setErrors((current) => ({ ...current, [key]: message }));
  };
  const chooseKind = (kind: InterestKind) => {
    setBrief((current) => ({ ...current, interestKind: kind, packageId: undefined, serviceId: undefined, travelWindow: kind === 'package' ? current.travelWindow : undefined, budgetBand: kind === 'package' ? current.budgetBand : undefined, startedAt: Date.now() }));
    setStep('interest'); setKindConfirmed(true); setErrors({}); setSubmissionError(''); setStatus('idle'); setAnnouncement(`${kind === 'custom' ? 'Custom journey' : kind} selected.`);
  };

  const goForward = () => {
    const validation = validateBrief(normalizeBrief(brief));
    const keys: Array<keyof EnquiryBrief> = activeStep === 'travellers'
      ? ['adults', 'budgetBand']
      : brief.interestKind === 'package'
      ? ['packageId', 'travelWindow']
      : brief.interestKind === 'service' ? ['serviceId'] : [];
    const stageErrors = Object.fromEntries(keys.flatMap((key) => validation[key] ? [[key, validation[key]]] : [])) as ValidationErrors;
    if (Object.keys(stageErrors).length) {
      setErrors(stageErrors);
      setSubmissionError('');
      setAnnouncement('Please review the highlighted enquiry details.');
      window.setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }
    setStageFocusRequest((current) => current + 1);
    setErrors({});
    setSubmissionError('');
    const next: EnquiryStep = brief.interestKind === 'package' && activeStep === 'interest' ? 'travellers' : 'contact';
    setStep(next);
    setAnnouncement(next === 'travellers' ? 'Step 2 of 3: travellers and budget.' : `Step ${sequence.length} of ${sequence.length}: your contact details.`);
  };

  const goBack = () => {
    const previous = getPreviousEnquiryStep(activeStep, sequence);
    setStageFocusRequest((current) => current + 1);
    setErrors({});
    setSubmissionError('');
    setStep(previous);
    setAnnouncement(previous === 'travellers' ? 'Step 2 of 3: travellers and budget.' : brief.interestKind === 'package' ? 'Step 1 of 3: journey details.' : 'Step 1 of 2: choose your enquiry.');
  };

  const selectedLabel = brief.interestKind === 'package' ? packages.find((item) => item.id === brief.packageId)?.title : brief.interestKind === 'service' ? activeEnquiryServices.find((item) => item.id === brief.serviceId)?.title : undefined;
  const whatsappText = useMemo(() => formatBrief(normalizeBrief(brief)), [brief]);
  const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || '919363312124').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
  const errorEntries = Object.entries(errors).filter(([, message]) => Boolean(message));
  const showInterest = !staged || activeStep === 'interest';
  const showTravellers = activeStep === 'travellers';
  const showContact = !staged || activeStep === 'contact';
  const isStored = status === 'success' || status === 'pending-notification';

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (staged && activeStep !== 'contact') {
      goForward();
      return;
    }
    const normalized = normalizeBrief(brief);
    const validation = validateBrief(normalized);
    if (Object.keys(validation).length) {
      setErrors(validation); setAnnouncement('Please review the highlighted fields.');
      window.setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }
    setErrors({});
    setSubmissionError('');
    setStatus('submitting'); setAnnouncement('Sending your enquiry securely.');
    try {
      const response = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(normalized) });
      const result = await response.json() as EnquiryResponse;
      const backendStored = response.ok && result.ok === true && result.stored === true;
      const backendNotified = backendStored && result.notified === true;
      setNotified(backendNotified);
      track('enquiry_submitted', { backend_notified: backendNotified, interest_kind: normalized.interestKind });
      if (backendStored) {
        setBrief(normalized);
        setStatus(backendNotified ? 'success' : 'pending-notification');
        setAnnouncement(backendNotified ? 'Your enquiry has been received.' : 'Your enquiry has been received. Owner notification is retrying.');
        return;
      }
      const failureMessage = result.error || 'The enquiry could not be saved. Please try again.';
      setStatus('error');
      setSubmissionError(failureMessage);
      setAnnouncement('There was a problem sending your enquiry. Review the alert for next steps.');
      return;
    } catch {
      setNotified(false);
      track('enquiry_submitted', { backend_notified: false, interest_kind: normalized.interestKind });
      setStatus('error');
      setSubmissionError('The enquiry could not be saved. Please try again.');
      setAnnouncement('There was a problem sending your enquiry. Review the alert for next steps.');
      return;
    }
  };

  return (
    <section id="contact" className="enquiry chapter" aria-labelledby="enquiry-title" data-section="contact">
      <div className="enquiry__backdrop"><picture><source type="image/avif" srcSet={getMediaPath(enquiryMedia, 'avif')} /><img src={getMediaPath(enquiryMedia, 'webp')} width="1280" height="800" loading="lazy" decoding="async" alt="" /></picture></div><div className="enquiry__wash" />
      <div className="shell enquiry__layout">
        <div className="enquiry__intro"><h2 id="enquiry-title">Plan your trip with us.</h2><p>Tell us what you need. A Dream Drifters travel expert will respond with clear next steps and considered options.</p><ContactAddress className="enquiry__address--intro" /></div>
        <form ref={formRef} className="enquiry-form glass-panel" data-flow={staged ? 'staged' : 'compact'} onSubmit={submit} noValidate aria-busy={status === 'submitting'}>
          <div className="sr-status" role="status" aria-live="polite">{announcement}</div>
          {isStored ? (
            <div className="enquiry-success"><CheckCircle aria-hidden="true" weight="thin" /><h3 ref={successRef} tabIndex={-1}>Your enquiry has been received.</h3><p>{notified ? 'The owner has also received an email notification.' : 'Your enquiry was saved successfully. The owner’s email notification is pending and will retry. You can continue in WhatsApp if you like.'}</p><pre>{whatsappText}</pre><a className="button button--accent" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_continued', { interest_kind: brief.interestKind })}>Continue in WhatsApp <WhatsappLogo aria-hidden="true" weight="fill" /></a><button className="button button--text-light" type="button" onClick={() => { setBrief(initialBrief()); setStep('interest'); setStatus('idle'); setNotified(false); setSubmissionError(''); setAnnouncement('The form is ready for a new enquiry.'); }}>Start another enquiry</button></div>
          ) : (
            <>
              <div className="enquiry-form__heading">
                <div>
                  <h3 ref={stageHeadingRef} tabIndex={-1}>{staged ? activeStep === 'interest' ? brief.interestKind === 'package' ? 'Journey details' : 'Choose your enquiry' : activeStep === 'travellers' ? 'Travellers and budget' : 'Your contact details' : 'Send us an enquiry'}</h3>
                  <small>Required fields are marked *</small>
                </div>
                {staged && <div className="enquiry-progress" role="progressbar" aria-label="Enquiry progress" aria-valuemin={1} aria-valuemax={sequence.length} aria-valuenow={stepNumber} style={{ '--enquiry-progress': `${(stepNumber / sequence.length) * 100}%` } as React.CSSProperties}><span>Step {stepNumber} of {sequence.length}</span><i aria-hidden="true"><b /></i></div>}
              </div>
              {submissionError ? <div ref={errorRef} className="error-summary" role="alert" tabIndex={-1}><strong>{submissionError}</strong><p>You can retry here or continue in WhatsApp.</p><a className="button button--text-light" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => track('whatsapp_continued', { interest_kind: brief.interestKind })}>Continue in WhatsApp <WhatsappLogo aria-hidden="true" weight="fill" /></a></div> : errorEntries.length > 0 && <div ref={errorRef} className="error-summary" role="alert" tabIndex={-1}><strong>Please check the following:</strong><ul>{errorEntries.map(([key, message]) => <li key={key}>{message}</li>)}</ul></div>}
              {showInterest && <div className="enquiry-stage enquiry-stage--interest">
                {kindConfirmed && <div className="selection-banner"><div><span>Selected for this enquiry</span><strong><span>{brief.interestKind === 'package' ? 'Travel package' : brief.interestKind === 'service' ? 'Travel service' : 'Custom journey'}</span>{selectedLabel && <span>{selectedLabel}</span>}</strong></div><button type="button" onClick={() => { setKindConfirmed(false); setErrors({}); }} aria-label={selectedLabel ? `Clear ${selectedLabel} selection; change enquiry type` : 'Change enquiry type'}><X aria-hidden="true" weight="bold" />Change</button></div>}
                {!kindConfirmed && <fieldset className="interest-picker"><legend>What can we help with? *</legend>{(['package', 'service', 'custom'] as InterestKind[]).map((kind) => <label key={kind} className={brief.interestKind === kind ? 'is-selected' : ''}><input type="radio" name="interestKind" value={kind} checked={brief.interestKind === kind} onChange={() => chooseKind(kind)} /><span>{kind === 'package' ? 'Travel package' : kind === 'service' ? 'Travel service' : 'Custom journey'}</span></label>)}</fieldset>}
                {brief.interestKind === 'package' && <div className="conditional-fields">
                  <Field label="Select package *" error={errors.packageId} errorId="package-error" wide><select aria-label="Select package" value={brief.packageId ?? ''} aria-invalid={Boolean(errors.packageId)} aria-describedby={errors.packageId ? 'package-error' : undefined} onBlur={() => validateField('packageId')} onChange={(event) => { const item = packages.find((entry) => entry.id === event.target.value); setField('packageId', event.target.value || undefined); if (item) setField('durationDays', item.durationDays); }}><option value="">Choose a journey</option>{packages.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></Field>
                  <Field label="Travel window *" error={errors.travelWindow} errorId="window-error"><input aria-label="Travel window" value={brief.travelWindow ?? ''} placeholder="October 2026 or flexible" aria-invalid={Boolean(errors.travelWindow)} aria-describedby={errors.travelWindow ? 'window-error' : undefined} onBlur={() => validateField('travelWindow')} onChange={(event) => setField('travelWindow', event.target.value)} /></Field>
                  <Field label="Duration"><input aria-label="Duration" type="number" min="1" max="60" value={brief.durationDays ?? ''} onChange={(event) => setField('durationDays', event.target.value ? Number(event.target.value) : undefined)} /></Field>
                </div>}
                {brief.interestKind === 'service' && <Field label="Select service *" error={errors.serviceId} errorId="service-error" wide><select aria-label="Select service" value={brief.serviceId ?? ''} aria-invalid={Boolean(errors.serviceId)} aria-describedby={errors.serviceId ? 'service-error' : undefined} onBlur={() => validateField('serviceId')} onChange={(event) => setField('serviceId', (event.target.value || undefined) as ServiceId | undefined)}><option value="">Choose a service</option>{activeEnquiryServices.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}</select></Field>}
                {staged && <button className="button button--accent enquiry-form__next" type="button" onClick={goForward}>{brief.interestKind === 'package' ? 'Continue to travellers and budget' : 'Continue to contact details'} <ArrowRight aria-hidden="true" weight="bold" /></button>}
              </div>}
              {showTravellers && <div className="enquiry-stage enquiry-stage--travellers">
                <div className="conditional-fields">
                  <Field label="Adults *" error={errors.adults} errorId="adults-error"><input aria-label="Adults" type="number" min="1" max="20" value={brief.adults ?? ''} aria-invalid={Boolean(errors.adults)} aria-describedby={errors.adults ? 'adults-error' : undefined} onBlur={() => validateField('adults')} onChange={(event) => setField('adults', event.target.value ? Number(event.target.value) : undefined)} /></Field>
                  <Field label="Children"><input aria-label="Children" type="number" min="0" max="20" value={brief.children ?? 0} onChange={(event) => setField('children', Number(event.target.value))} /></Field>
                  <Field label="Budget per person *" error={errors.budgetBand} errorId="budget-error" wide><select aria-label="Budget per person" value={brief.budgetBand ?? ''} aria-invalid={Boolean(errors.budgetBand)} aria-describedby={errors.budgetBand ? 'budget-error' : undefined} onBlur={() => validateField('budgetBand')} onChange={(event) => setField('budgetBand', (event.target.value || undefined) as BudgetBand | undefined)}><option value="">Choose a range</option>{budgetOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
                </div>
                <div className="enquiry-form__actions enquiry-form__actions--stage"><button className="button button--text-light enquiry-form__back" type="button" onClick={goBack}><ArrowLeft aria-hidden="true" weight="bold" />Back to journey details</button><button className="button button--accent enquiry-form__next" type="button" onClick={goForward}>Continue to contact details <ArrowRight aria-hidden="true" weight="bold" /></button></div>
              </div>}
              {showContact && <div className="enquiry-stage enquiry-stage--contact">
                <div className="contact-fields">
                  <Field label="Full name *" error={errors.name} errorId="name-error"><input aria-label="Full name" autoComplete="name" value={brief.name} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} onBlur={() => validateField('name')} onChange={(event) => setField('name', event.target.value)} /></Field>
                  <Field label="Mobile number *" error={errors.mobile} errorId="mobile-error"><input aria-label="Mobile number" type="tel" autoComplete="tel" placeholder="+91 98765 43210" value={brief.mobile} aria-invalid={Boolean(errors.mobile)} aria-describedby={errors.mobile ? 'mobile-error' : undefined} onBlur={() => validateField('mobile')} onChange={(event) => setField('mobile', event.target.value)} /></Field>
                  <Field label="Email address *" error={errors.email} errorId="email-error"><input aria-label="Email address" type="email" autoComplete="email" placeholder="name@example.com" value={brief.email} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} onBlur={() => validateField('email')} onChange={(event) => setField('email', event.target.value)} /></Field>
                  <Field label="Message"><textarea aria-label="Message" rows={2} placeholder="Tell us about your requirements" value={brief.notes ?? ''} onChange={(event) => setField('notes', event.target.value)} /></Field>
                </div>
                <label className="honeypot" aria-hidden="true"><span>Website</span><input tabIndex={-1} autoComplete="off" value={brief.website ?? ''} onChange={(event) => setField('website', event.target.value)} /></label>
                <div className="enquiry-form__closing">
                  <div><label className="consent"><input type="checkbox" checked={brief.consent} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'consent-error' : undefined} onBlur={() => validateField('consent')} onChange={(event) => setField('consent', event.target.checked)} /><span>I agree that Dream Drifters may store these details in an owner-controlled Google Sheet, retain them indefinitely, and use them to respond to and manage this enquiry. <button type="button" onClick={() => setPrivacyOpen(true)}>Read privacy notice</button>. *</span></label>{errors.consent && <small id="consent-error" className="field-error field-error--block">{errors.consent}</small>}</div>
                  <div className="enquiry-form__actions">
                    {staged && <button className="button button--text-light enquiry-form__back" type="button" onClick={goBack}><ArrowLeft aria-hidden="true" weight="bold" />{brief.interestKind === 'package' ? 'Back to travellers and budget' : 'Back to enquiry details'}</button>}
                    <button className="button button--accent enquiry-form__submit" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? <>Preparing your enquiry <CircleNotch className="spin" aria-hidden="true" /></> : <>Send enquiry <ArrowRight aria-hidden="true" weight="bold" /></>}</button>
                  </div>
                </div>
              </div>}
            </>
          )}
        </form>
        <ContactAddress className="enquiry__address--after" />
      </div>
      <PrivacyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </section>
  );
}

function ContactAddress({ className }: { className: string }) {
  return <address className={`enquiry__address ${className}`}><a href="tel:+919363312124">+91 93633 12124</a><a href="mailto:info@dreamdrifters.in">info@dreamdrifters.in</a><span>68, Dhanalakshmi Nagar, 3rd Street<br />Nerkundram, Chennai 600 107</span><small>GST 33AAMCD2807P1ZC</small></address>;
}

function Field({ label, error, errorId, wide = false, children }: { label: string; error?: string; errorId?: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={`field${wide ? ' field--wide' : ''}`}><span>{label}</span>{children}{error && errorId && <small id={errorId} className="field-error">{error}</small>}</label>;
}

function PrivacyDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (open && !ref.current?.open) ref.current?.showModal(); if (!open && ref.current?.open) ref.current.close(); }, [open]);
  return <dialog ref={ref} className="privacy-dialog" aria-labelledby="privacy-title" onCancel={onClose} onClose={onClose}><button className="icon-button" type="button" onClick={onClose} aria-label="Close privacy notice"><X aria-hidden="true" weight="bold" /></button><h2 id="privacy-title">Privacy notice</h2><p>Dream Drifters stores submitted enquiry details in an owner-controlled Google Sheet to respond and manage follow-up.</p><p>Dream Drifters retains these details indefinitely, unless the owner archives or deletes them. If you continue in WhatsApp, your message is also handled under WhatsApp’s own privacy terms.</p><p>Contact <a href="mailto:info@dreamdrifters.in">info@dreamdrifters.in</a> to ask about information you have shared with Dream Drifters.</p><button className="button button--accent" type="button" onClick={onClose}>Close privacy notice</button></dialog>;
}
