import { generatePageMetadata } from '@/src/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = generatePageMetadata({
  title: 'Blog',
  description:
    'Articles on regenerative farming, permaculture, and sustainable living practices from Carinya Parc.',
  path: '/blog',
  keywords: ['regenerative farming blog', 'permaculture articles', 'sustainable living tips'],
});
