// Single source of truth for site-wide metadata. Fill this in first on a new project —
// layout metadata, emails, and absolute-URL construction all read from here.
export const site = {
  name: 'Modryn',
  description: 'One sentence that says what this is.',
  // Used to build absolute URLs (metadataBase, email images, alert links). Point it at the
  // canonical host — if the deploy 308-redirects apex → www, use www, or every one of those
  // URLs takes a needless redirect hop (found once via an email image returning a 308).
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const;
