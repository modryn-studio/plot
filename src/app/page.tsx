import { site } from '@/config/site';

// The door. One honest sentence until there is something to let people into — a marketing
// surface is a phase 7 job, and a landing page that oversells an unbuilt product is the first
// place a trust-led product can lose. Replaced once `/` has a home screen to redirect to
// (build-plan.md slice 0): signed in -> that home, signed out -> /login.
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-6 py-16">
      <h1 className="text-title1 text-balance">{site.name}</h1>
      <p className="text-subtitle1 text-muted mt-4 text-pretty">{site.description}</p>
      <p className="text-body1 text-muted mt-10">Still being built, and not open for signups yet.</p>
    </main>
  );
}
