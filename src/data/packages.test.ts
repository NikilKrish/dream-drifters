import { describe, expect, it } from 'vitest';
import type { BrochureDetails, PackageDepartureSchedule, TravelPackage } from '../types';
import { packages } from './packages';

const incompleteItineraryNotice = 'Detailed day-by-day itinerary will be confirmed by Dream Drifters.';

const brochureSourceFiles: Record<string, string> = {
  bali: 'WhatsApp Image 2026-08-17 at 9.06.41 PM (3).jpeg',
  mexico: 'WhatsApp Image 2026-08-17 at 9.06.40 PM.jpeg',
  tanzania: 'WhatsApp Image 2026-08-17 at 9.06.40 PM (1).jpeg',
  'usa-2026': 'WhatsApp Image 2026-08-17 at 9.06.41 PM.jpeg',
  'machu-picchu': 'WhatsApp Image 2026-08-17 at 9.06.41 PM (1).jpeg',
  ramakkalmedu: 'WhatsApp Image 2026-08-17 at 9.06.41 PM (2).jpeg',
};

describe('journey catalogue', () => {
  it('publishes the eleven uniquely addressable packages in the approved order without duplicating Bali', () => {
    expect(packages.map((item) => item.id)).toEqual([
      'maldives',
      'japan',
      'switzerland',
      'bali',
      'paris',
      'dubai',
      'mexico',
      'tanzania',
      'usa-2026',
      'machu-picchu',
      'ramakkalmedu',
    ]);
    expect(new Set(packages.map((item) => item.id)).size).toBe(11);
    expect(packages.filter((item) => item.id === 'bali')).toHaveLength(1);
  });

  it('keeps package media references compatible while allowing an unstated numeric duration', () => {
    const { durationDays: _durationDays, ...packageWithoutDurationDays } = packages[0];
    const packageWithOptionalDuration = packageWithoutDurationDays satisfies TravelPackage;

    expect(packageWithOptionalDuration.id).toBe('maldives');
    packages.forEach((item) => {
      expect(item.image).toBe(`/media/${item.id}.webp`);
      expect(item.imageAvif).toBe(`/media/${item.id}.avif`);
      expect(item.imageAlt.length).toBeGreaterThan(10);
    });
  });

  it('records the supplied brochure filename and an honest itinerary notice for incomplete brochures', () => {
    const modelExample = {
      sourceFile: 'brochure.jpeg',
      departureSchedule: {
        caption: 'Fixed departures',
        months: ['Aug'],
        programmes: [{ name: 'Example', duration: '1 day', departures: ['01'] }],
      },
    } satisfies BrochureDetails;
    const scheduleExample = modelExample.departureSchedule satisfies PackageDepartureSchedule;
    expect(scheduleExample.months).toEqual(['Aug']);

    Object.entries(brochureSourceFiles).forEach(([id, sourceFile]) => {
      expect(packages.find((item) => item.id === id)?.brochure?.sourceFile).toBe(sourceFile);
    });

    ['bali', 'mexico', 'tanzania', 'usa-2026', 'machu-picchu'].forEach((id) => {
      const travelPackage = packages.find((item) => item.id === id);
      expect(travelPackage?.itinerary).toEqual([]);
      expect(travelPackage?.brochure?.contentNotice).toBe(incompleteItineraryNotice);
    });
  });

  it('transcribes the Mexico and Tanzania commercial details without converting their brochure prices', () => {
    expect(packages.find((item) => item.id === 'mexico')).toMatchObject({
      title: 'Magnificent Mexico',
      duration: '7 days / 6 nights',
      durationDays: 7,
      price: '$1,513.00',
      priceStatus: 'verified',
      brochure: {
        highlights: ['Chichén Itzá', 'Cancún', 'Mexico City', 'Xcaret'],
        commercialNotes: ['Guaranteed fixed departure', 'Departure: Aug 25', 'Double occupancy per person'],
      },
    });

    expect(packages.find((item) => item.id === 'tanzania')).toMatchObject({
      title: 'Tanzania Escape',
      duration: '6 days / 5 nights',
      durationDays: 6,
      price: '$2,185 PP',
      priceStatus: 'verified',
      brochure: {
        minimumTravellers: 6,
        highlights: ['Lake Manyara', 'Serengeti', 'Ngorongoro'],
        accommodation: [
          'Kibo Palace 4* — 01 Night',
          'Lake Manyara Serena Safari Lodge 4* — 01 Night',
          'Arukore Simba Camp 4* — 02 Nights',
          'Ngorongoro Coffee Lodge 3.5* — 01 Night',
        ],
        exclusions: ['Drinks', 'Tipping norms = USD 15 25 per guide per day', 'International flight'],
      },
    });
  });

  it('transcribes all six USA fixed-departure programmes and their Aug-Nov dates', () => {
    expect(packages.find((item) => item.id === 'usa-2026')?.brochure?.departureSchedule).toEqual({
      caption: 'USA 2026 guaranteed fixed departures',
      months: ['Aug', 'Sep', 'Oct', 'Nov'],
      programmes: [
        { name: 'Eastern Explorer', duration: '7 days / 6 nights', departures: ['06', '10', '20', null] },
        { name: 'Western Wanderer', duration: '7 days / 6 nights', departures: ['12', '16', '28', null] },
        { name: 'Amazing America (East & West Coast)', duration: '13 days / 12 nights', departures: ['06', '10', '22', null] },
        { name: 'Unique USA - (East & West Coast with Orlando)', duration: '16 days / 15 nights', departures: ['06', '10', '22', null] },
        { name: 'Magnificent Mexico', duration: '7 days / 6 nights', departures: ['25', null, null, null] },
        { name: 'Add on Orlando', duration: '4 days / 3 nights', departures: ['18', '22', null, '03'] },
      ],
    });
  });

  it('does not invent a Machu Picchu duration or itinerary', () => {
    const machuPicchu = packages.find((item) => item.id === 'machu-picchu');
    expect(machuPicchu?.duration).toBe('Duration to be confirmed');
    expect(machuPicchu?.durationDays).toBeUndefined();
    expect(machuPicchu?.itinerary).toEqual([]);
    expect(machuPicchu?.inclusions).toEqual(['Pickup and drop', 'Transport', 'Hotel stay', 'Sightseeing', '24x7 support']);
  });

  it('transcribes the three brochure itinerary days for Ramakkalmedu', () => {
    const ramakkalmedu = packages.find((item) => item.id === 'ramakkalmedu');
    expect(ramakkalmedu).toMatchObject({
      duration: '3 days / 2 nights',
      durationDays: 3,
      itinerary: [
        { day: 'Day 1', title: 'Ramakkalmedu' },
        { day: 'Day 2', title: 'Ramakkalmedu' },
        { day: 'Day 3', title: 'Departure' },
      ],
    });
    expect(ramakkalmedu?.itinerary[0].detail).toContain('Tallest Twin Statue, Watch Tower, Photo Point and Children’s Park');
    expect(ramakkalmedu?.itinerary[1].detail).toContain('Windmills and Vineyards');
  });

  it('updates the single Bali record with the brochure stay, activities, inclusions, and dates', () => {
    expect(packages.find((item) => item.id === 'bali')).toMatchObject({
      title: 'Bali Is Calling',
      duration: '7 days / 6 nights',
      durationDays: 7,
      price: 'US $357',
      priceStatus: 'verified',
      inclusions: [
        'Accommodation',
        'English speaking driver',
        'Flower garland welcome',
        '02 x 500ml water bottle',
        '01 dinner',
        '01 spa',
        'Avanza car or similar',
      ],
      brochure: {
        highlights: ['Water Sports', 'ATV Tandem', 'Banana Boat', 'Swing', 'Temple Tours'],
        accommodation: ['02 nights — Seres Spring Resort and Spa', '04 nights — Citadines Berawa Beach Bali'],
        commercialNotes: ['Booking period till 30th Sep 2026', 'Staying period 22nd Dec 2026', 'T&C'],
      },
    });
  });
});
