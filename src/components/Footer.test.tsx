import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Footer } from './Footer';

afterEach(cleanup);

describe('Footer', () => {
  it('labels the compatible reviews anchor as Assurance', () => {
    render(<Footer onQuote={vi.fn()} />);
    expect(screen.getByRole('link', { name: 'Assurance' })).toHaveAttribute('href', '#reviews');
    expect(screen.queryByRole('link', { name: 'Reviews' })).not.toBeInTheDocument();
  });
});
