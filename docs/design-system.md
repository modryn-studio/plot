# Design system — plot

> Phase 3 artifact. Every visual and interaction rule, decided once.
> Rule: if a screen needs a value that isn't in this file, **add it here first, then use it.**
> Never inline a one-off. One-offs are how a design system dies.
>
> That rule is already enforced — `tailwindcss/no-custom-classname` in `eslint.config.mjs` reads
> the legal class list from `src/app/globals.css`, so adding a token to `@theme` is the only way
> to make a class legal. See §10.

**Status:** draft
**Last amended:** 2026-08-17 — **rewritten after Rams' review.** He found that the four
inconsistencies Luke reported (radius, shadow, ink, an unexamined accent) were one problem
reported four times: declaring two *modes* licensed two rule sets, so every new component was a
fresh negotiation with no default to lose to. The accent is deleted, radius is keyed to object
class, depth is an affordance rather than decoration, and three tokens that failed AA were fixed.

---

## 0. The standard

The blueprint asks for a named standard rather than taste, so that disagreements resolve against
something.

### One shape language. Two densities.

The interface is **paper and ink on every surface**. What changes between a photograph and a
takeoff is how much of the screen the subject occupies and where the chrome's ground comes from —
**never** what a control is shaped like, how it presses, or which ink a sentence is set in.

- **Recraft** is the reference for **how a canvas is arranged**: full-bleed subject, slim rail,
  one floating compound input, parameters inline rather than in a settings panel.
- **Peterson / Sibley / Merlin** are the reference for **how a page of facts is arranged**: grid,
  terseness, one arrow, colour in the plate and not the chrome, sourced and dated.

**Neither is a reference for shape, depth, ink, motion or focus.** Those are one set, stated once
in §3, §4 and §7, and they hold everywhere. Recraft cannot tell you a button's radius and should
not be asked. Peterson cannot tell you whether a button pushes in, because Peterson has no buttons.

> **Why this replaced "canvas mode vs document mode".** The `Plan` view is a canvas you draw on
> *and* a document reporting `12' × 14' · 168 sq ft` with a live readout and a drainage warning.
> It is both at once, which means they were never modes. And [`walkthrough.md`](walkthrough.md)
> already names this product's largest risk as *"whether the Look → Plan handoff feels like one
> project or two apps."* A system with two declared modes has pre-committed to feeling like two
> apps. The words survive as names for two **densities**, and for nothing else.

**Adapted, not ported** (Luke, 2026-08-17). Recraft has no measurement anywhere — nothing on its
canvas has a dimension because nothing needs one. Ours does. So the canvas gains a scale bar, live
dimension readouts, and a second surface Recraft has no equivalent for.

### The field-guide half

**Peterson Field Guides · Sibley Guide to Birds · Merlin Bird ID (Cornell).**

Where the user reads something they will act on and spend money against. The `Takeoff`, the
`Build` guide, and the site summary.

What those three actually do, and what we take:

| Property | Where it comes from | How it lands here |
|---|---|---|
| **Dense but ordered.** A Sibley page holds a dozen views without feeling cluttered, because everything is on a grid and nothing is decorative. | Sibley | The takeoff is a list, not cards. Tight rhythm, hard alignment. |
| **The diagnostic detail is called out.** Peterson's whole system is an arrow pointing at the one field mark that settles the identification. | Peterson | The "dig one test hole first" notice *is* the arrow. One call-out, at the thing that decides the outcome. |
| **Terse, authoritative text.** Field marks, not prose. | Peterson / Sibley | Build steps state the reason in one clause. No paragraphs. |
| **Colour belongs to the subject, not the chrome.** The plate is coloured; the page is paper. | all three | The photo and the plan carry colour. The interface is paper and ink. **This is the rule that deleted the accent** (see section 3). |
| **Comparative layout.** Two things side by side beats two things described. | Sibley | Before/after, estimated vs measured, this month vs July. |
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
| `bg` | `#faf8f5` | `#12110f` | page ground: warm paper / warm ink |
| `surface` | `#f2efe9` | `#1b1a17` | panels, list rows *(recessed, see the naming note)* |
| `elevated` | `#ffffff` | `#232120` | cards, popovers, the floating prompt bar |
| `border` | `#e0dbd2` | `#33302c` | dividers |
| `border-strong` | `#c2bbae` | `#57524b` | the hover firm-up, and an input's resting edge |
| `text` | `#1c1a17` | `#eae7e1` | prose, **and the primary action** |
| `ink-hover` | `#2a2721` | `#d8d4cd` | the primary action's only hover move |
| `muted` | `#6b6660` | `#928d85` | metadata: dates, counts, units, labels, sources |
| `pressed` | `#e8e3da` | `#12110f` | the ground a control presses to |
| `success` | `#3a733a` | `#71b871` | a gate that has been passed |
| `warning` | `#a94c07` | `#f0ad4a` | drainage, crowding, out-of-zone |
| `danger` | `#b3261e` | `#f2867d` | destructive, hard stops (811) |

### There is no accent hue, and that is the decision

*(Luke + Rams, 2026-08-17. It was previously a spruce green, `#2f6f5e`.)*

The old justification, "bright eco green reads as marketing, dark desaturated reads as surveyed",
was a claim about **connotation** and never a decision about a **job**. This system's own standard
kills it: **colour belongs to the subject, not the chrome.** Green *is* this subject's colour:
grass, shrubs, the plant palette, the aerial. A green button over a plan whose plant symbols are
green is the chrome painted in the plate's ink. `run-rebuild` reached the identical verdict from
the other side: *"a green mark beside a green P&L is a lie no amount of contrast rescues."*

It also collided internally. `accent` measured **5.15** and `success` **4.34** on the worst
ground: two greens a hair apart in value, carrying different meanings, meeting on the Build screen
where a step card shows both.

**So the primary action is ink.** Peterson has no accent colour; the arrow is black, and what
makes it read is that it is the **only** arrow. A filled near-black button is a stronger scan cue
than a mid-value hue, and at **16.38:1** it is the most legible object on a phone in direct sun.

The consequence worth protecting: **success, warning and danger are now the only chromatic things
in the interface.** That is "colour reserved for meaning" actually arriving.

**If a hue is ever revisited, the constraint set is narrow and blue is out.** Not green (subject).
Not amber or red (`warning` and `danger` own those). Not warm brown (that is a pencil note).
**Not blue**: the APWA locate code makes blue mean potable water, and this product has a
water-marking feature and an 811 gate. Same collision, different subject. Violet is what survives,
and only as "what is left", which is taste rather than derivation.

### Two ink tiers, and no third

Luke's rule, verbatim:

> *Metadata attached to an object, a date on a task row, a count, a timestamp. Nobody reads these
> as prose; they're properties of the thing next to them. Muted is right. Prose meant to be read,
> explanations, guidance, documentation. This should be full-strength ink.*

| Tier | Token | What |
|---|---|---|
| **prose** | `text` | empty-state and error bodies, a `FactRow` hint, a `QuantityRow` reason, a build step's reason, the illustrations-not-plans notice, a `CallOut` body |
| **metadata** | `muted` | units, counts, labels, source lines, review dates, `measured`/`estimated`, resting controls, placeholders |

Hierarchy below body is carried by **size and weight**, not by a third grey. The ramp already
separates a 22px `h3` from a 14px `small`. Muted was never doing hierarchy work; it was only
making sentences harder to read, which is what makes this rule free.

**And this product has an argument Run does not:** 4.95:1 on a desk monitor and 4.95:1 on a phone
at arm's length in direct sun are not the same read. Prose at full strength is not a nicety here.

**The tell, for finding the next instance:** an element carrying a reading measure (`max-w-*`) and
also `text-muted`. The code named the job correctly and coloured it wrong. Grep for it.

### Derived vs confirmed resolves into the tiers

It no longer needs its own hues. **Derived is `muted` plus the word "estimated"; confirmed is full
`text` plus the word "measured."** Pencil and ink, and the loud one is the number you are allowed
to buy against.

The deleted `--color-derived` (`#8a7f6a`) **failed AA on every light ground**, 3.44 worst, on the
ink that tells you a number is a guess, on the screen where it becomes a purchase. The word was
always the real signal; the colour duplicated it, and badly.

### Contrast

Body at least 4.5:1, large text at least 3:1, **both themes**, and **computed rather than
claimed**. The rack's Contrast section reads the live custom properties and does the WCAG maths at
render. See section 10.

Three values were below the floor when that proof was first written, while this document's own
phase 3 gate already claimed contrast had been checked: `derived` 3.44, `success` 4.34, `warning`
4.38. `success` and `warning` moved to `#3a733a` (4.95) and `#a94c07` (4.91), solved with headroom
rather than to the line so hex rounding cannot drop them back under.

**Verify on the canvas too**, where chrome sits over an arbitrary photograph. That is the one
ground the system does not choose, and the case that breaks contrast assumptions.

*Naming note (backlog): the ground tokens are misnamed. `surface` is recessed and `elevated` is
raised, with `bg` between them. Coherent values, misleading names. Rename to recessed/page/raised
when the next surface is built, not while a live rack depends on them.*

---

## 4. Shape & depth

### Radius is keyed to what a thing *is*

A radius does exactly one job: **it tells you the boundary of a thing you can operate.** A rounded
rectangle reads as a discrete manipulable object; a square edge reads as a region of a page.

Luke's instinct that a blueprint product wants square edges is **right about the thing and wrong
about the noun.** What has square edges on paper is *the page and its printed regions*: the plate,
the map, the table. What does not is anything never printed on it, meaning your hand, a tool, a
control. **A field guide has no buttons, so it cannot rule on button shape.**

So the split is not canvas-vs-document. It is **printed matter vs held object**:

| Class | Token | Value | What it is |
|---|---|---|---|
| **plate** | `rounded-none` | 0 | the thing that IS the page: the photograph, the plan viewport, the aerial, a takeoff table, a data row's own bounds, print output |
| **slot** | `rounded-md` | 12px | card, modal, sheet, selectable choice, the PromptBar as a unit |
| **control** | `rounded-sm` | 8px | button, input, chip, IconButton, tool-rail button, menu item |
| **badge** | `rounded-xs` | 6px | `RENT` / `BUY`, `modelled`, `estimated`, the stale mark |

Values are **`run-rebuild`'s exactly**, and identical on purpose: a 44px control here and a 36px
control there are both rectangles held in a hand, so a different number would be difference for
its own sake. **The plate class is where plot genuinely differs**, because Run has no full-bleed
photograph that *is* the page.

`rounded-full` survives on exactly two things: the `NarratedProgress` status disc, and avatars. A
disc is a different object, not a rounded rectangle. There is deliberately no `lg`.

### Depth is the affordance for a thing you can push

Not elevation-as-importance, not lift-as-polish. Shadow answers one question, *is this a thing I
can operate?*, and on a phone at arm's length in daylight with dirty hands that is the
highest-value question on the screen.

> **The sentence this replaced was mine and it was wrong.** *"A field guide has no drop shadows"*
> reasons from a print constraint to a screen rule. Peterson has no shadows because ink on paper
> physically **cannot** cast one, not because a designer judged they harm legibility. Inheriting a
> constraint after the constraint has stopped existing is the same error as putting electronics in
> a wooden cabinet.

| Token | Light | Dark | Used for |
|---|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(28,26,23,.06)` | `0 1px 2px rgba(0,0,0,.28)` | a **control** at rest |
| `shadow-card` | `0 2px 4px rgba(28,26,23,.10)` | `0 2px 4px rgba(0,0,0,.32)` | genuinely floating over the canvas: tool rail, PromptBar, popover, modal |
| `shadow-press` | `inset 0 2px 4px rgba(28,26,23,.12)` | `inset 0 2px 5px rgba(0,0,0,.45)` | the push-in |

**Depth never appears on:** the plate (photograph, plan, print output), document rows (a takeoff
line, a `FactRow`, a `QuantityRow`, a build step, which are read rather than pushed), and `Card`.

**`Card` is a deliberate divergence from `run-rebuild`, and the test that earns it:** is the whole
card a hit target? In Run, often yes, because a card is a data object you click into, so a shadow
is honest. Here, never: a `Card` wraps a printed panel and you press things *inside* it. A shadow
would promise a press that does not exist.

**Press is an inset, not a fill flash and never a scale.** The weight of an inset sits at the
**top edge, the part not under your thumb**, so it survives a finger covering the control. A fill
flash does not. `active:scale-[0.98]` is worse still: a shrink is not a push, the object gets
smaller and stays flat.

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

### The exact contract for a control

One mechanic, adopted from `run-rebuild` verbatim rather than reimplemented, because a second
implementation of one idea is a second thing to drift.

| State | Ink primary | Secondary | Ghost |
|---|---|---|---|
| **rest** | `bg-text`, no border, `shadow-sm` | `bg-elevated`, 1px `border`, `shadow-sm` | nothing |
| **hover** | fill to `ink-hover`, nothing else | **border to `border-strong`, nothing else** | a raised chip appears |
| **press** | `shadow-press` | `bg-pressed` + `shadow-press` | `bg-pressed` + `shadow-press` |
| **focus** | the global `2px solid text`, offset 2 | same | same |
| **disabled** | `bg-surface` + `text-muted`, no shadow: a **ground swap** | same | opacity is fine here |

**Hover moves the border and only the border.** Luke's recorded rule, and it is right for a
structural reason: an object that already has a ground cannot announce hover by changing that
ground without reading as a *different object*.

**Disabled is a ground swap, never opacity**, on anything with a fill or a border. Opacity fades
the control's *edges* along with its ink, so it goes soft and blurry rather than reading as off,
and blurry in daylight is unreadable. `ghost` keeps opacity because it has no fill to swap.

**Press runs at 100ms**, not the 220ms base. Press is acknowledgement, and acknowledgement late
reads as a missed tap.

**No component may suppress the global focus outline.** Every primitive inherited from the
boilerplate carried `focus-visible:outline-none` plus a 30%-alpha ring at zero offset, which
overrode the app-wide outline that `globals.css` calls *"not optional on a product used outdoors
in sunlight with gloves on"*, on the most-tabbed controls in the product. All removed.

**Empty-state rule:** name what's missing, offer exactly one action. "No data" is not an empty
state.

**Error-state rule:** say what happened and what to do next. Never surface a raw exception.

**Two rules this product adds, both from the spec:**

- **A derived value must say so in words**, not only in ink. Colour-blind readers and sunlight
  both defeat a colour-only signal, and this signal is attached to money. This is why deleting
  `--color-derived` cost nothing: the word was always carrying it.
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
| `bg-[#e8e4dc]` · `text-[#4a453d]` | kitchen sink, "Chrome over a photograph" | A stand-in for a **photograph**, not a design surface. Tokenising it would claim the system owns a colour it does not: the real ground here is whatever the user's camera saw. |

*(`active:scale-[0.98]` used to be listed here. It is gone — a shrink is not a push. See section 4.)*

### The gap this checker cannot close

**It enforces that a class EXISTS, not that it is ours.** `text-sm`, `text-base` and `px-5` are
legal *Tailwind* classes, so they passed silently for as long as the boilerplate `Button` shipped
them — while section 1 forbids a 20px step and section 2 says every piece of text is one of eight
tokens. The lint rule was never going to catch that, and believing it would is how the audit got
skipped.

**So the rule covers invented tokens, and a human covers borrowed ones.** When a primitive is
touched, audit the whole file rather than the one property that prompted the visit: the missing
radius, the suppressed focus outline and the off-scale type in `button.tsx` were all found in one
pass because nothing in that file had ever been asked what job it was doing.

**Proven to fire, three times, and every catch was real** *(2026-08-17)*:

1. A probe class `text-body-xl` errored while `bg-derived` (a token added the same hour) passed —
   so the checker reads the live `@theme` block rather than a stale copy.
2. **It caught two of my own mistakes immediately.** `.tabular` and `.scroll-thin` were written as
   plain CSS classes at the bottom of `globals.css`. Both compile, both look exactly like design
   system classes, and neither is one. The fixes are the two correct answers and they are
   different: `tabular` did not need to exist at all (Tailwind ships `tabular-nums`), and
   `scroll-thin` needed registering with `@utility` so the framework and the linter both know it.
   That is precisely the failure mode this rule was added for, found within a minute rather than
   in a screenshot weeks later.
3. **It caught the whole accent deletion.** Removing `--color-accent` turned every `bg-accent` and
   `text-accent-foreground` still standing into an error, which is how the migration was proven
   complete rather than assumed. A token you delete from `@theme` cannot be silently left behind.

**Verify the checker supports your Tailwind major before trusting it.** Tooling written for v3
reads a JS config v4 does not have, finds nothing, and passes everything, which is worse than no
checker at all.

### The contrast proof computes, it does not print

The rack's Contrast section reads the live custom properties off the pane it renders in and does
the WCAG relative-luminance maths at render time. A hand-written table is a claim maintained
beside the value it describes, and it drifts the moment either moves.

It earned itself twice on the first render: it reported the three failing tokens, **and it found a
bug in itself** — `getComputedStyle` returns `#ffffff` as the shorthand `#fff`, so a six-digit-only
hex parser silently dropped `--color-elevated` and marked every ink as failing against it. A
printed table would have said "pass" in both cases.

---

## Phase 3 gate

- [x] **Any screen in the wireframes can be built inventing nothing new.** Checked against
      `spec.md` §5: `/properties/new` (Input, Button, EmptyState), `/site` (FactRow, CallOut,
      Button), `Look` (ToolRail, PromptBar, PromptChip), `Plan` (ScaleBar, DimensionReadout,
      CallOut), `Takeoff` (QuantityRow, CallOut, Button), `Build` (StepCard, GateCheck).
- [x] **Light and dark both defined and CONTRAST-CHECKED BY COMPUTATION.** This box was ticked
      once before against a check that had never run, which is how three tokens shipped below AA.
      It is now backed by the rack's computed proof and by an independent offline calculation that
      agrees with it: `text` 15.13 · `muted` 4.95 · `success` 4.95 · `warning` 4.91 · `danger`
      5.70, worst ground, both themes. **A ticked box is worth exactly as much as the check behind
      it.**
- [x] Chrome over a photograph has its own section, because that is the one ground the system does
      not choose and the case that breaks contrast assumptions.
- [x] Loading / empty / error exist for every interactive component
- [x] **Kitchen sink renders every state, including the bad-day list in §9** — all five have their
      own section under `Bad days`, and the hostile fixtures (a plant name that wraps twice, a
      four-sentence error) are fixed rows rather than hidden behind a toggle.
- [x] Keyboard focus visible everywhere, and **no component suppresses it** — the inherited
      `focus-visible:outline-none` was removed from Button, Input, Textarea and ThemeToggle.
      **Every tool-rail button has an accessible name**, enforced by `IconButton` requiring
      `label`, so a missing one is a type error rather than a review someone has to remember.
- [x] **One shape language.** Radius keyed to object class, one press mechanic, depth only where
      something can be pushed or genuinely floats.
- [x] **The token rule is enforced by lint and the checker has been proven to fire** — see §10,
      including the gap it cannot close.

**Remaining before this can be called locked:** the rack has only been read on a desktop browser.
It has **not been opened on a real phone outdoors**, which is the condition this whole system was
designed against — and worth noting, [`spec.md`](spec.md) never actually states that condition:
sunlight, gloves, one-handed use and offline appear nowhere in it. The design system has been
asserting a use context its own spec does not carry. **That is a spec gap and it should be closed
before someone trades the contrast and target sizes away for looking tidier.**
