'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './icon';

/* ONE STEP OF THE BUILD GUIDE, AND THE GATE BETWEEN STAGES.
 *
 * Structure taken from iFixit, which is the best-in-class instance of this problem anywhere: a
 * novice doing skilled physical work with real consequences.
 *
 * THE REASON IS NOT OPTIONAL. iFixit never says "park on level ground" — it says park on firm
 * level ground, BECAUSE if the ground shifts the jack can move and you can be crushed. A DIYer who
 * knows why will adapt correctly to a yard the guide never anticipated; one who only knows what
 * will not. So `reason` is a required prop, not a nicety.
 *
 * THE BODY SIZE IS text-body-lg, AND THAT IS FUNCTIONAL. This is read at arm's length, outdoors,
 * with dirty hands, on a phone propped against a wheelbarrow.
 *
 * WARNINGS GO ON THE STEP, never batched into an introduction nobody re-reads at step six.
 *
 * QUANTITIES ARE MARKED SO THEY CAN BE TRACED. `fromTakeoff` renders the numbers this project
 * actually produced, labelled as such — the guide is a library template and these are the parts
 * that are yours.
 */
export function StepCard({
  number,
  title,
  reason,
  fromTakeoff,
  warning,
  children,
}: {
  number: number;
  title: string;
  /** Required. Why this step exists, in one clause. */
  reason: string;
  /** The numbers this project produced, substituted into a library template. */
  fromTakeoff?: ReactNode;
  warning?: ReactNode;
  /** The gate, if this stage has one. */
  children?: ReactNode;
}) {
  return (
    <div className="border-border border-b py-6 last:border-b-0">
      <div className="flex gap-4">
        <span className="text-h3 text-muted tabular-nums shrink-0 tracking-tight">{number}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-h3 text-text">{title}</h3>
          <p className="text-body-lg text-text mt-2">{reason}</p>

          {fromTakeoff ? (
            <p className="text-small text-muted mt-3">
              <span className="text-text">From your takeoff:</span> {fromTakeoff}
            </p>
          ) : null}

          {warning ? (
            <p className="text-small text-danger mt-3 flex gap-2">
              <Icon name="danger" size={16} className="mt-0.5 shrink-0" />
              <span>{warning}</span>
            </p>
          ) : null}

          {children ? <div className="mt-4">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}

/* A STOP-WORK CHECK. The next step does not open until this is ticked.
 *
 * This is opinionated and it is meant to be. The 811 call and the compaction check are the two
 * cheapest things in the entire product that prevent a genuinely bad day, and a checkbox someone
 * can scroll past is not a gate. It costs one tap to satisfy and it is the only place in the app
 * that blocks anything.
 *
 * It is a real checkbox rather than a styled div, so it is keyboard-reachable and announced. */
export function GateCheck({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        'flex w-fit cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 transition-colors',
        disabled && 'cursor-not-allowed opacity-50',
        checked
          ? 'border-success/40 bg-success/10'
          : 'border-danger/40 bg-surface hover:border-danger'
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-text h-5 w-5"
      />
      <span className={cn('text-small font-medium', checked ? 'text-success' : 'text-text')}>
        {label}
      </span>
      {checked ? <Icon name="check" size={16} className="text-success" /> : null}
    </label>
  );
}
