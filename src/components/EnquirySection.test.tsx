import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EnquirySection } from './EnquirySection';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function useViewport({ desktop, tall }: { desktop: boolean; tall: boolean }) {
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: query.includes('min-width') ? desktop && tall : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
}

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
    useViewport({ desktop: true, tall: true });
    render(<EnquirySection selection={null} />);
    await user.click(screen.getByRole('button', { name: /send enquiry/i }));
    const summary = screen.getByRole('alert');
    expect(summary).toHaveFocus();
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('aria-describedby', 'name-error');
    expect(screen.getByLabelText(/mobile number/i)).toHaveAttribute('aria-describedby', 'mobile-error');
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('moves a short-viewport custom enquiry from interest to contact', async () => {
    const user = userEvent.setup();
    useViewport({ desktop: true, tall: false });
    render(<EnquirySection selection={null} />);

    expect(screen.getByRole('heading', { name: /choose your enquiry/i })).toBeVisible();
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /continue to contact details/i }));

    expect(screen.getByRole('heading', { name: /your contact details/i })).toHaveFocus();
    expect(screen.getByLabelText(/full name/i)).toBeVisible();
    expect(screen.queryByLabelText(/travel package/i)).not.toBeInTheDocument();
  });

  it('preserves contact values after navigating Back', async () => {
    const user = userEvent.setup();
    useViewport({ desktop: false, tall: true });
    render(<EnquirySection selection={null} />);

    await user.click(screen.getByRole('button', { name: /continue to contact details/i }));
    await user.type(screen.getByLabelText(/full name/i), 'Ananya Rao');
    await user.type(screen.getByLabelText(/mobile number/i), '+91 98765 43210');
    await user.type(screen.getByLabelText(/email address/i), 'ananya@example.com');
    await user.type(screen.getByLabelText(/message/i), 'A quiet anniversary journey.');
    await user.click(screen.getByRole('button', { name: /back to enquiry details/i }));
    await user.click(screen.getByRole('button', { name: /continue to contact details/i }));

    expect(screen.getByLabelText(/full name/i)).toHaveValue('Ananya Rao');
    expect(screen.getByLabelText(/mobile number/i)).toHaveValue('+91 98765 43210');
    expect(screen.getByLabelText(/email address/i)).toHaveValue('ananya@example.com');
    expect(screen.getByLabelText(/message/i)).toHaveValue('A quiet anniversary journey.');
  });

  it('exposes progress and announces focused stage changes', async () => {
    const user = userEvent.setup();
    useViewport({ desktop: false, tall: false });
    render(<EnquirySection selection={null} />);

    const progress = screen.getByRole('progressbar', { name: /enquiry progress/i });
    expect(progress).toHaveAttribute('aria-valuemin', '1');
    expect(progress).toHaveAttribute('aria-valuemax', '2');
    expect(progress).toHaveAttribute('aria-valuenow', '1');
    expect(progress).toHaveTextContent('Step 1 of 2');

    await user.click(screen.getByRole('button', { name: /continue to contact details/i }));

    expect(progress).toHaveAttribute('aria-valuenow', '2');
    expect(progress).toHaveTextContent('Step 2 of 2');
    expect(screen.getByRole('heading', { name: /your contact details/i })).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('Step 2 of 2: your contact details.');

    await user.click(screen.getByRole('button', { name: /back to enquiry details/i }));
    expect(screen.getByRole('heading', { name: /choose your enquiry/i })).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('Step 1 of 2: choose your enquiry.');
  });

  it('keeps package enquiries staged on a tall desktop', async () => {
    const user = userEvent.setup();
    useViewport({ desktop: true, tall: true });
    render(<EnquirySection selection={null} />);

    await user.click(screen.getByLabelText(/travel package/i));

    expect(screen.getByRole('progressbar', { name: /enquiry progress/i })).toHaveAttribute('aria-valuenow', '1');
    expect(screen.getByLabelText(/select package/i)).toBeVisible();
    expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
  });

  it('keeps custom and service enquiries compact on a tall desktop', async () => {
    const user = userEvent.setup();
    useViewport({ desktop: true, tall: true });
    const { container } = render(<EnquirySection selection={null} />);

    expect(container.querySelector('.enquiry-form')).toHaveAttribute('data-flow', 'compact');
    expect(screen.queryByRole('progressbar', { name: /enquiry progress/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText(/custom journey/i)).toBeVisible();
    expect(screen.getByLabelText(/full name/i)).toBeVisible();
    expect(screen.getByRole('button', { name: /send enquiry/i })).toBeVisible();

    await user.click(screen.getByLabelText(/travel service/i));

    expect(container.querySelector('.enquiry-form')).toHaveAttribute('data-flow', 'compact');
    expect(screen.queryByRole('progressbar', { name: /enquiry progress/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText(/select service/i)).toBeVisible();
    expect(screen.getByLabelText(/full name/i)).toBeVisible();
    expect(screen.getByRole('button', { name: /send enquiry/i })).toBeVisible();
  });
});
