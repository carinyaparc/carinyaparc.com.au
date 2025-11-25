import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({
    href,
    className,
    children,
    ...props
  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('NotFound', () => {
  it('should render 404 error message', async () => {
    const { default: NotFound } = await import('./not-found');

    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('should render descriptive error message', async () => {
    const { default: NotFound } = await import('./not-found');

    render(<NotFound />);

    expect(
      screen.getByText("Sorry, we couldn't find the page you're looking for."),
    ).toBeInTheDocument();
  });

  it('should render return home link', async () => {
    const { default: NotFound } = await import('./not-found');

    render(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /Return Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should have proper semantic HTML structure', async () => {
    const { default: NotFound } = await import('./not-found');

    const { container } = render(<NotFound />);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Page not found');
  });

  it('should have accessible link with arrow', async () => {
    const { default: NotFound } = await import('./not-found');

    render(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /Return Home/i });
    expect(homeLink).toBeInTheDocument();

    // Check for arrow span
    const arrow = homeLink.querySelector('span[aria-hidden="true"]');
    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveTextContent('←');
  });

  it('should use semantic HTML elements', async () => {
    const { default: NotFound } = await import('./not-found');

    const { container } = render(<NotFound />);

    // Should use main element
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();

    // Should use h1 for main heading
    const h1 = container.querySelector('h1');
    expect(h1).toHaveTextContent('Page not found');

    // Should use p elements for text content
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).toBeGreaterThan(0);
  });
});
