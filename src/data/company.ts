import type { ProofItem, TravelCapability, TravelService, TrustReason } from '../types';

export const proofItems: ProofItem[] = [
  { label: 'Chennai based', detail: 'A local travel team with direct support from first conversation to return.', status: 'verified', source: 'Business corrections supplied by Dream Drifters' },
  { label: 'Leisure and Corporate', detail: 'Considered planning for individual travellers, organisations and groups.', status: 'verified', source: 'Business corrections supplied by Dream Drifters' },
  { label: 'Connected worldwide', detail: 'Tour packages, flights, accommodation, visas, MICE and corporate travel through an international partner network.', status: 'verified', source: 'Business corrections supplied by Dream Drifters' },
  { label: 'One accountable team', detail: 'A consistent point of contact across planning, coordination and travel support.', status: 'verified', source: 'Business corrections supplied by Dream Drifters' },
];

export const companyStory = {
  about: 'Dream Drifters is a Chennai based travel management company shaping journeys for leisure travellers, organisations and groups. We combine attentive planning with an international partner network, bringing every flight, stay, experience and business requirement into one considered journey.',
  vision: 'To become a trusted travel partner for individuals and organisations by making every journey seamless, purposeful and memorable.',
  mission: 'To deliver thoughtful, cost-conscious travel solutions through attentive service, reliable partnerships and consistent support before, during and after every journey.',
};

export const capabilities: TravelCapability[] = [
  { id: 'tour-packages', shortTitle: 'Packages', title: 'Tour Packages', summary: 'Leisure journeys shaped around how you want to travel, not a fixed template.', image: '/media/maldives.webp', imageAvif: '/media/maldives.avif', features: ['International and domestic holidays', 'Tailor-made itineraries', 'Family and group journeys', 'Honeymoons and celebrations', 'End-to-end coordination'], action: { kind: 'packages' } },
  { id: 'flights', shortTitle: 'Flights', title: 'Flights', summary: 'Clear route choices, responsive ticketing and practical fare guidance.', image: '/media/japan.webp', imageAvif: '/media/japan.avif', features: ['Domestic and international ticketing', 'Route and fare comparisons', 'Group fare coordination', 'Amendment support', 'Transparent recommendations'], action: { kind: 'enquiry', serviceId: 'flights' } },
  { id: 'accommodation', shortTitle: 'Stays', title: 'Accommodation', summary: 'Suitable stays across budgets, destinations and business requirements.', image: '/media/paris.webp', imageAvif: '/media/paris.avif', features: ['Budget to luxury properties', 'Domestic and international stays', 'Corporate and long-stay options', 'Group accommodation', 'Transfer coordination'], action: { kind: 'enquiry', serviceId: 'accommodation' } },
  { id: 'visa', shortTitle: 'Visas', title: 'Visas', summary: 'Steady guidance through documentation, appointments and travel readiness.', image: '/media/switzerland.webp', imageAvif: '/media/switzerland.avif', features: ['Tourist and business visas', 'Document review and guidance', 'Appointment coordination', 'Compliance support', 'Destination advisories'], action: { kind: 'enquiry', serviceId: 'visa' } },
  { id: 'mice', shortTitle: 'MICE', title: 'Meeting Incentive, Conference Event (MICE)', summary: 'Purposeful group programmes designed around people, performance and memorable shared moments.', image: '/media/bali.webp', imageAvif: '/media/bali.avif', features: ['Business meetings', 'Rewards and recognition programmes', 'Incentive travel', 'Leadership retreats', 'Employee engagement tours', 'Travel vouchers', 'Corporate events'], action: { kind: 'enquiry', serviceId: 'mice' } },
  { id: 'corporate-travel', shortTitle: 'Corporate', title: 'Corporate Travel', summary: 'A managed travel programme that balances traveller care, control and business priorities.', image: '/media/dubai.webp', imageAvif: '/media/dubai.avif', features: ['Travel policy design and compliance', 'Budget and approval controls', 'Supplier and fare management', 'Programme reporting', 'Traveller support and risk coordination', 'Flights, stays and ground transport'], action: { kind: 'enquiry', serviceId: 'corporate-travel' } },
];

export const services: TravelService[] = [
  { id: 'corporate-travel', shortTitle: 'Corporate', title: 'Corporate Travel', summary: 'Complete business travel management with one accountable team.', image: '/media/dubai.webp', imageAvif: '/media/dubai.avif', features: ['Domestic and international flights', 'Hotel and ground transport', 'Travel expense optimisation', 'Traveller and emergency support', 'Vendor management'] },
  { id: 'flights', shortTitle: 'Flights', title: 'Flight Service', summary: 'Expert ticketing, smart routing and transparent fare strategy.', image: '/media/japan.webp', imageAvif: '/media/japan.avif', features: ['Domestic and international ticketing', 'Optimised routing', 'Group fare negotiation', 'Quick turnaround', 'No hidden charges'] },
  { id: 'hotels', shortTitle: 'Hotels', title: 'Hotel Booking', summary: 'The right stay for every budget, journey and business requirement.', image: '/media/paris.webp', imageAvif: '/media/paris.avif', features: ['Budget to luxury hotels', 'Domestic and global destinations', 'Competitive rates', 'Quick confirmations', 'Group accommodation'] },
  { id: 'visa', shortTitle: 'Visas', title: 'Visa Consultancy', summary: 'Clear documentation guidance and steady support through every stage.', image: '/media/switzerland.webp', imageAvif: '/media/switzerland.avif', features: ['Tourist and business visas', 'Documentation guidance', 'Appointment scheduling', 'Compliance support', 'Travel advisory'] },
  { id: 'insurance', shortTitle: 'Insurance', title: 'Travel Insurance', summary: 'Suitable coverage and complete assistance when the unexpected happens.', image: '/media/maldives.webp', imageAvif: '/media/maldives.avif', features: ['International coverage', 'Medical emergencies', 'Trip cancellation', 'Baggage loss and delay', 'Claims support'] },
  { id: 'events', shortTitle: 'Events', title: 'Events and Incentives', summary: 'Complex group moments planned, coordinated and delivered worldwide.', image: '/media/bali.webp', imageAvif: '/media/bali.avif', features: ['Sales meetings', 'Rewards and recognition', 'Incentive trips', 'Leadership retreats', 'Conferences and engagement tours'] },
];

export const trustReasons: TrustReason[] = [
  { title: 'Experienced travel professionals', detail: 'Practical expertise across leisure, business and group travel.' },
  { title: 'Custom corporate solutions', detail: 'Travel programmes shaped around each organisation’s real objectives.' },
  { title: 'Strong global network', detail: 'Established relationships across airlines, hotels and service partners.' },
  { title: 'Cost-conscious planning', detail: 'Clear choices, competitive options and transparent recommendations.' },
  { title: 'Dedicated customer support', detail: 'A real person remains visible before, during and after the journey.' },
  { title: 'Complete event execution', detail: 'Planning, logistics and on-ground coordination through one team.' },
  { title: 'Reliable visa assistance', detail: 'Calm guidance through documentation, appointments and compliance.' },
  { title: 'Traveller safety and care', detail: 'Comfort, clarity and support remain central to every recommendation.' },
];
