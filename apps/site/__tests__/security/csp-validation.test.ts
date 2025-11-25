/**
 * Security validation tests for CSP
 * Implements: T4.3, SEC-001, SEC-004
 */

import { describe, it, expect } from 'vitest';
import { generateNonce, buildCSPHeader, formatNonceForCSP } from '@/src/lib/security/csp';
import { CSP_DIRECTIVES } from '@/src/lib/security/constants';

describe('CSP Security Validation - Nonce Requirements', () => {
  it('should inject nonce into script-src directive', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    const formattedNonce = formatNonceForCSP(nonceContext.nonce);
    expect(cspResult.headerValue).toContain(formattedNonce);
    expect(cspResult.headerValue).toMatch(/script-src[^;]*'nonce-[^']+'/);
  });

  it('should inject nonce into style-src directive', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    const formattedNonce = formatNonceForCSP(nonceContext.nonce);
    expect(cspResult.headerValue).toContain(formattedNonce);
    expect(cspResult.headerValue).toMatch(/style-src[^;]*'nonce-[^']+'/);
  });

  it('should place nonce at the beginning of directive sources', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'", 'https://example.com'],
        },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    const scriptSrcMatch = cspResult.headerValue.match(/script-src ([^;]+)/);
    expect(scriptSrcMatch).toBeTruthy();
    expect(scriptSrcMatch![1]).toMatch(/^'nonce-/);
  });
});

describe('CSP Security Validation - Directive Restrictions', () => {
  it('should restrict default-src to self', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    expect(cspResult.headerValue).toMatch(/default-src[^;]*'self'/);
  });

  it('should block object-src entirely', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    expect(cspResult.headerValue).toContain("object-src 'none'");
  });

  it('should restrict base-uri to self', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    expect(cspResult.headerValue).toContain("base-uri 'self'");
  });

  it('should restrict form-action to self', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    expect(cspResult.headerValue).toContain("form-action 'self'");
  });
});

describe('CSP Security Validation - Third-Party Allowlist', () => {
  it('should only allow specific third-party domains', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    // Should allow GTM
    expect(cspResult.headerValue).toContain('https://www.googletagmanager.com');

    // Should allow Google Fonts
    expect(cspResult.headerValue).toContain('https://fonts.googleapis.com');
    expect(cspResult.headerValue).toContain('https://fonts.gstatic.com');

    // Should allow Analytics
    expect(cspResult.headerValue).toContain('https://www.google-analytics.com');

    // Should allow Sentry
    expect(cspResult.headerValue).toContain('https://*.sentry.io');
  });

  it('should not contain unsafe-inline or unsafe-eval in balanced preset', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    // With nonce-based CSP, we should not need unsafe-inline or unsafe-eval
    // The original directives should not have these, and they should not be added
    const directives = CSP_DIRECTIVES.BALANCED!;
    expect(directives['script-src']).not.toContain("'unsafe-inline'");
    expect(directives['script-src']).not.toContain("'unsafe-eval'");
  });
});

describe('CSP Security Validation - Report Mode', () => {
  it('should use enforcement header in non-report-only mode', () => {
    const nonceContext = generateNonce();
    const cspResult = buildCSPHeader(
      {
        directives: { ...CSP_DIRECTIVES.BALANCED },
        reportOnly: false,
      },
      nonceContext.nonce,
    );

    expect(cspResult.headerName).toBe('Content-Security-Policy');
  });

  it('should use report-only header when configured', () => {
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

  it('should include report-uri when configured', () => {
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
