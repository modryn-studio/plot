import { cn } from '@/lib/cn';

// A loading placeholder. Size it at the call site (`h-4 w-24`) so it matches the shape of the
// content it stands in for — a skeleton that doesn't match causes a visible reflow on load,
// which is worse than a spinner.
//
// A SHIMMER, NOT A PULSE. The animation is declared once as `.skeleton` in globals.css, so the
// curve and the 1.6s cycle cannot be re-picked per call site. A sweep reads as shorter than an
// opacity pulse at the same real duration, and unlike a pulse it cannot fade toward the ground the
// skeleton sits on and disappear there. See that rule for the full reasoning.
//
// aria-hidden and not announced: a screen reader should hear the loading state from the
// container's aria-busy, not from a stack of empty boxes.
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('skeleton rounded-sm', className)} />;
}
