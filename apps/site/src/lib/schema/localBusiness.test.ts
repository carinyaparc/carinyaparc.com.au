import { describe, it, expect } from 'vitest';
import { generateLocalBusinessSchema } from '@/lib/schema/localBusiness';
import { BASE_URL } from '@/lib/constants';

describe('LocalBusiness Schema', () => {
  const baseBusiness = {
    name: 'Test Business',
    description: 'A test local business',
    address: {
      streetAddress: '123 Test St',
      addressLocality: 'Test City',
      addressRegion: 'TC',
      postalCode: '12345',
      addressCountry: 'US',
    },
  };

  it('should generate valid LocalBusiness schema with required fields', () => {
    const schema = generateLocalBusinessSchema(baseBusiness);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('LocalBusiness');
    expect(schema.name).toBe('Test Business');
    expect(schema.description).toBe('A test local business');
    expect(schema.url).toBe(BASE_URL);
  });

  it('should generate valid PostalAddress', () => {
    const schema = generateLocalBusinessSchema(baseBusiness);

    expect(schema.address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: '123 Test St',
      addressLocality: 'Test City',
      addressRegion: 'TC',
      postalCode: '12345',
      addressCountry: 'US',
    });
  });

  it('should handle geo coordinates', () => {
    const business = {
      ...baseBusiness,
      geo: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    };

    const schema = generateLocalBusinessSchema(business);

    expect(schema.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: 40.7128,
      longitude: -74.006,
    });
  });

  it('should handle opening hours array', () => {
    const business = {
      ...baseBusiness,
      openingHours: ['Mo-Fr 09:00-17:00', 'Sa 10:00-14:00'],
    };

    const schema = generateLocalBusinessSchema(business);

    expect(schema.openingHours).toEqual(['Mo-Fr 09:00-17:00', 'Sa 10:00-14:00']);
  });

  it('should omit optional fields when not provided', () => {
    const schema = generateLocalBusinessSchema(baseBusiness);

    expect(schema.geo).toBeUndefined();
    expect(schema.openingHours).toBeUndefined();
    expect(schema.priceRange).toBeUndefined();
  });

  it('should handle price range', () => {
    const business = {
      ...baseBusiness,
      priceRange: '$$',
    };

    const schema = generateLocalBusinessSchema(business);

    expect(schema.priceRange).toBe('$$');
  });

  it('should handle empty opening hours array', () => {
    const business = {
      ...baseBusiness,
      openingHours: [],
    };

    const schema = generateLocalBusinessSchema(business);

    expect(schema.openingHours).toBeUndefined();
  });
});
