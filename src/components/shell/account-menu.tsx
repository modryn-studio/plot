'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Moon, Settings, Sun } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/cn';

/* THE ACCOUNT ROW AND ITS MENU, pinned to the bottom of the sidebar. Ported from
 * run-rebuild@s5-trades, which took it from run-trading@v2, which measured it off a reference.
 *
 * THIS IS WHERE THE THEME TOGGLE LIVES. Exactly one exists in the app and it is here, not a second
 * copy floating in a corner of the header. That is the whole reason the corner toggle came out of
 * the root layout: two ways to do one thing is how a shell starts feeling assembled rather than
 * designed.
 *
 * `user` IS RESOLVED BY WHOEVER RENDERS THE SHELL, never by a `useSession()` hook in here. That
 * hook returns null during SSR and the real user after hydration, so this row would render "Not
 * signed in" into the HTML and the name a moment later: a hydration mismatch React reports, plus a
 * visible flash from one avatar initial to another. Passing it in means both renders produce the
 * same string. A project wires it from its own session helper; `null` is a legitimate value and
 * renders the signed-out row.
 *
 * NO RULE ABOVE IT. The divider was doing the job that spacing and a shared hover fill already do.
 */

export type AccountUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

const ITEM =
  'text-small text-text hover:bg-selected flex min-h-10 w-full items-center gap-3 rounded-sm px-3 text-left transition-colors';

export function AccountMenu({ user }: { user?: AccountUser | null }) {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // ESCAPE RETURNS FOCUS TO THE TRIGGER; A CLICK OUTSIDE DOES NOT. The two dismissals are not the
  // same gesture. Escape is "back out of this", so a keyboard user who was tabbing through the
  // menu should land back where they started rather than falling out to document.body and having
  // to Tab from the top of the page again. A click outside is the user already choosing to
  // interact with something else on the page - forcing focus back to the trigger there would fight
  // the click rather than follow it.
  const closeOnEscape = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOnEscape();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close, closeOnEscape]);

  const email = user?.email ?? null;
  const label = user?.name || email || 'Not signed in';
  const avatar = avatarFailed ? null : (user?.image ?? null);

  return (
    <div ref={ref} className="relative">
      {/* The motion lives in .menu-panel (globals.css), not here: it is four related values
          (opacity, scale, translate, display) that only make sense together, and a call site is
          the wrong place to keep them in step. Same reasoning as .panel-transition for the
          sidebar. All this element decides is which state it is in.

          NO BORDER, same treatment as Card: a raised object is a ground change plus a shadow, and
          the hairline is the OTHER claim - "here is a box on the page" - which this panel is not.
          Shipped with both for a while, which is the exact anti-pattern Card's own file argues
          against. Nothing to lose from dropping it: the sidebar sits on bg-bg and this panel is
          bg-elevated, so the ground shift plus shadow-card already separates the two without a
          drawn edge doing the job a second time. */}
      <div
        role="menu"
        data-open={open}
        className="menu-panel bg-elevated shadow-card absolute bottom-full left-0 z-50 mb-2 w-full overflow-hidden rounded-md p-1"
      >
        {/* EVERY ITEM CLOSES THE MENU, the theme toggle included. Flipping the theme and leaving
            the menu open reads as "that did not take". */}
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            toggleTheme();
            close();
          }}
          className={ITEM}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        {/* Inert until a project builds the surface. Kept as a row rather than dropped so adding
            the page later is a behaviour change, not a layout change. */}
        <button type="button" role="menuitem" onClick={close} className={ITEM}>
          <Settings size={16} />
          Settings
        </button>

        <button
          type="button"
          role="menuitem"
          onClick={() =>
            authClient.signOut({
              /* A full navigation, not a router push. signOut() clears the session server-side
                 and invalidates the client cache; it does NOT navigate. Without this, the user
                 stays on the page with a dead session until something else hits the server,
                 which reads as hanging rather than as signing out. */
              fetchOptions: {
                /* A FULL NAVIGATION IS THE POINT, so the Next lint rule is suppressed rather
                   than obeyed here. router.push() keeps the client runtime alive, and with it
                   every cache and piece of module state the signed-in session populated - the
                   next screen can render stale user data from memory. Signing out should leave
                   nothing behind, and only a document navigation guarantees that. */
                // eslint-disable-next-line @next/next/no-location-assign-relative-destination
                onSuccess: () => window.location.assign('/login'),
              },
            })
          }
          disabled={!email}
          className={cn(ITEM, 'text-danger disabled:cursor-not-allowed disabled:opacity-50')}
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>

      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="hover:bg-selected flex min-h-11 w-full items-center gap-3 rounded-sm px-2 py-2 transition-colors"
      >
        {/* The provider's avatar when there is one, the initial when there is not. A plain <img>,
            not next/image: the host is whatever the auth provider uses, which next/image would need
            whitelisting for, and onError has to cover the provider rotating or 404-ing the URL. */}
        {/* A BORDER ON THE AVATAR (Luke, 2026-08-20). The disc takes the row's own hover ground, so
            on hover it is the same fill as the row behind it and its edge disappears - a same-on-same
            disc reads as a gap rather than as a face. The hairline keeps it findable in every state
            without giving it a second, competing fill. */}
        <span className="bg-selected border-border text-caption text-muted flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element -- see above
            <img
              src={avatar}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            (label[0] ?? '?').toUpperCase()
          )}
        </span>
        <span className="text-small min-w-0 flex-1 truncate text-left">{label}</span>
        {/* Points UP while the menu is up: the panel opens above this row, so the chevron aims at
            the thing it opened rather than at a fixed direction. */}
        <ChevronDown
          size={14}
          // ease-in-out, not the project default: a rotation is something ALREADY ON SCREEN
          // changing shape, which is that curve's job. `ease` is for a state change in place.
          className={cn(
            'text-muted shrink-0 transition-transform ease-in-out',
            open && 'rotate-180'
          )}
        />
      </button>
    </div>
  );
}
