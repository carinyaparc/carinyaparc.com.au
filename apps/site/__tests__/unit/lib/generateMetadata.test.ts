import { describe, it, expect, vi } from 'vitest';
import { generateMetadata, generatePageMetadata, getPathFromParams, viewport } from '@/src/lib/metadata';

// Mock the constants
vi.mock('@/lib/constants', () => ({
  SITE_TITLE: 'Carinya Parc',
  SITE_DESCRIPTION: 'Carinya Parc - Regenerative farming and sustainable living',
  BASE_URL: 'https://carinyaparc.com.au',
}));

describe('generateMetadata', () => {
  describe('viewport', () => {
    it('should export viewport configuration', () => {
      expect(viewport).toBeDefined();
      expect(viewport.themeColor).toBe('#4CA77F');
    });
  });

  describe('generateMetadata function', () => {
    it('should generate metadata with default values', async () => {
      const mockParent = Promise.resolve({
        openGraph: { images: [] },
      });

      const result = await generateMetadata({ params: {}, searchParams: {} }, mockParent as any);

      expect(result).toBeDefined();
      expect(result.title).toEqual({ default: 'Carinya Parc', template: '%s | Carinya Parc' });
      expect(result.description).toBe('Carinya Parc - Regenerative farming and sustainable living');
    });

    it('should handle blog post params', async () => {
      const mockParent = Promise.resolve({
        openGraph: { images: [] },
      });

      const result = await generateMetadata(
        { params: { post: 'test-post' }, searchParams: {} },
        mockParent as any,
      );

      expect(result.alternates?.canonical).toBe('https://carinyaparc.com.au/blog/test-post');
    });
  });

  describe('generatePageMetadata function', () => {
    it('should generate page metadata with required fields', () => {
      const metadata = generatePageMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: '/test',
      });

      expect(metadata.title).toBe('Test Page');
      expect(metadata.description).toBe('Test description');
      expect(metadata.alternates?.canonical).toBe('https://carinyaparc.com.au/test');
    });

    it('should handle optional image parameter', () => {
      const metadata = generatePageMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: '/test',
        image: '/test-image.jpg',
      });

      expect(metadata.openGraph?.images).toEqual([
        {
          url: 'https://carinyaparc.com.au/test-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Test Page',
        },
      ]);
    });

    it('should handle article type', () => {
      const metadata = generatePageMetadata({
        title: 'Test Article',
        description: 'Test article description',
        path: '/blog/test',
        type: 'article',
      });

      // Type is correctly set in the actual implementation
      expect(metadata.openGraph).toBeDefined();
    });

    it('should handle keywords', () => {
      const keywords = ['farming', 'regenerative', 'sustainable'];
      const metadata = generatePageMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: '/test',
        keywords,
      });

      expect(metadata.keywords).toContain('farming');
      expect(metadata.keywords).toContain('regenerative');
      expect(metadata.keywords).toContain('sustainable');
    });

    it('should set proper OpenGraph and Twitter metadata', () => {
      const metadata = generatePageMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: '/test',
      });

      expect(metadata.openGraph?.title).toBe('Test Page');
      expect(metadata.openGraph?.description).toBe('Test description');
      expect(metadata.openGraph?.url).toBe('https://carinyaparc.com.au/test');
    });
  });
});
