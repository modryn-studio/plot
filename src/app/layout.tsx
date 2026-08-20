import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { site } from '@/config/site';
import { ThemeProvider } from '@/components/theme-provider';
import { IconProvider } from '@/components/ui/icon';
import './globals.css';

/* TWO FACES, AND THE SERIF IS THE ARGUMENT — the boilerplate's TODO, answered.
 *
 * This product's document half is a field guide (Peterson / Sibley / Merlin), and a field guide is
 * a serif document. Every AI SaaS is not, which makes this the cheapest differentiator available
 * and one that serves the standard rather than decorating it.
 *
 * BODY TAKES THE SANS, deliberately diverging from the boilerplate's single face. The reading here
 * happens outdoors, on a phone, in sunlight, at 14px — where a text serif gives up legibility it
 * does not owe. Headings get the serif; the interface gets Inter.
 *
 * Both load as CSS variables consumed by --font-heading / --font-sans in globals.css, so no
 * component ever names a font. */
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
      {/* `font-sans`, not the boilerplate's `font-heading`: the interface is the sans and the
          serif is reserved for headings, which globals.css assigns in @layer base. */}
      <body className="font-sans antialiased">
        {/* IconProvider wraps everything so size and stroke are the DEFAULT for every lucide icon
            in the app, including ones written in Server Components. See ui/icon.tsx. */}
        <ThemeProvider>
          <IconProvider>
            {/* NO FLOATING THEME TOGGLE. There is exactly one theme control in the app and it
                lives in the sidebar's account menu (components/shell/account-menu.tsx), where a
                user looks for their own settings. A corner control belongs to no surface: it
                overlaps whatever the page happens to put underneath it, and two ways to do one
                thing is how a shell starts feeling assembled rather than designed. A project with
                no sidebar puts the toggle in its own header rather than bringing this back. */}
            {children}
          </IconProvider>
        </ThemeProvider>
        {/* Vercel Web Analytics: pageviews only, no cookie, no cross-site identity, so it does not
            add anything to the Privacy Policy's cookie section. Inert in development and on any
            non-Vercel host, so local runs never emit. Our own /api/track handles product events;
            this covers traffic and referrers, which that deliberately does not. */}
        <Analytics />
      </body>
    </html>
  );
}
