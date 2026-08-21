# Design system — plot

> Phase 3 artifact. **Short on purpose.** The house system — every state mechanic, the elevation
> split, the derivation formulas, the motion curves, what a project may and may not change — lives
> in `modryn-hq@v4:playbooks/design-rules.md` and is shipped in `modryn-base`. **Read that first.**
> This file records only what is *plot's*, which is a much smaller list than it used to be.

**Status:** locked. Colour/radius 2026-08-20; **face and type scale re-locked 2026-08-21** on one
face (Roboto) and a size-by-role type matrix ported from onX Hunt. Components are the boilerplate's.
**Last amended:** 2026-08-21 — face and type scale.

---

## What happened to the previous version of this file

An earlier pass (2026-08-17) wrote a 300-line design system from
`playbooks/templates/design-system.md`, built a bespoke token set and a single-file kitchen sink,
and invented mechanics for depth, radius and ink. **`playbooks/design-rules.md` did not exist
yet.** It does now, and most of what that pass wrote was either (a) the house's decision to make,
not plot's, or (b) wrong in a way that fails silently — shadows declared directly in `@theme` so
every dark-mode shadow rendered its light value, a drop shadow stacked under a border, `Card`
inverted, `rounded-sm` on form controls.

All of it was replaced with `modryn-base`'s current design layer on 2026-08-20. **This file no
longer restates house rules.** Where the old version and `design-rules.md` disagree,
`design-rules.md` wins.

Two things from that pass survived being right, and both were independently reached by the house:
**muted is metadata and ink is prose**, and **press is an inset, not a fill flash or a scale.**

---

## 0. The standard

The blueprint asks for a named standard rather than taste, so disagreements resolve against
something.

**One shape language. Two densities.** The interface is paper and ink on every surface. What
changes between a photograph and a takeoff is how much of the screen the subject occupies and
where the chrome's ground comes from — never what a control is shaped like, how it presses, or
which ink a sentence is set in.

- **Recraft** is the reference for **how a canvas is arranged**: full-bleed subject, slim rail,
  one floating compound input, parameters inline rather than in a settings panel.
- **Peterson / Sibley / Merlin** are the reference for **how a page of facts is arranged**: grid,
  terseness, one arrow, colour in the plate and not the chrome, sourced and dated.

**Neither is a reference for shape, depth, ink, motion or focus.** Those are house style. Recraft
cannot tell you a button's radius and should not be asked; Peterson cannot tell you whether a
button pushes in, because Peterson has no buttons.

**The sentence that is the bar:** *"Dense enough to trust, quiet enough to read in the sun, and
every number says where it came from."*

What that rules out, from the recon: stock defaults with one colour swapped (SimplyScapes reads as
generic because it is), and icon-only toolbars with no accessible names (GrowVeg and Arcadium
both — a real defect, not a style).

---

## 1. What plot changed, and why

Exactly the four things `design-rules.md` §"What a new project CHANGES" permits. Nothing else.

### Ground: warm paper, not cool grey

| Role | Light | Dark |
|---|---|---|
| `bg` | `#faf8f4` | `#12110f` |
| `surface` | `#f2eee7` | `#1a1917` |
| `elevated` | `#fffefc` | `#232120` |
| `border` | `#e3ddd1` | `#3b3833` |
| `field` | `#8a8377` | `#8a8880` |
| `text` | `#1c1a16` | `#ece9e3` |
| `muted` | `#6f6a61` | `#918c84` |
| `rule` | `#efeae1` | `#2e2c29` |

Every SaaS default ground is a blue-grey; a field guide is printed on paper. The ramp
relationships are the house's and are unchanged — `surface` recessed, `elevated` raised, `bg`
between, `border` deliberately faint on `elevated` because a labelled control is already
identified by its label.

**`elevated` moved from `#fffdf9` to `#fffefc`, and pure white was tried and reverted in
between** (2026-08-20). The instinct behind the move was right — `#fffdf9` tinted the card in the
*same* direction as `bg`, so the lift leaned almost entirely on the shadow. The first fix,
`#ffffff`, was wrong, and wrong in a way WCAG contrast could not see: it dropped chroma to zero
while every surrounding token — `bg`, `surface`, `border`, `text`, `muted` — stayed warm. WCAG
ratio moved a uniform +1–2% across the whole `#fffdf9`→`#ffffff` range and called that free; the
real cost, measured in CIEDE2000, was a **2.5× jump** in perceptual distance from `bg` (1.00 →
2.47) — a material change, not a lightness step. Luke caught it by eye within the hour.

**`#fffefc` is the fix that stays on `bg`'s hue.** In OKLCH, `bg` sits at 84.57° hue, chroma
0.0057. `#fffefc` sits at 84.56° — indistinguishable — at half the chroma, and it is the only
8-bit step in that range that stays this close: `#fffefb` drifts +6.9°, `#fffefd` drifts −16.8°.
It still measures every contrast pair *better* than the original `#fffdf9` (accent-foreground on
accent 8.13 → 8.20, muted-on-elevated 5.29 → 5.33) — the gain just no longer costs the hue.

Dark was proposed as `#222221` and **rejected**: a 0.3% luminance move that changes nothing
measurable and costs the one dark plane that carries warmth.

**This recolour cleared a contrast failure the boilerplate ships with.** `muted on surface`
measures **4.40 (fails)** in base's palette and **4.64 (AA)** in plot's. That is not why the warm
values were chosen, but it is worth recording: the constraint that muted must never carry prose
still holds, and now the metadata itself has margin.

### Accent: cyanotype

`#22517d` light · `#79aedd` dark.

**A blueprint is literally a cyanotype**, which earns this blue for a measured-drawing product
rather than picking it by elimination. It is deep and desaturated: it reads as drawing ink, not as
the bright blue of a link or the violet the boilerplate bans by name.

The alternatives were genuinely narrow and worth recording so nobody re-opens it casually:
**not green** — green is this subject's colour (grass, shrubs, the plant palette, the aerial), and
chrome wearing the plate's ink is the one thing the field-guide standard forbids. **Not amber or
red** — `warning` and `danger` own those. **Not violet** — the house rule says so outright.

**The dark value moved on 2026-08-20, and not for taste.** `#6ea6d8` put the primary button's
*pressed* label at **4.38 — under AA**, found by measuring rather than by looking. `accent-foreground`
is `elevated`, which in dark mode is itself dark, so the house's 97% press mix darkens the fill
toward its own label. The house formula is not plot's to retune, and raising the cap to 99% clears
AA only by shrinking the press to a 2.5% move — no press state at all. Lightening the accent, which
*is* a value a project may change, fixes it properly: rest 6.80, hover 5.17, press **4.80**, press
still a ~7% step off hover.

**One constraint this creates, recorded now so it is not discovered later:** a marked water area
on the plan **never renders in the accent hue.** Water is subject, the accent is chrome, and a
blue wash beside a blue button is the same collision green would have been. Use a hatch or a
neutral wash.

### Semantics

`success #2f7a43 / #6fc887` · `warning #a85a09 / #e8a94a` · `danger #b3271f / #ef8279`.

Deepened from base's so the light values clear AA on the page — the rack calls amber-on-light
"the usual miss", and plot's measures 4.79. Green survives here and only here: `success` appears
on document surfaces with no photograph and no plant symbols, so there is no subject collision.

### Face: one, and the weight ladder is the argument

`--font-sans: Roboto` · `--font-heading` is an alias for it.

**Replaced Source Serif 4 + Inter on 2026-08-21.** The old pair was not arbitrary: it argued that
plot's document half is a field guide, a field guide is a serif document, and every AI SaaS is not.
That argument lost to a better one rather than to taste.

The type scale below now carries hierarchy through a size-by-role matrix with four weights in it.
A second FAMILY on top of that is a third axis competing with the two already doing the work, and
the house rule is explicit that hierarchy below body drops through **size and weight**, never a
third thing. One face with 400 / 500 / 700 / 900 says everything the split said, in one axis.

**Roboto specifically, because it is measured rather than picked.** It is what onX Hunt's product
app actually ships, read off their live `--ys-text-*` tokens. Their marketing site runs Atlas
Grotesk, which is a paid Commercial Type licence and therefore not an option; Roboto is the face
they use where the real work happens anyway. The stack mirrors theirs, `Arial` before the generic.

Loaded as the **variable cut**, not four static weights: 900 is load-bearing (every button label in
this system is Black), and one variable file beats four static ones. Verified live on
`/kitchen-sink` that the wght axis is real, not reported: 400/500/700/900 produce four distinct
advance widths, and the loaded face reports `weight: "100 900"`.

**What this costs, stated rather than hidden.** Roboto is the most-used face on the web and carries
none of the serif's editorial character. The bet is that plot's identity lives in the warm paper,
the cyanotype ink, the 4/8/12 radius and the nadir photography, and that a neutral face under those
reads as an instrument rather than as a brand. Revisit if the built screens read generic.

### Radius: 4 / 8 / 12

One step tighter than the house's 6 / 10 / 16, because a drafting product reads better squarer.
**The assignment is untouched house style**: icon-only is a circle, every labelled control shares
`rounded-md` including fields, `rounded-sm` is for small insets and never a form control.

Luke's instinct that a blueprint product wants square edges is right about the thing and wrong
about the noun. What has square edges on paper is *the page and its printed regions* — the plate,
the map, the table. What does not is anything never printed on it: your hand, a tool, a control.
So the full-bleed photograph and the plan viewport are square; the things you hold are not.

---

## 2. Verified, not asserted

`/kitchen-sink` measures every contrast pair in both modes and checks each type token's declared
value against what the browser rendered. **The numbers below are read off that page** (2026-08-20,
light / dark), not computed alongside it.

**Five pairs sit below their bar, and all five are the same deliberate exemption in
`design-rules.md`: an edge that is not the only thing identifying its control may be faint.**

- `border on bg` 1.27 / 1.62 and `on elevated` 1.34 / 1.37 — a labelled field or a card. Something
  inside already says what it is, so the edge is free to be quiet at rest and jump on focus.
- `border-strong on bg` 1.78 / 2.35 and `on elevated` 1.88 / 2.00 — a hover border is a judgement
  call, not a contrast target.
- `rule on elevated` 1.19 / 1.15 — a rule only separates; it is deliberately quieter than `border`.

Held to the bar and clearing it: `field on elevated` **3.72 / 4.51** and `field on bg` 3.54 / 5.31
— the CodeInput box, where the outline *is* the control and SC 1.4.11 applies.

The tightest real pair in the system, `accent-foreground on accent-active`, now measures
**10.31 / 4.80**.

**What this section said before 2026-08-20 was wrong twice, and both were this document's fault
rather than the sink's.** It claimed *"every pair passes AA except three"*. The sink reported five,
and separately reported `accent-foreground on accent-active` failing dark mode at **4.38** — a pair
it measures at the right threshold, under a note calling it *"the tightest pair in the system."*
Nobody read the row. The sentence was written from the recolour's intent instead of from the page
built to check it, in a section titled *Verified, not asserted*.

**The lesson is not "extend the sink."** It is that a measuring tool nobody opens is worth exactly
as much as no tool. Every number above was read off the rendered page.

All 27 type roles render exactly as declared, in Roboto, with no missing tokens and no
declared-vs-rendered mismatch (read off `/kitchen-sink`, 2026-08-21).

### What the sink structurally cannot measure, found on /login (2026-08-20)

Two failures got through a page built to catch failures, and both are outside what it looks at.
Recording them because the shape matters more than either bug.

**1. A scoped theme does not carry the derived tokens.** `/login` is dark in both themes, via
`.dark` on its own root. Every LITERAL token flipped and every DERIVED one did not: `@theme` emits
to `:root`, and a custom property's computed value has its `var()`s already substituted on the
element that declares it, so `--color-accent-foreground: var(--color-elevated)` had resolved
against LIGHT `elevated` and was inherited as that finished colour. `.dark` on `<html>` works only
because html *is* `:root`. The primary CTA rendered `#fffefc` on `#79aedd` at **2.34:1**, and
`--color-pressed` was the light page ground, so every press flashed near-white.

Fixed by restating the five derivations (`accent-foreground`, `accent-hover`, `accent-active`,
`border-strong`, `pressed`) inside `.dark`. **The formulas are unchanged** — the house rule that
they may not be replaced by hexes is untouched; only the level they are declared at moved, so they
re-resolve wherever `.dark` lands. The two copies must stay character-identical. After the fix the
CTA measures **6.80 / 5.17 / 4.80** rest / hover / press, which is exactly what §1 already claimed
for dark mode and had no way to verify in a scope. **This belongs upstream in `modryn-base`**:
every project built from it carries the bug latent until a screen scopes a theme.

*The sink measures at the document level, where this bug does not exist.* It is not a gap in the
page, it is a gap in what a token-pair page can be.

**2. Ink on a photograph is not a token pair.** The sink measures `text on bg`. `/login` sets the
wordmark and claim on an aerial. At the first scrim value (`opacity-40`) the worst ground under the
claim measured **3.01:1** on a phone. It now runs at `opacity-65`, chosen off a sweep rather than by
eye, and measured against the real `getBoundingClientRect` text boxes composited over the actual
`object-cover` crop:

| | wordmark | claim | controls |
|---|---|---|---|
| phone 375x812 | 9.42 | 9.15 | 15.57 |
| desktop 1440x900 | 8.58 | 7.63 | 13.30 |

`opacity-55` also cleared 4.5 and was rejected: spec §1b puts this screen in direct sunlight, where
the bar is the floor and not the target. The claim is large text and its formal AA bar is only 3:1;
it is held to the body bar for the same reason.

**Any screen that puts type over an image owes this measurement, and the sink will not prompt for
it.**

### The type scale, ported from onX Hunt (2026-08-21)

Read off their live product app (`webmap.onxmaps.com`) with the chrome-devtools CLI, from their
`--ys-text-*` custom properties, not inferred from screenshots. Their marketing site is a separate
and much looser system (browser-default `em` multipliers, `line-height: normal`) and was not the
model.

**The idea worth taking is that SIZE and ROLE are separate axes.** plot's old scale was eight
size-named steps with one weight baked into each, so `text-body` could only ever be 400 and four
call sites had already bolted `font-medium` on beside it. The new scale is a matrix: 8 sizes x 27
roles. At 16px there are now six roles where there was one.

| band | roles | weight |
|---|---|---|
| `title0-6` | 48 / 36 / 32 / 24 / 18 / 16 / 14 | 700 |
| `numeric1-2` | 56 / 22 | 900 / 700, negative tracking |
| `subtitle1-4` | 22 / 16 / 14 / 12 | 400 / 500 |
| `body0-2` + `-medium` / `-bold` | 16 / 14 / 12 | 400 / 500 / 700 |
| `button1-3` | 16 / 14 / 12 | **900** |
| `metadata1` + `-medium` / `-bold` | 11 | 400 / 500 / 700 |

**Buttons at 900 is the signature**, and it is measured: onX's `<ys-button>` computes to
font-weight 900. It is what makes their CTAs read as pressable objects rather than coloured
rectangles with words on them. `Button`'s `size` now maps to a button role, so a control's height
and its label weight move together and no call site can pick a weight.

**Every line-height is a multiple of 4**, which plot's old scale already was. Kept deliberately.

**Letter-spacing went to zero almost everywhere** (was -0.02em on display/h1, +0.01em on caption).
onX tracks nothing except the numeric roles and the two subtitles that set 500 small.

**11px `metadata1` is new** and is a floor, not an invitation: a word labelling something already
visible, never a sentence, never on the critical path. Spec 1b puts half this product in sunlight.

**Three of their properties could not come across, and the reason is a Tailwind limit.** The
`--text-*` namespace resolves exactly three sub-properties: `--line-height`, `--letter-spacing`,
`--font-weight`. onX's roles also carry `textDecoration` (their link roles underline in the token)
and `paragraphSpacing` (body0/1/2 declare 20/14/12px). A `text-link1` token would have been
byte-identical to `text-body1` and would have silently NOT underlined, and a token that lies costs
more than a missing one. The underline is a `.link` utility instead; paragraph spacing waits for a
long-form surface. Their italic roles were dropped as tokens with no consumer.

### A `<picture>` does not re-select after load, and the scrim is why that is survivable

Chrome runs the source-selection algorithm once. Rotating a phone leaves the previous orientation's
file in place: measured live, the media query stops matching while `currentSrc` does not change.
So `/login` can render the landscape backdrop in a portrait viewport and vice versa.

Measured rather than assumed, all four combinations, worst band against ink:

| | phone 375x812 | desktop 1440x900 |
|---|---|---|
| correct file | 9.15 | 7.63 |
| wrong file, after rotation | 7.81 | 8.59 |

All pass AA with margin, so this is a **composition** bug and not a legibility one, and it is
recorded rather than engineered around. The 65% scrim chosen for contrast is what makes the wrong
crop safe. Revisit only if a rotated phone ever shows type on a busy region.

---

## 3. Still open

- **The rack has never been opened on a real phone outdoors**, which is the condition this whole
  system is designed against. That is a deploy away, and the rack ships to production for it.
- ~~`spec.md` does not state that condition.~~ **Closed 2026-08-20.** It is now
  [`spec.md`](spec.md) §1b, with seven binding EARS criteria behind it — the AA floor, the 44px
  hit target, the 100ms press that survives an occluding finger, the 18px build-guide step, the
  one-handed rule, no horizontal scroll outdoors, and preserving entered work when a request
  fails. **The contrast floors and target sizes in this file are no longer taste**; they are the
  design system's answer to a stated requirement, and moving one means arguing with the spec.
- **No product components exist yet**, deliberately. The eight built on 2026-08-17 were made ahead
  of any screen that needed them and are gone (recoverable at `049cc4c`). Rebuild against the
  house system when a real screen asks — and per house rule, **a new primitive means a new sink
  section in the same commit.**
