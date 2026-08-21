## What plot is

A measured model of a homeowner's property, and what it lets them build.

They type their address; the app pulls their parcel boundary, house footprint and a scaled aerial
from public records, then derives hardiness zone, slope, aspect and a modelled monthly sun map.
They confirm it. They photograph the corner of the yard they are thinking about, draw a rough
shape on the photo, say what they want it to look like, and it renders that into their actual
picture. When they like it, they flip to the overhead plan and give the shape a real size, which
produces a shopping list with waste already in it and a build guide with tools, steps and the
checks between them. When they finish, it stays on the property, so next year starts from what is
already built.

**The two-surface rule is the core architectural decision.** The photo carries the *look*, the
plan carries the *size*, and they are the same project. A phone photo has no scale, so no quantity
can ever come from it; an overhead plan has real geometry but sells nobody on anything. Every
competitor picked one and lost the other.

**Used outdoors, on a phone, in sunlight, with dirty hands.** That is not colour on the brief, it
is the constraint behind the contrast floors, the target sizes and the press feedback.

---

## Where this is, right now

**Blueprint phases 1 and 2 are closed. Phase 3 (design system) is open again by choice. There is
no product code at all** — no property, no project, no takeoff, not a single product route or
table. Everything in `src/` is boilerplate plus the rack.

| Phase | State |
|---|---|
| 1 Discovery | passed — `docs/problem-brief.md` |
| 2 Definition | passed — `docs/spec.md` |
| 3 Design system | re-locked 2026-08-20 (colour, radius) and 2026-08-21 (face, type scale) — `docs/design-system.md`, and the reset note below |
| 4 Architecture | passed — `docs/architecture.md`; schema written and migration applied to a live Neon project |
| 5 Build | in progress — `docs/build-plan.md` §1 ground checklist closed 2026-08-20; deployed to **https://plot-steel.vercel.app**; slice 0 (`ground`) not yet started |

### The design system was reset on 2026-08-20, and this is the one thing to read first

An earlier pass (2026-08-17) built a bespoke token set and a single-file kitchen sink from
`modryn-hq@v4:playbooks/templates/design-system.md`. **`playbooks/design-rules.md` did not exist
yet.** It does now, and that pass violated it in several ways that all fail silently: shadows
declared directly in `@theme` (so every dark-mode shadow rendered its light value), a resting drop
shadow stacked under a border on the secondary button, `Card` inverted to border-without-shadow,
`rounded-sm` on form controls, and `--color-accent` deleted outright rather than recoloured.

So the whole design layer was replaced with `modryn-base`'s current one — `globals.css`,
`components/ui/`, `components/shell/`, `app/kitchen-sink/`, `layout.tsx`, `eslint.config.mjs`.
**Plot was then re-locked on the house system, and that work is DONE** — this paragraph used to say
re-locking was the next task, and it was already stale by the time anyone read it. `5ef19e3` locked
warm paper + cyanotype and `cc92710` settled `elevated`. Exactly the four permitted changes were
made and nothing else: the colour role VALUES, the semantics, the face, and the radius scale at
4/8/12. **`docs/design-system.md` is the record, and it is locked.**

**The face and the type scale were then re-locked again on 2026-08-21**, against onX Hunt's product
app read live rather than from screenshots: one face (Roboto, replacing the Source Serif + Inter
split) and a size-by-role type MATRIX replacing the eight size-named steps.

The eight product-specific components from that pass (`CallOut`, `FactRow`, `QuantityRow`,
`StepCard`, `PromptBar`, `ToolRail`/`ScaleBar`/`DimensionReadout`, `ViewTabs`, `NarratedProgress`)
were deleted with it. They were built ahead of any screen that needed them, on mechanics the house
rules ban. **Recoverable at commit `049cc4c` if the reasoning is wanted** — rebuild them against
the new system when a real screen asks, one sink section per primitive, same commit.

---

## The docs are the source of truth, not this file

| | |
|---|---|
| `docs/problem-brief.md` | Phase 1 — who this is for and why it cannot be cloned |
| `docs/spec.md` | Phase 2 — **what v1 is.** Point agents here, not at your memory of it |
| `docs/walkthrough.md` | The same spec as a story, for picturing the flow |
| `docs/design-system.md` | Phase 3 — short by design; `modryn-hq/playbooks/design-rules.md` is the authority it defers to |
| `docs/architecture.md` | Phase 4 — where every piece of state lives, and why |
| `docs/build-plan.md` | Phase 5 — **the slices, the order, and the wave table.** Start here to build |
| `docs/recon.md` | The competitive read, and why the category fails |
| `docs/reference/` | Per-product teardowns from live drives |

**Five decisions in `docs/spec.md` §6 are still open**, and none of them block slice 0 or 1 —
`build-plan.md` §4 names which wave each one blocks. The three that did block the start
(geography, signup gating, permits) were decided on 2026-08-20.

---

## Data sources — settled, and proven in another repo

| What | Source | Notes |
|---|---|---|
| Parcel boundary | WI Statewide Parcel DB (ArcGIS) | Free, no key, 72 counties. **Wisconsin only** — returns nothing outside rather than guessing a line you would measure off. |
| Aerial imagery | Google Static Maps satellite | z18–21, north-up Web Mercator, metres-per-pixel computed in closed form. |
| Sun | Google Solar API `monthlyFlux` | 12 bands, 0.5 m grid. **Modelled**, never presented as measured. |
| Slope + aspect | USGS 3DEP ImageServer | 1 m, no key, national. |
| Soil | USDA-NRCS Soil Data Access | Free, keyless, national. |
| Hardiness zone | USDA PHZM | Free, keyless. |
| Image generation | Replicate | Standing studio rule: check Replicate before adding any image provider. |

**`modryn-builds/yard` already implements the first six** — `src/lib/{parcel,site-imagery,solar,
soil,climate,geo}.ts`, about 900 lines, plus a tenancy-scoped `property-store.ts` reviewed and
found sound on 2026-08-20. **Read it before reimplementing any of this.** Yard is a separate
product and is not being merged in; it is prior art and a parts bin.

---

## Scar Tissue — the rules

Carried from `modryn-base` deliberately: this file is loaded into every session and a referenced
doc is not, so a rule that lives only in a playbook is a rule nobody enforces. The evidence behind
each lives in `modryn-hq@v4:playbooks/scar-tissue.md`.

**Stack**
- **DB scripts need BOTH flags:** `tsx --env-file=.env.local --conditions=react-server`.
- **Migrations: `drizzle-kit generate` + `migrate`, NEVER `push`.** One push makes `migrate` skip older migrations forever, silently.
- **A `'use client'` file may import TYPES from a db-backed module, never VALUES.** `import type` is erased and always safe.
- **Every export of a `'use client'` module becomes a client reference.** Shared constants live in a plain module; re-exporting does not launder them.
- **No pinned `BETTER_AUTH_URL` in dev** — `baseURL` resolves per request from `Host`.
- **Next.js 16 is not the Next.js in your training data.** Read `node_modules/next/dist/docs/` before writing framework code. `middleware.ts` is `proxy.ts` now, and the old name loads while warning.
- **TypeScript stays on 6**; 7.0 breaks typescript-eslint and takes `npm run lint` down.
- **Tailwind v4 has no config file.** `@theme` in `src/app/globals.css`, never `:root`, never `tailwind.config.*`.
- **API routes use `createRouteLogger`**; env vars go in `src/lib/env.ts` (zod, fail-fast).
- **An emailed code, not a magic link.**
- **`?next=` is attacker-supplied.** Always read it through `safeNext`; `startsWith('/')` is NOT enough.
- **A STALE TURBOPACK CACHE CAN DROP AN ENTIRE `@theme` NAMESPACE, SILENTLY.** After the 2026-08-21 type-scale rewrite the dev server served CSS where every `--text-*` token was absent and no `.text-*` utility existed, so all 27 roles rendered at an inherited 16px/400 and `/kitchen-sink` showed "no --text-title1 token" on every row — while `--color-*`, `--font-*`, `--radius-*` and `--shadow-*` from the SAME `@theme` block were fine. **The file was correct**: compiling it through `@tailwindcss/postcss` at the project's own version produced the right output. The tell was `.next/dev/static/chunks/` still holding font chunks for faces deleted hours earlier, and the likely trigger is `next build` writing into the same `.next` a live `next dev` is using. **Fix: stop dev, `rm -rf .next`, restart.** Do not go looking for the bug in `globals.css` first — compile it standalone through postcss and compare before touching a token.
- **NO `loading.tsx` AT THE APP ROOT.** Past ~50KB of streamed payload its boundary stops hydrating, silently.

**Design system** — the full set lives in `modryn-hq@v4:playbooks/design-rules.md`. **Read it
before touching a token, a primitive or the shell.** The ones that bite hardest:

- **A `@theme` shadow value must stay INDIRECT** (`--shadow-card: var(--elevation-card)`). Tailwind resolves a directly-declared `@theme` shadow at build time and bakes it into the utility, so the `.dark` override does nothing and every shadow renders its light value. **This repo shipped that bug on 2026-08-17.**
- **Scoping `.dark` to a SUBTREE only flips the LITERAL tokens; the DERIVED ones stay baked at their light values** unless `.dark` also restates them. `@theme` emits to `:root`, and a custom property's computed value has its `var()`s already substituted on the element that declares it, so `--color-accent-foreground: var(--color-elevated)` resolves against LIGHT elevated at `:root` and is inherited as that finished colour. `.dark` on `<html>` works only because html IS `:root`. **`/login` shipped this on 2026-08-20**: its primary CTA rendered the light label on the dark accent at **2.34:1**, and `pressed` flashed near-white. Fixed by restating the five derivations inside `.dark` in `globals.css` — those copies must stay character-identical to their `@theme` originals. **`/kitchen-sink` cannot catch this**, because it measures at the document level where the bug does not exist.
- **THE TYPE TOKENS ARE ROLES, NOT SIZES, and the old names are gone.** There is no `text-body`, `text-small`, `text-caption`, `text-h1/h2/h3` or `text-display` — they were replaced wholesale on 2026-08-21 by `title0-6` / `numeric1-2` / `subtitle1-4` / `body0-2` (+`-medium`/`-bold`) / `button1-3` / `metadata1`. A size and a weight are now two separate choices, so **never pair a type token with `font-medium`/`font-bold`** — pick the role that already carries the weight. Lint catches an invented token name; it cannot catch `text-body0 font-bold`, which is the old habit wearing new clothes. **Button labels are weight 900** via `text-button1/2/3`, which is the ported signature and not a typo. **Changing the type scale means editing `src/lib/cn.ts` in the SAME commit** — it registers the scale as tailwind-merge's `font-size` group, and a role missing from that list is classified as a COLOUR, so `cn('text-accent', 'text-body0')` silently returns `text-body0` and the ink disappears. Verified: the 2026-08-21 rename left the list stale and every colour+size `cn()` pair lost its colour. Nothing catches this - not tsc, not lint, not /kitchen-sink.
- **A control gets a border OR a drop shadow, never both**, and only `Card`, modals and popovers may cast a drop shadow at all. Every button-class control presses with the `shadow-press` INSET.
- **Muted is METADATA; ink is PROSE. Two tiers, never three.** `muted on surface` is 4.40:1 here, so muted prose on a card already fails AA. Hierarchy below body drops through size and weight.
- **Shape follows the control's CONTENT.** Icon-only is a circle; every labelled control shares one radius, fields included.
- **Three easing curves, each with a job, and `ease-in` is BANNED.**
- **The kitchen sink holds no literal values**, and **a new primitive means a new sink section in the SAME commit.**
- **Some measured failures on `/kitchen-sink` are deliberate and recorded** — `muted on surface` at 4.40, `border-strong` below 3:1, `rule` not held to the non-text bar. The page shows them so nobody "fixes" a decision. Check `design-rules.md` before changing one.

**House style**
- **No em dashes in user-facing copy.** Comments and docs are exempt; lint enforces the rest.
- **The app never names itself to the person using it.** Use *you / your*, first-person *we*, or nothing.

---

## Stack

Next.js 16.3 (App Router) · React 19 (React Compiler on) · TypeScript 6 · Tailwind v4 ·
Vercel AI SDK v7 · Neon + Drizzle · Better Auth (emailed code + Google) · nodemailer ·
Vercel Analytics · lucide-react.

```
src/app/               admin/, api/auth/, api/track/, login/ — all boilerplate
src/app/kitchen-sink/  every token + component in every state; measures contrast and type
src/components/ui/     primitives — button, icon-button, text-field, theme-toggle, code-input,
                       tooltip, skeleton, empty-state, card, spinner, icon (LucideProvider)
src/components/shell/  account-menu — the theme toggle lives here, not floating in a corner
src/config/site.ts     name + description; single source of truth
src/lib/               auth · db · env · route-logger · notify · track · analytics · cn · next-path · ai
docs/                  the blueprint artifacts; the real source of truth for what to build
```

**Nothing under `src/` is product code yet.** The first thing built should be phase 4's data model,
not a screen.

## Conventions

- **Code style:** senior-engineer minimalism — small surface, obvious naming, no premature
  abstraction, comments explain WHY, early returns for errors. One file, one responsibility.
- **Both modes, always.** Recolor the `.dark` block in `globals.css` per brand.
- **`src/app/layout.tsx` sets `robots: { index: false }`.** Remove it when this genuinely goes
  public, not before. Delete `src/app/kitchen-sink/` (or gate it behind `require-admin`) at the
  same time — nothing imports it, so the directory is the whole deletion.
- **Adding an analytics event = three changes in ONE commit:** `src/lib/analytics.ts`,
  `ALLOWED_EVENTS` in `src/app/api/track/route.ts`, and a query in `scripts/funnel.sql`.
