/**
 * Integration tests for proxy security headers
 * Implements: T4.1, SEC-001, SEC-003, SEC-004
 */

import { describe, it, expect } from 'vitest';
import { generateNonce, buildCSPHeader } from '@/src/lib/security/csp';
import { generateCacheControl, createDefaultCacheConfig } from '@/src/lib/security/cache';
import { generateSecurityHeaders, createSecurityHeadersConfig } from '@/src/lib/security/headers';
import { CSP_DIRECTIVES } from '@/src/lib/security/constants';

describe('Proxy Integration - CSP with Nonce', () => {
  it('should generate nonce and build CSP header with nonce injected', () => {
    // Simulate middleware flow
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    expect(cspResult.nonce).toBe(nonceContext.nonce);
    expect(cspResult.headerValue).toContain(`'nonce-${nonceContext.nonce}'`);
    expect(cspResult.headerName).toBe('Content-Security-Policy');
  });

  it('should use report-only mode when configured', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: true,
      },
      nonceContext.nonce,
    );

    expect(cspResult.headerName).toBe('Content-Security-Policy-Report-Only');
  });

  it('should include report URI in CSP when configured', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
        reportUri: '/api/csp-report',
      },
      nonceContext.nonce,
    );

    expect(cspResult.headerValue).toContain('report-uri /api/csp-report');
  });
});

describe('Proxy Integration - Cache Control', () => {
  it('should apply correct cache control based on route', () => {
    const cacheConfig = createDefaultCacheConfig();

    // Test sensitive route
    const sensitiveCache = generateCacheControl('/api/subscribe', cacheConfig);
    expect(sensitiveCache).toContain('no-store');
    expect(sensitiveCache).toContain('private');

    // Test public route
    const publicCache = generateCacheControl('/_next/static/main.js', cacheConfig);
    expect(publicCache).toContain('public');
    expect(publicCache).toContain('immutable');

    // Test default route (unmatched)
    const defaultCache = generateCacheControl('/unmatched-route', cacheConfig);
    expect(defaultCache).toContain('public');
    expect(defaultCache).toContain('must-revalidate');
  });
});

describe('Proxy Integration - Security Headers', () => {
  it('should generate all security headers', () => {
    const config = createSecurityHeadersConfig();
    const headers = generateSecurityHeaders(config);

    expect(headers).toHaveProperty('Strict-Transport-Security');
    expect(headers).toHaveProperty('Referrer-Policy');
    expect(headers).toHaveProperty('X-Frame-Options');
    expect(headers).toHaveProperty('X-Content-Type-Options');
    expect(headers).toHaveProperty('X-XSS-Protection');
    expect(headers).toHaveProperty('Permissions-Policy');
  });

  it('should generate HSTS with preload enabled', () => {
    const config = createSecurityHeadersConfig();
    const headers = generateSecurityHeaders(config);

    const hsts = headers['Strict-Transport-Security'];
    expect(hsts).toContain('preload');
    expect(hsts).toContain('includeSubDomains');
  });
});

describe('Proxy Integration - Complete Flow', () => {
  it('should execute complete proxy flow without errors', () => {
    // Simulate complete proxy execution
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
        reportUri: '/api/csp-report',
      },
      nonceContext.nonce,
    );

    const cacheConfig = createDefaultCacheConfig();
    const cacheControl = generateCacheControl('/blog/post', cacheConfig);

    const securityConfig = createSecurityHeadersConfig();
    const securityHeaders = generateSecurityHeaders(securityConfig, { nonce: nonceContext.nonce });

    // Verify all components work together
    expect(cspResult.nonce).toBe(nonceContext.nonce);
    expect(cacheControl).toBeTruthy();
    expect(Object.keys(securityHeaders).length).toBeGreaterThan(0);
  });
});

describe('Proxy Integration - Error Handling', () => {
  it('should handle invalid CSP configuration gracefully', () => {
    const nonceContext = generateNonce();

    // Empty directives should still work (builder handles it)
    expect(() => {
      buildCSPHeader(
        {
          directives: {},
          reportOnly: false,
        },
        nonceContext.nonce,
      );
    }).not.toThrow();
  });

  it('should handle edge cases in cache control', () => {
    const cacheConfig = createDefaultCacheConfig();

    // Empty pathname
    expect(() => generateCacheControl('', cacheConfig)).not.toThrow();

    // Root pathname
    const rootCache = generateCacheControl('/', cacheConfig);
    expect(rootCache).toBeTruthy();
  });
});
