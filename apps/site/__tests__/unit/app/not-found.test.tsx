import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock Next.js components
vi.mock('next/link', () => ({
  default: vi.fn(({ href, className, children, ...props }) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  )),
}));

vi.mock('next/image', () => ({
  default: vi.fn(({ src, alt, width, height, className, quality, priority, ...props }) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-quality={quality}
      data-priority={priority}
      {...props}
    />
  )),
}));

describe('NotFound', () => {
  it('should render 404 error message', async () => {
    const NotFound = await import('@/app/not-found').then((m) => m.default);

    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(
      screen.getByText("Sorry, we couldn't find the page you're looking for."),
    ).toBeInTheDocument();
  });

  it('should render return home link', async () => {
    const NotFound = await import('@/app/not-found').then((m) => m.default);

    render(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /Return Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should render background image', async () => {
    const NotFound = await import('@/app/not-found').then((m) => m.default);

    render(<NotFound />);

    const backgroundImage = screen.getByRole('img');
    expect(backgroundImage).toHaveAttribute('src', '/images/404.jpg');
    expect(backgroundImage).toHaveAttribute('alt', '');
    expect(backgroundImage).toHaveAttribute('width', '3050');
    expect(backgroundImage).toHaveAttribute('height', '1500');
    expect(backgroundImage).toHaveAttribute('data-quality', '80');
    expect(backgroundImage).toHaveAttribute('data-priority', 'true');
  });

  it('should have proper semantic HTML structure', async () => {
    const NotFound = await import('@/app/not-found').then((m) => m.default);

    const { container } = render(<NotFound />);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('relative', 'isolate', 'min-h-full');

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Page not found');
  });

  it('should have proper CSS classes for styling', async () => {
    const NotFound = await import('@/app/not-found').then((m) => m.default);

    const { container } = render(<NotFound />);

    // Check main element classes
    const main = container.querySelector('main');
    expect(main).toHaveClass('relative', 'isolate', 'min-h-full');

    // Check background image classes
    const image = screen.getByRole('img');
    expect(image).toHaveClass(
      'absolute',
      'inset-0',
      '-z-10',
      'size-full',
      'object-cover',
      'object-top',
    );

    // Check content wrapper classes
    const contentDiv = main?.querySelector('div');
    expect(contentDiv).toHaveClass(
      'mx-auto',
      'max-w-7xl',
      'px-6',
      'py-32',
      'text-center',
      'sm:py-40',
      'lg:px-8',
    );
  });

  it('should have proper text styling classes', async () => {
    const NotFound = await import('@/app/not-found').then((m) => m.default);

    render(<NotFound />);

    // Check 404 text styling
    const status404 = screen.getByText('404');
    expect(status404.tagName.toLowerCase()).toBe('p');
    expect(status404).toHaveClass('text-base/8', 'font-semibold', 'text-white');

    // Check heading styling
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass(
      'mt-4',
      'text-5xl',
      'font-semibold',
      'tracking-tight',
      'text-balance',
      'text-white',
      'sm:text-7xl',
    );

    // Check description styling
    const description = screen.getByText("Sorry, we couldn't find the page you're looking for.");
    expect(description.tagName.toLowerCase()).toBe('p');
    expect(description).toHaveClass(
      'mt-6',
      'text-lg',
      'font-medium',
      'text-pretty',
      'text-white/70',
      'sm:text-xl/8',
    );
  });

  it('should have proper link styling and arrow', async () => {
    const NotFound = await import('@/app/not-found').then((m) => m.default);

    render(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /Return Home/i });
    expect(homeLink).toHaveClass('text-sm/7', 'font-semibold', 'text-white');

    // Check for arrow span
    const arrow = homeLink.querySelector('span[aria-hidden="true"]');
    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveTextContent('←');
  });

  it('should have proper container structure', async () => {
    const NotFound = await import('@/app/not-found').then((m) => m.default);

    const { container } = render(<NotFound />);

    const main = container.querySelector('main');
    const contentDiv = main?.querySelector('div');
    const linkContainer = contentDiv?.querySelector('div.mt-10');

    expect(linkContainer).toHaveClass('mt-10', 'flex', 'justify-center');
  });

  it('should be accessible', async () => {
    const NotFound = await import('@/app/not-found').then((m) => m.default);

    render(<NotFound />);

    // Should have proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    // Link should be accessible
    const homeLink = screen.getByRole('link', { name: /Return Home/i });
    expect(homeLink).toBeInTheDocument();

    // Background image should have empty alt (decorative)
    const backgroundImage = screen.getByRole('img');
    expect(backgroundImage).toHaveAttribute('alt', '');

    // Arrow should be properly hidden from screen readers
    const arrow = homeLink.querySelector('span[aria-hidden="true"]');
    expect(arrow).toHaveAttribute('aria-hidden', 'true');
  });

  it('should have proper responsive classes', async () => {
    const NotFound = await import('@/app/not-found').then((m) => m.default);

    render(<NotFound />);

    // Check responsive classes on main container
    const contentDiv = document.querySelector('main > div');
    expect(contentDiv).toHaveClass('sm:py-40', 'lg:px-8');

    // Check responsive classes on heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('sm:text-7xl');

    // Check responsive classes on description
    const description = screen.getByText("Sorry, we couldn't find the page you're looking for.");
    expect(description).toHaveClass('sm:text-xl/8');
  });

  it('should render correctly multiple times', async () => {
    const NotFound = await import('@/app/not-found').then((m) => m.default);

    const { rerender } = render(<NotFound />);

    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Return Home/i })).toBeInTheDocument();

    rerender(<NotFound />);

    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Return Home/i })).toBeInTheDocument();
  });

  it('should have correct image optimization settings', async () => {
    const NotFound = await import('@/app/not-found').then((m) => m.default);

    render(<NotFound />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('data-quality', '80');
    expect(image).toHaveAttribute('data-priority', 'true');
  });

  it('should use semantic HTML elements correctly', async () => {
    const NotFound = await import('@/app/not-found').then((m) => m.default);

    const { container } = render(<NotFound />);

    // Should use main element
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();

    // Should use h1 for main heading
    const h1 = container.querySelector('h1');
    expect(h1).toHaveTextContent('Page not found');

    // Should use p elements for text content
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2); // Status and description
  });
});
