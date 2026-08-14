import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { EnquirySection } from './EnquirySection';

afterEach(cleanup);

describe('EnquirySection', () => {
  it('prefills a selected package and reveals package-only fields', async () => {
    render(<EnquirySection selection={{ interestKind: 'package', packageId: 'maldives', label: 'Maldives Paradise', requestId: 1 }} />);
    await waitFor(() => expect(screen.getByLabelText(/select package/i)).toHaveValue('maldives'));
    expect(screen.getByLabelText(/travel window/i)).toBeVisible();
    expect(screen.queryByLabelText(/select service/i)).not.toBeInTheDocument();
    expect(screen.getByText(/selected for this enquiry/i)).toBeVisible();
  });

  it('switches to a service enquiry without requiring package details', async () => {
    const user = userEvent.setup();
    render(<EnquirySection selection={null} />);
    await user.click(screen.getByLabelText(/travel service/i));
    expect(screen.getByLabelText(/select service/i)).toBeVisible();
    expect(screen.queryByLabelText(/travel window/i)).not.toBeInTheDocument();
  });

  it('focuses a linked error summary when required details are missing', async () => {
    const user = userEvent.setup();
    render(<EnquirySection selection={null} />);
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));
    const summary = screen.getByRole('alert');
    expect(summary).toHaveFocus();
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('aria-describedby', 'name-error');
    expect(screen.getByLabelText(/mobile number/i)).toHaveAttribute('aria-describedby', 'mobile-error');
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('aria-describedby', 'email-error');
  });
});
