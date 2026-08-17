import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Spinner } from './spinner';

/* THE PRIMARY ACTION IS INK, NOT A HUE.
 *
 * There is no accent color in this system — see the block in globals.css for why. The short
 * version: color belongs to the subject, and green is this subject's color. A filled near-black
 * button is a stronger scan cue than a mid-value hue, it is the most legible object on the screen
 * in direct sun (16.38:1), and it leaves success/warning/danger as the only chromatic things in
 * the interface.
 *
 * THE THREE STATES, and the mechanic is `run-rebuild`'s verbatim rather than a second
 * implementation of one idea:
 *
 *   rest    a ground + --shadow-sm.  A control is a thing you can push, so it has depth.
 *   hover   THE BORDER, AND NOTHING ELSE (or, for a filled button, one step of fill). An object
 *           that already has a ground cannot announce hover by changing that ground without
 *           reading as a DIFFERENT object.
 *   press   --shadow-press, an inset, plus a pressed ground. It goes back past where it started;
 *           that is the whole gesture.
 *
 * PRESS IS AN INSET FOR A REASON THIS PRODUCT HAS AND RUN DOES NOT. The weight of an inset sits
 * at the top edge — the part NOT under your thumb — so it survives the finger covering the
 * control. A fill flash does not. And it runs at 100ms rather than the 220ms base, because press
 * is acknowledgement and acknowledgement late reads as a missed tap.
 *
 * DISABLED IS A GROUND SWAP, NEVER OPACITY, on anything with a fill or a border. Opacity fades
 * the control's EDGES along with its ink, so it goes soft and blurry rather than reading as off —
 * and blurry in daylight is unreadable. `ghost` keeps opacity because it has no fill to swap.
 *
 * NO LOCAL FOCUS RING. This used to carry `focus-visible:ring-accent/30 focus-visible:outline-none`,
 * which SUPPRESSED the app-wide `:focus-visible` outline that globals.css calls "not optional on a
 * product used outdoors in sunlight with gloves on", and replaced it with a 30%-alpha ring at zero
 * offset on the most-tabbed control in the product. The global outline is the whole answer.
 *
 * SIZES ARE THE TYPE SCALE PLUS AN EXPLICIT HEIGHT. This used to be `text-sm` / `text-base` and
 * `px-5` / `px-8` — Tailwind defaults rather than this system's tokens, and 20px is not in the
 * allowed spacing set. The lint rule could not catch it because those are legal *Tailwind*
 * classes; it enforces that a class exists, not that it is ours. Heights run larger than Run's,
 * and that difference is earned: gloves outdoors against a mouse at a desk.
 */

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-text text-bg shadow-sm hover:bg-ink-hover ' +
    'active:bg-text active:shadow-press ' +
    'disabled:bg-surface disabled:text-muted disabled:shadow-none',
  secondary:
    'border-border bg-elevated text-text border shadow-sm hover:border-border-strong ' +
    'active:bg-pressed active:shadow-press ' +
    'disabled:border-border disabled:bg-surface disabled:text-muted disabled:shadow-none',
  ghost:
    'text-muted hover:text-text hover:bg-pressed ' +
    'active:bg-pressed active:text-text active:shadow-press ' +
    'disabled:opacity-50',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-small h-11 px-4',
  md: 'text-body h-12 px-6',
  lg: 'text-body-lg h-14 px-8',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  // Every CTA that triggers an async action uses this — the label swaps for a spinner and the
  // button disables, so no async action can fire twice from a double-click.
  loading?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        // `rounded-sm` is the CONTROL radius (8px). A button is a thing held in a hand, not a
        // region of a page — see the radius block in globals.css.
        'inline-flex items-center justify-center gap-2 rounded-sm font-medium whitespace-nowrap',
        'transition duration-100 ease-out',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
