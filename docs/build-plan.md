# Build plan — plot

> Phase 5 artifact. The slices, the order, and which of them can run at the same time.
> The blueprint references "the build plan's wave table" but never defines the document.
> This is that document.

**Status:** draft
**Last amended:** 2026-08-20 — written

---

## 0. How to read this

Every row in §3 is a **vertical slice**: schema → server → UI → merged → deployed. Not a layer.
A slice is finished when it can be demoed on its own, by the definition in §5.

§4 is the **wave table** — which slices may be in flight at once. Two or three, never eight.
Within a wave, merge order still matters and is stated; parallel means *built* in parallel, not
merged in any order.

---

## 1. Before slice 0 — the ground that does not exist yet

**Closed 2026-08-20.** Slice 0 is unblocked.

**Production host: `https://plot-steel.vercel.app`.** `NEXT_PUBLIC_SITE_URL` and `BETTER_AUTH_URL`
are both set to it on Vercel and both left blank locally, where auth resolves per request. Every
var in `.env.local` goes on the deploy — **including `REPLICATE_API_TOKEN`**, which the boilerplate's
inherited comment wrongly described as local-only; see the row below.

| | What | Why it blocks |
|---|---|---|
| ☑ | A Neon project for plot | Every slice writes something. `withered-violet-63924132`, own project — **not** groundwork's, which has real address data on it |
| ☑ | `.env.local` with `DATABASE_URL`, `BETTER_AUTH_SECRET`, `ANTHROPIC_API_KEY` | `env.ts` throws at boot without them. `BETTER_AUTH_SECRET` generated fresh for plot, not shared with any other project — a shared secret lets one app's session cookie replay against another. `ANTHROPIC_API_KEY` and `GOOGLE_MAPS_API_KEY` reused from the same Google/Anthropic accounts groundwork uses |
| ☑ | `GOOGLE_MAPS_API_KEY` **added to `src/lib/env.ts`** | Was not in the schema; added as required, since address-in is slice 1 and nothing else in the critical path substitutes for it |
| ☑ | `REPLICATE_API_TOKEN` (`.optional()` in `env.ts`, by the degradation contract) | Filled from the same Replicate account. **A runtime production credential — it must be set on Vercel**, since the Look view calls Replicate on demand from `POST /api/projects/:slug/render`. `.optional()` only means a missing key darkens that one view instead of failing boot. Wave 3 still owns picking the actual model |
| ☑ | `npx drizzle-kit migrate` — applies `drizzle/0001_harsh_demogoblin.sql` | Applied and verified against `information_schema` — all five domain tables present with the right columns. A real write was round-tripped through `/api/auth` and confirmed in the DB, then deleted as test data |
| ☑ | A Vercel project pointing at `main` | "Deployed" is half of done. Live at **https://plot-steel.vercel.app** — no custom domain yet, which is the deliberate no-domain-yet case in `door-and-app.md` |

**One bug found provisioning this**, fixed rather than worked around:
`BETTER_AUTH_URL: z.string().url().optional()` in `src/lib/env.ts` rejected `KEY=` (empty string)
as an invalid URL — the exact footgun the file's own comment warns about, just not applied to this
one var. `NEXT_PUBLIC_SITE_URL` already goes through `optionalUrl`, which treats `''` as absent;
`BETTER_AUTH_URL` now does too. Same bug likely exists in `modryn-base` and any other project built
from it before this fix.

**No domain yet, deliberately** — `door-and-app.md`'s no-domain case: ship on the generated Vercel
URL and buy the domain when there is something worth pointing at it. Buying it later moves
`NEXT_PUBLIC_SITE_URL`, `BETTER_AUTH_URL` and any registered OAuth redirect URI together, which is
the one-time cost that case accepts up front.

It stays out of search **via a global `noindex` in the layout metadata, not a `Disallow`** —
`src/app/robots.ts` already allows crawling, and that is correct and deliberate: the crawler has to
fetch the page to see the directive. Do not "fix" it by disallowing in `robots.txt`.

---

## 2. Two open decisions, closed here

**Does signup gate the base plan? → Yes, signup comes first.**

The argument for the other way is real: making someone create an account before they learn whether
we even have their parcel reads as a trap. But `property.userId` is `NOT NULL` and unique by
design, so an anonymous base plan means a second code path that derives, renders and holds a
property nobody owns — real complexity, in the very first slice, for a conversion problem v1 does
not have. v1 is Wisconsin-only and dogfooded on one lot.

What signup-first actually costs is the question *"do you even cover me?"*, and two things already
answer it without an account: the Wisconsin notice, which the spec requires **before the address
field**, and **S16, the sample property**. That moves S16 out of polish — it is now load-bearing,
and it is the only thing a signed-out visitor can do. Recorded as such in §3.

**Permits and easements? → Surface as a warning, not a lookup.**

`yard/docs/discovery.md` names easements as one of four things that sink amateur projects, and we
already hold the parcel boundary, so a setback warning costs a comparison we can already do. A
real permit lookup is 72 county jurisdictions and is not v1. Lands in the `site` slice.

Still open, and each blocks a specific wave — see §4:
generation model · render faithfulness · plant palette source · guide count · guide grounding.

---

## 3. The slices

| # | Slice | Stories | Done when |
|---|---|---|---|
| 0 | `ground` | S15 | Deployed to Vercel, migration applied, one row read from Neon and rendered, commit SHA on screen |
| 1 | `address` | S1 | An address in Wisconsin returns a parcel boundary, house footprint and scaled aerial, saved as a property |
| 2 | `site` | S2 | Sun, slope, aspect, soil and zone are shown for that property; water is entered by hand; the owner confirms |
| 3 | `home` | S11, S13 | The property has a home screen listing its projects, and reopening one lands where you left it |
| 4 | `photos` | S12 | Photos upload to the property and are viewable |
| 5 | `plan` | S4 | A project exists with the four-view shell, and shapes can be drawn on the base plan at real size |
| 6 | `look` | S3 | A photo of the spot comes back rendered the way it was asked for |
| 7 | `takeoff` | S6, S7 | The drawn plan produces a quantity list, and the two or three numbers that matter can be tape-confirmed |
| 8 | `plants` | S5 | Plants place at mature size on the plan, not nursery size |
| 9 | `build` | S8 | Tools, ordered steps and check gates for the project type |
| 10 | `trace` | S1 fallback | A property with no parcel coverage can be traced by hand on the aerial |
| 11 | `looks` | S10 | Generated looks are kept and comparable |
| 12 | `complete` | S9 | Completing a project writes it into `property.existing` and the next project sees it |
| 13 | `sample` | S16 | A signed-out visitor can open a finished sample property and move through all four views |
| 14 | `export` | S14 | Takeoff and build guide print and export legibly |
| 15 | `outdoor` | §1b | Every outdoor screen audited on a real phone, in sun, one-handed, against the seven §1b criteria |

### Notes that change how a slice is built

**0 · `ground`** — the walking skeleton the blueprint asks for on day one. Also establishes the
route conventions while exactly one screen exists, because that is when it is one file to move:
every screen gets a named route, `/` is not one of them, and `/` **307**s — never 308 — to the
home when signed in and `/login` when not. `src/app/page.tsx` is the holding page until slice 3
gives it somewhere to go.

**1 · `address`** — read `modryn-builds/yard`'s `src/lib/parcel.ts`, `site-imagery.ts` and
`geo.ts` before writing any of it. The projection maths is the part most likely to be got subtly
wrong twice. Handles the not-found case **honestly** — says so, offers to continue on imagery
alone — but does not build the trace tool; that is slice 10, once a canvas exists to trace on.

**2 · `site`** — yard also has `solar.ts`, `soil.ts` and `climate.ts`. Everything here writes
`property.derived`; the confirm screen writes `property.confirmed`. **These are two columns and
they never merge.** A value a source returned is not a value the owner measured, and the whole
product's claim to trustworthy numbers rests on the app knowing which it is holding.

**5 · `plan`** — the long pole, and the slice that makes wave 3 parallel at all: it ships the
**four-view shell with three empty states**, so `look`, `takeoff` and `plants` each own one view
file instead of three worktrees fighting over one screen. Empty states are required by the
definition of done regardless, so this costs nothing extra.

**6 · `look`** — the two-surface rule is enforced here or nowhere: **no quantity may ever be
derived from the photo.** Renders are polled, not queued (recorded as known debt in
`architecture.md` §6).

**13 · `sample`** — promoted out of polish by §2. It is the entire signed-out experience.

**15 · `outdoor`** — the phase-3 gate item still unticked: the rack has never been opened on a
real phone outdoors. Runs alone, at the end, and can send work back into any slice.

---

## 4. Wave table

Three in flight is the ceiling. `→` means merge order inside the wave.

| Wave | In flight | Merge order | Blocked on |
|---|---|---|---|
| **0** | `ground` | — | §1 checklist |
| **1** | `address`, `site` | `address` → `site` | wave 0 |
| **2** | `home`, `photos`, `plan` | `home` → `photos` → `plan` | `address` merged |
| **3** | `look`, `takeoff`, `plants` | any | `plan` merged (the shell) · **decisions:** generation model + faithfulness (`look`), plant palette source (`plants`) |
| **4** | `build`, `trace`, `looks` | any | wave 3 · **decisions:** guide count + grounding source (`build`) |
| **5** | `complete`, `sample`, `export` | `complete` → `sample` | wave 4 |
| **6** | `outdoor` | — | everything |

**Why `site` merges second in wave 1** — its derivation libraries are independent files and can be
written the whole time, but it cannot be *demoed* without a property to derive from, and the gate
is that every merged slice is independently demoable.

**Why wave 2 is three-wide** — `home`, `photos` and `plan` touch different trees
(`/properties/[id]`, asset upload, `/projects/[slug]`). `plan` will outlast the other two; that is
the point of running them alongside it rather than after.

**Why `complete` waits for `build`** — a project becomes part of the property when it is finished,
and the build gates are what finish it.

---

## 5. Definition of done — plot's version

The blueprint's seven, plus three this product earns:

- [ ] Works
- [ ] Handles the error case — **including the external source being down.** `architecture.md` §2
      names a failure mode for every one of them; the slice implements the named one.
- [ ] Handles the empty case
- [ ] Works on mobile
- [ ] Matches the design system — `playbooks/design-rules.md` is the authority, not
      `docs/design-system.md`, which defers to it
- [ ] Merged
- [ ] Deployed
- [ ] **Derived and confirmed are never conflated** — in the schema, in the UI, and in the copy
- [ ] **No quantity is derived from a photo** — the two-surface rule, checked per slice
- [ ] **If the screen is used outdoors, it meets §1b** — 44px targets, AA contrast in sun, work
      preserved on failure. Slice 15 audits; every slice before it is written as if it will.

---

## 6. Working rules for this repo

- **One worktree per slice**, cut from `origin/main`. `.worktreeinclude` already names `.env.local`
  and `"dev": "next dev"` is unpinned — both already correct, do not regress them.
- **`main` stays deployed. No `dev` branch.**
- **One concern per commit.**
- **Tests where they earn their keep** — heavy on `geo.ts`, the takeoff quantity maths and the
  derived/confirmed boundary; light on UI chrome. Untested material quantities are the version of
  "untested payment math" this product has: a wrong number here is a wasted delivery.
- **`drizzle-kit generate`, never `push`.**

---

## 7. Progress log

Appended as slices merge — commit SHA, date, what shipped, what it cost against the estimate.
Feeds `blueprint-instrumentation.md` at the phase 7 retro.

| Slice | Merged | SHA | Notes |
|---|---|---|---|
| 0 `ground` | 2026-08-21 | `cb575c8` | `/` 307s to `/login` when signed out; renders a real authUser row read through drizzle plus the deployed commit SHA when signed in. No estimate was set to measure against -- this is the first entry. |

---

## Phase 5 gate

- [ ] Every merged slice is independently demoable
- [ ] `main` is deployed and the SHA on screen matches it
- [ ] The §1 ground checklist is fully ticked
- [ ] No slice merged with an open item in §5
