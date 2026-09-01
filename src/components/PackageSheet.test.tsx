import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { packages } from '../data/packages';
import type { TravelPackage } from '../types';
import { PackageSheet } from './PackageSheet';

vi.mock('gsap', () => ({
  gsap: {
    context: (renderAnimation: () => void) => {
      renderAnimation();
      return { revert: vi.fn() };
    },
    fromTo: vi.fn(),
    registerPlugin: vi.fn(),
    to: vi.fn(),
  },
}));

vi.mock('gsap/Flip', () => ({ Flip: { fit: vi.fn() } }));

function getPackage(id: string): TravelPackage {
  const travelPackage = packages.find((item) => item.id === id);
  if (!travelPackage) throw new Error(`Missing package fixture: ${id}`);
  return travelPackage;
}

function renderPackage(travelPackage: TravelPackage, onClose = vi.fn(), onPlan = vi.fn()) {
  render(<PackageSheet travelPackage={travelPackage} sourceImage={null} onClose={onClose} onPlan={onPlan} />);
  return { dialog: screen.getByRole('dialog', { name: travelPackage.editorialTitle }), onClose, onPlan };
}

afterEach(() => {
  cleanup();
  document.body.classList.remove('overlay-open');
});

describe('PackageSheet brochure details', () => {
  it('renders Tanzania pricing, commercial notes, minimum travellers, and populated brochure lists in order', () => {
    const { dialog } = renderPackage(getPackage('tanzania'));

    expect(within(dialog).getByText('From $2,185 PP')).toBeInTheDocument();
    expect(within(dialog).getByText('Minimum travellers')).toBeInTheDocument();
    expect(within(dialog).getByText('6')).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { level: 4, name: 'Commercial notes' })).toBeInTheDocument();
    expect(within(dialog).getByText('Tipping amount is ambiguous in the source artwork and must be confirmed with Dream Drifters before use.')).toBeInTheDocument();

    const sectionHeadings = within(dialog).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
    expect(sectionHeadings).toEqual([
      'Key facts',
      'Highlights',
      'Accommodation',
      'Inclusions',
      'Exclusions',
      'Content notice',
    ]);

    expect(within(dialog).getByText('Lake Manyara')).toBeInTheDocument();
    expect(within(dialog).getByText('Kibo Palace 4* — 01 Night')).toBeInTheDocument();
    expect(within(dialog).getByText('01 x seven-seater vehicle with driver and fuel for 5 days')).toBeInTheDocument();
    expect(within(dialog).getByText((_, element) => element?.textContent === 'Tipping norms = USD 15\n25 per guide per day')).toBeInTheDocument();
    expect(within(dialog).getByText('Detailed day-by-day itinerary will be confirmed by Dream Drifters.')).toBeInTheDocument();
    expect(within(dialog).queryByRole('heading', { name: 'Day-by-day itinerary' })).not.toBeInTheDocument();
  });

  it('renders the USA departure schedule as a captioned table with headers, dates, and explicit non-departure cells', () => {
    const { dialog } = renderPackage(getPackage('usa-2026'));
    const table = within(dialog).getByRole('table', { name: 'USA 2026 guaranteed fixed departures' });

    expect(within(dialog).getByRole('heading', { level: 3, name: 'Departure schedule' })).toBeInTheDocument();
    expect(within(table).getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Programme',
      'Duration',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
    ]);

    const easternExplorer = within(table).getByRole('row', { name: 'Eastern Explorer 7 days / 6 nights 06 10 20 No departure' });
    expect(within(easternExplorer).getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['7 days / 6 nights', '06', '10', '20', '—']);

    const mexico = within(table).getByRole('row', { name: 'Magnificent Mexico 7 days / 6 nights 25 No departure No departure No departure' });
    expect(within(mexico).getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['7 days / 6 nights', '25', '—', '—', '—']);
    expect(within(table).getAllByRole('row')).toHaveLength(7);
  });

  it('renders the complete day-by-day itinerary and preserves the package image description', () => {
    const { dialog } = renderPackage(getPackage('ramakkalmedu'));

    expect(within(dialog).getByRole('img', { name: 'Wind turbines across rolling green hills in Japan' })).toBeInTheDocument();
    expect(within(dialog).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      'Key facts',
      'Highlights',
      'Day-by-day itinerary',
    ]);

    const itineraryHeading = within(dialog).getByRole('heading', { level: 3, name: 'Day-by-day itinerary' });
    const itinerary = itineraryHeading.closest('section')?.querySelector('ol');
    expect(itinerary).not.toBeNull();
    expect(within(itinerary!).getAllByRole('listitem')).toHaveLength(3);
    expect(within(itinerary!).getByText('After check-in at the hotel / resort, walk 200 metres to visit Ramakkalmedu Tourist Centre. Visit Tallest Twin Statue, Watch Tower, Photo Point and Children’s Park. After tea and snacks, trek to the famous Ramakkal (Rock of Lord Ram) to watch the 7 townships of Theni District. Return to the resort in the evening and enjoy campfire and dinner.')).toBeInTheDocument();
    expect(within(itinerary!).getByText('Departure')).toBeInTheDocument();
  });

  it('omits every optional section whose collection or content is empty', () => {
    const emptyPackage: TravelPackage = {
      ...getPackage('ramakkalmedu'),
      inclusions: [],
      itinerary: [],
      brochure: {
        sourceFile: 'brochure.jpeg',
        highlights: [],
        accommodation: [],
        exclusions: [],
        commercialNotes: [],
      },
    };
    const { dialog } = renderPackage(emptyPackage);

    expect(within(dialog).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual(['Key facts']);
    expect(within(dialog).queryByRole('list')).not.toBeInTheDocument();
    expect(within(dialog).queryByRole('table')).not.toBeInTheDocument();
  });

  it('preserves focus trapping, Escape and both close controls, and the quote action', async () => {
    const user = userEvent.setup();
    const travelPackage = getPackage('bali');
    const { dialog, onClose, onPlan } = renderPackage(travelPackage);
    const closeControls = within(dialog).getAllByRole('button', { name: 'Close journey details' });
    const quoteAction = within(dialog).getByRole('button', { name: 'Get a quote for Bali Is Calling' });

    expect(closeControls[0]).toHaveFocus();
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(quoteAction).toHaveFocus();
    await user.keyboard('{Escape}');
    await user.click(closeControls[0]);
    await user.click(closeControls[1]);
    await user.click(quoteAction);

    expect(onClose).toHaveBeenCalledTimes(3);
    expect(onPlan).toHaveBeenCalledWith(travelPackage);
  });
});
