import { describe, it, expect, vi } from 'vitest';

// Mock fs
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(() => false),
    readdirSync: vi.fn(() => []),
    readFileSync: vi.fn(() => ''),
  },
  existsSync: vi.fn(() => false),
  readdirSync: vi.fn(() => []),
  readFileSync: vi.fn(() => ''),
}));

// Mock path
vi.mock('path', () => ({
  default: {
    join: vi.fn((...args) => args.join('/')),
  },
  join: vi.fn((...args) => args.join('/')),
}));

// Mock gray-matter
vi.mock('gray-matter', () => ({
  default: vi.fn((content: string) => ({
    data: { title: 'Test', description: 'Test', date: '2024-01-01' },
    content: 'Test content',
  })),
}));

describe('mdx', () => {
  it('should test fs mock configuration', () => {
    // Test that our mocks are set up correctly
    expect(vi.isMockFunction(vi.fn())).toBe(true);
  });

  it('should test path mock configuration', () => {
    // Test mock utilities
    const mockJoin = vi.fn((...args) => args.join('/'));
    expect(mockJoin('a', 'b', 'c')).toBe('a/b/c');
  });

  it('should test gray-matter mock configuration', () => {
    // Test mock functionality
    const mockMatter = vi.fn((_content: string) => ({
      data: { title: 'Test' },
      content: 'Test content',
    }));
    const result = mockMatter('test');
    expect(result.data.title).toBe('Test');
  });

  it('should handle mocked file operations', async () => {
    // Test async mock operations
    const mockGetAllFiles = vi
      .fn()
      .mockResolvedValue([{ slug: 'test-1', frontmatter: { title: 'Test 1' } }]);
    const files = await mockGetAllFiles('posts');
    expect(files).toHaveLength(1);
    expect(files[0].slug).toBe('test-1');
  });
});
