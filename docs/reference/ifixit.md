# Teardown — iFixit

**Read live 2026-08-17** via `chrome-devtools` CLI. Analysed the guide index and a representative
guide: *How to Jack Up a Car (or Truck)* (`/Guide/…/67013`).

**Status: the build-layer model (Luke, 2026-08-17 — "iFixit is also good, I'm on board").**

Chosen deliberately: a **car guide, not an electronics one**. Physical work, real tools, real
consequences, performed outdoors by a novice — the closest structural match to *build a patio*
that exists at scale anywhere on the web.

---

## Guide anatomy

### Header — the honesty block, before anything else

```
How to Jack Up a Car (or Truck)
Jeff Suovanen and 4 other contributors
Last updated on Sep 3, 2019
137K views · 4 favorites · 15 comments
10 - 20 minutes            ← time estimate
Moderate                   ← difficulty
```

Four things a homeowner needs before committing, all above the fold:

1. **Who wrote it** — named contributors, plural.
2. **When it was last updated** — provenance, and the reader can judge staleness themselves.
3. **How long it takes** — a *range*, not a single optimistic number.
4. **How hard it is** — a plain word, not a five-star scale.

**Take all four.** "Build a paver patio · 2 weekends · Hard" is the single most useful sentence a
DIY landscaping product could put on a project, and no competitor read this session offers
anything like it.

### Introduction — the framing, the danger, and the way out

The intro does four jobs beyond describing the task:

- **States the risk plainly.** Working under a vehicle is dangerous if precautions are skipped.
- **Forbids the specific shortcut** people actually take — no "making do" with missing or poorly
  maintained equipment.
- **Gives an escape hatch:** if you are not sure how to proceed, get help from a more experienced
  fixer. *No shame, no upsell.*
- **Names an alternative path:** the same job can be done with ramps instead of a jack.

The landscape parallel is exact: *this project needs a compactor; if the base is not right the
patio fails in one winter; if you are unsure, this is the step to hire out.* **A DIY product that
never says "hire this part out" is not trustworthy** — and note iFixit gains credibility by
saying it, rather than losing a sale.

### What you need — tools before step 1

Listed **before** the first step, each with a purchase route:

- Hydraulic Floor Jack — *available on Amazon*
- Wheel Chocks — *available on Home Depot*
- Jack Stands — *available on Amazon*
- `Show more…`

**Tools up front is the pattern Luke asked for by name.** Nobody wants to discover on Saturday
afternoon that step 6 needs a tool they don't own. The purchase links are also the honest
monetisation route — affiliate on tools, rather than selling the user's project as a lead.

Pairs directly with GrowVeg's Seed Inventory idea: *you already own three of these five; here are
the two to get.*

### Steps — where the craft is

Each numbered step carries:

- **Warnings placed at the step where they apply**, not batched in a preamble nobody re-reads.
  Step 1 opens with a caution that failure to follow may cause serious injury or death — because
  step 1 is where you choose the ground.
- **The reason, not just the instruction.** Not "park on level ground" but *park on firm level
  ground, because if the ground shifts the jack can move and you can be crushed.* A DIYer who
  knows why will adapt correctly to a situation the guide did not anticipate.
- **Worked examples for the confusing bit** — chocking the wheel opposite the jack is explained
  with two concrete cases rather than a rule.
- **Conditional stop-work instructions** — if the jack leaks fluid or shows disrepair, stop and
  replace it before proceeding.
- **`Ask FixBot`** — an AI assistant **scoped to that individual step**, not a global chatbot.
- **Per-step comments** — community knowledge attached to the exact place it applies.

**The per-step scoping of both AI and comments is the standout pattern.** A question at step 4 is
about step 4. Global help forces the user to re-explain where they are; step-scoped help already
knows.

---

## What to take — the build layer spec

1. **Time range + difficulty + last-updated + author, above the fold.**
2. **Tools and materials listed before step 1**, cross-referenced against what the user already
   owns, with a way to buy or rent the rest.
3. **Warnings at the step**, never only in an intro.
4. **Always give the reason.** "Never X, because Y" survives contact with an unanticipated yard.
5. **Name the alternative method**, and **name the point where hiring out is the right call.**
6. **Step-scoped help** — AI and comments attached to the step, not the project.
7. **Stop-work conditions**: the explicit "if you see this, stop" checks between stages. In
   landscaping these are the cure/settle/inspect gates — base compaction before pavers, concrete
   cure before load, call-before-you-dig before any excavation.
8. **Named contributors and a visible revision date.** Provenance is trust, and it is cheap.

## What to leave

- The wiki/community-editing model. Guides here are crowd-authored and revision-controlled; that
  is a whole product with its own moderation burden, and it is not v1.
- Storefront integration as a primary surface.
- Troubleshooting trees as a separate top-level section (interesting later — *my patio is
  sinking* is a genuine landscape troubleshooting entry point — but not now).

## The synthesis, in one line

**GrowVeg gives the model and the memory. iFixit gives the instructions.** GrowVeg's Parts List
already knows the patio path is 17'8" of brick; an iFixit-shaped guide is what turns that number
into a Saturday that ends with a path in the ground. Neither product has the other half, and no
landscaping product has either.
