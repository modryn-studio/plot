import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/* THE ONE RAISED SURFACE: a lighter ground, a radius, and the neutral lift.
 *
 * A RAISED OBJECT IS A GROUND CHANGE PLUS A SHADOW, AND CARRIES NO HAIRLINE. A drawn edge and a
 * cast shadow are two different claims about the same object: the border says "here is a box ON
 * the page", the shadow says "here is a sheet ABOVE it". Running both makes the card read as the
 * first while paying for the second, which is why a bordered-and-shadowed card always looks
 * slightly cheap without anyone being able to say why. Ported from run-trading@v2, which reversed
 * its own "flat + hairline" rule after measuring the two side by side.
 *
 * The hairline is NOT gone from the system. It survives INSIDE these objects: dividing rows,
 * underlining a card header, separating a modal footer from its scroll. That is where it was always
 * doing the work. What it stopped doing is outlining the object itself.
 *
 * `bg-elevated`, not `bg-surface`. In this palette `surface` is DARKER than the page, so a card
 * built on it sinks instead of lifting. `elevated` is the token whose stated job is "raised cards,
 * popovers, modals" and it is lighter than the page in both modes.
 *
 * PADDING STAYS THE CALLER'S — a modal panel takes none, a content card takes p-6 — but the CHROME
 * lives here, so a new screen cannot invent its own. This exists because the same four classes were
 * being retyped per screen, which is exactly how the login card ended up on the wrong ground with a
 * border nobody meant to keep.
 */
export const cardSurface = 'bg-elevated shadow-card rounded-lg';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(cardSurface, className)} {...props} />;
}
