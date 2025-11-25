import { describe, it, expect } from 'vitest';
import { generateBreadcrumbSchema, generateBreadcrumbsFromPath } from '@/lib/schema/breadcrumb';
import { BASE_URL } from '@/lib/constants';

describe('Breadcrumb Schema', () => {
  describe('generateBreadcrumbsFromPath', () => {
    it('should return only home for root path', () => {
      const result = generateBreadcrumbsFromPath('/');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: 'Home',
        url: BASE_URL,
        position: 1,
      });
    });

    it('should handle empty pathname', () => {
      const result = generateBreadcrumbsFromPath('');
      expect(result).toHaveLength(1);
      expect(result[0]!.name).toBe('Home');
    });

    it('should generate breadcrumbs for simple path', () => {
      const result = generateBreadcrumbsFromPath('/about');
      expect(result).toHaveLength(2);
      expect(result[1]).toEqual({
        name: 'About',
        url: `${BASE_URL}/about`,
        position: 2,
      });
    });

    it('should generate breadcrumbs for nested path', () => {
      const result = generateBreadcrumbsFromPath('/about/jonathan');
      expect(result).toHaveLength(3);
      expect(result[1]!.name).toBe('About');
      expect(result[2]).toEqual({
        name: 'Jonathan Daddia',
        url: `${BASE_URL}/about/jonathan`,
        position: 3,
      });
    });

    it('should handle hyphenated segments', () => {
      const result = generateBreadcrumbsFromPath('/legal/privacy-policy');
      expect(result).toHaveLength(3);
      expect(result[2]!.name).toBe('Privacy Policy');
    });

    it('should format unknown segments properly', () => {
      const result = generateBreadcrumbsFromPath('/unknown-segment/test-page');
      expect(result).toHaveLength(3);
      expect(result[1]!.name).toBe('Unknown Segment');
      expect(result[2]!.name).toBe('Test Page');
    });
  });

  describe('generateBreadcrumbSchema', () => {
    it('should generate valid BreadcrumbList schema', () => {
      const items = [
        { name: 'Home', url: BASE_URL, position: 1 },
        { name: 'Blog', url: `${BASE_URL}/blog`, position: 2 },
      ];

      const schema = generateBreadcrumbSchema(items);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      });
    });

    it('should handle empty items array', () => {
      const schema = generateBreadcrumbSchema([]);
      expect(schema.itemListElement).toHaveLength(0);
    });

    it('should generate schema from path', () => {
      const path = '/blog/test-post';
      const breadcrumbs = generateBreadcrumbsFromPath(path);
      const schema = generateBreadcrumbSchema(breadcrumbs);

      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[2]!.name).toBe('Test Post');
    });
  });
});
