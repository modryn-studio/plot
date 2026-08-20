import { Spinner } from '@/components/ui/spinner';

// Loading state for /admin, the one route here that actually waits on something (a session check
// plus a DB read). Deliberately quiet: a full-screen brand animation on every navigation is a
// cost the user pays for nothing.
//
// IT LIVES HERE RATHER THAN AT THE APP ROOT, and that is not a preference. A loading.tsx wraps its
// whole segment in a Suspense boundary, and past roughly 50KB of streamed payload that boundary
// stops finishing hydration: effects run, state updates, the DOM never changes, and NOTHING is
// logged. No hydration warning, no console error, no failed request. The page renders as static
// HTML and every interactive thing on it is dead.
//
// Found on /kitchen-sink (2026-08-18), which is large enough to cross the line. It reproduced in
// `next build` + `next start`, not only in dev, and bisected cleanly: 3 sections (~48KB) hydrated,
// 5 sections (~80KB) did not, regardless of which sections made up the bulk. Moving this file off
// the app root fixed it with no other change.
//
// So: add a loading.tsx to a segment that genuinely waits on data. Do NOT put one at the app root
// for completeness. It silently caps how big any page in the project is allowed to be.
export default function Loading() {
  return (
    <div className="text-muted flex min-h-dvh items-center justify-center" role="status" aria-label="Loading">
      <Spinner />
    </div>
  );
}
