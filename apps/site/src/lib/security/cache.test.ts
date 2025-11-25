/**
 * Unit tests for cache control module
 * Implements: T1.7, SEC-003
 */

import { describe, it, expect } from 'vitest';
import {
  matchesAnyPattern,
  isSensitiveRoute,
  isAuthRoute,
  isPublicRoute,
  generateCacheControl,
  getSensitiveCacheDirectives,
  getPublicCacheDirectives,
  createDefaultCacheConfig,
} from './cache';
import type { CacheControlConfig } from './types';

describe('matchesAnyPattern', () => {
  it('should match exact paths', () => {
    const patterns = ['/api/subscribe', '/contact'];

    expect(matchesAnyPattern('/api/subscribe', patterns)).toBe(true);
    expect(matchesAnyPattern('/contact', patterns)).toBe(true);
    expect(matchesAnyPattern('/other', patterns)).toBe(false);
  });

  it('should match glob patterns with wildcards', () => {
    const patterns = ['/api/*', '/api/**', '/admin/*'];

    expect(matchesAnyPattern('/api/users', patterns)).toBe(true);
    expect(matchesAnyPattern('/api/auth/login', patterns)).toBe(true);
    expect(matchesAnyPattern('/admin/dashboard', patterns)).toBe(true);
    expect(matchesAnyPattern('/public/page', patterns)).toBe(false);
  });

  it('should be case-insensitive', () => {
    const patterns = ['/API/*', '/Admin/*'];

    expect(matchesAnyPattern('/api/users', patterns)).toBe(true);
    expect(matchesAnyPattern('/ADMIN/dashboard', patterns)).toBe(true);
    expect(matchesAnyPattern('/AdMiN/settings', patterns)).toBe(true);
  });

  it('should match nested paths with double wildcard', () => {
    const patterns = ['/_next/**'];

    expect(matchesAnyPattern('/_next/static/chunks/main.js', patterns)).toBe(true);
    expect(matchesAnyPattern('/_next/image/test.jpg', patterns)).toBe(true);
  });

  it('should return false for empty patterns array', () => {
    expect(matchesAnyPattern('/any/path', [])).toBe(false);
  });
});

describe('isSensitiveRoute', () => {
  it('should identify sensitive routes correctly', () => {
    const patterns = ['/api/subscribe', '/contact', '/api/payment/*'];

    expect(isSensitiveRoute('/api/subscribe', patterns)).toBe(true);
    expect(isSensitiveRoute('/contact', patterns)).toBe(true);
    expect(isSensitiveRoute('/api/payment/process', patterns)).toBe(true);
    expect(isSensitiveRoute('/blog/post', patterns)).toBe(false);
  });
});

describe('isAuthRoute', () => {
  it('should identify auth routes correctly', () => {
    const patterns = ['/admin/*', '/api/auth/*'];

    expect(isAuthRoute('/admin/dashboard', patterns)).toBe(true);
    expect(isAuthRoute('/api/auth/login', patterns)).toBe(true);
    expect(isAuthRoute('/public/page', patterns)).toBe(false);
  });
});

describe('isPublicRoute', () => {
  it('should identify public routes correctly', () => {
    const patterns = ['/blog/*', '/_next/static/*', '/images/*'];

    expect(isPublicRoute('/blog/post-1', patterns)).toBe(true);
    expect(isPublicRoute('/_next/static/main.js', patterns)).toBe(true);
    expect(isPublicRoute('/images/photo.jpg', patterns)).toBe(true);
    expect(isPublicRoute('/api/subscribe', patterns)).toBe(false);
  });
});

describe('getSensitiveCacheDirectives', () => {
  it('should return no-store directives for sensitive routes', () => {
    const directives = getSensitiveCacheDirectives();

    expect(directives).toBe('no-store, no-cache, must-revalidate, max-age=0, private');
  });
});

describe('getPublicCacheDirectives', () => {
  it('should return immutable directives for public assets', () => {
    const directives = getPublicCacheDirectives();

    expect(directives).toBe('public, max-age=31536000, immutable');
  });
});

describe('generateCacheControl', () => {
  const config: CacheControlConfig = {
    sensitivePatterns: ['/api/subscribe', '/contact'],
    authPatterns: ['/admin/*', '/api/auth/*'],
    publicPatterns: ['/blog/*', '/_next/static/*'],
  };

  it('should return no-store for sensitive routes', () => {
    const result = generateCacheControl('/api/subscribe', config);

    expect(result).toBe('no-store, no-cache, must-revalidate, max-age=0, private');
  });

  it('should return no-cache for auth routes', () => {
    const result = generateCacheControl('/admin/dashboard', config);

    expect(result).toBe('no-cache, must-revalidate, max-age=0');
  });

  it('should return immutable for public static assets', () => {
    const result = generateCacheControl('/_next/static/main.js', config);

    expect(result).toBe('public, max-age=31536000, immutable');
  });

  it('should return default revalidate for unmatched routes', () => {
    const result = generateCacheControl('/some/other/page', config);

    expect(result).toBe('public, max-age=0, must-revalidate');
  });

  it('should prioritize sensitive over auth routes', () => {
    const overlappingConfig: CacheControlConfig = {
      sensitivePatterns: ['/api/auth/password-reset'],
      authPatterns: ['/api/auth/*'],
      publicPatterns: [],
    };

    const result = generateCacheControl('/api/auth/password-reset', overlappingConfig);

    // Should match sensitive pattern first
    expect(result).toBe('no-store, no-cache, must-revalidate, max-age=0, private');
  });

  it('should prioritize auth over public routes', () => {
    const overlappingConfig: CacheControlConfig = {
      sensitivePatterns: [],
      authPatterns: ['/blog/admin/*'],
      publicPatterns: ['/blog/*'],
    };

    const result = generateCacheControl('/blog/admin/edit', overlappingConfig);

    // Should match auth pattern first
    expect(result).toBe('no-cache, must-revalidate, max-age=0');
  });
});

describe('createDefaultCacheConfig', () => {
  it('should return valid default configuration', () => {
    const config = createDefaultCacheConfig();

    expect(config).toHaveProperty('sensitivePatterns');
    expect(config).toHaveProperty('authPatterns');
    expect(config).toHaveProperty('publicPatterns');
    expect(Array.isArray(config.sensitivePatterns)).toBe(true);
    expect(Array.isArray(config.authPatterns)).toBe(true);
    expect(Array.isArray(config.publicPatterns)).toBe(true);
  });

  it('should include common sensitive patterns', () => {
    const config = createDefaultCacheConfig();

    expect(config.sensitivePatterns).toContain('/api/subscribe');
    expect(config.sensitivePatterns).toContain('/contact');
  });

  it('should include common public patterns', () => {
    const config = createDefaultCacheConfig();

    expect(config.publicPatterns).toContain('/blog/*');
    expect(config.publicPatterns).toContain('/_next/static/*');
  });
});
