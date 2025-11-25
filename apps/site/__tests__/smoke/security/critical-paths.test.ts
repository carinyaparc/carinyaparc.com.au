/**
 * Smoke tests for security headers on critical paths
 * Implements: T4.2, SEC-006
 */

import { describe, it, expect } from 'vitest';
import { generateNonce, buildCSPHeader } from '@/src/lib/security/csp';
import { CSP_DIRECTIVES } from '@/src/lib/security/constants';

describe('Critical Paths - Security Headers Presence', () => {
  it('should generate security headers for homepage', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    expect(cspResult.headerName).toBe('Content-Security-Policy');
    expect(cspResult.headerValue).toBeTruthy();
    expect(cspResult.nonce).toBe(nonceContext.nonce);
  });

  it('should generate security headers for blog posts', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    expect(cspResult.headerValue).toContain("default-src 'self'");
    expect(cspResult.headerValue).toContain('script-src');
  });

  it('should generate security headers for newsletter subscription', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    // Form action should be restricted
    expect(cspResult.headerValue).toContain("form-action 'self'");
  });
});

describe('Critical Paths - CSP Compatibility', () => {
  it('should allow Google Tag Manager in CSP', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    expect(cspResult.headerValue).toContain('https://www.googletagmanager.com');
  });

  it('should allow Google Fonts in CSP', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    expect(cspResult.headerValue).toContain('https://fonts.googleapis.com');
    expect(cspResult.headerValue).toContain('https://fonts.gstatic.com');
  });

  it('should allow Google Analytics connections in CSP', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    expect(cspResult.headerValue).toContain('https://www.google-analytics.com');
    expect(cspResult.headerValue).toContain('https://*.google-analytics.com');
  });

  it('should allow Sentry connections in CSP', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    expect(cspResult.headerValue).toContain('https://*.sentry.io');
  });
});

describe('Critical Paths - Nonce Generation', () => {
  it('should generate unique nonces for each request', () => {
    const nonce1 = generateNonce();
    const nonce2 = generateNonce();
    const nonce3 = generateNonce();

    expect(nonce1.nonce).not.toBe(nonce2.nonce);
    expect(nonce2.nonce).not.toBe(nonce3.nonce);
    expect(nonce1.nonce).not.toBe(nonce3.nonce);
  });

  it('should generate valid UUID v4 nonces', () => {
    const nonceContext = generateNonce();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    expect(nonceContext.nonce).toMatch(uuidRegex);
  });
});
