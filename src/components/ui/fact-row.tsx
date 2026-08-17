import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/* WHAT THE APP WORKED OUT, AND WHERE IT GOT IT.
 *
 * The site screen is made of these. Its whole job is the thing no competitor does: separate what
 * we KNOW from what we GUESSED, and let the user correct either.
 *
 * MERLIN'S AUTHORITY COMES FROM BEING CHECKABLE. Cornell is trusted because every claim is
 * sourced, not because the app is pretty. So every derived fact names its source and its
 * confidence, in a caption the user can ignore but could always check.
 *
 * THREE CONFIDENCE STATES, and they are genuinely different things:
 *   modelled   a model produced it. Google's solar flux is built for ROOF planes; on the ground it
 *              is still a real irradiance model over a real surface model and it is the best
 *              answer available — but it is not a light meter and must never be shown as one.
 *   derived    read from an authoritative dataset. Parcel boundary, slope, aspect, zone.
 *   confirmed  the user checked it in the physical world. This is the only state a quantity should
 *              rest on without a call-out.
 *
 * THE WORD IS ALWAYS RENDERED. Never colour alone — sunlight and colourblindness both defeat it,
 * and the whole point of the distinction is that one of these is what you buy materials against.
 */
type Confidence = 'modelled' | 'derived' | 'confirmed';

const CONFIDENCE: Record<Confidence, { ink: string; word: string }> = {
  modelled: { ink: 'text-muted', word: 'modelled' },
  derived: { ink: 'text-muted', word: 'derived' },
  confirmed: { ink: 'text-text', word: 'confirmed' },
};

export function FactRow({
  label,
  value,
  hint,
  confidence,
  source,
  action,
}: {
  label: string;
  value: ReactNode;
  /** Plain-language gloss. "Which plants survive your winters" beats assuming they know. */
  hint?: string;
  confidence: Confidence;
  /** Where it came from. Cheap to render, and it is the entire basis of trust. */
  source?: string;
  /** Usually a correct-this control. Absent for facts with nothing to correct. */
  action?: ReactNode;
}) {
  const c = CONFIDENCE[confidence];
  return (
    <div className="border-border flex items-start gap-4 border-b py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="text-small text-muted">{label}</p>
        <p className="text-body text-text tabular-nums mt-0.5">{value}</p>
        {hint ? <p className="text-small text-text mt-1">{hint}</p> : null}
      </div>

      <div className="shrink-0 text-right">
        <p className={cn('text-caption', c.ink)}>{c.word}</p>
        {source ? <p className="text-caption text-muted mt-0.5">{source}</p> : null}
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </div>
  );
}
