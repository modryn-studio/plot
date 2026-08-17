import { cn } from '@/lib/cn';
import { Icon } from './icon';

/* ONE LINE OF THE SHOPPING LIST.
 *
 * THIS COMPONENT IS THE RESULT OF A CORRECTION, and the correction is worth keeping. The takeoff
 * originally had an `Overage` column and a `Basis` column — every line annotated with whether its
 * inputs were derived or measured, and its waste percentage broken out. Luke, 2026-08-17: that
 * reads as construction-worker information rather than homeowner DIY. He was right. Provenance in
 * a column is a developer's concern that leaked into the interface, and nobody standing in a
 * driveway cares whether a number is "derived".
 *
 * What survives is the honesty, expressed as a sentence rather than a column:
 *   - `amount` is the number to BUY. Waste is already inside it. One number, no arithmetic asked
 *     of the reader.
 *   - `reason` is a half-sentence, and ONLY on the lines that need one. "2.1 plus 10% — you can't
 *     blend a second batch" teaches a professional habit in eleven words. Most lines have no
 *     reason and render as a clean pair.
 *
 * WHERE THE DERIVED WARNING WENT: to a single CallOut at the bottom of the list, naming what to go
 * check. One arrow, not twelve asterisks. `unconfirmed` here only draws a quiet mark so the eye
 * can find the affected lines once the call-out has told it to look.
 *
 * TABULAR FIGURES ARE NOT COSMETIC. A column of quantities that does not align reads as guessed,
 * and this is the screen someone spends money against.
 */
export function QuantityRow({
  item,
  amount,
  reason,
  unconfirmed,
}: {
  item: string;
  /** What to buy, waste already included. */
  amount: string;
  /** Optional half-sentence. Only where the number would otherwise surprise someone. */
  reason?: string;
  /** Rests on a dimension the user has not confirmed. Marked quietly; explained once, elsewhere. */
  unconfirmed?: boolean;
}) {
  return (
    <div className="border-border flex items-baseline gap-4 border-b py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="text-body text-text">{item}</p>
        {reason ? <p className="text-small text-text mt-0.5">{reason}</p> : null}
      </div>
      <p
        className={cn(
          'tabular-nums text-body shrink-0 text-right',
          unconfirmed ? 'text-muted' : 'text-text'
        )}
      >
        {amount}
        {unconfirmed ? (
          <>
            {' '}
            <Icon name="verify" size={13} className="text-muted inline align-baseline" />
            {/* The word, because colour and a mark are both defeated by sunlight and by a
                colourblind reader, and this line is attached to money. */}
            <span className="sr-only">(not yet confirmed)</span>
          </>
        ) : null}
      </p>
    </div>
  );
}
