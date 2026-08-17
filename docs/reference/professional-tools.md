# Teardown — the professional tools

**Phase 2 structural craft recon.** Read 2026-08-17 from vendor product pages and published FAQ
documents. These are desktop Windows applications, so there is no DOM to drive — but the vendor
material is unusually explicit about workflow, which is exactly the IA question.

**This is the reference set Luke asked for in the opening message.** It got deprioritised during
phase 1 for being hard to read; that was the wrong call and it has been corrected.

---

## The professional loop, stated by the vendors themselves

Both leading products describe the same sequence, and it is the inverse of the consumer tools:

> **base plan (to scale) → design in 2D → one click to 3D → quantities and construction plans
> fall out of the same file**

Structure Studios states it plainly: draw in 2D, continue in interactive 3D, and when it is time
to build, the construction plans come from that same project — *"no redrawing, no rebuilding."*

**The 2D drawing is the authoritative artifact. The 3D is a view of it. The takeoff is a report
on it.** PRO Landscape says the same thing from the other side: you define 3D properties *in 2D*,
then add patterns and textures to produce the 3D.

This is the single most important structural finding of the whole recon, and it is the exact
opposite of how the consumer category is built (image first, everything else impossible).

---

## VizTerra (Structure Studios) — v4, shipped 2026-04-07

### Site acquisition — they solved the problem Luke deferred

**Type in the client's address and design on their actual lot instead of an empty grid.** For a
small additional cost, GIS returns:

- parcel boundaries
- **setbacks**
- the home's footprint
- high-resolution aerial imagery
- **all set to scale**

This is a shipping, paid-for, professional-grade answer to site acquisition, and it validates the
instinct Luke recorded as deferred ("a lot of ways to use APIs"). It also sets the bar: a
credible base plan is *boundary + setback + house footprint + scaled aerial*, not just a photo.

Note what it does **not** give: grade. Elevation and drainage still come from somewhere else.

### The workflow is guided, not a toolbar

> *"A guided, step-by-step workflow shows you the right tool at each stage."*

This is the direct answer to what is wrong with Arcadium's IA. Arcadium presents nine equal
drawers and lets you work out the order. The professional tool **sequences the work and surfaces
the right tool for the current stage.** For a homeowner who has never done this, that is not a
convenience — it is the entire difference between usable and not.

### Quantities are continuous, not a final step

Measurements and square footage calculate **as you design**, and the numbers drop straight onto
the construction plans. The takeoff is not a button at the end; it is a live property of the
model.

### Library scale

1,922 3D objects and furniture · 1,241 HD materials · **1,748 trees and shrubs** · all
purpose-built in 3D.

### Their own competitive framing — it matches ours exactly

Structure Studios describes the market as forcing a choice between architect/engineer-grade
software that is hard to learn and slow, and photo-overlay or 2D-only tools that cannot produce
true 3D or build-ready plans.

**That is precisely the axis identified in [`recon.md`](../recon.md) and confirmed by Luke.**
VizTerra resolves it — *for a professional selling a job*. Nobody has resolved it for an owner
keeping a property.

### Scale claim

2 million+ projects designed yearly. Their published customer story is explicitly about selling:
a contractor who closes ~95% of what he presents in 3D.

---

## PRO Landscape+ (Drafix Software)

### Positioning — "CAD specifically for landscape design"

Built to produce accurate site plans with the shortest learning curve possible, using **landscape
terminology** rather than CAD terminology, with **no prior CAD knowledge required.**

**The professionals already solved the vocabulary problem.** Luke's insight — geometry with a
landscape object model rather than an architectural one — is not speculative. It is what the
category leader sells as its primary advantage. It has simply never been pointed at an owner.

### Three routes to a base plan — and the third is the accuracy answer

1. **Import CAD** — DWG, DXF, PDF (RealDWG).
2. **Import and scale a survey, plot plan, or Google Earth image.**
3. **Draw from your own measurements** — start a line and the distance displays live as you draw.

Route 3 is exactly the verify-with-a-tape process Luke described. The professional answer to
accuracy is *not* a perfect data source; it is **a fast, legible way to draw what you measured,
with the number visible while you draw it.** That is a UI decision, not a data problem.

### Layers, phasing, and the strongest single find in the recon

Layer management drives output: print a planting plan and a separate irrigation plan from one
drawing. And then this —

> **You can bid any or all layers. Bid phase 1 this year, then next year bid phase 2, all from
> the same drawing.**

**Multi-year phasing off one persistent model is already a professional concept.** Luke's
durable-property-over-years thesis is not a novel invention that needs proving; it is standard
professional practice, expressed as layers plus phased bidding, and it has simply never been
given to the owner. The consumer tools cannot do it because they have no model to phase.

### The takeoff is the point

*"Not just a design but a complete, accurate take-off"* — plant symbols, edging, retaining walls,
pavers, mulch, grass. Select the plant size for each symbol and **the size and its price carry
through to the bid.**

### Plants are drawn at mature size by default

Pre-defined symbols are drawn to **mature plant size**. Symbol look, colour, size and line weight
are all adjustable, custom symbols supported, automatic render modes (hand-drawn, pastel).

This is Oudolf's argument as a default setting. The consumer tools draw a plant at the size it
looks good today; the professional tools draw the space it will actually occupy. That single
default is the difference between a design that works in year eight and one that doesn't.

### Automation worth noting

One-click plant legends · custom title blocks · automatic render modes · drawing defaults ·
**automatic sprinkler layout** · photo-imaging projects convert automatically into a CAD drawing
(the two surfaces are connected, not separate products).

### Module structure (their own feature nav)

Photo Imaging · Easy-To-Use CAD · Proposal Creation · 3D Rendering · Night Lighting ·
Companion App.

---

## The hardware wall — and why it is our opening

Structure Studios' published requirements:

| | Minimum | Recommended |
|---|---|---|
| OS | **Windows 10/11 only** | — |
| GPU | Dedicated DirectX 12, PassMark ≥ 4500 | High-performance dedicated |
| VRAM | — | 8 GB+ |
| RAM | 16 GB | 32 GB+ |
| Storage | SSD | M.2 NVMe |

**No macOS. No Boot Camp for v3/v4** (MacBook Pros don't support DirectX 12). Parallels not
suggested, VMware Fusion will not work. Integrated Intel graphics explicitly unsupported.

A homeowner is not buying a Windows workstation with a dedicated GPU to plan a patio. **The tools
that have the right model are locked to hardware our user does not own.** Browser delivery is
therefore not a convenience choice — it is the structural reason this product can exist at all,
and it is why Arcadium mattered as a proof that real geometry runs in a tab.

---

## What to take

1. **2D is authoritative; 3D is a view; the takeoff is a report.** Get this order right and
   quantities are free. Get it wrong and they are impossible.
2. **A guided, staged workflow that surfaces the right tool now** — not a flat toolbar of equal
   drawers. This is the fix for what Luke dislikes about Arcadium's IA.
3. **Address → GIS base plan**: parcel boundary, setbacks, house footprint, scaled aerial.
4. **Live dimension readout while drawing** — the cheap, legible answer to "verify with a tape."
5. **Layers as the phasing mechanism**, so one model serves this year's patio and next year's
   beds, and can produce a quantity for either.
6. **Plants drawn at mature footprint by default.**
7. **Quantities computed continuously**, with size feeding price.

## What to leave

- **Everything aimed at winning a bid.** Proposals, contracts, branded title blocks, close-rate
  framing. Our user is not selling the job; they are doing it. This is the largest single block
  of professional surface area that should not be ported.
- **The plotter/sheet-set mental model.** Paper size, scale selection and title blocks are
  artifacts of handing drawings to a crew and a permit office.
- **Night lighting and presentation video** as first-class modules — those exist to sell.
- **CAD file interchange** (DWG/DXF) as a headline feature.

## Still to read

- **DynaSCAPE** — design + takeoff + estimating as one chain.
- **Vectorworks Landmark** — CAD-native discipline layering and grading.
- **Land F/X** — **blocked**: `landfx.com/docs` sits behind a human-verification wall, which is
  not something to work around. Its structure is partially recoverable from search result
  snippets: separate Planting and Irrigation overviews, Plant Schedules (with codes, spacing,
  cost estimates, symbols), Work Areas as a schedule-scoping mechanism, and Preference Sets for
  per-client/per-region office standards. The **Work Area** concept — scoping a schedule to a
  region of the drawing — is worth a closer look, since it is plausibly how an owner asks "what
  does *this* bed cost."
