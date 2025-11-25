import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

describe('GlobalError', () => {
  const mockError = new Error('Test error message');
  const mockReload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockReload.mockClear();

    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
      configurable: true,
    });

    // Reset environment
    process.env.NODE_ENV = 'test';
  });

  it('should render error message', async () => {
    const { default: GlobalError } = await import('./global-error');

    render(<GlobalError error={mockError} />);

    expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
  });

  it('should render retry button', async () => {
    const { default: GlobalError } = await import('./global-error');

    render(<GlobalError error={mockError} />);

    const button = screen.getByRole('button', { name: 'Try again' });
    expect(button).toBeInTheDocument();
  });

  it('should reload page when retry button is clicked', async () => {
    const { default: GlobalError } = await import('./global-error');

    render(<GlobalError error={mockError} />);

    const retryButton = screen.getByRole('button', { name: 'Try again' });
    fireEvent.click(retryButton);

    expect(mockReload).toHaveBeenCalled();
  });

  it('should render correct HTML structure', async () => {
    const { default: GlobalError } = await import('./global-error');

    const { container } = render(<GlobalError error={mockError} />);

    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Oops, something went wrong!');
  });

  it('should handle multiple button clicks', async () => {
    const { default: GlobalError } = await import('./global-error');

    render(<GlobalError error={mockError} />);

    const retryButton = screen.getByRole('button', { name: 'Try again' });

    fireEvent.click(retryButton);
    fireEvent.click(retryButton);
    fireEvent.click(retryButton);

    expect(mockReload).toHaveBeenCalledTimes(3);
  });
});

