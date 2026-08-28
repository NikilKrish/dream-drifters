import type { InterestKind } from '../../shared/brief';

export type EnquiryStep = 'interest' | 'travellers' | 'contact';

export function getEnquirySequence(kind: InterestKind, tallDesktop: boolean): EnquiryStep[] {
  if (kind === 'package') return ['interest', 'travellers', 'contact'];
  return tallDesktop ? ['interest'] : ['interest', 'contact'];
}

export function getPreviousEnquiryStep(step: EnquiryStep, sequence: EnquiryStep[]): EnquiryStep {
  const index = sequence.indexOf(step);
  return sequence[Math.max(0, index - 1)] ?? sequence[0] ?? 'interest';
}
