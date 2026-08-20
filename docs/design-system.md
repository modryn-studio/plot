# Design system — plot

> Phase 3 artifact. **Short on purpose.** The house system — every state mechanic, the elevation
> split, the derivation formulas, the motion curves, what a project may and may not change — lives
> in `modryn-hq@v4:playbooks/design-rules.md` and is shipped in `modryn-base`. **Read that first.**
> This file records only what is *plot's*, which is a much smaller list than it used to be.

**Status:** locked 2026-08-20 (tokens, face, radius). Components are the boilerplate's.
**Last amended:** 2026-08-20 — rewritten after the design layer was reset onto the house system.

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
| `elevated` | `#fffdf9` | `#232120` |
| `border` | `#e3ddd1` | `#3b3833` |
| `field` | `#8a8377` | `#8a8880` |
| `text` | `#1c1a16` | `#ece9e3` |
| `muted` | `#6f6a61` | `#918c84` |
| `rule` | `#efeae1` | `#2e2c29` |

Every SaaS default ground is a blue-grey; a field guide is printed on paper. The ramp
relationships are the house's and are unchanged — `surface` recessed, `elevated` raised, `bg`
between, `border` deliberately faint on `elevated` because a labelled control is already
identified by its label.

**This recolour cleared a contrast failure the boilerplate ships with.** `muted on surface`
measures **4.40 (fails)** in base's palette and **4.64 (AA)** in plot's. That is not why the warm
values were chosen, but it is worth recording: the constraint that muted must never carry prose
still holds, and now the metadata itself has margin.

### Accent: cyanotype

`#22517d` light · `#6ea6d8` dark.

**A blueprint is literally a cyanotype**, which earns this blue for a measured-drawing product
rather than picking it by elimination. It is deep and desaturated: it reads as drawing ink, not as
the bright blue of a link or the violet the boilerplate bans by name.

The alternatives were genuinely narrow and worth recording so nobody re-opens it casually:
**not green** — green is this subject's colour (grass, shrubs, the plant palette, the aerial), and
chrome wearing the plate's ink is the one thing the field-guide standard forbids. **Not amber or
red** — `warning` and `danger` own those. **Not violet** — the house rule says so outright.

**One constraint this creates, recorded now so it is not discovered later:** a marked water area
on the plan **never renders in the accent hue.** Water is subject, the accent is chrome, and a
blue wash beside a blue button is the same collision green would have been. Use a hatch or a
neutral wash.

### Semantics

`success #2f7a43 / #6fc887` · `warning #a85a09 / #e8a94a` · `danger #b3271f / #ef8279`.

Deepened from base's so the light values clear AA on the page — the rack calls amber-on-light
"the usual miss", and plot's measures 4.79. Green survives here and only here: `success` appears
on document surfaces with no photograph and no plant symbols, so there is no subject collision.

### Face: two, and the serif is the argument

`--font-heading: Source Serif 4` · `--font-sans: Inter`

A field guide is a serif document and every AI SaaS is not, which makes this the cheapest
differentiator available and one that serves the standard rather than decorating it.

**This is the one place plot diverges from the boilerplate's structure rather than its values.**
The house ships a single face on `<body>`. Plot splits it: headings take the serif, the interface
takes the sans, because the reading happens outdoors on a phone at 14px, where a text serif gives
up legibility it does not owe. Assigned once in `@layer base`; no component names a font.

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
value against what the browser rendered. After the recolour, **every pair passes AA except three,
and all three are deliberate and documented in `design-rules.md`**:

- `border on bg` 1.27 / 1.62 — a labelled control is identified by its label, so its edge may be
  faint at rest and jump on focus.
- `border-strong on bg` 1.78 / 2.35 and `on elevated` 1.86 / 2.00 — a hover border is a judgement
  call, not a contrast target. Recorded as *"accepted, not missed"* so nobody fixes it back up.

Type steps render exactly as declared (48/52, 36/40, 28/32, 22/28, 18/28).

---

## 3. Still open

- **The rack has never been opened on a real phone outdoors**, which is the condition this whole
  system is designed against. That is a deploy away, and the rack ships to production for it.
- **`spec.md` does not state that condition.** Sunlight, gloves, one-handed use and offline appear
  nowhere in it, so the design system has been asserting a use context its own spec does not
  carry. Close that before someone trades the contrast floors and target sizes away for tidiness.
- **No product components exist yet**, deliberately. The eight built on 2026-08-17 were made ahead
  of any screen that needed them and are gone (recoverable at `049cc4c`). Rebuild against the
  house system when a real screen asks — and per house rule, **a new primitive means a new sink
  section in the same commit.**
