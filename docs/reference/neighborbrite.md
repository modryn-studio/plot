# Teardown — Neighborbrite

**Read live 2026-08-17** via `chrome-devtools` CLI, logged in as Luke, free plan.
Drove a complete design end to end using their front-yard sample image.
Marketing `neighborbrite.com`, product `app.neighborbrite.com`.

**Threat rank: #2 on craft, #1 on traction.** Claims 15M+ designs generated and names real
landscaping firms as customers (K&D Landscaping, Charleston Landscape, KC Landscape, Utah
Wildflower Co., Citiscapes, Blair Brothers, Tree Pros, Mountain View Landscaping, Blossom Lawn
Care). Judge this one on distribution, not pixels.

---

## Information architecture

Six top-level destinations — genuinely more product than SimplyScapes exposes:

```
/home
/recent-activity
/favorites
/plant-lists
/toolbox
/settings?section=billing        (labelled "Pricing" in nav)
/upload-image                    (the entry point)
/design/[designId]/goal
/design/[designId]/confirm
/design/[designId]/plan
/design/[designId]/generating
/design/[designId]/details
```

**The design is a five-step named-route wizard.** Every step owns a URL. That is the cleanest
IA finding of the whole recon and it is worth copying outright — it matches the blueprint's own
"every screen gets an explicit named route" rule, arrived at independently.

## The flow, step by step

**1 · `/upload-image` — "Your yard image"**
Drag/drop or browse. Three ways in, and the two fallbacks matter more than the primary:
- Upload a photo
- **"Use an address — Pull a photo from Street View"** (field renders `disabled` on first paint,
  enables a beat later — a real bug: the control is dead on arrival for the first second)
- **"Try a sample image"** — four samples: front yard · backyard · side yard · flower bed

*The sample-image escape hatch is why this competitor could be driven end-to-end without ever
uploading a photo. It is also good product design: it lets a visitor reach the payoff before
committing anything of their own.*

Header copy sets the promise: *"Upload one photo. We read your light, zone and slope, then design
a real planting plan — plant by plant."*

**2 · `/goal` — "What would you like to do today?"**
Titled "Your goals" but immediately presents **18 styles**, each with a one-line description:
English · Cottage · Modern · Naturalistic · Functional Backyard · Pool Backyard · Coastal ·
Desert · Tropical · Mediterranean · French · Scandinavian · Rock Garden · Japanese · Ranch ·
Edible Garden · Kids Play Area · Fairy Garden.

Selecting a style **advances immediately** — no confirm button, and they say so up front
("Selecting a style continues to the next step"). Goal and style are conflated: the product
never actually asks what you want to *do*.

**3 · `/confirm` — "What I'll use"**
*"Here's what I'll use to create your design. You can adjust it first."*

This is the best screen in any product read this session. It shows a **derived site model** and
asks the user only to correct it:

| Field | Value on Luke's account | Notes |
|---|---|---|
| Area to design | "We will automatically choose an area." | editable |
| Style | Naturalistic | from step 2 |
| Location | **Portage, WI 53901, USA** | geolocated, not asked |
| Hardiness zone | **5a** — *"Which plants can survive your winters"* | derived from location |
| Sunlight | *(no default)* | Full sun 6+ / Partial 4–6 / Shade <4 |
| Slope | Flat | **binary only: Flat or Slope** |

Two details worth stealing:
- **The confirm button says "Looks right"**, not "Continue". It asks for assent to a claim rather
  than permission to proceed. Correct verb for a derived model.
- **Hardiness zone carries its own plain-language gloss.** "Which plants can survive your winters"
  teaches the concept inline instead of assuming it. This is the register the DIY homeowner needs.

And one gap: **sunlight is the only field they refuse to guess**, which is honest, but slope is
reduced to a two-state toggle. Grade and drainage — the things that actually sink a DIY project —
are not modelled at all.

**4 · `/plan` — "Your design plan"**
*"Here's what I understood. You can adjust it before I generate."* Generates a text plan first,
~30s with a progress bar, then shows it for review before any image exists.

Actual output for Naturalistic / front yard / Zone 5a:

> Turn the front yard into a sweeping, naturalistic garden with stone accents.
> • Layer tall grasses for movement, winter texture, and a soft silhouette.
> • Blend colorful sun perennials in flowing drifts around the front lawn.
> • Use fuller flowering shrubs to anchor the house and soften corners.
> • Add natural stone groupings for an organic, award-winning finish.

**Plan-before-render is the right structure and the wrong content.** Four sentences of design
intent. No plant names. No counts. No spacing. No bed dimensions. No cost. No sequence. No
season. "Award-winning finish" is marketing copy inside what is supposed to be a plan. A
homeowner cannot act on this.

**5 · `/generating` — "Designing your yard…"**
A narrated progress list, each item ticking to Done:
`Reading your yard photo` → `Matching plants to Zone 5a` → `Choosing your plants` →
`Arranging the space for a flat area`

**Steal this pattern.** It converts a ~1 minute wait into an explanation of the method, in the
user's own vocabulary, and it quietly proves the site model was used. Also: *"You can safely
leave this page — your design will be waiting in Recent activity."*

**6 · `/details` — "Your first design"**
*"Here's a first draft based on your photo, goals, and local conditions."*

- Before/After toggle, fullscreen, favorite, share, download
- **Design tools — all `Pro`:** Add elements · Magic edit · Erase elements
- **Make changes — `Pro`:** free-text "Describe what should feel different in this version".
  Disabled with unusually honest microcopy: *"Update design is a Pro feature on this account.
  Selecting it opens the subscription page instead of starting a new design. Your request is
  saved and restored when you return."* — a paywall that tells you exactly what the button will
  do and promises not to lose your typing. Better than most paywalls.
- Keep exploring: Generate again · **Satellite view** · **View by season (spring/summer/fall/
  winter)** · Choose another style · **Find a landscaper** · Start over
- **"Plant palette for this design — `Pro` — Explore the plants selected to create this look,
  matching your Zone 5A. Unlock plant palette"**
- "Your design journey" — version history with restore

## The business model, stated plainly

**"Find a landscaper — Get a free quote from a top rated landscaper in your area."** Sitting in
the primary action list on the results screen. Combined with the `/landscapers` marketing site,
the picture is unambiguous: **this is a lead-generation business wearing a design tool.** The
homeowner's design is the lead magnet; the contractor is the customer.

That has a direct consequence for us: **their incentive is to stop at the picture.** A homeowner
who can build it themselves is a lost referral. They are structurally prevented from closing the
DIY gap — which is the definition of a spin the incumbent cannot copy in a week.

## Quotas and paywall

`4 of 4 free designs left today` — a **daily** allowance, not lifetime. Generous on volume,
strict on capability: every editing tool, the change request, and **the plant list itself** are
Pro. Free gets a picture.

## Plant model

Far thinner than SimplyScapes. Filters are two axes only: **Hardiness zone** (1a–13b, 26 values)
and **Sunlight** (3 buckets). No mature size, no water, no soil.

`/plant-lists` has a nice empty state though: *"No favorites yet. Search for plants you own, want
to move, or would like us to use in a future design."* — **"plants you own, want to move"** is the
only acknowledgement in any product read today that a yard already has things in it.

## Toolbox — how they frame their own capability

A tool catalog, tiered `free` / `Pro` / `Business`:
- **Guided design:** Choose a style · Describe your dream yard `Pro`
- **Edit a photo:** Magic edit `Pro` · Add elements `Pro` · Erase elements `Pro`
- **Finish and plan:** High resolution `Business` · Auto enhance `Business` · Identify plants `Pro`

Note what "Finish and **plan**" contains: a sharper image, better lighting, and plant names.
**In this category, "plan" means "a better picture."**

## Gaps and openings

1. **Ends at the image, by design and by incentive.** No quantities, no materials, no cost, no
   sequence, no build guidance. Then it hands you to a contractor.
2. **The plan step is structurally right and substantively empty.** Copy the structure, fill it
   with the thing a person can act on.
3. **Slope is binary.** No grade, no drainage, no water movement — the failure mode that ruins
   real DIY projects.
4. **Style is asked; goal never is.** The screen is titled "Your goals" and then only offers
   looks. Nobody asks what problem the yard has.
5. **The existing yard is nearly ignored.** One passing mention of "plants you own, want to move".
   No inventory, no what-stays-what-goes, no phasing.
6. **Address→Street View field ships disabled on first paint** — a real, reproducible defect.

## Visual signature (5 lines)

Clean, generic SaaS. Light ground, rounded cards, photo-forward with before/after toggles
everywhere. Nav is a plain horizontal row of six text links, no icons. Tier badges (`Pro`,
`Business`) are used heavily as an upsell texture throughout the UI. Accessibility is decent —
proper live regions, progress bars with values, expandable buttons correctly marked.
