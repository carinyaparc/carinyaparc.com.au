// src/lib/metadata/title.ts
export function generateTitle(siteName: string, pageTitle?: string): string {
  return pageTitle ? `${pageTitle} | ${siteName}` : siteName;
}
