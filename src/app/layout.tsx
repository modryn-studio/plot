import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
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
 * ONE FACE, CARRYING EVERYTHING THROUGH WEIGHT. This replaced an Inter + Source Serif 4 pair on
 * 2026-08-21, and the pair was not wrong so much as answering a different question: it argued that
 * the document half of this product is a field guide and a field guide is a serif document. What
 * changed is the reference. onX Hunt's product app runs one grotesque across a 32-role scale and
 * gets ALL of its hierarchy from size and weight, which is also what the house rule already says
 * ("hierarchy below body drops through SIZE and WEIGHT, never a third ink"). A second face is a
 * third axis competing with the two that already work.
 *
 * ROBOTO SPECIFICALLY, because it is what onX ships and it is free where their marketing face is
 * not (that is Atlas Grotesk, Commercial Type, a paid licence we did not buy). Measured off their
 * live app rather than guessed.
 *
 * THE VARIABLE CUT, NOT A WEIGHT LIST. The scale uses 400 / 500 / 700 / 900, and 900 is
 * load-bearing rather than decorative: every button label in this system is Black, which is the
 * single thing that makes the reference read the way it does. Naming four static weights would
 * ship four files; the variable font is one, and the wght axis covers 100-900.
 *
 * Loaded as a CSS variable consumed by --font-sans / --font-heading in globals.css, so no
 * component ever names a font. */
const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
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
    <html lang="en" suppressHydrationWarning className={roboto.variable}>
      {/* `font-sans` is the whole face now. There is no second family to reserve for headings, so
          @layer base no longer assigns one and --font-heading is an alias kept for the house
          token contract. See the note on the font import above. */}
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
