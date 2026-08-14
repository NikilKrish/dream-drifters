import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Navigation } from './Navigation';

afterEach(cleanup);

describe('Navigation', () => {
  it('traps focus, makes the page inert and closes with Escape', async () => {
    const user = userEvent.setup();
    render(<><Navigation onQuote={vi.fn()} /><main><button type="button">Behind menu</button></main><footer className="footer" /></>);
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
