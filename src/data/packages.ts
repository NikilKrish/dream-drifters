import type { TravelPackage } from '../types';

export const packages: TravelPackage[] = [
  {
    id: 'maldives', title: 'Maldives Paradise', editorialTitle: 'Paradise, privately', location: 'Indian Ocean', duration: '5 days / 4 nights', durationDays: 5, price: '₹95,000', priceStatus: 'hidden', mood: 'Beach and restore',
    summary: 'A warm-water reset shaped around overwater calm, unhurried days and a few unforgettable moments at sea.',
    image: '/media/maldives.webp', imageAvif: '/media/maldives.avif', imageAlt: 'Turquoise water washing onto a tropical beach', layout: 'feature',
    inclusions: ['Five-star overwater resort', 'Water sports and snorkelling', 'Sunset dolphin cruise', 'Spa experience', 'Daily meals'],
    itinerary: [
      { day: 'Day 1', title: 'Island welcome', detail: 'Arrive at Velana International Airport, transfer by speedboat and settle into the rhythm of the island.' },
      { day: 'Day 2', title: 'Into the blue', detail: 'Snorkelling, jet skiing and parasailing followed by an evening dolphin cruise.' },
      { day: 'Day 3', title: 'Slow island life', detail: 'Spa time, island hopping and a traditional Maldivian dinner.' },
      { day: 'Day 4', title: 'Reef and leisure', detail: 'Optional diving, beach time and an evening poolside barbecue.' },
      { day: 'Day 5', title: 'One last swim', detail: 'A leisurely morning before the transfer to the airport.' },
    ],
  },
  {
    id: 'japan', title: 'Japan Cultural Journey', editorialTitle: 'Culture in motion', location: 'Japan', duration: '8 days / 7 nights', durationDays: 8, price: '₹1,10,000', priceStatus: 'hidden', mood: 'Culture and cuisine',
    summary: 'Tokyo energy, Kyoto ritual and the quiet presence of Fuji, connected by one beautifully paced journey.',
    image: '/media/japan.webp', imageAvif: '/media/japan.avif', imageAlt: 'Mount Fuji beyond a still Japanese landscape', layout: 'landscape',
    inclusions: ['Tokyo and Kyoto city tours', 'Traditional tea ceremony', 'Mount Fuji viewpoints', 'Bullet-train journeys', 'Temple and shrine visits'],
    itinerary: [
      { day: 'Day 1', title: 'Tokyo arrival', detail: 'Arrive, settle in and encounter Shibuya and Shinjuku after dark.' },
      { day: 'Day 2', title: 'Old and new Tokyo', detail: 'Senso-ji, Meiji Shrine, Harajuku and a traditional tea ceremony.' },
      { day: 'Day 3', title: 'Fuji horizon', detail: 'Lake Kawaguchi, Chureito Pagoda and an onsen ryokan stay.' },
      { day: 'Day 4', title: 'Hakone landscapes', detail: 'Open-air art, a mountain ropeway and Lake Ashi.' },
      { day: 'Days 5 to 7', title: 'Kyoto rituals', detail: 'Gion, Kinkaku-ji, Arashiyama and the torii gates of Fushimi Inari.' },
      { day: 'Day 8', title: 'Return', detail: 'Bullet train to Tokyo and onward airport transfer.' },
    ],
  },
  {
    id: 'switzerland', title: 'Swiss Alps Adventure', editorialTitle: 'Alpine wonder', location: 'Switzerland', duration: '7 days / 6 nights', durationDays: 7, price: '₹1,20,000', priceStatus: 'hidden', mood: 'Nature and adventure',
    summary: 'High mountain railways, mirror-like lakes and days designed to move between wonder and warmth.',
    image: '/media/switzerland.webp', imageAvif: '/media/switzerland.avif', imageAlt: 'A clear Swiss lake beneath high alpine peaks', layout: 'portrait',
    inclusions: ['Jungfrau experience', 'Guided alpine walks', 'Interlaken adventure', 'Premium hotels', 'Scenic rail travel'],
    itinerary: [
      { day: 'Day 1', title: 'Zurich arrival', detail: 'Old Town, lakeside views and a gentle first evening.' },
      { day: 'Day 2', title: 'Top of Europe', detail: 'Rail to Interlaken and the Jungfrau high-alpine experience.' },
      { day: 'Day 3', title: 'Meadow trails', detail: 'A guided alpine walk and traditional fondue.' },
      { day: 'Days 4 to 6', title: 'Lakes and peaks', detail: 'Lucerne, Mount Rigi and Mount Pilatus by boat, rail and cable car.' },
      { day: 'Day 7', title: 'Departure', detail: 'A quiet morning before the airport transfer.' },
    ],
  },
  {
    id: 'bali', title: 'Bali Tropical Paradise', editorialTitle: 'A softer rhythm', location: 'Bali', duration: '6 days / 5 nights', durationDays: 6, price: '₹85,000', priceStatus: 'hidden', mood: 'Beach and restore',
    summary: 'Forest temples, rice terraces and salt-air evenings, all at a pace that leaves room to feel Bali.',
    image: '/media/bali.webp', imageAvif: '/media/bali.avif', imageAlt: 'A Balinese temple surrounded by tropical forest', layout: 'landscape',
    inclusions: ['Beachfront resort', 'Ubud and rice terraces', 'Balinese spa', 'Yoga and wellness', 'Sunset dining'],
    itinerary: [
      { day: 'Day 1', title: 'Arrive softly', detail: 'Beachfront check-in, welcome massage and sunset dinner.' },
      { day: 'Day 2', title: 'Ubud stories', detail: 'Rice terraces, the palace and a traditional dance.' },
      { day: 'Day 3', title: 'Wellness day', detail: 'Balinese treatments, yoga and meditation.' },
      { day: 'Days 4 to 5', title: 'Temples and coast', detail: 'Tanah Lot, sacred springs and water time at Canggu.' },
      { day: 'Day 6', title: 'Departure', detail: 'A slow final morning before the airport.' },
    ],
  },
  {
    id: 'paris', title: 'Paris Romantic Getaway', editorialTitle: 'The art of romance', location: 'Paris', duration: '6 days / 5 nights', durationDays: 6, price: '₹1,55,000', priceStatus: 'hidden', mood: 'Celebration',
    summary: 'Iconic Paris balanced with intimate streets, long tables and a little room for serendipity.',
    image: '/media/paris.webp', imageAvif: '/media/paris.avif', imageAlt: 'The Eiffel Tower above the rooftops of Paris', layout: 'portrait',
    inclusions: ['Eiffel Tower summit', 'Guided Louvre visit', 'Seine cruise', 'Versailles day trip', 'French dining'],
    itinerary: [
      { day: 'Day 1', title: 'Paris arrival', detail: 'Hotel welcome, a Seine cruise and an evening on the Champs-Élysées.' },
      { day: 'Day 2', title: 'Paris from above', detail: 'Eiffel Tower, Trocadéro and a memorable dinner.' },
      { day: 'Day 3', title: 'Art and old streets', detail: 'The Louvre, Musée d’Orsay and the Latin Quarter.' },
      { day: 'Days 4 to 5', title: 'Versailles and Montmartre', detail: 'Royal gardens, artists’ streets and fine dining.' },
      { day: 'Day 6', title: 'Au revoir', detail: 'Café morning, final shopping and airport transfer.' },
    ],
  },
  {
    id: 'dubai', title: 'Dubai Luxury Escape', editorialTitle: 'Desert after dark', location: 'Dubai', duration: '4 days / 3 nights', durationDays: 4, price: '₹75,000', priceStatus: 'hidden', mood: 'Celebration',
    summary: 'Skyline energy, desert silence and contemporary luxury condensed into one polished escape.',
    image: '/media/dubai.webp', imageAvif: '/media/dubai.avif', imageAlt: 'Dubai skyline glowing in the evening light', layout: 'portrait',
    inclusions: ['Burj Khalifa', 'Desert safari and dinner', 'Five-star hotel', 'Gold Souk visit', 'Beach-club access'],
    itinerary: [
      { day: 'Day 1', title: 'Marina arrival', detail: 'Five-star check-in and a waterfront evening.' },
      { day: 'Day 2', title: 'City to desert', detail: 'Burj Khalifa, the Gold Souk and sunset in the dunes.' },
      { day: 'Day 3', title: 'Water and leisure', detail: 'Beach club, spa time and a final gourmet dinner.' },
      { day: 'Day 4', title: 'Departure', detail: 'A relaxed breakfast and private airport transfer.' },
    ],
  },
];

export function getPackage(id?: string): TravelPackage | undefined {
  return packages.find((item) => item.id === id);
}
