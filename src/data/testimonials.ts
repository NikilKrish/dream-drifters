import type { Testimonial } from '../types';

export const testimonials: Testimonial[] = [
  { quote: 'An absolutely magical experience. Every detail was perfectly planned and the team exceeded our expectations.', author: 'Priya Sharma', journey: 'Maldives trip', status: 'draft' },
  { quote: 'They made our honeymoon unforgettable. The hotel selection and itinerary were spot on.', author: 'Raj and Anjali Patel', journey: 'Paris getaway', status: 'draft' },
  { quote: 'Professional, responsive and genuinely passionate about travel. A dependable corporate travel partner.', author: 'Suresh Rajan', journey: 'Corporate travel in Dubai', status: 'draft' },
  { quote: 'The visa assistance was seamless and stress-free. Everything was sorted well in advance.', author: 'Meena Krishnamurthy', journey: 'Japan journey', status: 'draft' },
  { quote: 'The group event planning was flawless, from logistics to accommodation.', author: 'Vikram Industries', journey: 'Corporate event in Bali', status: 'draft' },
  { quote: 'Their support made our international trip feel completely stress-free.', author: 'Deepa and family', journey: 'Switzerland adventure', status: 'draft' },
];

export const verifiedTestimonials = testimonials.filter((item) => item.status === 'verified');
