import { describe, it, expect } from 'vitest';
import { generateOrganizationSchema } from '@/lib/schema/organization';

describe('Organization Schema', () => {
  const baseOrg = {
    name: 'Test Organization',
    url: 'https://example.com',
    logoUrl: 'https://example.com/logo.png',
  };

  it('should generate valid Organization schema with required fields', () => {
    const schema = generateOrganizationSchema(baseOrg);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('Test Organization');
    expect(schema.url).toBe('https://example.com');
    expect(schema.logo).toEqual({
      '@type': 'ImageObject',
      url: 'https://example.com/logo.png',
      width: 600,
      height: 600,
    });
  });

  it('should handle optional sameAs field', () => {
    const org = {
      ...baseOrg,
      sameAs: ['https://facebook.com/test', 'https://twitter.com/test'],
    };

    const schema = generateOrganizationSchema(org);

    expect(schema.sameAs).toEqual(['https://facebook.com/test', 'https://twitter.com/test']);
  });

  it('should not include sameAs when not provided', () => {
    const schema = generateOrganizationSchema(baseOrg);

    expect(schema.sameAs).toBeUndefined();
  });

  it('should include logo dimensions', () => {
    const schema = generateOrganizationSchema(baseOrg);

    expect(schema.logo).toMatchObject({
      width: 600,
      height: 600,
    });
  });

  it('should handle empty sameAs array', () => {
    const org = {
      ...baseOrg,
      sameAs: [],
    };

    const schema = generateOrganizationSchema(org);

    expect(schema.sameAs).toBeUndefined();
  });
});
