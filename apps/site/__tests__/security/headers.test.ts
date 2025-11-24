// tests/security/headers.test.ts
import { test, expect } from '@playwright/test';

test.describe('Security Headers', () => {
  test('should have proper security headers', async ({ page }) => {
    const response = await page.goto('/');

    // Check CSP
    expect(response?.headers()['content-security-policy']).toBeTruthy();

    // Check HSTS
    expect(response?.headers()['strict-transport-security']).toBe(
      'max-age=63072000; includeSubDomains; preload',
    );

    // Check other security headers
    expect(response?.headers()['x-content-type-options']).toBe('nosniff');
    expect(response?.headers()['x-frame-options']).toBe('DENY');
    expect(response?.headers()['x-xss-protection']).toBe('1; mode=block');
  });
});
