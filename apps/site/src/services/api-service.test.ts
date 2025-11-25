import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { handlers } from '../../__tests__/mocks/handlers';

// Since we don't have a direct API service file to import, we'll create a mock service for testing
class ApiService {
  static async fetchPosts() {
    const response = await fetch('/api/posts');
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  }

  static async subscribe(email: string) {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error('Failed to subscribe');
    return response.json();
  }
}

// Set up MSW server with imported handlers
const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Service', () => {
  describe('fetchPosts', () => {
    it('should fetch posts successfully', async () => {
      // Act
      const result = await ApiService.fetchPosts();

      // Assert
      expect(result).toHaveProperty('posts');
      expect(result.posts.length).toBe(2);
      expect(result.posts[0].title).toBe('Seasonal Soil Care: Winter Composting & Cover Crops');
      expect(result.posts[1].title).toBe('Designing Polyculture Systems');
    });

    it('should handle errors properly', async () => {
      // Arrange - Setup a spy to test error handling
      const fetchSpy = vi
        .spyOn(global, 'fetch')
        .mockImplementation(() =>
          Promise.resolve(new Response(null, { status: 500, statusText: 'Server Error' })),
        );

      // Act & Assert
      try {
        await ApiService.fetchPosts();
        // If we get here, the test should fail
        expect(true).toBe(false); // This should not be reached
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Failed to fetch posts');
      }

      // Cleanup
      fetchSpy.mockRestore();
    });
  });

  describe('subscribe', () => {
    it('should subscribe successfully with valid email', async () => {
      // Act
      const result = await ApiService.subscribe('test@example.com');

      // Assert
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message', 'Subscription successful');
    });

    it('should throw an error when the email is missing', async () => {
      // Act & Assert
      await expect(ApiService.subscribe('')).rejects.toThrow();
    });

    it('should handle errors properly', async () => {
      // Arrange - Setup a spy to test error handling
      const fetchSpy = vi
        .spyOn(global, 'fetch')
        .mockImplementation(() =>
          Promise.resolve(new Response(null, { status: 500, statusText: 'Server Error' })),
        );

      // Act & Assert
      try {
        await ApiService.subscribe('test@example.com');
        // If we get here, the test should fail
        expect(true).toBe(false); // This should not be reached
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Failed to subscribe');
      }

      // Cleanup
      fetchSpy.mockRestore();
    });
  });
});
