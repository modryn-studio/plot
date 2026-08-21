'use client';

/* Login — the front door, rebuilt 2026-08-20 as a full-bleed splash.

   THE SHAPE: a backdrop of measured ground, the wordmark and one claim floating in the upper half,
   and the controls low in the frame where a thumb already is. It replaces a centred card, which was
   the right thing to ship before the product had anything to say about itself and the wrong thing
   to keep once it did. The first screen of a tool about looking at your property should be a piece
   of property, with the measuring already done to it.

   WHAT THIS SCREEN OWES THE HOUSE SYSTEM, since it is the first product screen in the repo and
   every later one will copy whatever it does:
   - Control heights are the stated ones. `size="lg"` is 48px, not the reference's ~56, and that
     clears spec §1b's 44px floor. The air on this screen comes from the GAPS, never from growing
     a control past its scale.
   - Radius is `rounded-md` (8px), the locked 4/8/12 scale. This reads squarer than the reference
     and that is plot's brand, not a shortfall: a drafting product reads better squarer.
   - No new tokens. Both scrim passes read `--color-bg`, which is what `bg-bg` compiles to anyway,
     so the ground under the photograph is literally the page's own ground.
   - `muted` stays metadata. The terms line is `text-body1` ink, not muted prose.

   EMAIL ONLY, FOR NOW. The Google button is COMMENTED OUT rather than deleted (Luke's call,
   2026-08-20): `GOOGLE_CLIENT_ID` is present-but-empty in `.env.local`, so the button that used to
   sit here rendered on a screen where it could not work. The provider stays wired and dark in
   auth.ts. There is no "Sign up" / "Log in" pair either, and that is not a simplification of the
   reference so much as an honest reading of what the server does: one emailed code both creates the
   account and signs it in. Two buttons would be two doors into one room.

   A code, not a magic link: a link signs in whichever device OPENS it, so requesting it at the desk
   and tapping it on the phone signs the phone in and leaves the desk waiting, and Gmail's in-app
   browser fails the same way. A code is read on one device and typed into the other.

   THIS SCREEN IS DARK IN BOTH THEMES, via `.dark` on its own root rather than a hardcoded palette.
   Ink over a photograph has to be light or it is not ink. Scoping the class re-points every token
   underneath it, so the controls stay exactly the components they are everywhere else.

   ITS CONSEQUENCE IS THAT THERE IS NO THEME TOGGLE HERE, and that was considered and rejected
   rather than forgotten. A toggle on a screen that looks identical either way is a control that
   demonstrably does nothing, which is worse than an absent one; layout.tsx already argues the same
   point about floating corner controls. The toggle lives in the account menu, behind the door. */

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { safeNext } from '@/lib/next-path';
import { site } from '@/config/site';
import { analytics } from '@/lib/analytics';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { CodeInput } from '@/components/ui/code-input';
import { TextField } from '@/components/ui/text-field';

type Busy = 'sending' | 'verifying' | null;

/* THE BACKDROP, AND WHY IT IS TWO FILES RATHER THAN ONE RESIZED.
 *
 * A phone is 9:16 and a laptop is 16:9. `object-cover` on one image cannot serve both: a portrait
 * frame dropped into a landscape viewport crops to its middle band, which is exactly the part this
 * composition needs to stay empty, and the parcel that was carefully placed in the upper third ends
 * up off screen. So there are two compositions, picked by `<picture>` rather than by CSS, because a
 * `<source media>` guarantees the browser fetches exactly ONE of them.
 *
 * EITHER CAN BE `null`, AND null IS A FINISHED SCREEN RATHER THAN A PLACEHOLDER: the gradient below
 * is the same one the photograph sits under, so dropping the files in changes the picture without
 * changing the layout, the legibility or the scrim.
 *
 * THE FILES ARE GENERATED, NOT PHOTOGRAPHED, and they have to be: this screen renders BEFORE the
 * session exists, so it is the one page a signed-out stranger is supposed to reach, which makes
 * anything in it public by definition. A real property's imagery is database-only and session-gated
 * for exactly that reason, so a backdrop here can only ever be scenery, never anyone's lot.
 *
 * `webp`, AND KEPT SMALL ON PURPOSE. This is the one image this repo ships to a phone before any
 * session exists, on whatever connection that phone happens to have, and per spec §1b that
 * connection is a back yard behind a house.
 */
const BACKDROP_PORTRAIT: string | null = '/login/backdrop-portrait.webp';
const BACKDROP_LANDSCAPE: string | null = '/login/backdrop-landscape.webp';

// Seconds the Resend button stays disabled. Matches OTP_SEND_COOLDOWN_MINUTES on the server, so a
// legitimate resend never silently hits the server-side throttle and returns nothing.
const RESEND_COOLDOWN = 60;

/* THE CODE STEP SURVIVES A RELOAD (Luke, 2026-08-03: "im locked out unless i submit a new email
 * code").
 *
 * `step` and `email` were plain component state, so a refresh - or a hot reload, or wandering off
 * to the inbox in the same tab and coming back - dropped the user onto the email form with a
 * perfectly good code sitting in their inbox and NO WAY TO TYPE IT. The code stays valid for 15
 * minutes; the screen that accepts it lasted until the next render. Asking for a second code is
 * then the only way forward, which is both a dead end for the user and a way to walk into the
 * server's own send throttle.
 *
 * sessionStorage, not localStorage: this is a per-tab, in-flight step, not a preference. It expires
 * with the code it belongs to, so a stale entry can never strand someone on a code step whose code
 * is already dead.
 *
 * THE CODE ITSELF IS NEVER STORED - only the address it went to and when. The digits are the
 * credential; keeping them in a place a later script could read is exactly the trade this product
 * does not make. */
const PENDING_KEY = 'otp_pending';
const OTP_TTL_MS = 15 * 60 * 1000;

type Pending = { email: string; sentAt: number };

function readPending(): Pending | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<Pending>;
    if (typeof p.email !== 'string' || typeof p.sentAt !== 'number') return null;
    if (Date.now() - p.sentAt >= OTP_TTL_MS) return null;
    return { email: p.email, sentAt: p.sentAt };
  } catch {
    // A quota error, a private-browsing lockout, or somebody else's JSON. Not being able to restore
    // is a worse screen, never a broken one.
    return null;
  }
}

function writePending(email: string) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ email, sentAt: Date.now() }));
  } catch {
    /* see readPending */
  }
}

function clearPending() {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* see readPending */
  }
}

/* 404 GETS ITS OWN LINE BECAUSE IT HAS A SPECIFIC CAUSE WORTH NAMING: the email-otp plugin only
 * mounts when the SMTP credentials exist, so on a deployment missing them the route is simply not
 * there. "Try again" is the one instruction guaranteed not to help, and with Google commented out
 * this is now the only door in the building. Everything else stays generic, because an
 * unrecognised failure has nothing useful to say and a stack-shaped string is worse than a
 * sentence. */
function sendErrorMessage(status?: number): string {
  if (status === 429) return 'Too many tries. Wait a minute, then try again.';
  if (status === 404) {
    return 'Email sign-in is not configured on this deployment. The mail credentials are missing.';
  }
  return 'We could not send that code. Please try again.';
}

export function Login() {
  /* WHERE THIS SIGN-IN IS HEADED. `?next=` is set by the app's auth gate when it turns a signed-out
     visitor away from a real URL, so signing in returns them to the page they asked for rather than
     dropping them on the home screen.
     Read through `safeNext`, which is the same guard the gate writes with - the parameter is
     attacker-supplied by construction, and an unchecked one would let a link like
     `plot.app/login?next=https://evil.example` hand a freshly authenticated user to somebody
     else's page. See lib/next-path.ts.
     `useSearchParams` needs a Suspense boundary above it, which login/page.tsx provides explicitly. */
  const next = safeNext(useSearchParams().get('next'));
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'form' | 'code'>('form');
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const verifyingRef = useRef(false);
  // Set by onBack while a send/resend is in flight, so that request's success or failure - which
  // resolves after the user has already left the code step - can't silently drag them back to it
  // (or paint a stale error) once it lands. Cleared at the top of every new sendCode call.
  const abandonedRef = useRef(false);

  // Top of the funnel. Empty deps: once per mount, not per re-render - otherwise every
  // keystroke in the email field would count as another view.
  useEffect(() => {
    analytics.loginViewed();
  }, []);

  /* Put the user back on the code step if one is still live. In an effect rather than a lazy
     useState initializer, because sessionStorage does not exist on the server and seeding state
     from it would hydrate a different tree than was rendered. Costs one frame of the email form. */
  useEffect(() => {
    const pending = readPending();
    if (!pending) return;
    setEmail(pending.email);
    setStep('code');
    // What is LEFT of the resend cooldown, not a fresh 60. A user who waited two minutes before
    // reloading should not be told to wait another minute.
    const elapsed = Math.floor((Date.now() - pending.sentAt) / 1000);
    setCooldown(Math.max(0, RESEND_COOLDOWN - elapsed));
  }, []);

  // Resend countdown. Re-arms itself each tick rather than running one interval, so it can never
  // outlive the component or keep firing after it reaches zero.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  /* GOOGLE IS COMMENTED OUT, NOT DELETED (Luke, 2026-08-20). GOOGLE_CLIENT_ID is present-but-empty
     locally, so auth.ts never mounts the provider and this handler had nothing to call. Restoring
     it is this block plus the button below plus the mark at the bottom of the file, and nothing
     else.

  async function withGoogle() {
    // Intent, not success. `signup_completed` is recorded server-side in auth.ts, where it
    // cannot be spoofed or lost to an ad blocker; the gap between the two is the drop-off.
    analytics.signupStarted('google');
    setBusy('google');
    setError(null);
    try {
      // Better Auth resolves with { error } rather than throwing; on success it redirects away.
      // safeNext defaults to HOME (lib/next-path.ts) - never '/login', or signing in bounces back
      // to this screen.
      const res = await authClient.signIn.social({ provider: 'google', callbackURL: next });
      if (res?.error) {
        setError('Something went wrong. Please try again.');
        setBusy(null);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setBusy(null);
    }
  }

  */

  // Used by both the first send and Resend. `resend` only changes which analytics beat fires and
  // whether we are already on the code step.
  async function sendCode(resend = false) {
    const address = email.trim();
    if (!address) return;
    abandonedRef.current = false;
    if (!resend) analytics.signupStarted('email');
    setBusy('sending');
    setError(null);
    try {
      // Better Auth resolves with { error } rather than throwing, so a failed send must NOT fall
      // through to the "we sent you a code" state.
      const res = await authClient.emailOtp.sendVerificationOtp({
        email: address,
        type: 'sign-in',
      });
      // The user clicked "Use a different email" while this was in flight - don't paint this
      // response over a screen they already left.
      if (abandonedRef.current) return;
      if (res?.error) {
        setError(sendErrorMessage(res.error.status));
        setBusy(null);
        return;
      }
      writePending(address);
      setStep('code');
      setCode('');
      setCooldown(RESEND_COOLDOWN);
      // Forces CodeInput to remount (see its `key` below) so autoFocus fires again. Without this,
      // a resend leaves focus sitting on the "Send a new code" button instead of the boxes, since
      // `step` never actually changes value across a resend and React has no other reason to
      // recreate the input.
      setSentCount((n) => n + 1);
    } catch {
      if (!abandonedRef.current) setError('We could not send that code. Please try again.');
    } finally {
      setBusy((b) => (b === 'sending' ? null : b));
    }
  }

  async function verify(otp: string) {
    // Ref, not the `busy` state: onComplete fires from an input event, and `disabled` only takes
    // effect on the next render. A fast second paste in that gap would submit twice and burn one
    // of the three allowed attempts on a code that was already in flight.
    if (verifyingRef.current) return;
    verifyingRef.current = true;
    setBusy('verifying');
    setError(null);
    try {
      const res = await authClient.signIn.emailOtp({ email: email.trim(), otp });
      if (res?.error) {
        // Clear the boxes: leaving a rejected code in place invites re-submitting the same digits.
        setCode('');
        setError(
          res.error.status === 429
            ? 'Too many tries. Wait a minute, then try again.'
            : 'That code is wrong or expired. Check your email, or send a new one.'
        );
        setBusy(null);
        verifyingRef.current = false;
        return;
      }
      // Signed in, so the pending step is spent. Cleared before the navigation rather than after:
      // there is no "after" once the document is replaced.
      clearPending();
      // Full navigation, not router.push: the session cookie is set on this response, and a hard
      // load guarantees every server component reads it rather than a cached signed-out render.
      // The ref is deliberately NOT released here: the page is leaving, and re-enabling the input
      // during the navigation would let a stray keystroke fire a second sign-in.
      window.location.assign(next);
    } catch {
      setCode('');
      setError('Something went wrong. Please try again.');
      setBusy(null);
      verifyingRef.current = false;
    }
  }

  return (
    /* `dark` scopes the dark palette to this screen in both themes, see the file header. `bg-bg`
       under it so overscroll on iOS reveals this screen's own ground rather than the app's.

       `text-text` IS LOAD-BEARING AND IS NOT REDUNDANT WITH `dark`. Scoping the class re-points the
       custom properties, but `color` is INHERITED: `html` already resolved `var(--color-text)` to
       the LIGHT value in the base layer, and every descendant inherits that computed colour rather
       than re-reading the variable. Without this the palette flips underneath text that stays
       near-black, and the wordmark and claim render at roughly 1.1:1 against their own ground:
       present in the DOM, invisible on the screen, lint-clean and type-clean. Naming the colour
       here forces one re-resolution against the dark tokens and everything inherits from that.
       Any future subtree that scopes a theme needs the same pair. */
    <div className="dark bg-bg text-text relative min-h-dvh">
      <Backdrop />

      {/* `relative` to sit above the backdrop's stacking context without a z-index: both are
          positioned and this one comes second, which is the whole rule. */}
      <main className="relative flex min-h-dvh flex-col px-6 pt-16 pb-10 md:pb-16">
        {/* THE HERO TAKES THE SLACK. `flex-1` means it absorbs whatever height is left after the
            controls, so the lockup sits at the optical centre of a tall phone and the form stays
            pinned to the thumb on a short one, with no breakpoint deciding between them. */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8">
          {/* THE WORDMARK IS THE SANS AND THE CLAIM IS THE SERIF, which is each face doing its own
              job rather than a style choice: the interface is Inter and the serif is reserved for
              headings (layout.tsx). Set small, uppercase and widely tracked, so the identity reads
              as a mark rather than as a sentence competing with the one below it.
              `tracking-widest` is Tailwind's own scale step, not an invented token: plot clears no
              namespaces, so the stock tracking utilities are live and a wordmark does not earn a
              token of its own until a second screen needs one. */}
          <p className="text-body0-medium tracking-widest uppercase">{site.name}</p>

          {/* THE CLAIM IS THE <h1>, NOT THE WORDMARK. The document is already titled "Plot" by the
              layout's metadata, so the page's one heading should be what the page is ABOUT. It is
              also set larger than the mark above it, which is the reference's best move: the
              message outranks the identity on the only screen a stranger ever sees.
              `text-balance` so the wrap is even rather than leaving one orphaned word. */}
          <h1 className="text-title1 md:text-title0 max-w-md text-center text-balance">
            Know your property before you build on it
          </h1>
        </div>

        {/* The controls, low in the frame. `max-w-sm` so the column never stretches to a tablet's
            full width, and centred within whatever is left. */}
        <div className="mx-auto w-full max-w-sm">
          {/* ONE ERROR SLOT, DIRECTLY ABOVE THE CONTROLS THAT PRODUCE IT. It used to sit at the top
              of a card because a Google failure originated above the form; with one path left, the
              message belongs next to the thing that failed. */}
          {error && <p className="text-body1 text-danger mb-4 text-center">{error}</p>}

          {step === 'code' ? (
            <CodePanel
              key={sentCount}
              email={email.trim()}
              code={code}
              onCode={(v) => {
                setCode(v);
                // Drop the rejected-code message the moment they start retyping, so the boxes
                // don't sit red underneath a fresh attempt.
                if (error) setError(null);
              }}
              onComplete={verify}
              verifying={busy === 'verifying'}
              invalid={Boolean(error) && busy !== 'verifying'}
              cooldown={cooldown}
              sending={busy === 'sending'}
              onResend={() => void sendCode(true)}
              onBack={() => {
                abandonedRef.current = true;
                clearPending();
                setStep('form');
                setCode('');
                setError(null);
              }}
            />
          ) : (
            <>
              {/* GOOGLE, COMMENTED OUT RATHER THAN DELETED. Restoring it means uncommenting this,
                  the handler above and the mark at the bottom of the file, and deciding what
                  separates it from the email form: the reference uses an "OR" between rules, and
                  `rule` measures 1.19 on elevated, which would be invisible here.

              <Button
                onClick={withGoogle}
                loading={busy === 'google'}
                disabled={Boolean(busy)}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                <GoogleMark />
                Continue with Google
              </Button>

              */}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendCode();
                }}
                className="flex flex-col gap-3"
              >
                {/* TextField, not a bare Input with an aria-label: this screen used to render zero
                    <label> elements. `labelHidden` because the placeholder and the button under it
                    leave nothing ambiguous, and a visible label would be the only one on a screen
                    that is otherwise a photograph. */}
                <TextField
                  label="Email address"
                  labelHidden
                  type="email"
                  required
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    // Clear a stale failure as soon as the user acts on it.
                    if (error) setError(null);
                  }}
                  placeholder="Enter your email"
                />
                <Button
                  type="submit"
                  loading={busy === 'sending'}
                  disabled={Boolean(busy)}
                  size="lg"
                  className="w-full"
                >
                  Continue with email
                </Button>
              </form>

              {/* PROJECT TODO: these two need real pages before this is public.
                  `text-body1` ink rather than `muted`: this is prose the reader is being asked to
                  agree to, and muted is reserved for metadata. */}
              <p className="text-body1 mt-6 text-center">
                By continuing you agree to our Terms and Privacy Policy.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* THE GROUND UNDER THE SCREEN, in three layers, and every colour in it is a token.
 *
 * 1. `bg-bg`, so this is a finished screen with no photograph at all.
 * 2. the photograph, if there is one.
 * 3. a scrim, which is what makes ink legal over an image whose contents nobody controls.
 *
 * THE SCRIM IS TWO PASSES, NOT ONE, AND EACH HAS ITS OWN JOB. Pass one is a flat dim, and it is
 * what makes the wordmark and the claim legal over open ground. Pass two is a vertical fade to the
 * page ground, and it is what makes the controls legal: the bottom of this screen is not a darkened
 * photograph, it is the app's own background, which the photograph dissolves into. One pass cannot
 * do both, because the amount of darkness a 16px placeholder needs would leave nothing of the
 * picture anywhere else.
 *
 * BOTH PASSES ARE `--color-bg` RATHER THAN A FRESH BLACK, so this adds no token to the system. The
 * screen is `.dark`-scoped, so that resolves to #12110f here, and a second opinion about what
 * "darkened" means would drift from the page ground the moment either changed.
 *
 * THE FADE IS AN INLINE `linear-gradient`, deliberately. Tailwind's gradient utilities take their
 * stops from the `--color-*` namespace and there is no `transparent` token to resolve, so
 * `from-transparent` compiles to nothing. Reaching for the CSS variable directly is not an escape
 * from the token system, it IS the token: `var(--color-bg)` is the same value `bg-bg` compiles to.
 *
 * THE STOPS DIFFER BY ORIENTATION because the compositions do. On a phone the hero sits high and
 * the controls sit low, so the fade can start near the middle. On a laptop there is far less
 * vertical room below the lockup, so the fade starts later and finishes harder or the controls end
 * up sitting on picture rather than on ground.
 */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="bg-bg absolute inset-0" />

      {/* <picture>, NOT A CSS background-image, and not two divs toggled by a breakpoint. A
          `<source media>` guarantees the browser resolves exactly ONE candidate and fetches only
          that file. Toggling two background divs with `md:hidden` relies on browsers skipping the
          fetch for a display:none element, which is true in practice and is not a guarantee, and
          this is the one image that loads before any session exists.
          A plain <img> rather than next/image: the optimizer cannot compose with <picture> art
          direction, and these are pre-sized, pre-encoded static assets with nothing left for it to
          do. (`no-img-element` is not enabled in this repo's config, so there is no rule to
          silence here. If a future Next config turns it on, this comment is the justification.) */}
      {(BACKDROP_PORTRAIT || BACKDROP_LANDSCAPE) && (
        <picture>
          {BACKDROP_LANDSCAPE && (
            <source media="(min-aspect-ratio: 1/1)" srcSet={BACKDROP_LANDSCAPE} />
          )}
          <img
            src={BACKDROP_PORTRAIT ?? BACKDROP_LANDSCAPE ?? ''}
            alt=""
            // The largest thing on the screen and the first paint. Nothing above it competes.
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      )}

      {/* PASS ONE: THE OVERALL DIM, CARRYING THE HERO. AND 65% IS MEASURED, NOT PICKED.
          This shipped at `opacity-40` for about an hour, which looked right and was not: composited
          against the real crop, the worst ground under the CLAIM measured 3.01:1 on a 375x812 phone
          and under the WORDMARK 4.32:1, both under the 4.5 bar. /kitchen-sink cannot see this,
          because it measures token against token and this is ink on a photograph.
          The sweep, worst-case pixel in each band, phone / desktop:
            40%  wordmark 4.32 / 4.52   claim 3.01 / 3.90
            55%  wordmark 6.12 / 6.34   claim 4.56 / 5.63   <- clears the bar with no margin
            65%  wordmark 7.77 / 7.99   claim 6.14 / 7.28   <- shipped
          55 clears 4.5 and was still rejected: spec §1b says this screen is read in direct
          sunlight, where a ratio that passes at a desk is a grey rectangle at noon, so the bar is
          the floor and not the target. The claim is large text and its formal AA bar is only 3:1;
          it is held to the body bar anyway for the same reason.
          65 rather than 62 because Tailwind's opacity scale steps in fives and an arbitrary value
          here would be a one-off number in a component, which is the thing the design system's
          lint rules exist to stop. The extra 3% costs nothing visible. */}
      <div className="bg-bg absolute inset-0 opacity-65" />

      {/* Pass two: the ground under the controls. Transparent through the hero, fully the page's
          own background by the time it reaches the form. */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, transparent 38%, var(--color-bg) 82%, var(--color-bg) 100%)',
        }}
      />
      <div
        className="absolute inset-0 max-md:hidden"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, transparent 45%, var(--color-bg) 90%, var(--color-bg) 100%)',
        }}
      />
    </div>
  );
}

// Step 2: enter the mailed code. Deliberately text-title3, not a second masthead: a transactional step
// should not carry the same weight as the claim it replaced.
//
// No "Verify" button. The code is a fixed six digits, so the sixth keystroke is unambiguous intent
// and submitting for the user removes a step that exists only to be clicked. The button reappears
// as nothing but a spinner row while the check is in flight, so the wait is still visible.
function CodePanel({
  email,
  code,
  onCode,
  onComplete,
  verifying,
  invalid,
  cooldown,
  sending,
  onResend,
  onBack,
}: {
  email: string;
  code: string;
  onCode: (v: string) => void;
  onComplete: (v: string) => void;
  verifying: boolean;
  invalid: boolean;
  cooldown: number;
  sending: boolean;
  onResend: () => void;
  onBack: () => void;
}) {
  return (
    <div className="text-center">
      <p className="text-title3">Check your email</p>
      <p className="text-body0 mt-2">
        We sent a 6-digit code to {email}. It expires in 15 minutes.
      </p>

      <div className="mt-6">
        <CodeInput
          value={code}
          onChange={onCode}
          onComplete={onComplete}
          // Also disabled while a resend is in flight: the old code's digits are still sitting in
          // this input until the resend resolves (see the `key` remount above), and typing the 6th
          // one during that window would submit a code the server may already have replaced.
          disabled={verifying || sending}
          invalid={invalid}
          autoFocus
        />
      </div>

      {verifying && (
        <Button loading disabled size="lg" className="mt-4 w-full">
          Signing in
        </Button>
      )}

      <div className="text-body1 mt-6 flex flex-col gap-2">
        {/* Disabled-with-a-countdown rather than hidden: a missing button reads as "there is no way
            to get another one", which is the moment people give up and leave. */}
        <button
          onClick={onResend}
          disabled={cooldown > 0 || sending || verifying}
          className="link hover:text-accent transition disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
        >
          {cooldown > 0
            ? `Send a new code in ${cooldown}s`
            : sending
              ? 'Sending'
              : 'Send a new code'}
        </button>
        <button
          onClick={onBack}
          disabled={verifying}
          className="link hover:text-accent transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          Use a different email
        </button>
      </div>
    </div>
  );
}

/* Google's brand mark. Its four colors are fixed by Google's sign-in branding guidelines, so this
   is a deliberate exception to the palette (same call every reference login makes).
   COMMENTED OUT with its button, see the handler above.

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden className="shrink-0">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

*/
