// src/lib/metadata/robots.ts
import type { Metadata } from 'next';

interface RobotsConfig {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  nocache?: boolean;
  googleBotOptions?: {
    index?: boolean;
    follow?: boolean;
    noimageindex?: boolean;
    'max-video-preview'?: number | 'none' | 'standard';
    'max-image-preview'?: 'none' | 'standard' | 'large';
    'max-snippet'?: number;
  };
}

export function generateRobots(config: RobotsConfig = {}): NonNullable<Metadata['robots']> {
  const {
    index = true,
    follow = true,
    noarchive = false,
    nosnippet = false,
    noimageindex = false,
    nocache = false,
    googleBotOptions = {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  } = config;

  return {
    index,
    follow,
    noarchive,
    nosnippet,
    noimageindex,
    nocache,
    googleBot: googleBotOptions,
  };
}
