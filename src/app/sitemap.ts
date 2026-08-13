import { MetadataRoute } from 'next';

/* EMPTY WHILE THE APP IS noindex, and the two facts are tied together on purpose.
 *
 * `layout.tsx` sets `robots: { index: false, follow: false }` for every route — the default for a
 * new project, since there is nothing worth indexing until there is. Listing a URL here at the
 * same time is the opposite instruction: a sitemap means "please index these", and Search Console
 * reports the pair as an outright error, `Submitted URL marked 'noindex'`.
 *
 * The file stays rather than being deleted because `robots.ts` points at it, and because the
 * marketing site will want one — but that is a different host and eventually a different repo
 * (see modryn-hq/playbooks/door-and-app.md). THIS sitemap only ever describes the app, so while
 * the app is noindex it describes nothing.
 *
 * Fill it in at the same moment the global `noindex` comes off in `layout.tsx`, never before.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
