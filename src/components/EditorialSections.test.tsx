import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EditorialHero, EditorialReviews } from './EditorialSections';

afterEach(cleanup);

describe('EditorialReviews', () => {
  it('renders Assurance as three visible operating commitments without verification-process copy', () => {
    render(<EditorialReviews />);

    expect(screen.getByRole('heading', { name: 'Support you can see.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'A named point of contact' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Clear options before commitment' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Support through the journey' })).toBeInTheDocument();
    expect(screen.queryByText(/verification|references are available|review is completed/i)).not.toBeInTheDocument();
  });
});

describe('EditorialHero', () => {
  it('keeps a pause control available while the hero loop is moving', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1440 });
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 1 });
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, value: 8 });
    const { container } = render(<EditorialHero onPackages={vi.fn()} onQuote={vi.fn()} />);

    await act(async () => { await new Promise((resolve) => window.setTimeout(resolve, 380)); });
    const video = container.querySelector('video')!;
    fireEvent.canPlay(video);
    fireEvent.loadedData(video);

    await waitFor(() => expect(screen.getByRole('button', { name: 'Pause background video' })).toBeVisible());
  });
});
