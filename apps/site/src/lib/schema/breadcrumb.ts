import { BASE_URL, DEFAULT_BREADCRUMB_HOME, BREADCRUMB_NAME_MAP } from '../constants';

export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

/**
 * Generates breadcrumb items from a pathname
 */
export function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  // Always start with home
  const breadcrumbs: BreadcrumbItem[] = [DEFAULT_BREADCRUMB_HOME];

  // Handle root path
  if (!pathname || pathname === '/') {
    return breadcrumbs;
  }

  // Split pathname and filter empty segments
  const segments = pathname.split('/').filter(Boolean);
  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Get friendly name from map or format segment
    const friendlyName =
      BREADCRUMB_NAME_MAP[segment] ||
      segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    breadcrumbs.push({
      name: friendlyName,
      url: `${BASE_URL}${currentPath}`,
      position: index + 2, // position 1 is home
    });
  });

  return breadcrumbs;
}

/**
 * Generates BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem' as const,
      position: item.position,
      name: item.name,
      item: item.url,
    })),
  };
}
