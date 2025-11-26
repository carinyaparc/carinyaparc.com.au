/**
 * Security headers generation utilities
 * Implements: T1.8, SEC-004, SEC-007
 */

import type { SecurityHeadersConfig, SecurityHeadersOptions } from './types';

/**
 * Generate HSTS header value
 *
 * @param config - HSTS configuration
 * @returns Strict-Transport-Security header value
 */
function buildHSTSHeader(config: SecurityHeadersConfig['hsts']): string {
  const parts = [`max-age=${config.maxAge}`];

  if (config.includeSubDomains) {
    parts.push('includeSubDomains');
  }

  if (config.preload) {
    parts.push('preload');
  }

  return parts.join('; ');
}

/**
 * Generate Permissions-Policy header value
 *
 * @param policy - Permissions policy configuration
 * @returns Permissions-Policy header value
 */
function buildPermissionsPolicyHeader(policy: Record<string, string[]>): string {
  return Object.entries(policy)
    .map(([feature, origins]) => {
      if (origins.length === 0) {
        return `${feature}=()`;
      }
      return `${feature}=(${origins.join(' ')})`;
    })
    .join(', ');
}

/**
 * Generate all security headers
 * Implements: T1.8, SEC-004, SEC-007
 *
 * @param config - Security headers configuration
 * @param options - Additional options (nonce, environment)
 * @returns Record of header names to values
 */
export function generateSecurityHeaders(
  config: SecurityHeadersConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Reserved for future nonce support
  _options: SecurityHeadersOptions = {},
): Record<string, string> {
  const headers: Record<string, string> = {
    'Strict-Transport-Security': buildHSTSHeader(config.hsts),
    'Referrer-Policy': config.referrerPolicy,
    'X-Frame-Options': config.frameOptions,
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy': buildPermissionsPolicyHeader(config.permissionsPolicy),
  };

  return headers;
}

/**
 * Create default security headers configuration
 *
 * @returns Default SecurityHeadersConfig for production
 */
export function createSecurityHeadersConfig(): SecurityHeadersConfig {
  return {
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
  };
}

/**
 * Validate security headers configuration
 *
 * @param config - Configuration to validate
 * @returns true if valid, false otherwise
 */
export function validateSecurityHeadersConfig(config: SecurityHeadersConfig): boolean {
  // HSTS maxAge must be at least 1 year (31536000 seconds)
  if (config.hsts.maxAge < 31536000) {
    return false;
  }

  // Ensure required fields are present
  if (!config.referrerPolicy || !config.frameOptions) {
    return false;
  }

  return true;
}
