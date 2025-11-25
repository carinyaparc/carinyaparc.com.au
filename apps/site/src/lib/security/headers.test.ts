/**
 * Unit tests for security headers module
 * Implements: T1.9, SEC-004
 */

import { describe, it, expect } from 'vitest';
import {
  generateSecurityHeaders,
  createSecurityHeadersConfig,
  validateSecurityHeadersConfig,
} from './headers';
import { SECURITY_HEADER_PRESETS } from './constants';
import type { SecurityHeadersConfig } from './types';

describe('generateSecurityHeaders', () => {
  it('should return all expected security headers', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;
    const headers = generateSecurityHeaders(config);

    expect(headers).toHaveProperty('Strict-Transport-Security');
    expect(headers).toHaveProperty('Referrer-Policy');
    expect(headers).toHaveProperty('X-Frame-Options');
    expect(headers).toHaveProperty('X-Content-Type-Options');
    expect(headers).toHaveProperty('X-XSS-Protection');
    expect(headers).toHaveProperty('Permissions-Policy');
  });

  it('should generate HSTS header with correct format', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;
    const headers = generateSecurityHeaders(config);

    const hsts = headers['Strict-Transport-Security'];
    expect(hsts).toContain('max-age=63072000');
    expect(hsts).toContain('includeSubDomains');
    expect(hsts).toContain('preload');
  });

  it('should set Referrer-Policy correctly', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;
    const headers = generateSecurityHeaders(config);

    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
  });

  it('should set X-Frame-Options correctly', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;
    const headers = generateSecurityHeaders(config);

    expect(headers['X-Frame-Options']).toBe('DENY');
  });

  it('should set X-Content-Type-Options to nosniff', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;
    const headers = generateSecurityHeaders(config);

    expect(headers['X-Content-Type-Options']).toBe('nosniff');
  });

  it('should set X-XSS-Protection correctly', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;
    const headers = generateSecurityHeaders(config);

    expect(headers['X-XSS-Protection']).toBe('1; mode=block');
  });

  it('should generate Permissions-Policy with correct format', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;
    const headers = generateSecurityHeaders(config);

    const policy = headers['Permissions-Policy'];
    expect(policy).toContain('camera=()');
    expect(policy).toContain('microphone=()');
    expect(policy).toContain('geolocation=()');
  });

  it('should handle HSTS without includeSubDomains', () => {
    const config: SecurityHeadersConfig = {
      hsts: {
        maxAge: 31536000,
        includeSubDomains: false,
        preload: false,
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      frameOptions: 'DENY',
      permissionsPolicy: {},
    };

    const headers = generateSecurityHeaders(config);
    const hsts = headers['Strict-Transport-Security'];

    expect(hsts).toBe('max-age=31536000');
    expect(hsts).not.toContain('includeSubDomains');
    expect(hsts).not.toContain('preload');
  });

  it('should handle Permissions-Policy with allowed origins', () => {
    const config: SecurityHeadersConfig = {
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      frameOptions: 'DENY',
      permissionsPolicy: {
        geolocation: ['self', 'https://example.com'],
      },
    };

    const headers = generateSecurityHeaders(config);
    const policy = headers['Permissions-Policy'];

    expect(policy).toBe('geolocation=(self https://example.com)');
  });

  it('should handle SAMEORIGIN for X-Frame-Options', () => {
    const config: SecurityHeadersConfig = {
      ...SECURITY_HEADER_PRESETS.PRODUCTION!,
      frameOptions: 'SAMEORIGIN',
    };

    const headers = generateSecurityHeaders(config);

    expect(headers['X-Frame-Options']).toBe('SAMEORIGIN');
  });
});

describe('SECURITY_HEADER_PRESETS.PRODUCTION', () => {
  it('should have valid HSTS maxAge (at least 1 year)', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;

    expect(config.hsts.maxAge).toBeGreaterThanOrEqual(31536000);
  });

  it('should have HSTS includeSubDomains enabled', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;

    expect(config.hsts.includeSubDomains).toBe(true);
  });

  it('should have HSTS preload enabled', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;

    expect(config.hsts.preload).toBe(true);
  });

  it('should use strict-origin-when-cross-origin referrer policy', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;

    expect(config.referrerPolicy).toBe('strict-origin-when-cross-origin');
  });

  it('should use DENY for frame options', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;

    expect(config.frameOptions).toBe('DENY');
  });

  it('should disable camera, microphone, and geolocation', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;

    expect(config.permissionsPolicy.camera).toEqual([]);
    expect(config.permissionsPolicy.microphone).toEqual([]);
    expect(config.permissionsPolicy.geolocation).toEqual([]);
  });
});

describe('createSecurityHeadersConfig', () => {
  it('should return valid default configuration', () => {
    const config = createSecurityHeadersConfig();

    expect(config).toHaveProperty('hsts');
    expect(config).toHaveProperty('referrerPolicy');
    expect(config).toHaveProperty('frameOptions');
    expect(config).toHaveProperty('permissionsPolicy');
  });

  it('should have HSTS maxAge of at least 1 year', () => {
    const config = createSecurityHeadersConfig();

    expect(config.hsts.maxAge).toBeGreaterThanOrEqual(31536000);
  });
});

describe('validateSecurityHeadersConfig', () => {
  it('should return true for valid config', () => {
    const config = SECURITY_HEADER_PRESETS.PRODUCTION!;

    expect(validateSecurityHeadersConfig(config)).toBe(true);
  });

  it('should return false for HSTS maxAge less than 1 year', () => {
    const config: SecurityHeadersConfig = {
      hsts: {
        maxAge: 86400, // 1 day
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      frameOptions: 'DENY',
      permissionsPolicy: {},
    };

    expect(validateSecurityHeadersConfig(config)).toBe(false);
  });

  it('should return false when referrerPolicy is missing', () => {
    const config = {
      hsts: {
        maxAge: 63072000,
        includeSubDomains: true,
        preload: true,
      },
      frameOptions: 'DENY',
      permissionsPolicy: {},
    } as SecurityHeadersConfig;

    expect(validateSecurityHeadersConfig(config)).toBe(false);
  });

  it('should return false when frameOptions is missing', () => {
    const config = {
      hsts: {
        maxAge: 63072000,
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: {},
    } as SecurityHeadersConfig;

    expect(validateSecurityHeadersConfig(config)).toBe(false);
  });
});
