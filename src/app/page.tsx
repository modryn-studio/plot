import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { site } from '@/config/site';
import { auth } from '@/lib/auth';
import { db, authUser } from '@/lib/db';
import { getCommitSha } from '@/lib/build-info';
import { loginWithNext } from '@/lib/next-path';

/* THE DOOR AND THE ROUTE CONVENTION, SET WHILE THIS IS THE ONLY SCREEN (build-plan.md slice 0).
 *
 * `/` 307s to `/login` when signed out. It does NOT yet 307 anywhere when signed in, and that is
 * not an oversight — `HOME` (lib/next-path.ts) already points at `/`, because there is no other
 * screen for it to point at until slice 3 (`home`) ships one. So today `/` IS home: this file is
 * simultaneously the door and the only room behind it. When slice 3 lands, `HOME` moves to the
 * real home route and this file becomes a redirect with no content of its own, matching the
 * target convention the build plan states outright: every screen gets a named route, `/` is not
 * one of them.
 *
 * `redirect()` throws a `NEXT_REDIRECT` and Next answers it with 307, never 308, by default in a
 * Server Component — see node_modules/next/dist/docs/.../redirect.md. No proxy.ts needed: Proxy's
 * own docs say it should not be the session/authorization mechanism, only an optimistic check in
 * front of one, and every other gated surface in this app (require-admin.ts) already does the
 * real check here, in the Server Component. One pattern, one place it can go wrong. */
export const dynamic = 'force-dynamic'; // a session check and a DB read; never let this cache

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(loginWithNext('/'));

  /* THE WALKING SKELETON'S PROOF (build-plan.md slice 0's done-when: "one row read from Neon and
     rendered, commit SHA on screen"). This queries authUser through OUR OWN db.ts/schema.ts, not
     through Better Auth's internal adapter call that already ran above — a separate code path
     that proves env.ts, the Neon connection and Drizzle's schema all resolve end to end, using a
     row that is genuinely there rather than data invented for the occasion. */
  const [account] = await db
    .select({ email: authUser.email, createdAt: authUser.createdAt })
    .from(authUser)
    .where(eq(authUser.id, session.user.id))
    .limit(1);

  const sha = getCommitSha();

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-6 py-16">
      <h1 className="text-title1 text-balance">{site.name}</h1>
      <p className="text-subtitle1 text-muted mt-4 text-pretty">{site.description}</p>
      <p className="text-body1 text-muted mt-10">Still being built, and not open for signups yet.</p>

      {account && (
        <p className="text-metadata1 text-muted mt-6">
          Signed in as {account.email} · account created{' '}
          {account.createdAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
          {sha && <> · {sha.slice(0, 7)}</>}
        </p>
      )}
    </main>
  );
}
