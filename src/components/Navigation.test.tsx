import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Navigation } from './Navigation';

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value });
}

afterEach(() => {
  cleanup();
  setScrollY(0);
});

describe('Navigation', () => {
  it('restores the opaque surface immediately when the page loads below 24px', () => {
    setScrollY(240);
    const { container } = render(<Navigation onQuote={vi.fn()} onNavigate={vi.fn()} />);

    expect(container.querySelector('.site-nav')).toHaveClass('is-scrolled');
  });

  it('uses 8px and 24px hysteresis without flickering between thresholds', () => {
    setScrollY(0);
    const { container } = render(<Navigation onQuote={vi.fn()} onNavigate={vi.fn()} />);
    const navigation = container.querySelector('.site-nav')!;

    expect(navigation).not.toHaveClass('is-scrolled');
    setScrollY(24);
    fireEvent.scroll(window);
    expect(navigation).toHaveClass('is-scrolled');
    setScrollY(16);
    fireEvent.scroll(window);
    expect(navigation).toHaveClass('is-scrolled');
    setScrollY(8);
    fireEvent.scroll(window);
    expect(navigation).not.toHaveClass('is-scrolled');
    setScrollY(16);
    fireEvent.scroll(window);
    expect(navigation).not.toHaveClass('is-scrolled');
  });

  it('labels the compatible reviews anchor as Assurance', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<Navigation onQuote={vi.fn()} onNavigate={onNavigate} />);

    const assurance = screen.getByRole('link', { name: 'Assurance' });
    expect(assurance).toHaveAttribute('href', '#reviews');
    await user.click(assurance);
    expect(onNavigate).toHaveBeenCalledWith('reviews');
  });

  it('traps focus, makes the page inert and closes with Escape', async () => {
    const user = userEvent.setup();
    render(<><Navigation onQuote={vi.fn()} onNavigate={vi.fn()} /><main><button type="button">Behind menu</button></main><footer className="footer" /></>);
    const trigger = screen.getByRole('button', { name: 'Menu' });
    await user.click(trigger);
    await waitFor(() => expect(document.querySelector('main')).toHaveProperty('inert', true));
    expect(screen.getByRole('link', { name: 'About' })).toHaveFocus();
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(screen.getByRole('button', { name: 'Get a quote' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
    expect(document.querySelector('main')).toHaveProperty('inert', false);
  });
});
