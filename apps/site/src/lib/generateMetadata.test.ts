import { describe, it, expect } from 'vitest';

describe('generateMetadata', () => {
  describe('viewport', () => {
    it('should export viewport configuration', async () => {
      const { viewport } = await import('@/src/lib/metadata');
      
      expect(viewport).toBeDefined();
      expect(viewport.themeColor).toBe('#4CA77F');
    });
  });

  describe('generateMetadata function', () => {
    it('should be a function', async () => {
      const { generateMetadata } = await import('@/src/lib/metadata');
      
      expect(typeof generateMetadata).toBe('function');
    });

    it('should return metadata object', async () => {
      const { generateMetadata } = await import('@/src/lib/metadata');
      
      const mockParent = Promise.resolve({
        openGraph: { images: [] },
      });

      const result = await generateMetadata({ params: {}, searchParams: {} }, mockParent as any);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('description');
    });
  });

  describe('generatePageMetadata function', () => {
    it('should be a function', async () => {
      const { generatePageMetadata } = await import('@/src/lib/metadata');
      
      expect(typeof generatePageMetadata).toBe('function');
    });

    it('should generate metadata with required fields', async () => {
      const { generatePageMetadata } = await import('@/src/lib/metadata');
      
      const result = generatePageMetadata({
        title: 'Test Page',
        description: 'Test Description',
        path: '/test',
      });

      expect(result).toBeDefined();
      expect(result.title).toBe('Test Page');
      expect(result.description).toBe('Test Description');
    });

    it('should handle optional fields', async () => {
      const { generatePageMetadata } = await import('@/src/lib/metadata');
      
      const result = generatePageMetadata({
        title: 'Test',
        description: 'Desc',
        path: '/test',
        keywords: ['test', 'page'],
      });

      expect(result).toBeDefined();
      // Keywords may be part of the metadata object
      if (result.keywords) {
        expect(Array.isArray(result.keywords)).toBe(true);
      }
    });
  });

  describe('getPathFromParams function', () => {
    it('should be a function', async () => {
      const { getPathFromParams } = await import('@/src/lib/metadata');
      
      expect(typeof getPathFromParams).toBe('function');
    });

    it('should handle empty params', async () => {
      const { getPathFromParams } = await import('@/src/lib/metadata');
      
      const result = getPathFromParams({});
      
      expect(result).toBe('/');
    });

    it('should handle post param', async () => {
      const { getPathFromParams } = await import('@/src/lib/metadata');
      
      const result = getPathFromParams({ post: 'test-post' });
      
      expect(result).toContain('test-post');
    });
  });
});

