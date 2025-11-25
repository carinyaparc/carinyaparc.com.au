/**
 * Route-based cache control utilities
 * Implements: T1.6, SEC-003
 */

import { minimatch } from 'minimatch';
import type { CacheControlConfig } from './types';

/**
 * Check if a route matches any of the given patterns
 *
 * @param pathname - The route pathname to check
 * @param patterns - Array of glob patterns
 * @returns true if pathname matches any pattern
 */
export function matchesAnyPattern(pathname: string, patterns: string[]): boolean {
  return patterns.some((pattern) => minimatch(pathname, pattern, { nocase: true }));
}

/**
 * Check if a route is sensitive (requires no-store cache)
 * Implements: T1.6, SEC-003
 *
 * @param pathname - The route pathname to check
 * @param patterns - Sensitive route patterns
 * @returns true if route is sensitive
 */
export function isSensitiveRoute(pathname: string, patterns: string[]): boolean {
  return matchesAnyPattern(pathname, patterns);
}

/**
 * Check if a route is an auth route
 *
 * @param pathname - The route pathname to check
 * @param patterns - Auth route patterns
 * @returns true if route is auth-related
 */
export function isAuthRoute(pathname: string, patterns: string[]): boolean {
  return matchesAnyPattern(pathname, patterns);
}

/**
 * Check if a route is a public static asset
 *
 * @param pathname - The route pathname to check
 * @param patterns - Public route patterns
 * @returns true if route is public cacheable asset
 */
export function isPublicRoute(pathname: string, patterns: string[]): boolean {
  return matchesAnyPattern(pathname, patterns);
}

/**
 * Get cache directives for sensitive routes
 *
 * @returns Cache-Control header value for sensitive routes
 */
export function getSensitiveCacheDirectives(): string {
  return 'no-store, no-cache, must-revalidate, max-age=0, private';
}

/**
 * Get cache directives for auth routes
 *
 * @returns Cache-Control header value for auth routes
 */
export function getAuthCacheDirectives(): string {
  return 'no-cache, must-revalidate, max-age=0';
}

/**
 * Get cache directives for public static assets
 *
 * @returns Cache-Control header value for public assets
 */
export function getPublicCacheDirectives(): string {
  return 'public, max-age=31536000, immutable';
}

/**
 * Get default cache directives
 *
 * @returns Cache-Control header value for default routes
 */
export function getDefaultCacheDirectives(): string {
  return 'public, max-age=0, must-revalidate';
}

/**
 * Generate Cache-Control header value based on route
 * Implements: T1.6, SEC-003
 *
 * @param pathname - The route pathname
 * @param config - Cache control configuration
 * @returns Appropriate Cache-Control header value
 */
export function generateCacheControl(pathname: string, config: CacheControlConfig): string {
  // Check in priority order: sensitive -> auth -> public -> default
  if (isSensitiveRoute(pathname, config.sensitivePatterns)) {
    return getSensitiveCacheDirectives();
  }

  if (isAuthRoute(pathname, config.authPatterns)) {
    return getAuthCacheDirectives();
  }

  if (isPublicRoute(pathname, config.publicPatterns)) {
    return getPublicCacheDirectives();
  }

  return getDefaultCacheDirectives();
}

/**
 * Create default cache control configuration
 *
 * @returns Default CacheControlConfig
 */
export function createDefaultCacheConfig(): CacheControlConfig {
  return {
    sensitivePatterns: ['/api/subscribe', '/contact', '/api/auth/*'],
    authPatterns: ['/admin/*', '/api/auth/*'],
    publicPatterns: [
      '/blog/*',
      '/recipes/*',
      '/_next/static/*',
      '/_next/image/*',
      '/images/*',
      '/fonts/*',
    ],
  };
}
