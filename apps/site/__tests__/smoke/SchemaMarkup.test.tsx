import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SchemaMarkup } from '@/components/ui/SchemaMarkup';

// Mock usePathname
vi.mock('next/navigation', () => ({
  usePathname: () => '/test-path',
}));

describe('SchemaMarkup Component - Smoke Tests', () => {
  it('should render schema script tag', () => {
    const { container } = render(<SchemaMarkup type="page" />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
  });

  it('should generate valid JSON-LD', () => {
    const { container } = render(<SchemaMarkup type="page" />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(() => {
      JSON.parse(script?.textContent || '');
    }).not.toThrow();
  });

  it('should handle blog type with article data', () => {
    const articleData = {
      title: 'Test Article',
      slug: 'test-article',
      author: 'Test Author',
      datePublished: '2024-01-01',
      description: 'Test description',
    };

    const { container } = render(<SchemaMarkup type="blog" data={{ article: articleData }} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
  });

  it('should handle recipe type with recipe data', () => {
    const recipeData = {
      name: 'Test Recipe',
      description: 'Test description',
      author: 'Test Chef',
    };

    const { container } = render(<SchemaMarkup type="recipe" data={{ recipe: recipeData }} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
  });
});
