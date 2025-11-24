import type { Metadata } from 'next';
import { FAVICON_ICO_PATH, FAVICON_16_PATH, APPLE_TOUCH_ICON_PATH } from '../constants';

interface IconsConfig {
  icon?: string;
  shortcut?: string;
  apple?: string;
  other?: Array<{
    rel: string;
    url: string;
    sizes?: string;
    type?: string;
  }>;
}

export function generateIcons(config: IconsConfig = {}): NonNullable<Metadata['icons']> {
  const {
    icon = FAVICON_ICO_PATH,
    shortcut = FAVICON_16_PATH,
    apple = APPLE_TOUCH_ICON_PATH,
    other = [],
  } = config;

  return {
    icon,
    shortcut,
    apple,
    other,
  };
}
