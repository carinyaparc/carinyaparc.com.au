import { Raleway } from 'next/font/google';

export const raleway = Raleway({
  weight: ['400', '700'], // 400 for body, 700 for sub-heads
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  preload: true,
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
});

export const fontClassNames = `${raleway.variable} font-sans`;
