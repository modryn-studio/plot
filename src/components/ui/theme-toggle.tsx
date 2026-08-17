'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/cn';

/* A CONTROL, so: radius-sm (8), a rest shadow, and a press that pushes IN.
 *
 * Three things were wrong here and all three came from never auditing the boilerplate:
 *   - `active:scale-[0.98]` — a SHRINK is not a push. The object gets smaller and stays flat.
 *     Replaced with the system's `--shadow-press` inset, so the whole app has one press gesture.
 *   - `focus-visible:ring-accent/30 focus-visible:outline-none` — this SUPPRESSED the app-wide
 *     focus outline that globals.css calls "not optional on a product used outdoors in sunlight
 *     with gloves on", and swapped it for a 30%-alpha ring at zero offset.
 *   - `rounded-md` — that is the SLOT radius (12). A toggle is a control (8).
 *
 * Hover moves the ink only. The border stays: this control has a ground of its own, and a ground
 * that changes on hover reads as a different object rather than the same one under a pointer.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'border-border bg-elevated text-muted inline-flex h-11 w-11 items-center justify-center',
        'rounded-sm border shadow-sm',
        'transition duration-100 ease-out',
        'hover:border-border-strong hover:text-text',
        'active:bg-pressed active:shadow-press',
        className
      )}
    >
      {/* Sized through the same 18px the IconButton uses. Not routed through <Icon> because the
          moon/sun pair is chrome for the toggle itself rather than product vocabulary, and adding
          two names to MARKS that only this file uses would grow the map for nothing. */}
      {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
    </button>
  );
}
