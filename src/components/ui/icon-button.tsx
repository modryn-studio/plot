import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/* THE COMPACT ICON CONTROL. Two hit shapes exist in this system and the shape is what tells them
 * apart:
 *
 *   A NAV ROW is full-width, h-10, labelled, a rounded rectangle, and takes the ground fill on
 *   hover. It is a PLACE TO GO.
 *   AN ICON BUTTON is 40px, a circle, bare at rest, and fills on hover. It ACTS ON the surface
 *   it sits in.
 *
 * Keeping those visually distinct is why a sidebar's collapse control never reads as another
 * destination in the nav beneath it.
 *
 * Shape follows the control's CONTENT, not its rank: icon-only is a circle, labelled is a
 * rectangle (see Button). Logos and avatars stay round, which this agrees with rather than excepts.
 *
 * Bare at rest, on purpose. A lone glyph in a rail needs no chrome until the pointer arrives; the
 * chrome IS the hover affordance.
 *
 * REST NOTHING -> HOVER A BORDER + GROUND -> PRESS PUSHED IN (2026-08-19, reversing an earlier
 * shadow-based version). ONLY A CARD FLOATS: no button-class control ever carries a shadow, so
 * hover cannot be "a raised chip" any more - it is the SAME border a secondary button shows at
 * rest (border-border), plus the same ground (elevated), arriving together. Press drops to
 * pressed, a ground one step toward the page - the same token every button-class control uses,
 * now that this control keeps a real border through the press to mark its edge regardless, PLUS
 * the inset --shadow-press so the chip visibly goes down rather than just changing colour. An
 * inset is not a drop shadow: the
 * basic rule this system holds everywhere now is that a control never carries a DROP shadow -
 * that claim ("I float above the page") belongs to Card alone - while an inset, which says the
 * opposite, is exactly what a press should look like.
 */
export function IconButton({ className, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(
        // No focus ring: the global :focus-visible outline in globals.css is the only one.
        // duration-100 to match Button: a press has to answer the finger immediately.
        // icon-hit-area + relative: the visible chip stays 40px, an invisible ::after (globals.css)
        // expands the actual hit target to 44px, the mobile touch-target minimum.
        // border-transparent AT REST: the width is always present, only the colour moves on
        // hover, so the circle never resizes and the colour change can actually transition.
        'icon-hit-area relative text-muted hover:border-border hover:bg-elevated hover:text-text active:bg-pressed active:shadow-press border border-transparent inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition duration-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:border-transparent disabled:shadow-none',
        className
      )}
      {...props}
    />
  );
}
