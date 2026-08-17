# Recon — professional landscape design tools

**Project:** `plot` *(working slug — not named yet, that's Jobs' call in phase 1/2)*
**Blueprint phase:** 1 (Discovery — problem recon)
**Started:** 2026-08-17
**Method:** [`read-live-competitor.md`](../../playbooks/read-live-competitor.md), `chrome-devtools` CLI v1.7.0

**Decisions locked at kickoff (Luke, 2026-08-17):**
- Category to mine: **design / visualization**, not business-ops.
- Vessel: **brand new project, new repo.** Not [[project_yard]], not groundwork, not stake.
- ~~Who: the one-project homeowner.~~ **Superseded same day** — see below.

**Direction corrected (Luke, 2026-08-17, after reviewing the authed drives):**
- **Who: a property-rooted owner.** A durable, measured property that persists and gets worked
  on over **years**. The project is the door; the property is the relationship.
- **SimplyScapes and Neighborbrite are rejected as references.** Luke does not want to copy or
  take anything from either. Their teardowns stand only as evidence of what the category
  structurally cannot do — **not** as pattern sources.
- **Arcadium 3D stays on the table** for 3D rendering and interaction quality. Its **IA is still
  wrong** (a house-design object model with Garden as one drawer of nine).
- **The reference set is the professional tools** — which is what Luke asked for in the opening
  message. See "Recon targeting was wrong" below.
- **Deferred, not solved:** how the site model gets acquired (trace satellite / tape / plat /
  parcel-GIS APIs). Luke: solvable with APIs and search, not the current focus.

The current phase 1 artifact is [`problem-brief.md`](problem-brief.md), rewritten against this
direction.

---

## The readability verdict

The reason this mattered enough to check first: the recon method only works on a DOM. My opening
read was that design/visualization tools are desktop and therefore unreadable. **That was too
pessimistic — the pro design category has largely moved to the browser since ~2024.** Roughly
half the serious tools are now fully live-readable.

| Tier | Readable? | What it costs us |
|---|---|---|
| A — pro tools that run in the browser | **Yes, fully** | Nothing. Snapshot, computed styles, CSS rules, driven interaction. |
| B — pro-service homeowner portals | **Yes, fully** | Nothing. |
| C — desktop / CAD incumbents | **No** | Screenshots, docs, and vendor tutorial video only. |

Tier C is not skippable — VizTerra and PRO Landscape are where the professional IA actually
comes from, and their conventions are what tiers A and B are imitating. But it gets read the
slow way, and its findings are lower-confidence by construction.

---

## Tier A — browser-based professional tools (live-readable)

### SimplyScapes — `simplyscapes.com` / `app.simplyscapes.com`
**Read: landing + pricing, 2026-08-17. Not yet logged in.**

The closest thing in the market to what this project proposes, and therefore the most important
one to get inside. It runs **both sides of the transform in a single product** — a `/solutions/
landscaping-professionals` page and a `/solutions/homeowners` page, same canvas underneath.

- **Positioning:** "Show the 'after' before they sign. Win the job." Pro-first headline,
  homeowner as the second audience.
- **Core loop, their words:** photo in → AI drafts a concept → you finish it plant by plant →
  export PDF proposal. "From photo to proposal in 15 minutes."
- **The stated wedge**, and it is a good one: *"An AI image you can't edit is an idea, not a
  plan."* They are explicitly positioned against one-shot AI render toys.
- **Depth moat:** 2,400+ plants, 7,000+ real photographs (not symbols/clipart), filtered by
  climate zone, water use, sun, mature size. Aerial measure for material takeoffs (beta).
- **Pricing:** Free forever — full Visual Designer incl. generative AI, 3 active designs,
  limited library, **no credit card**. Plus $29.99/mo — unlimited designs, full drag-and-drop
  library. Enterprise — white-label, team workspaces.
- **Distribution tell, and this is the interesting one:** partnered with **water agencies and
  conservation programs** — Utah Water Ways, Irvine Ranch Water District, Slow the Flow,
  Alliance for Water Efficiency. Rebate-funded lawn conversion is their channel.
- **Free tier gives homeowners the whole toolkit.** The paywall is *volume and library breadth*,
  not capability. Worth noting before assuming a homeowner tier is an opening.

### Neighborbrite — `neighborbrite.com` / `app.neighborbrite.com`
**Read: `/landscapers`, 2026-08-17. Not yet logged in.**

- **Claim:** 15M+ designs generated. Named logos of real landscaping companies (K&D Landscaping,
  Charleston Landscape, Citiscapes, Blair Brothers, Mountain View Landscaping). This is traction,
  not vapor — rank it as a real threat.
- **Positioning:** pure sales-enablement for the contractor. "Win more landscaping jobs."
- **The whole pitch is a friction table** — old way vs. Neighborbrite across visual clarity,
  speed, client understanding, scope definition, revisions, pricing conversations, closing.
  Note what they think they're selling: **scope agreement before pricing**, not pretty pictures.
- Consumer side exists on the same app host.

### Arcadium 3D — `arcadium3d.com`
- Browser-based **3D** (tiers A above are photo-overlay 2.5D; this is real 3D + first-person
  walkthrough). Free plan with full design tools. Register at `/register`.
- Notable: **share a project instantly via URL** with clients, contractors, or family.
- Reviews quoted skew architect/office, so it is a generalist that does landscape, not a
  landscape native.

### Cedreo — `cedreo.com` / signup at `/signup`
- Cloud-hosted rendering (all processing offloaded). 100k+ remodelers/builders/designers.
- Free $0 tier, then Personal $139, Pro $79–129, Enterprise $119–159.
- Interior-first with exterior massing and terrain. Useful for **plan-set and to-scale
  deliverable conventions**, less so for planting.

### Also in tier A, not yet read
Coohom, Homestyler (has a landscape mode), SketchUp for Web, ArcSite (pro CAD, contractor
takeoffs — confirm web vs iPad).

---

## Tier B — pro-service homeowner portals (live-readable, not yet read)

These matter more than their size suggests: they are **already the pro→consumer translation
layer**. A professional designer produces the work; a homeowner receives and acts on it through
a web app. That receiving surface is close to this project's actual output screen.

- **Yardzen** — the premium one. NYT/WSJ/Forbes coverage. Flow: share vision + budget + media →
  designer produces concept in ~2 weeks → review → revise → approve. Delivers 3D renders,
  detailed plans, and a contractor hand-off.
- **Tilly** — collaborative, direct designer access, post-design support.
- **ShrubHub** — budget/fast, and explicitly aimed at **DIY** — delivers the 3D plan and stops.
  Closest to our named user.
- **Bacqyard** — fourth name in the same set.

**Read these for:** what a homeowner is actually handed at the end, how a plan is made
actionable for someone who will hold the shovel, and what the revision loop looks like.

---

## Tier C — desktop / CAD incumbents (screenshots + docs only)

Where the professional IA genuinely originates. Not live-readable — no DOM.

- **Structure Studios** — VizTerra (landscape/hardscape), Pool Studio, Vip3D. **Version 4
  shipped 2026-04-07**: rebuilt 3D engine, path tracing, dynamic global illumination, 1,000+ new
  assets. The premium visual bar in the category. Core loop: draw in 2D → transform to 3D →
  interactive 3D presentation shared with the client.
- **PRO Landscape+** — the full design-build workflow in one Windows app: design over a photo of
  the client's property, draw an accurate CAD plan for the crew, generate a bid via one-click
  proposal. Lighting module. Companion tablet app for field presentation. **This is the most
  complete professional IA in the category** and the primary Tier C study target.
- **Realtime Landscaping Pro** — one-time fee, thousands of plants/objects, animations.
- **DynaSCAPE**, **Vectorworks Landmark**, **Land F/X** (AutoCAD plugin) — the CAD-native end.

---

## Synthesis after the authed drives (2026-08-17)

Three products driven live and logged in. Full teardowns in [`reference/`](reference/).
What the three reads add up to:

### The market splits on one axis, and nobody is on both ends

| | Landscape-native | Spatial rigor | Learning curve | Ends at |
|---|---|---|---|---|
| Neighborbrite | yes | none | ~90 seconds | a picture + a contractor referral |
| SimplyScapes | yes | aerial area (beta) | minutes | a picture + a shopping list |
| Arcadium 3D | **no** — one drawer of nine | **full CAD** | tutorial videos | a 3D model |
| PRO Landscape / VizTerra *(tier C)* | yes | full CAD | professional training | a CAD plan **for a crew** |

**The tools that know plants have no measurement. The tools that measure don't know plants. The
tools that do both are desktop, expensive, and produce documents for a paid crew.**

### Every single one of them stops at the picture

This is the finding. Across all three, driven end to end:

- No quantities. Not one product said how many plants, how much mulch, how many pavers.
- No dimensions that become materials. SimplyScapes' area measure is beta and aerial-only.
- No cost, anywhere.
- **No sequence.** Nothing says what to do first, what has to cure before what, what to rent,
  what to do this weekend versus next spring.
- Nothing models grade or drainage. Neighborbrite's entire slope model is **Flat / Slope**.
- Nothing takes real inventory of what is already in the yard. The closest is one line of
  Neighborbrite empty-state copy: *"plants you own, want to move."*

Neighborbrite's own taxonomy gives the game away. Its Toolbox groups three features under
**"Finish and plan"**: high resolution, auto enhance, identify plants. **In this category,
"plan" means "a better picture."**

### Why the incumbents structurally cannot close that gap

Neighborbrite's results screen carries a primary action: **"Find a landscaper — get a free quote
from a top rated landscaper in your area,"** and its marketing site is aimed at contractors. It
is a **lead-generation business wearing a design tool**. SimplyScapes is pro-first in every
headline — its homeowner page is a second door onto a product built to help someone *win a bid*.

**A homeowner who can build it themselves is, to both of them, a lost referral.** Closing the
DIY gap is not an oversight they can patch next sprint; it is against their revenue. That is the
definition the blueprint asks for: something they structurally can't copy in a week.

### ~~The spin candidate~~ — superseded 2026-08-17

The original candidate here was *"add the contractor's build sequence to the picture the
incumbents already produce."* **Luke rejected it, and he was right.** It was a real answer built
on a fake foundation: you cannot derive a sequence, a quantity, or a cost from a photograph,
because a photograph has no geometry. Sequencing was a feature bolted onto pixels.

**The corrected spin: the durable, measured model of the property IS the product.** Renders,
quantities and sequence are *derived outputs*. See [`problem-brief.md`](problem-brief.md).

This reframes the finding below rather than discarding it. "Everyone stops at the picture" is
still the correct diagnosis of the category — but the cause is not laziness at the end of the
pipeline, it is the absence of a model at the start of it.

### ~~Patterns worth stealing outright~~ — withdrawn 2026-08-17

This section previously listed eight patterns to lift, six of them from SimplyScapes and
Neighborbrite. **Luke has ruled both out as references** — he does not want to copy or take
anything from either. The list is withdrawn rather than quietly re-used under a different
heading.

What survives, because it was never from those two:

- **Arcadium's `Draw → Area`, surface snap, named elevations, cross-section, and always-visible
  `Ft & in` units.** Area-outline is the single control that turns geometry into a materials
  quantity. Arcadium remains an approved reference for **rendering and interaction**, not IA.

### Recon targeting was wrong, and that's on me

Luke's opening message asked for the UI/UX/IA of **professional landscaper products**. I read
three consumer tools instead, because those were the ones with a DOM I could drive. I optimised
for what was easy to read rather than what was asked for — and the easy ones turned out to be
the wrong ones. Two of the three are now rejected outright.

The intel is not wasted: it establishes what the consumer category structurally cannot do, which
is real evidence for the brief. But the **actual reference set is the professional tools**, and
they were sitting in Tier C the whole time being deprioritised for being hard to read.

**Reprioritised targets — these are now primary:**

| Product | Why it matters | How to read it |
|---|---|---|
| **PRO Landscape+** | The most complete professional IA in the category: photo design → accurate CAD plan → one-click bid | Docs, tutorial video, trial screenshots |
| **VizTerra** (Structure Studios v4) | The 2D→3D→presentation loop, and the premium visual bar | Docs, v4 launch material, training video |
| **DynaSCAPE** | Design + takeoff + estimating as one chain | Docs, video |
| **Vectorworks Landmark** / **Land F/X** | CAD-native discipline layering, plant schedules, grading | Docs, video |
| **Arcadium 3D** | Browser-native spatial interaction, already read live | ✅ done — [`reference/arcadium3d.md`](reference/arcadium3d.md) |

None of the first four are browser apps, so the live-read CLI does not apply. Read them the slow
way: vendor documentation, feature pages, and — most valuable — **training/tutorial videos**,
because a tutorial walks the real workflow in the real order, which is exactly the IA question.

### Honest threat rank

1. **SimplyScapes** — closest premise, real data depth, free homeowner tier. Beatable on honesty
   (below) and on everything after the picture.
2. **Neighborbrite** — weaker plant model, far stronger distribution (15M+ designs, named
   contractor logos). Rank on traction, per the playbook.
3. **Tier C desktop (PRO Landscape, VizTerra v4)** — not competing for our user, but they own the
   professional IA we are translating. Study, don't fear.
4. **Arcadium 3D / Cedreo** — generalists. A teacher, not a rival.

**The honesty opening at SimplyScapes:** its pricing page sells the free plan as the "Visual
Designer — full toolkit". Inside the editor the banner reads **`0/5 design elements used`**. Five
elements is not a yard. Only a logged-in read surfaces that.

---

## Status

- [x] Category map built, readability verdict established
- [x] SimplyScapes — landing, pricing, **authed: designs list, new-design flow, visual designer,
      plant library and filter schema** → [`reference/simplyscapes.md`](reference/simplyscapes.md)
- [x] Neighborbrite — **authed: a complete design driven end to end**, all six wizard steps,
      toolbox, plant lists → [`reference/neighborbrite.md`](reference/neighborbrite.md)
- [x] Arcadium 3D — **authed: workspace, project creation, 3D editor, full tool and view model**
      → [`reference/arcadium3d.md`](reference/arcadium3d.md)
- [x] Cedreo — landing + pricing only
- [x] **Phase 1 artifact — [`problem-brief.md`](problem-brief.md)**, rewritten against the
      corrected direction. Gate question still Luke's to answer.
- [x] **PRIMARY — professional-tool IA recon, first pass**: PRO Landscape+ and VizTerra read in
      depth from vendor product pages and published FAQ docs →
      [`reference/professional-tools.md`](reference/professional-tools.md). **Headline findings:**
      the pro loop is *2D authoritative → 3D as a view → takeoff as a report*; VizTerra ships
      **address→GIS base plans** (parcel boundary, setbacks, house footprint, scaled aerial);
      PRO Landscape offers **live dimension readout while drawing from your own measurements**;
      **multi-year phasing off one model already exists** as layers + phased bidding; plants are
      **drawn at mature size by default**; and the whole category is **Windows + dedicated GPU
      only**, which is the structural opening for a browser build.
- [ ] Professional recon, second pass: **DynaSCAPE**, **Vectorworks Landmark**. *(Land F/X docs
      are behind a human-verification wall — not worked around; partial structure recovered from
      search snippets, see the teardown.)*
- [x] **UI/UX homework — first and most important pass done 2026-08-17.**
      - **[`reference/growveg.md`](reference/growveg.md) — THE COPY TARGET for IA and UX**
        (Luke's call). Driven fully authed: shell, Overview, Planner with a real plan, Plant List,
        Parts List, Journal, Seed Inventory, Garden Guru. It is the only product found that does
        **all three layers on a measured model with memory across years**. Take the structure,
        **leave the UI** — Luke: *"not a huge fan, looks outdated"*, and the markup confirms it
        (icon-only unlabeled buttons, the Journal is a legacy app in an iframe, `+` rendered as
        StaticText).
      - **[`reference/ifixit.md`](reference/ifixit.md) — the build-layer model.** Guide anatomy:
        time range + difficulty + author + last-updated above the fold, tools before step 1,
        warnings at the step, reasons not just instructions, step-scoped AI and comments, and
        naming when to hire out.
- [ ] Remaining UI/UX targets, now lower priority since GrowVeg answered the main question:
      Houzz Pro / Buildertrend (client-file), Fieldwire (photos pinned to a plan).

### The UI/UX homework — target list

**Layer 1 · The record (the client file for a property)**

The thing Luke described — *"a profile of the address with all the necessary info, records,
pictures from walk-throughs, notes, ideas, plans"* — already exists in the **field-service and
construction ops** category. Worth naming honestly: **this is partly the category set aside at
kickoff.** We are not reversing that decision — we want their *client/property file*, not their
scheduling, invoicing or CRM.

| Target | Why | Readable |
|---|---|---|
| **Houzz Pro** | Closest existing "client file" for exterior/remodel work — photos, notes, plans, selections, all per project | web, trial |
| **Buildertrend** | The deepest job-file model: daily logs, photo streams, docs, selections | web, demo |
| **Fieldwire** / **Autodesk Build** | Photos and notes **pinned to a location on a plan** — directly relevant to walk-through capture | web, free tier |
| **Jobber** | The lightweight end of the same idea, property-centric | web, trial |

Bring back: what a property/job file is made of, how photos and notes attach to a place, how
history is presented over time, and what earns a screen.

**Layer 2 · The design (model + AI mockups)**

- **Arcadium 3D** — done. Interaction and rendering reference only.
- **VizTerra / PRO Landscape** — done. Structural loop reference.
- Still to read: **DynaSCAPE**, **Vectorworks Landmark** — discipline layering and grading.
- **Open question with no good exemplar:** grade and drainage capture. May need its own recon
  pass into civil/site tools rather than landscape ones.

**Layer 3 · The build (the DIY execution layer)**

This is the layer with the clearest best-in-class exemplar anywhere in this whole recon:

| Target | Why | Readable |
|---|---|---|
| **iFixit** | The gold standard for guided physical work by a novice: **required tools listed up front**, numbered steps, a photo per step, difficulty and time estimates, community fixes and gotchas | web, free, fully readable |
| **This Old House** / **Family Handyman** | Project instructions in a homeowner register, with materials and tool lists | web, free |
| **Sunset / regional extension guides** | Seasonal timing and regional correctness for planting work | web, free |

Bring back from iFixit specifically: how a tool list is presented *before* step one, how a step
is composed, how difficulty and duration are set honestly, and how warnings and mistakes are
surfaced without nagging.

**Sequencing note:** run layer 3 (iFixit) first. It is free, entirely readable, and it defines
the layer that most differentiates the product — so it carries the most information per hour
spent.
- [ ] ~~Tier B portals — Yardzen, ShrubHub, Tilly~~ **dropped.** They are the delivery surface
      for a done-for-you design service — the opposite of an owner-maintained model.

## Method notes for next time

- `chrome-devtools` CLI has **no file-upload command**. Photo-gated products can still be driven:
  fetch an image in-page, assign it to the `input[type=file]` via `DataTransfer`, dispatch
  `change`. Worked first try on SimplyScapes.
- **Route discovery beats clicking.** Next.js App Router chunk paths
  (`chunks/app/(main)/[workspaceId]/designs/page-*.js`) hand you the real route tree, including
  entities the nav hides. Read `list_network_requests` after a reload.
- **Measure, don't infer.** Arcadium's toolbar looked "blocked"; `elementFromPoint` plus
  `getBoundingClientRect` showed it sitting at `x = -384` — off-viewport during onboarding, a
  different bug with a different meaning.
- **A shared daemon is contended.** Another session was driving other tabs and repeatedly took
  the selected page mid-command. Resolve the tab index dynamically and keep select-then-read in
  one invocation.
