import { describe, it, expect } from 'vitest';
import { navigation, type NavItem } from '../../../apps/site/src/app/navigation';

describe('navigation', () => {
  describe('NavItem type', () => {
    it('should allow all valid NavItem properties', () => {
      const validNavItem: NavItem = {
        label: 'Test Label',
        verb: 'Test',
        rest: 'Test Rest',
        href: '/test',
        icon: null,
        children: [],
        visible: true,
      };

      expect(validNavItem).toBeDefined();
    });

    it('should allow minimal NavItem with only href', () => {
      const minimalNavItem: NavItem = {
        href: '/test',
      };

      expect(minimalNavItem).toBeDefined();
    });
  });

  describe('navigation array', () => {
    it('should be exported and be an array', () => {
      expect(navigation).toBeDefined();
      expect(Array.isArray(navigation)).toBe(true);
      expect(navigation.length).toBeGreaterThan(0);
    });

    it('should contain valid navigation items', () => {
      navigation.forEach((item, index) => {
        expect(item).toHaveProperty('href');
        expect(typeof item.href).toBe('string');

        if (item.label) {
          expect(typeof item.label).toBe('string');
        }

        if (item.verb) {
          expect(typeof item.verb).toBe('string');
        }

        if (item.rest) {
          expect(typeof item.rest).toBe('string');
        }

        if (item.visible !== undefined) {
          expect(typeof item.visible).toBe('boolean');
        }

        if (item.children) {
          expect(Array.isArray(item.children)).toBe(true);
        }
      });
    });

    it('should have expected core navigation items', () => {
      const hrefs = navigation.map((item) => item.href);

      // Check for expected routes
      expect(hrefs).toContain('/');
      expect(hrefs).toContain('/about');
      expect(hrefs).toContain('/blog');
      expect(hrefs).toContain('/regenerate');
    });

    it('should have home page marked as not visible', () => {
      const homePage = navigation.find((item) => item.href === '/');
      expect(homePage).toBeDefined();
      expect(homePage?.visible).toBe(false);
    });

    it('should have main navigation items marked as visible', () => {
      const aboutPage = navigation.find((item) => item.href === '/about');
      const blogPage = navigation.find((item) => item.href === '/blog');
      const regeneratePage = navigation.find((item) => item.href === '/regenerate');

      expect(aboutPage?.visible).toBe(true);
      expect(blogPage?.visible).toBe(true);
      expect(regeneratePage?.visible).toBe(true);
    });

    it('should have proper structure for navigation items with verb/rest pattern', () => {
      const verbRestItems = navigation.filter((item) => item.verb && item.rest);

      verbRestItems.forEach((item) => {
        expect(typeof item.verb).toBe('string');
        expect(typeof item.rest).toBe('string');
        expect(item.verb!.length).toBeGreaterThan(0);
        expect(item.rest!.length).toBeGreaterThan(0);
      });
    });

    it('should have valid href patterns', () => {
      navigation.forEach((item) => {
        // Should start with / or be a valid URL
        expect(item.href.startsWith('/') || item.href.startsWith('http') || item.href === '#').toBe(
          true,
        );
      });
    });

    it('should not have duplicate hrefs for visible items', () => {
      const visibleItems = navigation.filter((item) => item.visible !== false);
      const hrefs = visibleItems.map((item) => item.href);
      const uniqueHrefs = [...new Set(hrefs)];

      expect(hrefs.length).toBe(uniqueHrefs.length);
    });

    it('should have consistent structure for complete navigation items', () => {
      const aboutItem = navigation.find((item) => item.href === '/about');
      const blogItem = navigation.find((item) => item.href === '/blog');
      const regenerateItem = navigation.find((item) => item.href === '/regenerate');

      // About item structure
      expect(aboutItem).toEqual({
        verb: 'Discover',
        rest: 'Our Story',
        href: '/about',
        visible: true,
      });

      // Blog item structure
      expect(blogItem).toEqual({
        verb: 'Read',
        rest: 'Life on Pasture',
        href: '/blog',
        visible: true,
      });

      // Regenerate item structure
      expect(regenerateItem).toEqual({
        verb: 'Regenerate',
        rest: 'Land with Us',
        href: '/regenerate',
        visible: true,
      });
    });

    it('should have home item with label instead of verb/rest', () => {
      const homeItem = navigation.find((item) => item.href === '/');

      expect(homeItem).toEqual({
        label: 'Home',
        href: '/',
        visible: false,
      });
    });

    it('should have placeholder items with # href and visible false', () => {
      const placeholderItems = navigation.filter((item) => item.href === '#');

      placeholderItems.forEach((item) => {
        expect(item.visible).toBe(false);
        expect(item.verb).toBeDefined();
        expect(item.rest).toBeDefined();
      });
    });

    it('should contain expected verbs and descriptions', () => {
      const verbs = navigation.map((item) => item.verb).filter(Boolean);
      const expectedVerbs = [
        'Discover',
        'Regenerate',
        'Experience',
        'Learn',
        'Cook',
        'Read',
        'Join',
      ];

      expectedVerbs.forEach((expectedVerb) => {
        expect(verbs).toContain(expectedVerb);
      });
    });

    it('should have proper rest text for each verb', () => {
      const verbRestPairs = navigation
        .filter((item) => item.verb && item.rest)
        .map((item) => ({ verb: item.verb, rest: item.rest }));

      const expectedPairs = [
        { verb: 'Discover', rest: 'Our Story' },
        { verb: 'Regenerate', rest: 'Land with Us' },
        { verb: 'Read', rest: 'Life on Pasture' },
      ];

      expectedPairs.forEach((expectedPair) => {
        expect(verbRestPairs).toContainEqual(expectedPair);
      });
    });

    it('should have valid navigation array length', () => {
      // Should have a reasonable number of navigation items
      expect(navigation.length).toBeGreaterThanOrEqual(5);
      expect(navigation.length).toBeLessThan(20);
    });
  });

  describe('navigation filtering', () => {
    it('should provide visible items when filtered', () => {
      const visibleItems = navigation.filter((item) => item.visible !== false);

      expect(visibleItems.length).toBeGreaterThan(0);
      expect(visibleItems.length).toBeLessThan(navigation.length);
    });

    it('should provide hidden items when filtered', () => {
      const hiddenItems = navigation.filter((item) => item.visible === false);

      expect(hiddenItems.length).toBeGreaterThan(0);
    });

    it('should have correct visible/hidden distribution', () => {
      const visibleItems = navigation.filter((item) => item.visible !== false);
      const hiddenItems = navigation.filter((item) => item.visible === false);

      // All items should be accounted for
      expect(visibleItems.length + hiddenItems.length).toBe(navigation.length);
    });
  });
});
