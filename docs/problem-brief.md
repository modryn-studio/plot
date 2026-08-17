# Problem brief — `plot` *(working slug)*

**Blueprint phase 1 artifact.** Rewritten 2026-08-17 after Luke corrected the direction — see
"What changed" at the bottom. Supporting recon in [`recon.md`](recon.md) and
[`reference/`](reference/).

---

```
Problem:      I'm going to be in this house for twenty years and I want to fix the place
              up a piece at a time. Nothing I can use knows what my yard actually is.
              Every tool starts me over from a blank photo.

Who:          A homeowner who owns their property and expects to keep it, doing the work
              themselves, project by project, over years. They meet the product at one
              project — a patio, a bed, a drainage problem — but they are not a
              one-project person. They're an owner. The project is the door; the
              property is the relationship.

Today:        Either an AI yard designer that returns a photo-realistic picture they
              cannot build from and cannot measure, or no software at all — graph paper,
              a tape measure, a phone full of screenshots, and memory. Nothing persists
              between projects. What it costs them: every project restarts from zero,
              nothing learned from the last one carries forward, and decisions that
              should compose across the property get made one at a time and fight each
              other in year six.

Spin:         The durable, measured model of the actual property IS the product.
              Renders, quantities, and sequence are outputs derived from it, not
              features bolted onto a picture. It compounds — every project makes the
              model more complete and the next project cheaper to plan.

Kill signal:  Owners won't invest what it takes to get an accurate model of their lot,
              even with heavy API assist. Or: they build one, and never come back for a
              second project. If the model isn't reused, it isn't durable, and this is
              just a slower renderer.
```

---

## Why the model is the moat

**A photograph cannot be interrogated.** SimplyScapes and Neighborbrite both produce an image of
a yard. You cannot ask either one how wide a bed is, because there is no bed — there are pixels.
Every downstream thing an owner actually needs (quantities, materials, cost, does the patio
physically fit, what will this shrub do in year eight) is not *missing* from those products, it
is *impossible* in them. They are structurally incapable, not behind on roadmap.

**The professional tools can do it, but they're aimed at the wrong person for the wrong
duration.** VizTerra and PRO Landscape build real geometry and produce real takeoffs — for a
contractor, to win and execute one job, then move to the next property. The model is disposable
by design because the *relationship* is disposable. An owner has the opposite time horizon.

**So the compounding is the defensible part.** A competitor can clone a UI in a week. They cannot
clone the user's own accumulated ground truth about their own land — the measured boundary, the
grade, where water actually goes, what's planted and when it went in, what was tried and failed.
That asset belongs to the user and grows with use. It's the thing that makes year three cheaper
than year one, and it's why the second project is the real product, not the first.

## The shape of it *(reframed by Luke, 2026-08-17 — this supersedes "the model is the product")*

**Think of the client file a real landscaper keeps for a property — and hand it to the person who
owns the property.**

A landscaper working an address builds a profile of it: the necessary info and records, photos
from walk-throughs, notes, the client's ideas, mockups, plans, modeling, a material list. Strip
out the parts that exist only to sell and bill a job. Add what somebody doing the work themselves
needs and a crew never does. That is the product.

**Three layers:**

**1 · The record — the property file.**
Address profile and site conditions, walk-through photos, notes, ideas and inspiration, and the
history of what was done and when. This is the part that makes it durable: it accumulates whether
or not a project is active, and it is the reason to come back.

**2 · The design — including AI mockups.**
The measured model, AI-generated images of the idea, plans, and the material takeoff. The
professional loop applies inside this layer: **2D authoritative → 3D as a view → takeoff as a
report.** Organised by landscape discipline, not object bin — site, ground, hardscape, planting,
systems. Plants drawn at mature footprint.

**3 · The build — what no professional tool has, because a crew already knows.**
The tool list for this project, step-by-step instructions, the sequence, tutorials and video,
walk-throughs, tips, and the common mistakes. This is the layer the whole category is missing and
the reason a homeowner would pick this over a pro tool they could otherwise pirate.

**And it is a loop.** The finished project becomes part of the record, so next year starts from a
property that knows what happened last year. That sentence is the durability thesis and the
business.

## Where AI images fit — corrected 2026-08-17

**AI mockups are in.** Luke wants to generate images of the user's idea. The earlier framing here
("not a render generator") was too broad and is corrected.

The sin the consumer tools commit is not *generating an image*. It is that **the image is all
there is** — nothing underneath it can be measured, priced, or built from. Here an AI mockup sits
in the file beside the notes and the walk-through photos as a fast way to capture and explore an
idea.

**And the differentiated version is only possible because a model exists:** a mockup can be
**conditioned on the real geometry** — true proportions, correct mature plant sizes, real
sightlines from where a person would actually stand, the actual house. Neighborbrite and
SimplyScapes structurally cannot do this; they have nothing to condition on. The model does not
replace the render — **it makes the render honest.**

## What this is not

- **Not AI-image-as-the-product.** The image is a view of an idea, not the deliverable.
- **Not a photo-overlay collage.** A photograph cannot be measured, priced, or built from.
- **Not a lead-gen funnel.** The moment a referral fee exists, the incentive is to stop at the
  picture — which is exactly what happened to both incumbents.
- **Not a house-design tool with a garden drawer.** That is Arcadium's failure, and it is an
  object-model failure rather than a feature gap.
- **Not a contractor's back office.** No scheduling, invoicing, crew management or CRM. We take
  the *client file* from the ops tools, not the business operations around it.
- **Not per-project throwaway.** If the record does not outlive the project, there is no product.

## Accuracy — decided 2026-08-17 (Luke)

> *"I don't want to go overboard. If we have a good plan to make it correct, then let's do it.
> But I'm not against having the user verify with a tape measure."*

**Accuracy is a process, not a data source.** The model does not need to arrive survey-grade from
parcel/GIS/satellite. It needs to arrive *close*, and then become *correct* through a deliberate
verification step the user performs with a tape.

This is a large unlock and it changes what has to be built:

- We are **not** blocked on finding a perfect authoritative source for any given lot. Derived
  geometry only has to be a good first draft.
- The product needs an explicit **verify** concept — a first-class thing, not a disclaimer.
  Dimensions carry a state: *derived* vs *measured*. The user confirms the few that matter.
- **Which dimensions matter is the design problem.** Asking someone to tape their whole lot fails.
  Asking for the three numbers a patio takeoff is actually sensitive to succeeds. The product
  should know which measurements it needs verified before it will stand behind a quantity.
- A takeoff should be able to state its own confidence: this number rests on measured values,
  that one rests on derived values, here is what to go check.

Silva's veto question — *how accurate before someone buys materials against it?* — is therefore
answered as: **accurate enough that every quantity traces to a verified measurement, and the
product says so when it doesn't.**

## Decided since

- **2D/3D relationship — settled by the professional recon.** Pro tools are 2D-authoritative:
  draw in 2D, one click to 3D as a *view*, construction plans and quantities come off the same
  file. Arcadium being 3D-first is a thing to diverge from, not copy.
- **Water and hills matter** (Luke, 2026-08-17). Grade and drainage are confirmed in scope, not a
  later nicety. They are also the least-served thing in the entire category — VizTerra's GIS
  returns boundary, setbacks and footprint but **not grade**, and Neighborbrite's whole slope
  model is a two-state toggle. This is where the product can be straightforwardly better than
  anyone, and it is where DIY projects actually fail.
- **Phone LiDAR is a future feature** (Luke, 2026-08-17). Tape-measure verification is the v1
  answer; LiDAR is an upgrade path, not a dependency.
- **The name.** `plot` is fine for now. Explicitly not a big deal, revisit later.

## Open

1. **How grade and drainage get modelled and captured** at a fidelity a homeowner can supply.
   Nobody in the category does this well, so there is no pattern to copy — this needs its own
   design work and probably its own recon.
2. **Where the build-layer content comes from** — tool lists, instructions, tutorials, tips.
   Authored, generated, curated, or licensed. This is the layer that most differentiates the
   product, so it is also the one most likely to decide the build cost.
3. **How projects relate to the property over years** — phases, versions, history, what-was-tried.
4. **Which measurements the product insists on** before it will stand behind a takeoff.
5. **UI/UX homework is outstanding** (Luke, 2026-08-17) — see [`recon.md`](recon.md) for the
   target list. Phase 2 should not close before it is done.

**Deferred by Luke (2026-08-17):** how the site model gets acquired in the first place — trace
satellite, tape measure, plat, parcel/GIS APIs, or some combination. Noted as solvable with APIs
and search; explicitly not the current focus.

## Gate — PASSED 2026-08-17

> **Would you still build this if it took 3× longer than you think?**

**Yes.** Luke, 2026-08-17: *"I want to build the real blueprint version. I don't care if it takes
longer."*

The case: the gap is verified rather than assumed, it sits where both the consumer tools (no
geometry) and the professional tools (wrong user, wrong time horizon) structurally cannot go, and
the moat compounds with use instead of being a feature that can be copied. The accepted cost: a
real geometry model is materially harder to build than a render wrapper.

**→ Phase 2 (Definition) is open.** It begins with structural craft recon of the professional
tools — see [`recon.md`](recon.md).

---

## What changed, and why

The first version of this brief was written before Luke reviewed the recon. It named the user as
a *one-project homeowner* and the spin as *adding build sequencing to the picture the incumbents
already produce*. Both are now superseded:

- **The user is property-rooted, not project-rooted.** Confirmed by Luke: a durable, measured
  property that persists and gets worked on over years.
- **The spin is the model, not the sequence.** Sequencing bolted onto a photograph was a real
  answer on a fake foundation. The foundation is the product.
- **SimplyScapes and Neighborbrite are rejected as references.** Luke does not want to copy or
  take from either. They remain useful only as evidence of what the category structurally cannot
  do. Arcadium 3D stays on the table for interaction quality and spatial rigor — not its IA.
