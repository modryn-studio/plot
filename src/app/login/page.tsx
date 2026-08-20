import { Suspense } from 'react';
import { Login } from '@/components/views/auth/login';
import { Spinner } from '@/components/ui/spinner';

// Identity-first: the login screen is the front door (route /login for now; enforcing it as the
// app entry for unauthenticated visitors is a follow-up, see GitHub issue #17).
//
// NO <main> HERE, AND NO LAYOUT EITHER. Login owns the landmark and the shell height. This file
// used to wrap it in a <main> while Login rendered a second one inside, which is two landmarks
// nested one inside the other: invalid, and a screen reader is left choosing between two "main"
// regions on the app's front door. The page is now only the boundary below.
//
// THE SUSPENSE BOUNDARY IS LOAD-BEARING, not decoration. Login reads `?next=` through
// useSearchParams, which Next requires a boundary above, or this route fails to prerender and
// takes the whole build down. It used to be satisfied by an app-root loading.tsx, silently and
// at a distance; that file had to move (it caps how large any page in the project can be, see
// src/app/admin/loading.tsx), and moving it broke the build here. Keeping the boundary next to
// the thing that needs it means the next person to move a file finds out from the comment
// instead of from a failed export.
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="text-muted flex min-h-dvh items-center justify-center"
          role="status"
          aria-label="Loading"
        >
          <Spinner />
        </div>
      }
    >
      <Login />
    </Suspense>
  );
}
