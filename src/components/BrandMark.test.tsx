import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { BrandMark } from './BrandMark';

afterEach(cleanup);

describe('BrandMark', () => {
  it('renders Dream and Drifters in a wordmark wrapper', () => {
    render(<BrandMark light />);

    expect(screen.getByText('Dream')).toBeInTheDocument();
    expect(screen.getByText('Drifters')).toBeInTheDocument();
    expect(screen.getByText('Dream').parentElement).toHaveClass('brand-mark__words');
  });
});
