// THE COMMIT SHA ON SCREEN, build-plan.md slice 0's walking-skeleton proof that what is deployed
// is actually what is on `main` — not a claim in a doc, a fact the page can show.
//
// VERCEL_GIT_COMMIT_SHA is a Vercel System Environment Variable, set automatically at build AND
// runtime on every deploy. Not in env.ts: it is not a secret and the app can boot without it —
// it is simply absent locally, which is the case the fallback below covers.
import 'server-only';
import { execSync } from 'node:child_process';

// LOCALLY, FALL BACK TO THE REAL GIT HEAD rather than showing nothing. Wrapped in try/catch
// because this also runs inside `next build`, which must never fail because some sandbox happens
// not to have `git` on PATH. This branch never executes on Vercel, where the env var is always
// set — so a failure here can only ever cost the SHA line locally, never the build.
function localGitSha(): string | null {
  try {
    return execSync('git rev-parse HEAD', { cwd: process.cwd() }).toString().trim();
  } catch {
    return null;
  }
}

/** The deployed commit, or the local HEAD in dev, or null if neither is available. */
export function getCommitSha(): string | null {
  return process.env.VERCEL_GIT_COMMIT_SHA ?? localGitSha();
}
