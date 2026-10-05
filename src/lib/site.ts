/**
 * Canonical Site URL resolver
 * Automatically detects Vercel deployment URLs or custom NEXT_PUBLIC_SITE_URL
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const raw = process.env.NEXT_PUBLIC_SITE_URL.trim();
    return raw.startsWith('http') ? raw : `https://${raw}`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}
