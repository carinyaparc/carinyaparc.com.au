/**
 * Security validation tests for security headers
 * Implements: T4.3, SEC-004
 */

import { describe, it, expect } from 'vitest';
import { generateSecurityHeaders, createSecurityHeadersConfig } from '@/src/lib/security/headers';
import { SECURITY_HEADER_PRESETS } from '@/src/lib/security/constants';
import { generateCacheControl, createDefaultCacheConfig } from '@/src/lib/security/cache';

describe('Security Headers Validation - Presence', () => {
  it('should include all required security headers', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;
    const headers = generateSecurityHeaders(config);

    const requiredHeaders = [
      'Strict-Transport-Security',
      'Referrer-Policy',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'X-XSS-Protection',
      'Permissions-Policy',
    ];

    requiredHeaders.forEach((header) => {
      expect(headers).toHaveProperty(header);
      expect(headers[header]).toBeTruthy();
    });
  });
});

describe('Security Headers Validation - HSTS', () => {
  it('should have HSTS maxAge of at least 1 year', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;
    const headers = generateSecurityHeaders(config);

    const hsts = headers['Strict-Transport-Security'];
    expect(hsts).toBeTruthy();
    expect(typeof hsts).toBe('string');

    const maxAgeMatch = hsts?.match(/max-age=(\d+)/);
    expect(maxAgeMatch).toBeTruthy();

    if (maxAgeMatch && maxAgeMatch[1]) {
      const maxAge = parseInt(maxAgeMatch[1], 10);
      expect(maxAge).toBeGreaterThanOrEqual(31536000); // 1 year in seconds
    }
  });

  it('should have HSTS with includeSubDomains', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;
    const headers = generateSecurityHeaders(config);

    const hsts = headers['Strict-Transport-Security'];
    expect(hsts).toContain('includeSubDomains');
  });

  it('should have HSTS with preload', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;
    const headers = generateSecurityHeaders(config);

    const hsts = headers['Strict-Transport-Security'];
    expect(hsts).toContain('preload');
  });
});

describe('Security Headers Validation - Content Type', () => {
  it('should set X-Content-Type-Options to nosniff', () => {
    const config = createSecurityHeadersConfig();
    const headers = generateSecurityHeaders(config);

    expect(headers['X-Content-Type-Options']).toBe('nosniff');
  });
});

describe('Security Headers Validation - Frame Options', () => {
  it('should set X-Frame-Options to DENY', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;
    const headers = generateSecurityHeaders(config);

    expect(headers['X-Frame-Options']).toBe('DENY');
  });
});

describe('Security Headers Validation - Referrer Policy', () => {
  it('should use strict-origin-when-cross-origin', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;
    const headers = generateSecurityHeaders(config);

    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
  });
});

describe('Security Headers Validation - Permissions Policy', () => {
  it('should disable camera, microphone, and geolocation', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;
    const headers = generateSecurityHeaders(config);

    const policy = headers['Permissions-Policy'];
    expect(policy).toContain('camera=()');
    expect(policy).toContain('microphone=()');
    expect(policy).toContain('geolocation=()');
  });
});

describe('Cache-Control Validation - Route Sensitivity', () => {
  it('should apply no-store to sensitive routes', () => {
    const config = createDefaultCacheConfig();
    const cacheControl = generateCacheControl('/api/subscribe', config);

    expect(cacheControl).toContain('no-store');
    expect(cacheControl).toContain('no-cache');
    expect(cacheControl).toContain('must-revalidate');
    expect(cacheControl).toContain('private');
  });

  it('should apply immutable to public static assets', () => {
    const config = createDefaultCacheConfig();
    const cacheControl = generateCacheControl('/_next/static/main.js', config);

    expect(cacheControl).toContain('public');
    expect(cacheControl).toContain('immutable');
    expect(cacheControl).toMatch(/max-age=\d+/);
  });

  it('should apply must-revalidate to default routes', () => {
    const config = createDefaultCacheConfig();
    const cacheControl = generateCacheControl('/about', config);

    expect(cacheControl).toContain('must-revalidate');
  });
});

describe('Security Headers Validation - XSS Protection', () => {
  it('should enable XSS protection with block mode', () => {
    const config = createSecurityHeadersConfig();
    const headers = generateSecurityHeaders(config);

    expect(headers['X-XSS-Protection']).toBe('1; mode=block');
  });
});
