import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Spinner } from './spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

/* THE THREE STATES.
 *
 *   "monarch doesn't highlight the entire button on hover. i think its just the border. and its
 *    subtle."  -> HOVER MOVES THE BORDER, AND NOTHING ELSE. A raised object that already has a
 *    ground cannot announce hover by changing that ground without reading as a different object.
 *    The old secondary moved border AND text to accent, which is the whole-button highlight.
 *
 *   "when buttons are clicked, they need to look like they've been pushed in."  -> A GROUND
 *    CHANGE **and** the INSET --shadow-press. The two are not alternatives: the ground says which
 *    state you are in, the inset says the surface went DOWN.
 *    DROP shadows are what this system bans on controls, not inset ones. A drop shadow claims "I
 *    float above the page", which only Card may claim; an inset claims the opposite. Stripping
 *    shadow-press along with the drop shadows (2026-08-19) over-applied that rule and cost every
 *    button its press feedback - restored same day. What stayed deleted is secondary's resting
 *    a resting drop shadow stacked under a border, which is the combination the rule forbids.
 *    accent-active still earns its place: primary has no border to mark a press with, so its fill
 *    carries a colour step as well.
 *
 * Primary darkens to accent-hover rather than hover:opacity-90, which greys the fill against the
 * page instead of deepening it. accent-hover is derived from the accent (globals.css), so this
 * follows a recolour without a second value to maintain. */
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-accent-foreground hover:bg-accent-hover active:bg-accent-active active:shadow-press disabled:opacity-50',
  /* bg-ELEVATED, not bg-surface. `surface` is DARKER than the page in this palette, so a
   * secondary button was a grey slab sitting on a white card while the input beside it was the
   * card's own ground: two different grounds for two controls doing the same job in the same
   * stack. `elevated` is the raised ground, the same one Input and Card use, so the three now
   * agree. (run-trading@v2 calls this token `surface` and its button, input and card all take it.)
   * Disabled is a real ground at FULL opacity, not a 50% fade: fading a bordered control washes
   * its edge and its label together into mush, where a flat recessed fill still reads as a
   * control that is switched off. */
  secondary:
    'border-border bg-elevated text-text border hover:border-border-strong active:bg-pressed active:shadow-press disabled:bg-surface disabled:text-muted disabled:shadow-none disabled:opacity-100',
  /* GHOST IS A BARE LABELLED CONTROL: full ink at rest, chrome only on hover, pushed in on press.
   *
   * FULL INK, NOT MUTED. It shipped muted, which is a hierarchy inversion rather than a shade
   * choice: `muted` is the role this system reserves for METADATA (a date, a count), and a button
   * is a control you act on, not a property of the thing beside it. A ghost button is quiet
   * because it has no ground and no edge, NOT because its label is dimmer than the words around
   * it. The same correction the sidebar rows just took, for the same reason.
   *
   * AND IT NOW HAS A PRESS STATE. It previously ran `hover:text-text active:text-text`, so once
   * rest became full ink the active rule was a no-op and the control answered a click with
   * nothing at all. It borrows IconButton's mechanic verbatim rather than inventing a third one:
   * a bare labelled control and a bare icon control are the same CLASS of thing, one just carries
   * a word: same border, same ground, same pressed token (--color-pressed) as every other
   * button-class control now uses. */
  /* border-transparent AT REST, not a bare 0px edge: the border-WIDTH is present in every state and
   * only its COLOUR changes on hover, so the box never resizes and the colour change can actually
   * transition (a width jumping from 0 to 1 cannot animate smoothly in any browser). Same technique
   * IconButton uses, and for the identical reason. */
  ghost:
    'text-text border border-transparent hover:border-border hover:bg-elevated active:bg-pressed active:shadow-press disabled:opacity-50 disabled:border-transparent disabled:shadow-none',
};

/* HEIGHT IS STATED, NEVER DERIVED, and that is the point of this table.
 *
 * These used to be padding plus line-height, which meant the height of a control was whatever the
 * type scale happened to add up to. On /login that produced three different heights in one card:
 * a 46px field beside a 56px submit and a 58px Google button, and nothing in the code said they
 * were supposed to match, so nothing caught it. A stated height binds; a derived one only ever
 * happens to agree, and stops agreeing the moment font size, padding or line-height moves.
 *
 * 32 / 40 / 48 are on the allowed spacing scale. A single-line Input is 48 for the same reason, so
 * size="lg" and a field sit level in the same row without either being tuned to the other.
 *
 * text-small / text-body, NOT Tailwind's stock text-sm / text-base: the stock utilities live
 * outside the @theme scale and drift the moment the scale is retuned. */
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 text-small',
  md: 'h-10 px-5 text-small',
  lg: 'h-12 px-8 text-body',
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
        // SHAPE FOLLOWS CONTENT: a labelled control is a rounded rectangle, an icon-only one is a
        // circle (see IconButton). Buttons here used to carry no radius token at all, so every
        // project inherited square corners by omission rather than by decision.
        // No focus ring: the global :focus-visible outline in globals.css is the only one.
        /* `transition`, not `transition-colors`: the press is a box-shadow as well as a colour,
           and transition-colors does not carry box-shadow, so the inset would snap instead of
           settling.
           duration-100, NOT the project default of 200ms, and this is the one place a component
           overrides the curve on purpose. A press has to answer the finger immediately: at 200ms
           the button still reads as mid-change after the finger has already lifted. */
        'relative inline-flex items-center justify-center rounded-md text-center font-medium transition duration-100 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* THE LABEL KEEPS ITS BOX WHILE LOADING. It used to be swapped out for the spinner
          (`loading ? <Spinner/> : children`), which meant the button resized to whatever an 18px
          spinner needs the instant it was clicked - a "Send the code" CTA visibly shrank to a
          square under the cursor, and in a row of buttons everything beside it moved too.
          opacity-0 rather than `invisible` or `hidden`: it holds the layout AND keeps the label in
          the accessibility tree, so the button still has an accessible name while busy. */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      )}
      {/* gap lives here rather than on the button, because the button now has exactly one child.
          One value, defined once: an icon-plus-label button gets 12px and cannot be overridden
          into a second default from a call site. */}
      {/* `truncate` HERE, NOT ON THE BUTTON (2026-08-20). A label longer than the box used to WRAP,
          and the height is stated (`h-8`/`h-10`/`h-12`), so it could not grow to hold the extra
          line: measured at a 200px width the label needed 50px inside a 40px button and simply
          escaped it. The row's own note claimed it "grows taller, never escapes the box", which the
          stated-height rule two blocks up makes impossible by design.
          Truncating rather than letting it wrap is what keeps that rule intact - a button that
          grows breaks the alignment the stated height exists to guarantee. On the span rather than
          the button because a centred flex container overflows at BOTH ends, clipping the label
          left and right with the ellipsis nowhere; a span is a flex ITEM, so `overflow-hidden`
          gives it an automatic minimum size of 0 and it truncates to one ellipsis at the end. */}
      <span
        /* NO `justify-center` HERE, and that is the whole fix. The BUTTON centres this span
           already; centring a second time inside a box that can overflow is what clipped the label
           at BOTH ends - a centred flex container splits its overflow evenly, so the label lost its
           first word and its last one at once and the ellipsis rendered off-screen entirely. Laid
           out from the start edge, all the overflow is at the end, which is where an ellipsis
           belongs. `gap-3` stays for an icon-plus-label button; `min-w-0` is what lets this shrink
           at all as a flex item of the button. */
        className={cn('inline-flex min-w-0 items-center gap-3 truncate', loading && 'opacity-0')}
      >
        {children}
      </span>
    </button>
  );
}
