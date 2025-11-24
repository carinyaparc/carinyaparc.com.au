// src/lib/metadata/twitter.ts
import type { Metadata } from 'next';
import { TWITTER_HANDLE, TWITTER_CARD_TYPE } from '../constants';

interface TwitterCardConfig {
  handle?: string;
  site?: string;
  cardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
  title?: string;
  description?: string;
  images?: string[];
}

export function generateTwitterCard(
  config: TwitterCardConfig = {},
): NonNullable<Metadata['twitter']> {
  const {
    handle = TWITTER_HANDLE,
    site = TWITTER_HANDLE,
    cardType = TWITTER_CARD_TYPE as 'summary' | 'summary_large_image',
    title,
    description,
    images = [],
  } = config;

  return {
    card: cardType,
    site,
    creator: handle,
    ...(title && { title }),
    ...(description && { description }),
    ...(images.length > 0 && { images }),
  };
}
