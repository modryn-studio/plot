'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './icon';
import { Spinner } from './spinner';

/* THE CANVAS'S PRIMARY CONTROL, ADAPTED FROM RECRAFT.
 *
 * The pattern taken: a floating compound input that carries its PARAMETERS AS INLINE CHIPS rather
 * than in a settings panel. Recraft's reads `[Image][Model][Style][1:1][2 images][palette]` under
 * the text field, and the effect is that changing what you are asking for never means leaving what
 * you are asking. A settings drawer would break that.
 *
 * ADAPTED, NOT PORTED (Luke, 2026-08-17). Two changes, both because this product has a job
 * Recraft does not:
 *
 *   1. THE ALLOWANCE IS ON THE BAR, before you commit. Recraft shows credits in the top bar, which
 *      is fine when a generation is the product. Here a generation is one step of a longer job, so
 *      the cost belongs at the moment of spending rather than in the chrome.
 *
 *   2. THE STANDING NOTICE IS PART OF THE COMPONENT, not a page decoration. Recraft's "can make
 *      mistakes" line sits under its bar; ours says the stronger and more specific thing — that
 *      the output is an ILLUSTRATION, NOT A PLAN. That distinction is the entire reason this
 *      product exists rather than being another render app, so it does not get to be optional and
 *      it does not appear and disappear with state.
 *
 * FLOATS, SO IT SHADOWS. This is the one family of surface in the system allowed a shadow, because
 * here the elevation is literally true: the bar is over a photograph.
 */
export function PromptBar({
  placeholder = 'Describe what you want here',
  chips,
  remaining,
  busy,
  onSubmit,
}: {
  placeholder?: string;
  /** Inline parameter controls. Material, look, season — whatever the surface takes. */
  chips?: ReactNode;
  /** Generations left. Shown before the spend, not after. */
  remaining?: number;
  busy?: boolean;
  onSubmit?: (value: string) => void;
}) {
  const [value, setValue] = useState('');
  const empty = value.trim().length === 0;

  return (
    <div className="w-full max-w-2xl">
      <div className="border-border bg-elevated rounded-md border p-3 shadow-lg">
        <div className="flex items-start gap-2">
          <textarea
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            aria-label="Describe what you want"
            className="text-body text-text placeholder:text-muted min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 outline-none"
          />
          <button
            type="button"
            aria-label="Generate"
            title="Generate"
            disabled={empty || busy}
            onClick={() => onSubmit?.(value)}
            className={cn(
              'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm transition-colors',
              'disabled:pointer-events-none disabled:opacity-40',
              'bg-text text-bg hover:opacity-90'
            )}
          >
            {busy ? <Spinner /> : <Icon name="send" size={16} />}
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 px-1">
          {chips}
          {typeof remaining === 'number' ? (
            <span className="text-caption text-muted ml-auto tabular-nums">
              {remaining} left today
            </span>
          ) : null}
        </div>
      </div>

      {/* NOT OPTIONAL, and not state-dependent. See the note above. */}
      <p className="text-caption text-text mt-2 text-center">
        Generated images are illustrations, not plans. Sizes come from the Plan view.
      </p>
    </div>
  );
}

/* An inline parameter. Reads as a control, not a tag — it opens something. */
export function PromptChip({
  label,
  value,
  onClick,
}: {
  label: string;
  value?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-border text-caption text-muted hover:text-text hover:border-border inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 transition-colors"
    >
      {label}
      {value ? <span className="text-text">{value}</span> : null}
      <Icon name="chevron" size={12} />
    </button>
  );
}
