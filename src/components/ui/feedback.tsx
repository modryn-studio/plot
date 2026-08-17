import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from './icon';

/* THE STATES THAT SEPARATE A REAL APP FROM A DEMO — empty, loading, error.
 *
 * These are the bad-day path, and the bad day is the day the user shows up. Default and hover are
 * what you see every time you build a screen, which is why they are already right and these are
 * not.
 */

/* AN EMPTY STATE NAMES WHAT IS MISSING AND OFFERS EXACTLY ONE ACTION.
 *
 * "No data" is not an empty state. GrowVeg's seed inventory does this well and is worth the
 * comparison: instead of "no packets", it says keep a log of what you own, note the varieties that
 * work FOR YOUR GARDEN, and get told when you are low — three jobs in one sentence, and the local
 * framing is the product's whole argument in passing. */
export function EmptyState({
  icon = 'info',
  title,
  children,
  action,
}: {
  icon?: IconName;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="border-border bg-surface rounded-md border border-dashed p-8 text-center">
      <Icon name={icon} size={24} className="text-muted mx-auto" />
      <p className="text-h3 text-text mt-3">{title}</p>
      <p className="text-small text-text mx-auto mt-2 max-w-md">{children}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

/* AN ERROR SAYS WHAT HAPPENED AND WHAT TO DO NEXT. Never a raw exception.
 *
 * `recoverable` is the difference between "this failed and your work is gone" and "this failed and
 * your work is exactly where you left it" — which for a generation that costs money is the whole
 * difference. The spec requires the drawing and the prompt to survive a failed render. */
export function ErrorState({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="border-danger/40 bg-danger/5 rounded-md border p-6">
      <div className="flex gap-3">
        <Icon name="danger" size={20} className="text-danger mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-body text-text font-medium">{title}</p>
          <p className="text-small text-text mt-1">{children}</p>
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

/* A SLOW OPERATION THAT SAYS WHAT IT IS DOING.
 *
 * A minute of spinner is a minute of doubt. A minute of "fetching your parcel from Columbia
 * County → fetching imagery → modelling your sun" is a minute of the product explaining its
 * method, in the user's own vocabulary, and quietly proving it used the inputs it asked for.
 *
 * It also converts a failure into a legible one: when a step stalls, the user knows WHICH source
 * is slow, and a partial result ("we got everything but the parcel") becomes explicable rather
 * than mysterious. */
export type ProgressStep = {
  label: string;
  state: 'done' | 'active' | 'waiting' | 'failed';
};

export function NarratedProgress({ steps }: { steps: ProgressStep[] }) {
  return (
    <ol className="space-y-2" aria-live="polite">
      {steps.map((s) => (
        <li key={s.label} className="flex items-center gap-3">
          <span
            className={cn(
              'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
              s.state === 'done' && 'border-success text-success',
              s.state === 'active' && 'border-text text-text',
              s.state === 'waiting' && 'border-border text-muted',
              s.state === 'failed' && 'border-danger text-danger'
            )}
          >
            {s.state === 'done' ? <Icon name="check" size={12} /> : null}
            {s.state === 'failed' ? <Icon name="close" size={12} /> : null}
            {s.state === 'active' ? (
              <span className="bg-text h-1.5 w-1.5 animate-pulse rounded-full" />
            ) : null}
          </span>
          <span
            className={cn(
              'text-small',
              s.state === 'waiting' ? 'text-muted' : 'text-text',
              s.state === 'failed' && 'text-danger'
            )}
          >
            {s.label}
          </span>
        </li>
      ))}
    </ol>
  );
}

/* A shape standing in for content that has not arrived. Never a blocking spinner over a whole
 * screen — the parts that HAVE loaded stay usable, which is the spec's rule that a failed guide
 * leaves the takeoff working. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('bg-surface animate-pulse rounded-sm', className)} />;
}
