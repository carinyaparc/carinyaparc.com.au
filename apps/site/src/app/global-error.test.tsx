import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

// Mock console.error
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: {
    reload: mockReload,
  },
  writable: true,
});

describe('GlobalError', () => {
  const mockError = new Error('Test error message');

  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleError.mockClear();
    mockReload.mockClear();

    // Reset environment
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render error message and retry button', async () => {
    const GlobalError = await import('@/app/global-error').then((m) => m.default);

    render(<GlobalError error={mockError} />);

    expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('should have proper HTML structure', async () => {
    const GlobalError = await import('@/app/global-error').then((m) => m.default);

    const { container } = render(<GlobalError error={mockError} />);

    const html = container.querySelector('html');
    expect(html).toBeInTheDocument();

    const body = container.querySelector('body');
    expect(body).toBeInTheDocument();

    const heading = container.querySelector('h2');
    expect(heading).toHaveTextContent('Oops, something went wrong!');
  });

  it('should capture exception in production', async () => {
    process.env.NODE_ENV = 'production';

    const GlobalError = await import('@/app/global-error').then((m) => m.default);

    render(<GlobalError error={mockError} />);

    expect(Sentry.captureException).toHaveBeenCalledWith(mockError);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  it('should log error to console in development', async () => {
    process.env.NODE_ENV = 'development';

    const GlobalError = await import('@/app/global-error').then((m) => m.default);

    render(<GlobalError error={mockError} />);

    expect(mockConsoleError).toHaveBeenCalledWith('Global error:', mockError);
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('should log error to console in test environment', async () => {
    process.env.NODE_ENV = 'test';

    const GlobalError = await import('@/app/global-error').then((m) => m.default);

    render(<GlobalError error={mockError} />);

    expect(mockConsoleError).toHaveBeenCalledWith('Global error:', mockError);
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('should reload page when try again button is clicked', async () => {
    const GlobalError = await import('@/app/global-error').then((m) => m.default);

    render(<GlobalError error={mockError} />);

    const retryButton = screen.getByRole('button', { name: 'Try again' });
    fireEvent.click(retryButton);

    expect(mockReload).toHaveBeenCalled();
  });

  it('should handle error with digest property', async () => {
    const errorWithDigest = Object.assign(new Error('Test error'), { digest: 'abc123' });

    const GlobalError = await import('@/app/global-error').then((m) => m.default);

    render(<GlobalError error={errorWithDigest} />);

    expect(mockConsoleError).toHaveBeenCalledWith('Global error:', errorWithDigest);
    expect(errorWithDigest.digest).toBe('abc123');
  });

  it('should handle error without digest property', async () => {
    const simpleError = new Error('Simple error');

    const GlobalError = await import('@/app/global-error').then((m) => m.default);

    render(<GlobalError error={simpleError} />);

    expect(mockConsoleError).toHaveBeenCalledWith('Global error:', simpleError);
  });

  it('should re-run effect when error changes', async () => {
    const GlobalError = await import('@/app/global-error').then((m) => m.default);

    const firstError = new Error('First error');
    const secondError = new Error('Second error');

    const { rerender } = render(<GlobalError error={firstError} />);

    expect(mockConsoleError).toHaveBeenCalledWith('Global error:', firstError);

    // Clear mock calls
    mockConsoleError.mockClear();

    // Rerender with new error
    rerender(<GlobalError error={secondError} />);

    expect(mockConsoleError).toHaveBeenCalledWith('Global error:', secondError);
  });

  it('should handle Sentry errors gracefully', async () => {
    process.env.NODE_ENV = 'production';

    // Make Sentry.captureException throw an error
    (Sentry.captureException as any).mockImplementation(() => {
      throw new Error('Sentry error');
    });

    const GlobalError = await import('@/app/global-error').then((m) => m.default);

    // Should not throw
    expect(() => {
      render(<GlobalError error={mockError} />);
    }).not.toThrow();
  });

  it('should have accessible button', async () => {
    const GlobalError = await import('@/app/global-error').then((m) => m.default);

    render(<GlobalError error={mockError} />);

    const button = screen.getByRole('button', { name: 'Try again' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Try again');
  });

  it('should maintain component structure across re-renders', async () => {
    const GlobalError = await import('@/app/global-error').then((m) => m.default);

    const { rerender } = render(<GlobalError error={mockError} />);

    expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();

    // Rerender with same error
    rerender(<GlobalError error={mockError} />);

    expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('should handle multiple button clicks', async () => {
    const GlobalError = await import('@/app/global-error').then((m) => m.default);

    render(<GlobalError error={mockError} />);

    const retryButton = screen.getByRole('button', { name: 'Try again' });

    fireEvent.click(retryButton);
    fireEvent.click(retryButton);
    fireEvent.click(retryButton);

    expect(mockReload).toHaveBeenCalledTimes(3);
  });
});
