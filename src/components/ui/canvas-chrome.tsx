'use client';

import { cn } from '@/lib/cn';
import { IconButton } from './icon-button';
import type { IconName } from './icon';

/* THE CHROME THAT SITS OVER A PHOTOGRAPH OR A PLAN.
 *
 * A CONTRAST PROBLEM NO OTHER SURFACE IN THE SYSTEM HAS: everything else sits on a token ground we
 * chose, so its contrast is a fixed, checkable number. These sit on an arbitrary image — a sunlit
 * driveway, a shaded fence line, a near-white patch of concrete — and the same token can pass
 * against `bg` and vanish against the photo behind it.
 *
 * So chrome over the canvas always carries its OWN ground (`bg-elevated` + border), never floats
 * as bare ink on the image. This is the case the design system's contrast gate has to check and
 * the one that is easy to forget, because it looks fine over whatever screenshot you developed
 * against.
 */

/** The tool rail. Slim, vertical, and every button has a name — see IconButton for why. */
export function ToolRail({
  tools,
  active,
  onSelect,
}: {
  tools: { name: IconName; label: string }[];
  active?: IconName;
  onSelect?: (name: IconName) => void;
}) {
  return (
    <div
      role="toolbar"
      aria-orientation="vertical"
      aria-label="Canvas tools"
      className="border-border bg-elevated flex w-fit flex-col gap-1 rounded-md border p-1 shadow-md"
    >
      {tools.map((t) => (
        <IconButton
          key={t.name}
          name={t.name}
          label={t.label}
          active={active === t.name}
          onClick={() => onSelect?.(t.name)}
        />
      ))}
    </div>
  );
}

/* THE SCALE BAR, AND IT IS ALWAYS VISIBLE ON AN OVERHEAD VIEW.
 *
 * This is the single mark that separates a base plan from a picture of a house. An aerial photo
 * with no scale cannot answer "how long is that bed", which is the first question every project
 * asks. It is cheap to draw and it is the whole difference. */
export function ScaleBar({ feet, widthPx }: { feet: number; widthPx: number }) {
  return (
    <div className="border-border bg-elevated inline-flex flex-col gap-1 rounded-sm border px-3 py-2">
      <div
        className="border-text h-2 border-r-2 border-b-2 border-l-2"
        style={{ width: widthPx }}
        aria-hidden="true"
      />
      <span className="text-caption text-muted tabular-nums">{feet} ft</span>
    </div>
  );
}

/* LIVE DIMENSION WHILE DRAWING.
 *
 * PRO Landscape's answer to the accuracy problem is not a better data source — it is that you
 * start a line and the distance shows as you drag. That turns "measure your lot" into "draw what
 * you measured", which is a UI decision rather than a data problem, and it is the reason
 * tape-verification is viable at all.
 *
 * `confirmed` when the user TYPED the value rather than dragging it: a typed number is a claim
 * about the physical world, a dragged one is an estimate. */
export function DimensionReadout({
  value,
  confirmed,
  className,
}: {
  value: string;
  confirmed?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'border-border bg-elevated tabular-nums text-small inline-flex items-center gap-1.5 rounded-sm border px-2 py-1',
        confirmed ? 'text-confirmed' : 'text-derived',
        className
      )}
    >
      {value}
      <span className="text-caption text-muted">{confirmed ? 'measured' : 'estimated'}</span>
    </span>
  );
}
