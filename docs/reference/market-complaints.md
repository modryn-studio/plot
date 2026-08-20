# What the market gets wrong, from its own users

**Ported from `modryn-builds/yard` on 2026-08-20, researched there 2026-08-16.** Kept verbatim
below the line; the notes in this header are plot's.

**Why it is here.** Everything else in `reference/` is a teardown — me driving a competitor and
reading its markup. This is a different and complementary class of evidence: **complaints from
people who actually paid and were disappointed**, gathered from published reviews. A teardown says
what a product does. This says what it costs the person using it.

**Three of the six land directly on decisions plot has already made**, and one lands on a gap:

| # | Complaint | Where plot stands |
|---|---|---|
| 1 | **The scale is wrong** | Immune, and this is the whole thesis. A photo has no scale, so nothing downstream can be right except by accident. Plot's numbers come off geometry. |
| 2 | **Plants are look-alikes, not species** | Covered by S5: zone and sun filter the palette, mature footprint is the default draw. |
| 3 | **Everything blooms at once** | **GAP.** Plot cut the seasonal timeline to `NOT IN V1`. The complaint says a planting plan that cannot say what the bed looks like in February is not finished. See the note in `spec.md` §4. |
| 4 | **Ground-level reality is invisible** | Partly covered, and the reason the Look view is a ground photo at all. Slope and aspect are derived; grade against siding and downspout discharge are not. |
| 5 | **The record is stale and nobody says so** | Covered by the schema (`captured_at`, imagery date in `derived`) but **not yet required by a story** — see `spec.md` §1b. |
| 6 | **Paywalls on the part that matters** | Not a live decision, but it names which half users think is valuable: **not the render, the buy list.** That is a pricing input for later. |

The pattern across all six is the one plot is built on: **the market sells a picture of the end
state and is weakest at everything required to get there.**

---

## The original, as written in yard

Researched 2026-08-16, from published reviews and comparisons of the current generation of consumer
landscape-design apps. Sources at the bottom.

This is not a competitor list. It is a list of **failure modes to be structurally incapable of**.

---

## The market as it stands

The current leaders are photo-in / render-out tools: upload a picture of your yard, get a
photorealistic redesign plus a plant list, roughly $15–20/month. Gardenly, iScape, Neighborbrite,
Remodel AI, and a long tail of near-identical AI wrappers. SketchUp remains the serious option for
people who want real control and are willing to pay for it in effort.

The category has converged hard on one output: **a beautiful picture of your yard, changed.**

---

## The complaints

Ordered by how badly each one damages trust, worst first.

### 1. The scale is wrong

Reviewers report plants rendered at sizes they never reach, and whole projects whose scale reads as
plausible but is not. A bed that looks right in a render is 40% too small on the ground.

**Why it happens.** The render is generated from a photograph. A photograph has no scale. Nothing in
the pipeline ever knew how many feet across the yard was, so nothing could get it right except by
accident.

**What it means here.** This is the single most expensive failure in the list, because it survives
all the way to a materials order. It is also the one this project is already immune to, and the
reason `/site` exists at all: 745.8 ft of measured boundary, per-edge bearings, and a county
acreage that agrees with the measured figure to a thousandth. A design read off that base plan
cannot be off by 40%.

### 2. Plants are look-alike objects, not species

The render shows *a shrub shape that resembles* what was asked for. Users then discover the
suggested plant will not survive their winter, or is not sold in their region, or is a different
genus entirely from what the picture depicts.

**Why it happens.** The image model is optimising for a convincing picture. Nothing in that loop is
checking a hardiness zone.

**What it means here.** Verify, don't assume (`method.md` §6) already covers it, and the `oudolf`
brief is explicitly *mature size against the space that actually exists*. The discipline to import
is: **a plant is not chosen until its zone, mature dimensions, and regional availability have been
checked against a source.** Never a plausible name from memory.

### 3. Everything blooms at once

Renders show combinations in simultaneous flower that cannot co-occur — a June plant and a
September plant in the same frame, both peaking.

**Why it happens.** The training data is photographs of gardens at their single best moment. There
is no model of time.

**What it means here.** This is the exact failure `oudolf` exists to prevent: *structure over
colour, the whole year including the dead months.* A planting plan that cannot say what the bed
looks like in February is not finished. Worth stating as a deliverable requirement rather than a
preference.

### 4. Ground-level reality is invisible

The most-cited concrete example: a flat patio rendered onto a yard that actually slopes, where the
real build needs tiers or a retaining wall. Also drainage, grading, sun, irrigation, and local code
— none of which appear in an overhead or a hero photo.

**Why it happens.** Overhead imagery and a single wide photo genuinely do not contain this
information. It is not a model failure so much as an input failure.

**What it means here.** **This is the one failure this project is currently exposed to.** The base
plan is overhead, Google-derived, and modelled on a 2021 surface. Slope, standing water, grade
against siding, and downspout discharge are all invisible in it. That is the entire argument for the
ground-photo pass in `docs/photo-brief.md`, and the reason `silva` holds a veto seat on
buildability. It is also why the ground photos are not a nice-to-have: they are the only correction
layer that exists.

### 5. The record is stale and nobody says so

Related, and rarely listed as a complaint because users do not know to make it: the imagery
underneath these tools is often years old, and the tool presents it without a date.

**What it means here.** Already handled, and worth not regressing. The sun overlay states *"Built
from 2021-03-12 imagery, so it knows the trees as they were then."* A capture date and an imagery
date are different facts and both get shown. The same instinct as showing measured and recorded
acreage separately rather than reconciling them: **the disagreement is the useful part.**

### 6. Paywalls on the part that matters

Users report paying for the app and then hitting a second charge for plant identification and
shopping lists — the outputs that convert a picture into an action.

**What it means here.** Not a live decision. Recorded because it identifies which part of the
product users consider the valuable half: **not the render — the list of what to actually buy and
do.**

---

## What this rules in

The pattern across all six is the same. **The market sells a picture of the end state and is weakest
at everything required to get there.** Scale, species, season, site conditions, currency of the
data, and the buy list are all the unglamorous half, and all six complaints live there.

The unglamorous half is what this repo already produces. That is not a strategy that was chosen; it
fell out of `method.md` §6 and of building the base plan first. Worth being deliberate about it now:

- **Do not chase the render.** It is where the whole category is losing credibility, and it is the
  one output that cannot be verified.
- **A measured, dated record of one real property, accumulating across seasons, is the asset.**
  Every complaint above is a symptom of not having one.
- **The deliverable is a decision, not a document** (`method.md` §9), and increasingly: a decision
  plus what to buy.

---

## Sources

- [iScape — best landscape design tools for homeowners in 2026](https://www.iscapeit.com/blog/best-landscape-design-tools-for-homeowners-in-2026)
- [Neighborbrite — 6 best landscape design apps for homeowners in 2026](https://neighborbrite.com/blog/best-landscape-design-apps-for-homeowners-2026)
- [Gardenly — best AI landscape design apps in 2026](https://gardenly.app/blog/best-ai-landscape-design-apps-2026)
- [Kingstowne Lawn & Landscape — should I use AI to design my backyard?](https://www.kingstownelawn.com/blog/use-ai-design-backyard-diy-professional-landscape-design)
- [TechRadar — best landscape design software of 2026](https://www.techradar.com/best/3d-landscape-design-software)
