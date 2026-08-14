import type { ProofItem, TravelService, TrustReason } from '../types';

export const proofItems: ProofItem[] = [
  { label: 'Based in Chennai', detail: 'A registered local office and a direct team to speak with.', status: 'verified', source: 'Company profile supplied by Dream Drifters' },
  { label: 'Leisure and corporate', detail: 'Planning support for individuals, organisations and groups.', status: 'verified', source: 'Company profile supplied by Dream Drifters' },
  { label: 'Six connected services', detail: 'Flights, stays, visas, insurance, events and corporate travel.', status: 'verified', source: 'Published service catalogue' },
  { label: 'One accountable team', detail: 'One point of contact from first brief to travel support.', status: 'verified', source: 'Published service model' },
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
