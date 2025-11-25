/**
 * Security header constants and presets
 * Implements: T1.2, SEC-004, SEC-006
 */

import type { SecurityHeadersConfig, CacheControlConfig } from './types';

/**
 * Balanced CSP directives preset
 * Allows GTM, Google Analytics, Google Fonts while maintaining strong security
 */
export const CSP_DIRECTIVES: Record<string, Record<string, string[]>> = {
  BALANCED: {
    'default-src': ["'self'"],
    'script-src': ["'self'", 'https://www.googletagmanager.com'],
    'style-src': ["'self'", 'https://fonts.googleapis.com'],
    'img-src': ["'self'", 'data:', 'https://www.google-analytics.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': [
      "'self'",
      'https://www.google-analytics.com',
      'https://*.google-analytics.com',
      'https://*.sentry.io',
    ],
    'frame-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  },
};

/**
 * Production security headers preset
 * Configured for SecurityHeaders.com A+ rating
 */
export const SECURITY_HEADER_PRESETS: Record<string, SecurityHeadersConfig> = {
  PRODUCTION: {
    hsts: {
      maxAge: 63072000, // 2 years
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    frameOptions: 'DENY',
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: [],
    },
  },
};

/**
 * Default cache control patterns
 */
export const DEFAULT_CACHE_PATTERNS: CacheControlConfig = {
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
