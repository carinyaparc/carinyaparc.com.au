import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock Next.js components
vi.mock('next/link', () => ({
  default: vi.fn(({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )),
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ArrowLeft: vi.fn(() => <svg data-testid="arrow-left-icon">ArrowLeft</svg>),
}));

// Mock UI components
vi.mock('@repo/ui/button', () => ({
  Button: vi.fn(({ asChild, variant, size, className, children, ...props }) => {
    if (asChild) {
      return (
        <div data-testid="button" data-variant={variant} className={className} {...props}>
          {children}
        </div>
      );
    }
    return (
      <button
        data-testid="button"
        data-variant={variant}
        data-size={size}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  }),
}));

// Mock page components
vi.mock('@/components/sections/PageHeader', () => ({
  default: vi.fn((props) => (
    <div
      data-testid="page-header"
      data-variant={props.variant}
      data-align={props.align}
      data-title={props.title}
      data-subtitle={props.subtitle}
      data-description={props.description}
      data-background-image={props.backgroundImage}
      data-background-image-alt={props.backgroundImageAlt}
    >
      Page Header
    </div>
  )),
}));

vi.mock('@/components/posts/LatestPosts', () => ({
  LatestPosts: vi.fn((props) => (
    <div
      data-testid="latest-posts"
      data-title={props.title}
      data-subtitle={props.subtitle}
      data-limit={props.limit}
      data-featured={props.featured}
      data-view-all-link={props.viewAllLink}
    >
      Latest Posts
    </div>
  )),
}));

vi.mock('@/components/posts/FeaturedPosts', () => ({
  default: vi.fn((props) => (
    <div data-testid="featured-posts" data-limit={props.limit}>
      Featured Posts
    </div>
  )),
}));

describe('BlogPage', () => {
  it('should render all main sections', async () => {
    const BlogPage = await import('@/app/(blog)/blog/page').then((m) => m.default);

    render(await BlogPage());

    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByTestId('featured-posts')).toBeInTheDocument();
    expect(screen.getByTestId('latest-posts')).toBeInTheDocument();
  });

  it('should render back button with correct props', async () => {
    const BlogPage = await import('@/app/(blog)/blog/page').then((m) => m.default);

    render(await BlogPage());

    const backButton = screen.getByTestId('arrow-left-icon').closest('div');
    expect(backButton).toHaveAttribute('data-variant', 'ghost');

    const backLink = screen.getByText('Back to Home').closest('a');
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('should configure page header correctly', async () => {
    const BlogPage = await import('@/app/(blog)/blog/page').then((m) => m.default);

    render(await BlogPage());

    const pageHeader = screen.getByTestId('page-header');
    expect(pageHeader).toHaveAttribute('data-variant', 'dark');
    expect(pageHeader).toHaveAttribute('data-align', 'center');
    expect(pageHeader).toHaveAttribute('data-title', 'Life on Pasture');
    expect(pageHeader).toHaveAttribute('data-subtitle', 'Our Blog');
    expect(pageHeader).toHaveAttribute('data-background-image', '/images/img_23.jpg');
    expect(pageHeader).toHaveAttribute('data-background-image-alt', 'Carinya Parc landscape');
  });

  it('should configure featured posts with correct limit', async () => {
    const BlogPage = await import('@/app/(blog)/blog/page').then((m) => m.default);

    render(await BlogPage());

    const featuredPosts = screen.getByTestId('featured-posts');
    expect(featuredPosts).toHaveAttribute('data-limit', '1');
  });

  it('should render all category filter buttons', async () => {
    const BlogPage = await import('@/app/(blog)/blog/page').then((m) => m.default);

    render(await BlogPage());

    const expectedCategories = [
      'All',
      'Soil Health',
      'Biodiversity',
      'Water Systems',
      'Education',
      'Wildlife',
    ];

    expectedCategories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('should style "All" category button as default variant', async () => {
    const BlogPage = await import('@/app/(blog)/blog/page').then((m) => m.default);

    render(await BlogPage());

    const allButtons = screen.getAllByTestId('button');
    const allCategoryButton = allButtons.find(
      (button) => button.textContent === 'All' && button.hasAttribute('data-variant'),
    );

    expect(allCategoryButton).toHaveAttribute('data-variant', 'default');
    expect(allCategoryButton).toHaveClass('bg-green-600', 'hover:bg-green-700');
  });

  it('should style other category buttons as outline variant', async () => {
    const BlogPage = await import('@/app/(blog)/blog/page').then((m) => m.default);

    render(await BlogPage());

    const soilHealthButton = screen
      .getAllByTestId('button')
      .find((button) => button.textContent === 'Soil Health');

    expect(soilHealthButton).toHaveAttribute('data-variant', 'outline');
    expect(soilHealthButton).toHaveClass('border-green-600', 'text-green-600', 'hover:bg-green-50');
  });

  it('should configure latest posts correctly', async () => {
    const BlogPage = await import('@/app/(blog)/blog/page').then((m) => m.default);

    render(await BlogPage());

    const latestPosts = screen.getByTestId('latest-posts');
    expect(latestPosts).toHaveAttribute('data-title', 'Recent Articles');
    expect(latestPosts).toHaveAttribute(
      'data-subtitle',
      'Explore our latest insights and updates from the farm',
    );
    expect(latestPosts).toHaveAttribute('data-limit', '6');
    expect(latestPosts).toHaveAttribute('data-featured', 'false');
    expect(latestPosts).toHaveAttribute('data-view-all-link', '');
  });

  it('should have proper layout structure', async () => {
    const BlogPage = await import('@/app/(blog)/blog/page').then((m) => m.default);

    const { container } = render(await BlogPage());

    // Main container
    const mainDiv = container.querySelector('div.min-h-screen');
    expect(mainDiv).toBeInTheDocument();

    // Back button section
    const backButtonSection = container.querySelector('div.max-w-7xl');
    expect(backButtonSection).toBeInTheDocument();
    expect(backButtonSection).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'pt-8');

    // Page header section
    const headerSection = container.querySelector('section');
    expect(headerSection).toBeInTheDocument();
  });

  it('should have proper CSS classes for styling', async () => {
    const BlogPage = await import('@/app/(blog)/blog/page').then((m) => m.default);

    const { container } = render(await BlogPage());

    // Category filter section
    const categorySection = container.querySelector('section.py-8.bg-green-50');
    expect(categorySection).toBeInTheDocument();

    // Blog posts section
    const postsSection = container.querySelector('section.py-20.bg-white');
    expect(postsSection).toBeInTheDocument();

    // Category buttons container
    const buttonContainer = container.querySelector('div.flex.flex-wrap.gap-2.justify-center');
    expect(buttonContainer).toBeInTheDocument();
  });

  it('should render category buttons with correct size', async () => {
    const BlogPage = await import('@/app/(blog)/blog/page').then((m) => m.default);

    render(await BlogPage());

    const categoryButtons = screen
      .getAllByTestId('button')
      .filter((button) =>
        ['All', 'Soil Health', 'Biodiversity', 'Water Systems', 'Education', 'Wildlife'].includes(
          button.textContent || '',
        ),
      );

    categoryButtons.forEach((button) => {
      expect(button).toHaveAttribute('data-size', 'sm');
    });
  });

  it('should have semantic HTML structure', async () => {
    const BlogPage = await import('@/app/(blog)/blog/page').then((m) => m.default);

    const { container } = render(await BlogPage());

    // Should have sections for organization
    const sections = container.querySelectorAll('section');
    expect(sections).toHaveLength(3); // Header, categories, posts

    // Should use proper container classes
    const containers = container.querySelectorAll('div.max-w-7xl');
    expect(containers.length).toBeGreaterThan(0);
  });

  it('should be accessible', async () => {
    const BlogPage = await import('@/app/(blog)/blog/page').then((m) => m.default);

    render(await BlogPage());

    // Back link should be accessible
    const backLink = screen.getByText('Back to Home');
    expect(backLink).toBeInTheDocument();

    // Category buttons should be accessible
    const categoryButtons = screen
      .getAllByTestId('button')
      .filter((button) =>
        ['All', 'Soil Health', 'Biodiversity'].includes(button.textContent || ''),
      );

    categoryButtons.forEach((button) => {
      expect(button.tagName.toLowerCase()).toBe('button');
    });
  });

  it('should handle async rendering correctly', async () => {
    const BlogPage = await import('@/app/(blog)/blog/page').then((m) => m.default);

    // Should be an async function
    expect(BlogPage.constructor.name).toBe('AsyncFunction');

    const result = await BlogPage();
    expect(result).toBeDefined();
    expect(result.type).toBe('div');
  });
});
