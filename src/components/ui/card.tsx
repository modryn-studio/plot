import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/* A BORDERED SURFACE, AND DELIBERATELY NOT A SHADOWED ONE.
 *
 * Document mode is a field guide, and a field guide has no drop shadows. Peterson and Sibley
 * separate things with rules and whitespace because ink on paper cannot cast a shadow, and the
 * result reads as reference rather than as an interface. Shadow is reserved here for things that
 * genuinely float ABOVE the canvas — the prompt bar, popovers, modals — where the elevation is
 * literally true rather than decorative.
 *
 * So: `border` for a card, `shadow` only for a thing over the photograph.
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'border-border bg-elevated rounded-md border p-6',
        className
      )}
      {...props}
    />
  );
}

/* A row inside a list, sharing the card's edge rather than drawing its own. The takeoff and the
 * site summary are lists, not stacks of cards — a dozen bordered boxes is the pattern that makes
 * a Sibley page impossible. */
export function Row({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-border border-b py-4 last:border-b-0', className)}
      {...props}
    />
  );
}
