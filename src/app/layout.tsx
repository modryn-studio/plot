import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { site } from '@/config/site';
import { ThemeProvider } from '@/components/theme-provider';
import { IconProvider } from '@/components/ui/icon';
import './globals.css';

// NO FONT IS DECLARED HERE ON PURPOSE. `--font-heading` in globals.css is system-ui with a TODO
// on it: choose a real display face per project (next/font/google, then point the token at its
// variable). Shipping a framework default as the brand face is what unstyled output looks like,
// and picking one here would mean every project inherits a decision nobody made for it.

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
    <html lang="en" suppressHydrationWarning>
      <body className="font-heading antialiased">
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
