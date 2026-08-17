import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from './icon';

/* PETERSON'S ARROW.
 *
 * The entire Peterson system is one idea: an arrow pointing at the single field mark that settles
 * the identification. Not a paragraph describing the bird — a pointer at the one thing that
 * decides it.
 *
 * This is that, and the discipline is the same: ONE per screen, at the thing that decides the
 * outcome. On the takeoff it is "three of these depend on how deep you dig — go check". In the
 * build guide it is the stop-work condition. The moment there are three of these on a page, none
 * of them is an arrow any more and the user learns to scroll past the box shape.
 *
 * TONE CARRIES MEANING, AND MEANING IS THE ONLY THING COLOUR IS FOR IN THIS SYSTEM:
 *   note    something to know
 *   check   something to go and verify in the physical world before trusting a number
 *   warn    something that will go wrong — drainage, crowding, out of zone
 *   stop    something that must not be skipped — 811, a cure time, a load
 *
 * NEVER COLOUR ALONE. Every tone ships an icon and a word, because this runs outdoors in sunlight
 * on a phone, some readers are colourblind, and the signal is attached to money.
 */
type Tone = 'note' | 'check' | 'warn' | 'stop';

/* THE `check` TONE IS INK, AND THAT IS THE POINT OF DELETING THE ACCENT. Peterson's arrow is
 * black; what makes it read is that it is the ONLY arrow on the plate. With no accent hue in the
 * system, ink is the loudest non-semantic thing available, and "go verify this before you buy" is
 * not a warning and not a danger — it is the one instruction that decides the outcome. */
const TONES: Record<Tone, { icon: IconName; ring: string; ink: string; word: string }> = {
  note: { icon: 'info', ring: 'border-border', ink: 'text-muted', word: 'Note' },
  check: { icon: 'verify', ring: 'border-border-strong', ink: 'text-text', word: 'Check this' },
  warn: { icon: 'warn', ring: 'border-warning/40', ink: 'text-warning', word: 'Warning' },
  stop: { icon: 'danger', ring: 'border-danger/40', ink: 'text-danger', word: 'Do not skip' },
};

export function CallOut({
  tone = 'note',
  title,
  children,
  action,
}: {
  tone?: Tone;
  /** Overrides the tone's default word. The default is usually right. */
  title?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  const t = TONES[tone];
  return (
    <div
      className={cn(
        'bg-surface flex gap-3 rounded-md border p-4',
        t.ring
      )}
    >
      <Icon name={t.icon} size={18} className={cn('mt-0.5 shrink-0', t.ink)} />
      <div className="min-w-0 flex-1">
        {/* The word is not decoration. It is what survives when the colour does not. */}
        <p className={cn('text-small font-medium', t.ink)}>{title ?? t.word}</p>
        <div className="text-small text-text mt-1">{children}</div>
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
    </div>
  );
}
