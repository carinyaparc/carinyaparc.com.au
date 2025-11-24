import { http, HttpResponse } from 'msw';

// Type for subscription request data
interface SubscriptionRequest {
  email: string;
}

// Mock API handlers for testing
export const handlers = [
  // Mock subscription endpoint - handle all subscription requests including those with empty emails
  http.post('/api/subscribe', async ({ request }) => {
    const data = (await request.json()) as SubscriptionRequest;

    // Check if the email is provided
    if (!data || !data.email) {
      return new HttpResponse(JSON.stringify({ success: false, message: 'Email is required' }), {
        status: 400,
      });
    }

    return HttpResponse.json({ success: true, message: 'Subscription successful' });
  }),

  // Mock error response for testing error states
  http.post('/api/subscribe/error', async () => {
    return new HttpResponse(
      JSON.stringify({ success: false, message: 'Error processing subscription' }),
      { status: 500 },
    );
  }),

  // Mock blog posts API
  http.get('/api/posts', async () => {
    return HttpResponse.json({
      posts: [
        {
          id: '20250520-seasonal-soil-care-winter-composting-cover-crops',
          title: 'Seasonal Soil Care: Winter Composting & Cover Crops',
          date: '2025-05-20T10:00:00Z',
          excerpt:
            'Learn how to keep your soil healthy during winter with composting techniques and cover crops.',
          slug: 'seasonal-soil-care-winter-composting-cover-crops',
        },
        {
          id: '20250530-designing-polyculture-systems',
          title: 'Designing Polyculture Systems',
          date: '2025-05-30T10:00:00Z',
          excerpt:
            'A guide to creating resilient polyculture systems that work with nature rather than against it.',
          slug: 'designing-polyculture-systems',
        },
      ],
    });
  }),

  // Mock recipes API
  http.get('/api/recipes', async () => {
    return HttpResponse.json({
      recipes: [
        {
          id: 'herbed-omlette-with-native-greens',
          title: 'Herbed Omlette with Native Greens',
          cookTime: 15,
          prepTime: 10,
          slug: 'herbed-omlette-with-native-greens',
        },
      ],
    });
  }),
];
