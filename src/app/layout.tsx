import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { site } from '@/config/site';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

/* TWO FACES, AND THE SERIF IS THE POINT. A field guide is a serif document and every AI SaaS is
 * not, which makes this the cheapest differentiator available and one that serves the standard
 * rather than decorating it. See docs/design-system.md §0 — document mode is Peterson / Sibley /
 * Merlin, canvas mode is Recraft's shell.
 *
 * Both are loaded as CSS variables and consumed by --font-heading / --font-sans in globals.css,
 * so no component ever names a font. */
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  // Shrinks layout viewport when an on-screen keyboard opens — h-dvh containers
  // then exclude keyboard height without per-component visualViewport hacks.
  interactiveWidget: 'resizes-content',
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  description: site.description,
  // Private until it isn't — keep it out of search indexes until there's a reason not to.
  robots: { index: false, follow: false },
  // Icons are left to Next's file conventions: src/app/icon.png, favicon.ico, apple-icon.png.
  // Replace those three files with the project's mark. (Setting an `icons` block here would stop
  // the conventions entirely, so anything it forgot to list would silently disappear.)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: ThemeProvider's blocking script sets the .dark class
    // before hydration, which intentionally differs from the server-rendered markup.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sourceSerif.variable} ${inter.variable}`}
    >
      <body className="antialiased">
        {/* NO GLOBAL FLOATING ThemeToggle. The base shipped one pinned at `fixed top-4 right-4`
            with a note to "move it into a real header when the project grows one" — that moment
            arrived. A fixed button over every route lands on top of whatever a real shell puts in
            its top-right corner, which is exactly what it did to the kitchen sink's header.
            Each surface with a header now renders its own; see kitchen-sink and the login view. */}
        <ThemeProvider>{children}</ThemeProvider>
        {/* Vercel Web Analytics: pageviews only, no cookie, no cross-site identity, so it does not
            add anything to the Privacy Policy's cookie section. Inert in development and on any
            non-Vercel host, so local runs never emit. Our own /api/track handles product events;
            this covers traffic and referrers, which that deliberately does not. */}
        <Analytics />
      </body>
    </html>
  );
}
