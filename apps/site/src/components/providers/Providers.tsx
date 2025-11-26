/**
 * Client-side providers for application-wide state management
 * Implements: T2.0 - TanStack Query setup
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient instance per component mount (ensures no cross-request state in SSR)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable automatic refetching for forms
            staleTime: Infinity,
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Retry once on network failure
            retry: 1,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

