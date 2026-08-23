import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { EditorialReviews } from './EditorialSections';

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
