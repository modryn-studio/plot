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
| 3 Design system | **re-opened 2026-08-20**, see below |
| 4 Architecture | not started |

### The design system was reset on 2026-08-20, and this is the one thing to read first

An earlier pass (2026-08-17) built a bespoke token set and a single-file kitchen sink from
`modryn-hq@v4:playbooks/templates/design-system.md`. **`playbooks/design-rules.md` did not exist
yet.** It does now, and that pass violated it in several ways that all fail silently: shadows
declared directly in `@theme` (so every dark-mode shadow rendered its light value), a resting drop
shadow stacked under a border on the secondary button, `Card` inverted to border-without-shadow,
`rounded-sm` on form controls, and `--color-accent` deleted outright rather than recoloured.

So the whole design layer was replaced with `modryn-base`'s current one — `globals.css`,
`components/ui/`, `components/shell/`, `app/kitchen-sink/`, `layout.tsx`, `eslint.config.mjs`.
**Plot is now on the house system, unrecoloured.**

**The next design task is to re-lock it deliberately**, against `design-rules.md` §"What a new
project CHANGES, and what it must NOT" — the colour role VALUES, `--font-heading`, and the radius
scale, and nothing else. The previous pass's *thinking* is still good and is recorded in
`docs/design-system.md`; its *implementation* is gone. Re-derive from the rules, do not paste the
old values back.

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
| `docs/design-system.md` | Phase 3 — **partly superseded**, see the reset note above |
| `docs/recon.md` | The competitive read, and why the category fails |
| `docs/reference/` | Per-product teardowns from live drives |

**Seven decisions in `docs/spec.md` §6 are still open**, two of which block the first slice:
geography at launch (the parcel DB is Wisconsin-only), and whether signup gates the base plan.

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
- **NO `loading.tsx` AT THE APP ROOT.** Past ~50KB of streamed payload its boundary stops hydrating, silently.

**Design system** — the full set lives in `modryn-hq@v4:playbooks/design-rules.md`. **Read it
before touching a token, a primitive or the shell.** The ones that bite hardest:

- **A `@theme` shadow value must stay INDIRECT** (`--shadow-card: var(--elevation-card)`). Tailwind resolves a directly-declared `@theme` shadow at build time and bakes it into the utility, so the `.dark` override does nothing and every shadow renders its light value. **This repo shipped that bug on 2026-08-17.**
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
