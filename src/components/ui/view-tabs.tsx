'use client';

import { cn } from '@/lib/cn';

/* THE SPINE OF THE PROJECT SCREEN: Look · Plan · Takeoff · Build.
 *
 * FOUR VIEWS OF ONE MODEL, taken from GrowVeg's `Plan | Plant List | Parts List | Notes` — which
 * is the pattern that makes quantities possible at all. The drawing is the truth; the lists are
 * reports ON the drawing. Get that relationship right and a takeoff falls out for free; get it
 * wrong and it is impossible, which is exactly why the AI render apps cannot produce one.
 *
 * THESE ARE NOT PAGES AND MUST NOT READ AS PAGES. Look and Plan are the same patio seen two ways —
 * one carries how it will look, the other how big it is. If the switch reads as navigation, the
 * user concludes they are using two tools that happen to share a login, which is the single
 * biggest craft risk in this product (walkthrough.md, "still guessing" #3).
 *
 * So the switch MOVES rather than cuts. `duration-base` with `ease-out`, and the shape stays put
 * across the transition wherever it can.
 *
 * A NOTE ON WHY THIS IS TABS AND NOT ROUTES. The spec gives the project one route with four views
 * precisely so that `/projects/[id]` is one thing in a log and in a funnel. Screens that are peers
 * get named routes; views of one object do not.
 */
export const PROJECT_VIEWS = ['Look', 'Plan', 'Takeoff', 'Build'] as const;
export type ProjectView = (typeof PROJECT_VIEWS)[number];

export function ViewTabs({
  active,
  onChange,
  disabled,
}: {
  active: ProjectView;
  onChange: (view: ProjectView) => void;
  /** Views that cannot be reached yet, with the reason as their title. */
  disabled?: Partial<Record<ProjectView, string>>;
}) {
  return (
    <div role="tablist" aria-label="Project views" className="border-border flex gap-1 border-b">
      {PROJECT_VIEWS.map((view) => {
        const on = active === view;
        const why = disabled?.[view];
        return (
          <button
            key={view}
            role="tab"
            aria-selected={on}
            disabled={Boolean(why)}
            title={why}
            onClick={() => onChange(view)}
            className={cn(
              'text-small -mb-px border-b-2 px-4 py-3 transition-colors',
              'disabled:pointer-events-none disabled:opacity-40',
              on
                ? 'border-text text-text font-medium'
                : 'text-muted hover:text-text border-transparent'
            )}
          >
            {view}
          </button>
        );
      })}
    </div>
  );
}
