/**
 * Unit tests for CSP module
 * Implements: T1.5, SEC-001
 */

import { describe, it, expect } from 'vitest';
import { generateNonce, formatNonceForCSP, buildCSPHeader, validateCSPConfig } from './csp';
import { CSP_DIRECTIVES } from './constants';
import type { CSPConfig } from './types';

describe('generateNonce', () => {
  it('should return a valid NonceContext with base64-encoded nonce', () => {
    const result = generateNonce();

    expect(result).toHaveProperty('nonce');
    expect(result).toHaveProperty('timestamp');
    expect(typeof result.nonce).toBe('string');
    expect(typeof result.timestamp).toBe('number');

    // Base64 format check (Next.js v16 uses base64-encoded nonces)
    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    expect(result.nonce).toMatch(base64Regex);
    expect(result.nonce.length).toBeGreaterThan(0);
  });

  it('should generate nonce from UUID encoded as base64', () => {
    const result = generateNonce();

    // Decode base64 to verify it's a UUID
    const decoded = Buffer.from(result.nonce, 'base64').toString();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(decoded).toMatch(uuidRegex);
  });

  it('should include requestId when provided', () => {
    const requestId = 'test-request-123';
    const result = generateNonce(requestId);

    expect(result.requestId).toBe(requestId);
  });

  it('should generate unique nonces across multiple calls', () => {
    const nonces = new Set<string>();
    const iterations = 10000;

    for (let i = 0; i < iterations; i++) {
      const result = generateNonce();
      nonces.add(result.nonce);
    }

    // All nonces should be unique
    expect(nonces.size).toBe(iterations);
  });

  it('should generate timestamp close to current time', () => {
    const before = Date.now();
    const result = generateNonce();
    const after = Date.now();

    expect(result.timestamp).toBeGreaterThanOrEqual(before);
    expect(result.timestamp).toBeLessThanOrEqual(after);
  });
});

describe('formatNonceForCSP', () => {
  it('should format nonce with single quotes and nonce- prefix', () => {
    const nonce = 'abc123';
    const formatted = formatNonceForCSP(nonce);

    expect(formatted).toBe("'nonce-abc123'");
  });
});

describe('buildCSPHeader', () => {
  it('should inject nonce into script-src and style-src directives', () => {
    const config: CSPConfig = {
      directives: { ...CSP_DIRECTIVES.BALANCED },
      reportOnly: false,
    };
    const nonce = 'test-nonce-123';

    const result = buildCSPHeader(config, nonce);

    expect(result.headerValue).toContain("'nonce-test-nonce-123'");
    expect(result.headerValue).toContain('script-src');
    expect(result.headerValue).toContain('style-src');
    expect(result.nonce).toBe(nonce);
  });

  it('should use Content-Security-Policy header name when reportOnly is false', () => {
    const config: CSPConfig = {
      directives: { ...CSP_DIRECTIVES.BALANCED },
      reportOnly: false,
    };

    const result = buildCSPHeader(config, 'test-nonce');

    expect(result.headerName).toBe('Content-Security-Policy');
  });

  it('should use Content-Security-Policy-Report-Only header name when reportOnly is true', () => {
    const config: CSPConfig = {
      directives: { ...CSP_DIRECTIVES.BALANCED },
      reportOnly: true,
    };

    const result = buildCSPHeader(config, 'test-nonce');

    expect(result.headerName).toBe('Content-Security-Policy-Report-Only');
  });

  it('should include report-uri when configured', () => {
    const config: CSPConfig = {
      directives: { ...CSP_DIRECTIVES.BALANCED },
      reportUri: '/api/csp-report',
      reportOnly: false,
    };

    const result = buildCSPHeader(config, 'test-nonce');

    expect(result.headerValue).toContain('report-uri /api/csp-report');
  });

  it('should build valid CSP header format', () => {
    const config: CSPConfig = {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", 'https://example.com'],
      },
      reportOnly: false,
    };

    const result = buildCSPHeader(config, 'test-nonce');

    // Should follow "directive sources; directive sources" format
    expect(result.headerValue).toMatch(/^[\w-]+ .+; [\w-]+ .+$/);
    expect(result.headerValue).toContain("default-src 'self'");
    expect(result.headerValue).toContain('script-src');
  });

  it('should place nonce at the beginning of directive sources', () => {
    const config: CSPConfig = {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", 'https://example.com'],
      },
      reportOnly: false,
    };

    const result = buildCSPHeader(config, 'abc123');

    // Nonce should be first in script-src
    const scriptSrcMatch = result.headerValue.match(/script-src ([^;]+)/);
    expect(scriptSrcMatch).toBeTruthy();
    expect(scriptSrcMatch![1]).toMatch(/^'nonce-abc123'/);
  });
});

describe('validateCSPConfig', () => {
  it('should return true for valid config', () => {
    const config: CSPConfig = {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
      },
    };

    expect(validateCSPConfig(config)).toBe(true);
  });

  it('should return false when directives is missing', () => {
    const config = {} as CSPConfig;

    expect(validateCSPConfig(config)).toBe(false);
  });

  it('should return false when default-src is missing', () => {
    const config: CSPConfig = {
      directives: {
        'script-src': ["'self'"],
      },
    };

    expect(validateCSPConfig(config)).toBe(false);
  });

  it('should return false when directives is not an object', () => {
    const config = {
      directives: 'invalid',
    } as unknown as CSPConfig;

    expect(validateCSPConfig(config)).toBe(false);
  });
});

describe('CSP_DIRECTIVES.BALANCED', () => {
  it('should contain expected directives', () => {
    const directives = CSP_DIRECTIVES.BALANCED!;

    expect(directives).toHaveProperty('default-src');
    expect(directives).toHaveProperty('script-src');
    expect(directives).toHaveProperty('style-src');
    expect(directives).toHaveProperty('img-src');
    expect(directives).toHaveProperty('font-src');
    expect(directives).toHaveProperty('connect-src');
    expect(directives).toHaveProperty('frame-src');
    expect(directives).toHaveProperty('object-src');
    expect(directives).toHaveProperty('base-uri');
    expect(directives).toHaveProperty('form-action');
  });

  it('should allow Google Tag Manager in script-src', () => {
    const directives = CSP_DIRECTIVES.BALANCED!;

    expect(directives['script-src']).toContain('https://www.googletagmanager.com');
  });

  it('should allow Google Fonts in style-src and font-src', () => {
    const directives = CSP_DIRECTIVES.BALANCED!;

    expect(directives['style-src']).toContain('https://fonts.googleapis.com');
    expect(directives['font-src']).toContain('https://fonts.gstatic.com');
  });

  it('should allow Google Analytics in connect-src', () => {
    const directives = CSP_DIRECTIVES.BALANCED!;

    expect(directives['connect-src']).toContain('https://www.google-analytics.com');
    expect(directives['connect-src']).toContain('https://*.google-analytics.com');
  });
});
