import { describe, it, expect } from 'vitest';
import {
  SITE_TITLE,
  SITE_DESCRIPTION,
  BASE_URL,
  APP_DIR,
  CONSENT_COOKIE_NAME,
  SESSION_COOKIE_NAME,
} from '../../../apps/site/src/lib/constants';

describe('Constants', () => {
  it('should export SITE_TITLE', () => {
    expect(SITE_TITLE).toBe('Carinya Parc');
  });

  it('should export SITE_DESCRIPTION', () => {
    expect(SITE_DESCRIPTION).toBe('Carinya Parc - Regenerative farming and sustainable living');
  });

  it('should export BASE_URL', () => {
    // Just test that BASE_URL is defined
    expect(BASE_URL).toBeDefined();
    expect(typeof BASE_URL).toBe('string');
    expect(BASE_URL).toMatch(/^https?:\/\//);
  });

  it('should export APP_DIR', () => {
    expect(APP_DIR).toContain('/src/app');
  });

  it('should export cookie names', () => {
    expect(CONSENT_COOKIE_NAME).toBe('carinya_parc_consent');
    expect(SESSION_COOKIE_NAME).toBe('carinya_parc_session');
  });
});
