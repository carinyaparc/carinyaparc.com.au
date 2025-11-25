/**
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// We'll mock the modules before importing anything that uses them
vi.mock('fs');
vi.mock('path');

// Mock the constants before importing sitemap
vi.mock('@/lib/constants', () => ({
  BASE_URL: 'https://carinyaparc.com.au',
}));

describe('sitemap', () => {
  // Get mocked modules
  const mockFs = vi.mocked(fs);
  const mockPath = vi.mocked(path);

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default path.join behavior
    mockPath.join.mockImplementation((...args: string[]) => args.filter(Boolean).join('/'));

    // Mock process.cwd()
    vi.spyOn(process, 'cwd').mockReturnValue('/test/project');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should export default sitemap function', async () => {
    // Mock minimal file system to avoid errors
    mockFs.existsSync.mockReturnValue(false);
    mockFs.readdirSync.mockReturnValue([]);

    const { default: sitemap } = await import('@/app/sitemap');
    expect(typeof sitemap).toBe('function');
  });

  describe('getAppRoutes', () => {
    it('should scan app directory and return route info', async () => {
      // Setup mock file system structure
      const fileSystem = {
        '/test/project/site/src/app': ['page.tsx', 'layout.tsx', 'about', 'blog', 'api'],
        '/test/project/site/src/app/about': ['page.tsx'],
        '/test/project/site/src/app/blog': ['page.tsx', '[slug]'],
        '/test/project/site/src/app/blog/[slug]': ['page.tsx'],
      };

      mockFs.existsSync.mockImplementation((path) => {
        const pathStr = path.toString();
        return pathStr.includes('/app') || pathStr.includes('/content');
      });

      mockFs.readdirSync.mockImplementation((dir) => {
        const dirStr = dir.toString();
        return fileSystem[dirStr as keyof typeof fileSystem] || ([] as any);
      });

      mockFs.statSync.mockImplementation((filePath) => {
        const filePathStr = filePath.toString();
        return {
          isDirectory: () => !filePathStr.endsWith('.tsx') && !filePathStr.endsWith('.js'),
          mtime: new Date('2024-01-01'),
        } as any;
      });

      const { default: sitemap } = await import('@/app/sitemap');
      const result = await sitemap();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ url: 'https://carinyaparc.com.au' }),
          expect.objectContaining({ url: 'https://carinyaparc.com.au/about' }),
          expect.objectContaining({ url: 'https://carinyaparc.com.au/blog' }),
        ]),
      );
    });

    it('should handle missing app directory gracefully', async () => {
      mockFs.existsSync.mockReturnValue(false);
      mockFs.readdirSync.mockReturnValue([]);

      const { default: sitemap } = await import('@/app/sitemap');
      const result = await sitemap();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0); // Should still have some routes
    });

    it('should assign correct priorities to different route types', async () => {
      const fileSystem = {
        '/test/project/site/src/app': ['page.tsx', 'about', 'blog', 'legal'],
        '/test/project/site/src/app/about': ['page.tsx'],
        '/test/project/site/src/app/blog': ['page.tsx'],
        '/test/project/site/src/app/legal': ['page.tsx'],
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((dir) => {
        const dirStr = dir.toString();
        return fileSystem[dirStr as keyof typeof fileSystem] || ([] as any);
      });

      mockFs.statSync.mockImplementation((filePath) => {
        const filePathStr = filePath.toString();
        return {
          isDirectory: () => !filePathStr.endsWith('.tsx'),
          mtime: new Date('2024-01-01'),
        } as any;
      });

      const { default: sitemap } = await import('@/app/sitemap');
      const result = await sitemap();

      const homePage = result.find((r) => r.url === 'https://carinyaparc.com.au');
      const aboutPage = result.find((r) => r.url === 'https://carinyaparc.com.au/about');
      const legalPage = result.find((r) => r.url === 'https://carinyaparc.com.au/legal');

      expect(homePage?.priority).toBe(1.0);
      expect(aboutPage?.priority).toBeGreaterThan(0.7);
      expect(legalPage?.priority).toBeLessThan(0.5);
    });

    it('should skip hidden files and directories', async () => {
      const fileSystem = {
        '/test/project/site/src/app': ['page.tsx', '.hidden', '_internal', 'public'],
        '/test/project/site/src/app/public': ['page.tsx'],
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((dir) => {
        const dirStr = dir.toString();
        return fileSystem[dirStr as keyof typeof fileSystem] || ([] as any);
      });

      mockFs.statSync.mockImplementation((filePath) => {
        const filePathStr = filePath.toString();
        return {
          isDirectory: () => !filePathStr.endsWith('.tsx'),
          mtime: new Date('2024-01-01'),
        } as any;
      });

      const { default: sitemap } = await import('@/app/sitemap');
      const result = await sitemap();

      const urls = result.map((r) => r.url);
      expect(urls).not.toContain('https://carinyaparc.com.au/.hidden');
      expect(urls).not.toContain('https://carinyaparc.com.au/_internal');
      expect(urls).toContain('https://carinyaparc.com.au/public');
    });
  });

  describe('getContentRoutes', () => {
    it('should scan content directory for MDX files', async () => {
      const fileSystem = {
        '/test/project/site/content': ['posts', 'recipes'],
        '/test/project/site/content/posts': ['post1.mdx', 'post2.mdx', 'draft.md'],
        '/test/project/site/content/recipes': ['recipe1.mdx', 'recipe2.mdx'],
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((dir) => {
        const dirStr = dir.toString();
        return fileSystem[dirStr as keyof typeof fileSystem] || ([] as any);
      });

      mockFs.statSync.mockImplementation(
        (filePath: string) =>
          ({
            isDirectory: () => !filePath.includes('.mdx') && !filePath.includes('.md'),
            mtime: new Date('2024-01-01'),
          }) as any,
      );

      const { default: sitemap } = await import('@/app/sitemap');
      const result = await sitemap();

      const blogUrls = result.filter((r) => r.url.includes('/blog/')).map((r) => r.url);
      const recipeUrls = result.filter((r) => r.url.includes('/recipes/')).map((r) => r.url);

      expect(blogUrls).toContain('https://carinyaparc.com.au/blog/post1');
      expect(blogUrls).toContain('https://carinyaparc.com.au/blog/post2');
      expect(recipeUrls).toContain('https://carinyaparc.com.au/recipes/recipe1');
      expect(recipeUrls).toContain('https://carinyaparc.com.au/recipes/recipe2');
    });

    it('should handle missing content directory gracefully', async () => {
      mockFs.existsSync.mockImplementation((path) => {
        const pathStr = path.toString();
        return pathStr.includes('/app');
      });
      mockFs.readdirSync.mockReturnValue([]);

      const { default: sitemap } = await import('@/app/sitemap');
      const result = await sitemap();

      expect(result).toBeInstanceOf(Array);
      // Should not throw error, just return other routes
    });
  });

  describe('combineRoutes', () => {
    it('should combine and deduplicate routes correctly', async () => {
      const fileSystem = {
        '/test/project/site/src/app': ['page.tsx', 'blog'],
        '/test/project/site/src/app/blog': ['page.tsx'],
        '/test/project/site/content': ['posts'],
        '/test/project/site/content/posts': ['post1.mdx'],
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((dir) => {
        const dirStr = dir.toString();
        return fileSystem[dirStr as keyof typeof fileSystem] || ([] as any);
      });

      mockFs.statSync.mockImplementation((filePath) => {
        const filePathStr = filePath.toString();
        return {
          isDirectory: () => !filePathStr.includes('.tsx') && !filePathStr.includes('.mdx'),
          mtime: new Date('2024-01-01'),
        } as any;
      });

      const { default: sitemap } = await import('@/app/sitemap');
      const result = await sitemap();

      // Check that we don't have duplicate routes
      const urls = result.map((r) => r.url);
      const uniqueUrls = [...new Set(urls)];
      expect(urls.length).toBe(uniqueUrls.length);
    });
  });

  describe('sitemap output format', () => {
    it('should return correct sitemap format', async () => {
      mockFs.existsSync.mockReturnValue(false);
      mockFs.readdirSync.mockReturnValue([]);

      const { default: sitemap } = await import('@/app/sitemap');
      const result = await sitemap();

      expect(Array.isArray(result)).toBe(true);
      result.forEach((route) => {
        expect(route).toHaveProperty('url');
        expect(route).toHaveProperty('lastModified');
        expect(route).toHaveProperty('priority');
        expect(route).toHaveProperty('changeFrequency');
        expect(typeof route.url).toBe('string');
        expect(route.url).toMatch(/^https:\/\//);
      });
    });

    it('should use BASE_URL for all routes', async () => {
      const fileSystem = {
        '/test/project/site/src/app': ['page.tsx', 'about'],
        '/test/project/site/src/app/about': ['page.tsx'],
      };

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation((dir) => {
        const dirStr = dir.toString();
        return fileSystem[dirStr as keyof typeof fileSystem] || ([] as any);
      });

      mockFs.statSync.mockImplementation((filePath) => {
        const filePathStr = filePath.toString();
        return {
          isDirectory: () => !filePathStr.endsWith('.tsx'),
          mtime: new Date('2024-01-01'),
        } as any;
      });

      const { default: sitemap } = await import('@/app/sitemap');
      const result = await sitemap();

      result.forEach((route) => {
        expect(route.url).toMatch(/^https:\/\/carinyaparc\.com\.au/);
      });
    });
  });

  describe('error handling', () => {
    it('should handle filesystem errors gracefully', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation(() => {
        throw new Error('Filesystem error');
      });

      const { default: sitemap } = await import('@/app/sitemap');

      // Should not throw an error
      await expect(sitemap()).resolves.toBeDefined();
    });

    it('should handle stat errors gracefully', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['page.tsx'] as any);
      mockFs.statSync.mockImplementation(() => {
        throw new Error('Stat error');
      });

      const { default: sitemap } = await import('@/app/sitemap');

      // Should not throw an error
      await expect(sitemap()).resolves.toBeDefined();
    });
  });
});
