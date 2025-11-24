import { describe, it, expect } from 'vitest';
import { generateArticleSchema } from '@/lib/schema/article';
import { BASE_URL, DEFAULT_AUTHOR_NAME } from '@/lib/constants';

describe('Article Schema', () => {
  const baseArticle = {
    title: 'Test Article',
    slug: 'test-article',
    author: 'John Doe',
    datePublished: '2024-01-01',
    description: 'Test description',
  };

  it('should generate valid Article schema with required fields', () => {
    const schema = generateArticleSchema(baseArticle);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBe('Test Article');
    expect(schema.url).toBe(`${BASE_URL}/blog/test-article`);
    expect(schema.author).toMatchObject({
      '@type': 'Person',
      name: 'John Doe',
    });
    expect(schema.datePublished).toBe('2024-01-01');
    expect(schema.description).toBe('Test description');
  });

  it('should use default author when not provided', () => {
    const article = { ...baseArticle, author: undefined };
    const schema = generateArticleSchema(article);

    expect(schema.author?.name).toBe(DEFAULT_AUTHOR_NAME);
  });

  it('should handle optional fields', () => {
    const article = {
      ...baseArticle,
      dateModified: '2024-01-15',
      imageUrl: '/images/test.jpg',
      excerpt: 'Test excerpt',
      tags: ['tag1', 'tag2'],
    };

    const schema = generateArticleSchema(article);

    expect(schema.dateModified).toBe('2024-01-15');
    expect(schema.image).toBe(`${BASE_URL}/images/test.jpg`);
    expect(schema.keywords).toBe('tag1, tag2');
  });

  it('should handle absolute image URLs', () => {
    const article = {
      ...baseArticle,
      imageUrl: 'https://example.com/image.jpg',
    };

    const schema = generateArticleSchema(article);
    expect(schema.image).toBe('https://example.com/image.jpg');
  });

  it('should generate mainEntityOfPage', () => {
    const schema = generateArticleSchema(baseArticle);

    expect(schema.mainEntityOfPage).toEqual({
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/test-article`,
    });
  });

  it('should generate publisher information', () => {
    const schema = generateArticleSchema(baseArticle);

    expect(schema.publisher).toMatchObject({
      '@type': 'Organization',
      name: expect.any(String),
      logo: {
        '@type': 'ImageObject',
        url: expect.stringContaining('logo.png'),
      },
    });
  });

  it('should include wordCount and articleBody when content provided', () => {
    const article = {
      ...baseArticle,
      content: 'This is a test article with some content.',
    };

    const schema = generateArticleSchema(article);

    expect(schema.wordCount).toBeGreaterThan(0);
    expect(schema.articleBody).toBe('This is a test article with some content.');
  });
});
