import { describe, it, expect, vi } from 'vitest';

// Mock the generatePageMetadata function with the actual path
vi.mock('@/src/lib/metadata', () => ({
  generatePageMetadata: vi.fn((config) => ({
    title: config.title,
    description: config.description,
    openGraph: {
      title: config.title,
      description: config.description,
      url: `https://carinyaparc.com.au${config.path}`,
      images: [config.image],
    },
    alternates: {
      canonical: `https://carinyaparc.com.au${config.path}`,
    },
  })),
}));

describe('blog metadata', () => {
  it('should export metadata object', async () => {
    const { metadata } = await import('@/app/(blog)/blog/metadata');

    expect(metadata).toBeDefined();
    expect(typeof metadata).toBe('object');
  });

  it('should have correct title', async () => {
    const { metadata } = await import('@/app/(blog)/blog/metadata');

    expect(metadata.title).toBe('Blog - Life on Pasture - Carinya Parc');
  });

  it('should have correct description', async () => {
    const { metadata } = await import('@/app/(blog)/blog/metadata');

    expect(metadata.description).toContain('regeneration journey');
    expect(metadata.description).toContain('ecosystem');
  });

  // Note: 'path' is not part of Next.js Metadata type, it's a custom property in our implementation
  // We verify the canonical URL instead which reflects the path
  it('should have correct canonical URL', async () => {
    const { metadata } = await import('@/app/(blog)/blog/metadata');

    expect(metadata.alternates?.canonical).toContain('/blog');
  });
});
