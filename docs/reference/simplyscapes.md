# Teardown — SimplyScapes

**Read live 2026-08-17** via `chrome-devtools` CLI, logged in as Luke, free plan.
Marketing `www.simplyscapes.com`, product `app.simplyscapes.com`.

**Threat rank: #1.** Not because of craft — the craft is unremarkable — but because it is
deliberately aimed at both audiences at once, has genuine data depth, and gives homeowners a
free tier. It is the closest thing in the market to this project's premise.

---

## Information architecture

Deceptively thin on the surface, deeper underneath.

**Visible nav (authed):** `Designs`. That is the entire sidebar. Plus Help, user menu, and an
"Upgrade Plan" banner reading `0 of 3 Free designs`.

**Actual route structure**, recovered from Next.js App Router chunk paths rather than clicking:

```
app/(auth)/signin
app/(main)/page                          — root
app/(main)/[workspaceId]/designs         — the only nav destination
app/visual-designer/[designId]           — the editor, outside the (main) shell
```

**The entity model is three levels deeper than the nav admits:**

- **Workspace** — top-level, in every URL. Luke's is named "My Yard", labelled `Free` /
  `Just You`. Multi-tenant and team-aware from day one, for a product whose primary user is
  one person.
- **Property** — the new-design dialog has a `Select Property` field. Properties exist as
  first-class records; nothing in the nav exposes them.
- **Design** — belongs to a property, carries a **Design Area** from a fixed six:
  Front Yard · Backyard · Side Yard · Patio or Deck · Garden or Planter Bed ·
  **Park Strip (Curbside)**.
- **Photo** — the root input. Uploaded photos are reusable across designs ("OR PICK FROM
  EXISTING PHOTOS").

*Park Strip (Curbside) is not a natural sixth category for a design tool. It is there because
of the water-agency channel — curbside strips are what municipal turf-replacement rebates pay
for.*

## Key flows

**Create:** `New Design` → dialog "Start a new design / Upload a photo of the space, or pick one
you've uploaded before" → upload (JPG/PNG/WEBP/HEIC, ≤25 MB) → **optional** details step
(design name, property, design area — "Add details now, or skip and do it later") → `Open design`
→ `/visual-designer/[id]`.

Worth noting: **the metadata step is skippable.** They ask what the space is, but refuse to
block on it. The photo is the only required input.

**The designer.** Toolbar: `File · Share · AI · Plants · Objects · Images · Draw · Clone`, zoom
slider (10–200%), export menu, fullscreen. A canvas app — most state is not in the DOM.

## The plant library — their actual moat

This is the deepest thing in the product and the hardest to clone. Filter axes:

| Group | Fields |
|---|---|
| Details | Plant Function, **Plant Layer** |
| Size | Width min, Width max, **Height min, Height max** |
| Requirements | Water Requirements, Sun Exposure, **Soil Chemistry** |

**Plant Layer and mature width/height are planting-design concepts, not catalog fields.** Layer
is canopy/understory/groundcover thinking; min-max mature size is the discipline that stops a
shrub eating a walkway in year six. Whoever specced this understood planting design.

**Types (11):** Shade Trees · Shrubs & Roses · Perennials & Annuals · Ornamental Grasses ·
Conifer Trees · Flowering Trees · Edible Plants · Annuals · Vines & Groundcovers · Succulents ·
House Plants & Tropicals

**Plant Combinations:** "All-Season Blooms 1–10" — pre-composed groupings, i.e. the product
knows a plant is chosen *with* others, not alone.

**Plant Collections:** Drought-Tolerant · Beautiful Blooms · Foliage Focus™ · True Textures™ ·
Herbs and Medicinal · Privacy Screens · Pollinator Friendly · Shade-Loving · Low-Maintenance
Shrubs · Fragrant. *(Two are trademarked, so the collections are treated as branded IP.)*

Plants are served as real photographs from CloudFront, filenames carrying botanical name, a
sequence and often a month — `Agave-parryi---SS---2---April.webp`,
`Calamagrostis-acutiflora---SS---23.webp`. **They photograph the same plant across the season.**
That is a genuine multi-year data asset and the part of this business that cannot be vibe-coded.

**Not found in the filter panel: hardiness zone.** The marketing claims climate-zone filtering;
the designer's filter offers Water / Sun / Soil Chemistry and mature size, but no zone control.
Either it is applied implicitly from the property, or the claim is softer than stated.

## Gaps and openings — the gold

1. **The free tier is far more limited than the marketing says.** The pricing page promises the
   free plan includes the "Visual Designer — full toolkit, including generative AI". Inside the
   editor the banner reads **`0/5 design elements used. Upgrade for full access.`** Five elements
   is not a yard. This is the single biggest honesty gap in the product and it is only visible
   from inside — exactly what a live read buys you over a landing page.
2. **The output stops at a picture and a shopping list.** Free tier's stated deliverable is
   "Create a shopping list". There is no quantity math, no spacing, no bed area, no soil volume,
   no cost, and **no order of operations**.
3. **No sequencing whatsoever.** Nothing tells you what to do first, what has to cure, what
   season to plant in, or what to rent. For a homeowner holding the shovel this is the whole job.
4. **Measurement is beta and aerial-only.** "Switch to the aerial view, draw areas, and get
   measurements for material takeoffs (beta)." Areas only — no grade, no drainage, no volume.
5. **The IA hides its own structure.** Property and Workspace exist as records but never appear
   in the nav, so a user with three areas of one yard has no place that shows the yard.
6. **It is pro-first in tone.** Every headline sells *winning the job*. The homeowner is a
   second audience reached by a second landing page, not a different product.

## Visual signature (5 lines)

Stock **shadcn/ui defaults**, essentially untouched: oklch neutral ramp, `--radius: .625rem`,
default `chart-1..5` and full `sidebar-*` token set. One swap: `--primary: #5b92e5`, a generic
blue — in a landscape product. `--brand: oklch(62.3% .214 259.815)` (blue again),
`--highlight: oklch(85.2% .199 91.936)` (yellow). Type is **Nunito** (300/400/600/700/800).
Net: a competent developer's default theme, not a designed system. Craft is available here —
but per the playbook it is table stakes, not the wedge.

## Table-stakes checklist (what we must match thinly)

Photo upload · design-area taxonomy · a filterable plant library with mature size · plant
groupings/collections · AI first-draft on the real photo · manual placement on the same canvas ·
before/after compare · PDF and image export · shareable link · saved properties and reusable
photos.
