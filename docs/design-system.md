# Design system — plot

> Phase 3 artifact. Every visual and interaction rule, decided once.
> Rule: if a screen needs a value that isn't in this file, **add it here first, then use it.**
> Never inline a one-off. One-offs are how a design system dies.
>
> That rule is already enforced — `tailwindcss/no-custom-classname` in `eslint.config.mjs` reads
> the legal class list from `src/app/globals.css`, so adding a token to `@theme` is the only way
> to make a class legal. See §10.

**Status:** draft
**Last amended:** 2026-08-17 — first draft, written against the two standards Luke named.

---

## 0. The standard

The blueprint asks for a named standard rather than taste, so that disagreements resolve against
something. This product has **two modes with genuinely different densities**, and Luke named a
reference for each.

### Canvas mode — the reference is Recraft's own shell

Where the user photographs, draws and prompts. The `Look` view, and the drawing half of `Plan`.

The work is the content and the chrome gets out of its way: a quiet ground, a slim tool rail, and
a **floating compound input** carrying its parameters as inline chips rather than in a settings
panel. Zoom is a readout, not a secret gesture. A standing line admits the generator can be wrong.

**Adapted, not ported** (Luke, 2026-08-17). Recraft has no measurement anywhere — nothing on its
canvas has a dimension because nothing needs one. Ours does. So the canvas gains a scale bar, live
dimension readouts, and a second surface that Recraft has no equivalent for.

### Document mode — the reference is a field guide

**Peterson Field Guides · Sibley Guide to Birds · Merlin Bird ID (Cornell).**

Where the user reads something they will act on and spend money against. The `Takeoff`, the
`Build` guide, and the site summary.

What those three actually do, and what we take:

| Property | Where it comes from | How it lands here |
|---|---|---|
| **Dense but ordered.** A Sibley page holds a dozen views without feeling cluttered, because everything is on a grid and nothing is decorative. | Sibley | The takeoff is a list, not cards. Tight rhythm, hard alignment. |
| **The diagnostic detail is called out.** Peterson's whole system is an arrow pointing at the one field mark that settles the identification. | Peterson | The "dig one test hole first" notice *is* the arrow. One call-out, at the thing that decides the outcome. |
| **Terse, authoritative text.** Field marks, not prose. | Peterson / Sibley | Build steps state the reason in one clause. No paragraphs. |
| **Colour belongs to the subject, not the chrome.** The plate is coloured; the page is paper. | all three | The photo and the plan carry colour. The interface is paper and ink. Accent is reserved for action and meaning. |
| **Comparative layout.** Two things side by side beats two things described. | Sibley | Before/after, derived vs confirmed, this month vs July. |
| **Works outdoors, one-handed, guided.** Merlin asks five questions and answers you. | Merlin | Big targets, high contrast, a guided sequence rather than a toolbar of equals. |
| **Sourced and dated.** Cornell's authority comes from being checkable. | Merlin | Every guide cites its source and its review date. Every derived value names where it came from. |

**The sentence that is the bar:** *"Dense enough to trust, quiet enough to read in the sun, and
every number says where it came from."*

**What this rules out**, specifically, from the recon: stock shadcn defaults with one colour
swapped (SimplyScapes — reads as generic because it is), and icon-only toolbars with no accessible
names (GrowVeg and Arcadium both — a real defect, not a style).

---

## 1. Spacing

Inherited from the base and unchanged, because it is already right: **no new spacing tokens.**
Use Tailwind's scale, restricted to these steps.

**Base rhythm: 8px.** 4 only for tight internals.

`4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96` → `1 2 3 4 6 8 10 12 16 20 24`

Never an arbitrary `[13px]`. Never an odd or half step (`5 7 9 11 3.5`).

---

## 2. Type

**Two faces, and the serif is the point.** A field guide is a serif document; every AI SaaS is
not. This is the cheapest available differentiator and it directly serves the standard.

| Role | Face | Why |
|---|---|---|
| Headings, and document-mode display | **Source Serif 4** | Open, screen-drawn, authoritative without being fussy. The field-guide voice. |
| UI, body, canvas chrome | **Inter** | Neutral, legible small, excellent at outdoor contrast. |
| Numbers | Inter with **tabular figures** | Quantities sit in columns and must align. |

`--font-heading: 'Source Serif 4'` · `--font-sans: 'Inter'`

| Token | Size | Line-height | Weight | Used for |
|---|---|---|---|---|
| `text-display` | 3rem | 3.25rem | 700 | one per page, max |
| `text-h1` | 2.25rem | 2.5rem | 700 | page title |
| `text-h2` | 1.75rem | 2rem | 600 | section title |
| `text-h3` | 1.375rem | 1.75rem | 600 | card / block title |
| `text-body-lg` | 1.125rem | 1.75rem | 400 | build-step instructions — read outdoors |
| `text-body` | 1rem | 1.5rem | 400 | default |
| `text-small` | 0.875rem | 1.25rem | 400 | secondary, the reason under a quantity |
| `text-caption` | 0.75rem | 1rem | 500 | source lines, review dates, units |

**Numeric rule:** tabular figures on for every quantity, dimension and measurement. A takeoff
whose numbers don't align is a takeoff that looks guessed.

**`text-body-lg` is the build guide's body size, not a decoration.** Someone is reading it at
arm's length with dirty hands.

---

## 3. Colour

**Warm paper, not cool grey.** Every SaaS default ground is a blue-grey; a field guide is printed
on paper. This one change does more for the product's character than any accent choice.

**Colour is reserved for meaning.** The photo and the plan are the coloured things on screen. The
interface is paper and ink.

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `bg` | `#faf8f5` | `#12110f` | page ground — warm paper / warm ink |
| `surface` | `#f2efe9` | `#1b1a17` | panels, list rows |
| `elevated` | `#ffffff` | `#232120` | cards, popovers, the floating prompt bar |
| `border` | `#e0dbd2` | `#33302c` | dividers |
| `text` | `#1c1a17` | `#eae7e1` | body |
| `muted` | `#6b6660` | `#928d85` | secondary, the reason under a quantity |
| `accent` | `#2f6f5e` | `#5fae97` | primary action, confirmed state |
| `accent-foreground` | `#ffffff` | `#0d1512` | text on accent |
| `success` | `#3f7d3f` | `#71b871` | a gate that has been passed |
| `warning` | `#b45309` | `#f0a d4a` | drainage, crowding, out-of-zone |
| `danger` | `#b3261e` | `#f2867d` | destructive, hard stops (811) |

**The accent is a spruce green, and it is deliberately dark and desaturated.** The bright "eco"
green is the single most predictable choice a landscaping product could make, and it reads as
marketing rather than instrument. This one reads as surveyed.

### Product-specific roles

Two states are core product concepts, not decoration, so they get tokens:

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `derived` | `#8a7f6a` | `#a89a80` | a value the app worked out and the user has not confirmed |
| `confirmed` | = `accent` | = `accent` | a value the user has verified in the physical world |

Used sparingly, and **never as the only signal** — a derived value also says so in words.
See the note in §7.

**Contrast:** body ≥ 4.5:1, large text ≥ 3:1, both themes. Verify on the *canvas* too, where
chrome sits over an arbitrary photograph — that is the case that breaks contrast assumptions.

---

## 4. Shape & depth

Inherited, unchanged.

| Token | Value | Used for |
|---|---|---|
| `radius-sm` | 6px | inputs, chips |
| `radius-md` | 10px | buttons, cards |
| `radius-lg` | 16px | modals, sheets, the floating prompt bar |

Shadow is used only where something genuinely floats above the canvas — the prompt bar, popovers,
modals. On document surfaces, **borders, not shadows.** A field guide has no drop shadows.

---

## 5. Grid & layout

| | |
|---|---|
| **Max content width** | 720px for document mode (a reading measure), full-bleed for canvas |
| **Gutter** | `space-6` (24px) |
| **Page padding** | mobile `space-4` / desktop `space-8` |

**Breakpoints:** `sm 640` · `md 768` · `lg 1024` · `xl 1280`

**Mobile is the real case, not the fallback.** The photo is taken on a phone, outdoors, and the
build guide is read at the job. Design the phone layout first for `Look` and `Build`.

---

## 6. Motion

| Token | Value | Used for |
|---|---|---|
| `duration-fast` | 120ms | hover, focus, small state change |
| `duration-base` | 220ms | enter/exit, expand, view switch |
| `ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | things entering |

No spring, no bounce. Respect `prefers-reduced-motion`.

**One motion rule that carries meaning:** switching between `Look` and `Plan` is a *transition
between two views of one thing*, not a page change. It should move, so the user understands the
shape carried over.

---

## 7. States

Every interactive component defines all eight: default · hover · focus · active · disabled ·
**loading** · **empty** · **error**.

**Empty-state rule:** name what's missing, offer exactly one action. "No data" is not an empty
state.

**Error-state rule:** say what happened and what to do next. Never surface a raw exception.

**Two rules this product adds, both from the spec:**

- **A derived value must say it is derived in words**, not only in colour. Colour-blind users and
  sunlight both defeat a colour-only signal, and this signal is attached to money.
- **A generative surface carries a standing notice** that its output is an illustration, not a
  plan. It does not appear and disappear with state.

---

## 8. Component inventory

The base ships five primitives. Product-specific ones are the real work.

**Inherited from the base, verified against the new tokens:**
- [x] Button (primary / secondary / ghost), three sizes, loading, disabled
- [x] Input, Textarea
- [x] Spinner, ThemeToggle, CodeInput
- [x] **Card** + **Row** — bordered, never shadowed. A field guide has no drop shadows.
- [ ] Modal / Sheet — not yet needed by a specced screen
- [ ] Toast — not yet needed by a specced screen

**Built for this product:**
- [x] **Icon** — one wrapper decides stroke (1.5) and viewBox. Never inline an `<svg>` elsewhere.
- [x] **IconButton** — `label` is a **required prop**, which is the whole reason it exists.
- [x] **ViewTabs** — `Look · Plan · Takeoff · Build`. The spine of the project screen.
- [x] **PromptBar** + **PromptChip** — floating compound input, parameters as inline chips,
      allowance shown before the spend, standing illustration-not-a-plan notice built in.
- [x] **ToolRail** — slim vertical rail, every button named.
- [x] **ScaleBar** — the mark that separates a base plan from a picture of a house.
- [x] **DimensionReadout** — distinguishes a dragged estimate from a typed measurement.
- [x] **FactRow** — value, plain-language hint, confidence, source, correction.
- [x] **QuantityRow** — amount to buy with waste inside it, reason as a half-sentence.
- [x] **CallOut** — Peterson's arrow. Four tones, each with an icon and a word.
- [x] **StepCard** + **GateCheck** — reason required; the gate blocks the next step.
- [x] **EmptyState**, **ErrorState**, **NarratedProgress**, **Skeleton**

---

## 9. Kitchen sink

**Route:** `/kitchen-sink`

Every component in every state, light and dark, mobile and desktop. And specifically the bad days,
because that is when this app gets opened:

- a takeoff with a missing input
- a quantity that recomputed and is now stale
- a build guide that failed to load while the takeoff still works
- a generation that failed with the drawing preserved
- a property with no parcel coverage
- sun data unavailable outside coverage
- a plant name long enough to wrap twice
- a project list at 400 items

---

## 10. Enforcement

**Checker:** `tailwindcss/no-custom-classname` (error) · **reads tokens from:**
`src/app/globals.css`

Already wired in the base and already proven — it caught two tokens declared outside a Tailwind
namespace within a minute of being switched on.

| Case | Example | Level |
|---|---|---|
| A token that does not exist | `text-body-xl` | error |
| A plausible variant of a real token | `bg-surface-2` | error |
| An arbitrary value | `text-[13px]` | warn |

**Allowlist** — a handful is normal. Past that, the system is missing a token.

| Class | Where | Why |
|---|---|---|
| `bg-[#e8e4dc]` · `text-[#4a453d]` | kitchen sink, Contrast | A stand-in for a **photograph**, not a design surface. Tokenising it would claim the system owns a colour it does not: the real ground here is whatever the user's camera saw. |
| `active:scale-[0.98]` | `theme-toggle.tsx` | Inherited from the base. A press transform, structural rather than a colour or a size token. |

**Proven to fire, twice, and both catches were real** *(2026-08-17)*:

1. A probe class `text-body-xl` errored while `bg-derived` (a token added the same hour) passed —
   so the checker reads the live `@theme` block rather than a stale copy.
2. **It caught two of my own mistakes immediately.** `.tabular` and `.scroll-thin` were written as
   plain CSS classes at the bottom of `globals.css`. Both compile, both look exactly like design
   system classes, and neither is one. The fixes are the two correct answers and they are
   different: `tabular` did not need to exist at all (Tailwind ships `tabular-nums`), and
   `scroll-thin` needed registering with `@utility` so the framework and the linter both know it.
   That is precisely the failure mode this rule was added for, found within a minute rather than
   in a screenshot weeks later.

**Verify the checker supports your Tailwind major before trusting it.** Tooling written for v3
reads a JS config v4 does not have, finds nothing, and passes everything, which is worse than no
checker at all.

---

## Phase 3 gate

- [x] **Any screen in the wireframes can be built inventing nothing new.** Checked against
      `spec.md` §5: `/properties/new` (Input, Button, EmptyState), `/site` (FactRow, CallOut,
      Button), `Look` (ToolRail, PromptBar, PromptChip), `Plan` (ScaleBar, DimensionReadout,
      CallOut), `Takeoff` (QuantityRow, CallOut, Button), `Build` (StepCard, GateCheck).
- [x] **Light and dark both defined and contrast-checked, including chrome over a photograph.**
      The photo case has its own row in the rack's Contrast section, because that is the one
      ground the system does not choose and the one that breaks contrast assumptions.
- [x] Loading / empty / error exist for every interactive component
- [x] **Kitchen sink renders every state, including the bad-day list in §9** — all five have their
      own section under `Bad days`, plus a `long text` density toggle that swaps every string for
      roughly four times the length.
- [x] Keyboard focus visible everywhere (`:focus-visible` baseline in `globals.css`), and
      **every tool-rail button has an accessible name** — enforced by `IconButton` requiring
      `label`, so a missing one is a type error rather than a review someone has to remember.
- [x] **The token rule is enforced by lint and the checker has been proven to fire** — see §10.

**Remaining before this can be called locked:** the rack has been read on a desktop browser at
375 / 768 / 1280 / 1920 simulated widths, but **not yet opened on a real phone outdoors**, which
is the condition this system was designed against. That is a deploy away, and the rack ships to
production precisely so it can be done.
