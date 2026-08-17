# Spec — `plot` *(working name)*

> Phase 2 artifact. This file is the single source of truth for what v1 is.
> If the code and this file disagree, one of them is a bug. Update this file *first*, always.
> Point agents at this file, not at your memory of it.

**Status:** draft
**Last amended:** 2026-08-17 — rewritten after Luke's review of the walkthrough. Sun and slope
become derived rather than asked. The design surface becomes photo-first, adapted from Recraft.
The takeoff drops its provenance columns. The build guide becomes a finite reviewed library.

---

## 1. Problem brief (carried from phase 1)

| | |
|---|---|
| **Problem** | I'm going to be in this house for twenty years and I want to fix the place up a piece at a time. Nothing I can use knows what my yard actually is. Every tool starts me over from a blank photo. |
| **Who** | A homeowner who owns their property and expects to keep it, doing the work themselves, project by project, over years. They arrive at one project; they are not a one-project person. |
| **Today** | An AI yard designer that returns a picture they cannot build from or measure, or no software at all. Nothing persists between projects. |
| **Spin** | The durable, measured model of the actual property is the product. Renders, quantities and build sequence are outputs derived from it. It compounds. |
| **Kill signal** | Owners won't invest what it takes to get an accurate model, even with heavy API assist. Or they build one and never return for a second project. |

Full brief: [`problem-brief.md`](problem-brief.md) · Recon: [`recon.md`](recon.md) ·
Narrative: [`walkthrough.md`](walkthrough.md)

---

## 2. The critical path

**Three destinations. The project is one screen with four views** — adapted from GrowVeg's
four-views-of-one-model, which is the pattern that makes quantities possible at all.

1. **`/properties/new`** → enter an address. Parcel boundary, house footprint and scaled aerial
   come back. No drawing.
2. **`/properties/[id]/site`** → confirm what we derived. Sun, slope and aspect are **shown, not
   asked**. Only water is entered by hand.
3. **`/projects/[id]`** → four views of one project:

   | View | What it is | Where it comes from |
   |---|---|---|
   | **Look** | Your photo of the spot, drawn and prompted on, rendered by AI | the photo |
   | **Plan** | The same thing, overhead, at real size | the base plan |
   | **Takeoff** | What to buy | computed from Plan |
   | **Build** | Tools, steps, checks | library + your numbers |

**The one-sentence value claim:** *A homeowner can photograph a corner of their yard, see it
rebuilt the way they want it, and walk out with a shopping list and a build order that match the
picture — without measuring their whole lot or learning CAD.*

**The two-surface rule, and it is the core architectural decision of the product:**
**The photo carries the *look*. The plan carries the *size*. They are the same project.**
A phone photo has no scale, so no quantity can ever come from it; an overhead plan has real
geometry but sells nobody on anything. Every competitor picked one and lost the other.

---

## 3. User stories

### ⭐ Critical path

**S1 — Start a property from an address**
> As an owner, I want to type my address and get a base plan of my lot, so that I don't start
> from a blank page or a tape measure.

- `WHEN the user submits an address, THE SYSTEM SHALL geocode it and create a Property.`
- `WHERE parcel data covers the property, THE SYSTEM SHALL display the parcel boundary and the
  county's recorded acreage alongside its own computed acreage.`
- `IF the computed acreage and the recorded acreage differ by more than 5%, THEN THE SYSTEM SHALL
  display both figures and SHALL NOT average them.`
- `IF no parcel data covers the property, THEN THE SYSTEM SHALL display the aerial imagery with no
  boundary, and SHALL NOT infer one.`
- `THE SYSTEM SHALL display a scale bar and the unit system on every overhead view.`
- `IF the address cannot be geocoded, THEN THE SYSTEM SHALL display "We couldn't find that
  address", keep the entered text, and offer a map pin as an alternative.`

Edge cases:
- **Empty:** no properties → one "Add your property" action, one sentence on what happens next,
  and a link to the sample property.
- **Error:** each upstream failure named separately; a parcel miss degrades to imagery-only rather
  than blocking.
- **Loading:** narrated, naming each source as it resolves — address, parcel, imagery, sun.

---

**S2 — Confirm the derived site**
> As an owner, I want to see what the app already worked out about my lot and correct anything
> wrong, so that I trust what comes out of it later.

- `THE SYSTEM SHALL derive and display, without asking the user: hardiness zone, slope grade,
  slope aspect, and monthly sun exposure.`
- `THE SYSTEM SHALL label each derived value with its confidence and its source.`
- `THE SYSTEM SHALL label modelled sun as modelled and SHALL NOT present it as measured.`
- `WHEN the user edits a derived value, THE SYSTEM SHALL retain the original and mark the value
  as user-corrected.`
- `THE SYSTEM SHALL require the user to mark where water collects or runs, and SHALL NOT derive
  it in v1.`
- `THE SYSTEM SHALL label the primary action "Looks right".`
- `IF a derived source has no coverage at this property, THEN THE SYSTEM SHALL say which one is
  missing and continue without it.`

Edge cases:
- **Empty:** sun unavailable outside coverage → say so plainly; planting advice degrades to zone
  only.
- **Error:** an impossible correction (self-intersecting boundary) → reject with the reason at
  the offending point.
- **Loading:** each attribute streams independently; none blocks another.

---

**S3 — Photograph the spot and see it changed** *(the Look view)*
> As an owner, I want to take a picture of where I'm thinking of building and see it the way I
> want it, so that I find out whether I actually want it before I spend anything.

- `THE SYSTEM SHALL accept a photo taken or uploaded from the device.`
- `THE SYSTEM SHALL provide manual drawing tools and a prompt entry that act on the same photo.`
- `THE SYSTEM SHALL expose generation parameters as inline controls on the prompt entry, not in a
  separate settings panel.`
- `WHEN the user accepts a drawn region and a prompt, THE SYSTEM SHALL generate a rendered image
  in which the change is composited into the original photo.`
- `THE SYSTEM SHALL provide named one-tap treatments that require no prompt.`
- `THE SYSTEM SHALL retain every generated image against the project with its prompt and its
  parameters.`
- `THE SYSTEM SHALL display a standing notice that generated images are illustrations, not plans.`
- `IF generation fails, THEN THE SYSTEM SHALL preserve the drawing and the prompt and allow retry
  without re-entry.`
- `THE SYSTEM SHALL display the remaining generation allowance before the user submits.`

Edge cases:
- **Empty:** no photo yet → the camera/upload action and one line on what a good photo is (stand
  where you'd stand, get the whole area in frame).
- **Error:** generation refused or failed → the drawing survives, the prompt survives, the cost
  is not charged.
- **Loading:** narrated progress naming what is happening, with the source photo still visible.

---

**S4 — Give it a real size** *(the Plan view)*
> As an owner, I want to set how big the thing actually is, so that the list I get is the list I
> can buy.

- `WHEN a project has a shape drawn in the Look view, THE SYSTEM SHALL place a corresponding
  editable shape on the Plan view.`
- `WHILE the user is drawing or resizing, THE SYSTEM SHALL display the running dimension in feet
  and inches.`
- `THE SYSTEM SHALL allow any dimension to be typed as an exact value.`
- `WHEN an enclosed shape is complete, THE SYSTEM SHALL display its area and perimeter.`
- `THE SYSTEM SHALL require a surface material and a depth for any built surface.`
- `IF a project area lies downhill of a marked water area, THEN THE SYSTEM SHALL display a
  drainage warning naming that area.`
- `THE SYSTEM SHALL autosave within 5 seconds of a change and display the last-saved time.`
- `THE SYSTEM SHALL keep the Look and Plan views of a project referring to one project record.`

Edge cases:
- **Empty:** nothing drawn in Look → Plan offers to draw directly; the two entry orders are both
  valid.
- **Error:** self-intersecting outline → refuse to close it, indicate where.
- **Loading:** base plan renders before tools activate; tools are visibly disabled until ready.

---

**S5 — Place plants at mature size**
> As an owner, I want plants shown at the size they'll actually be, so that I don't plant a
> problem.

- `THE SYSTEM SHALL draw every plant at its mature footprint by default.`
- `THE SYSTEM SHALL filter the palette by the property's hardiness zone and the project area's
  sun exposure.`
- `THE SYSTEM SHALL display each plant's mature width, mature height and spacing.`
- `IF two plants are placed closer than their mature spacing allows, THEN THE SYSTEM SHALL warn,
  naming both.`
- `IF a plant would overhang a built surface at mature width, THEN THE SYSTEM SHALL warn, naming
  the surface.`
- `IF a plant is outside the property's hardiness zone, THEN THE SYSTEM SHALL warn and SHALL allow
  the placement.`

Edge cases:
- **Empty:** filters match nothing → name the excluding filter, offer to relax it.
- **Error:** placement outside the boundary → warn, allow, mark out-of-bounds.
- **Loading:** paginated with skeletons, never a blocking spinner.

---

**S6 — Get a list I can buy from** *(the Takeoff view)*
> As an owner, I want to know what to buy and how much, so that I make one trip and don't guess
> at the register.

- `THE SYSTEM SHALL compute every quantity from the Plan geometry by deterministic calculation,
  and SHALL NOT generate a quantity with a language model.`
- `THE SYSTEM SHALL present each line as the amount to buy, with waste already included.`
- `WHERE waste has been included, THE SYSTEM SHALL state the raw amount and the reason in plain
  language on that line.`
- `THE SYSTEM SHALL express volumes in cubic yards and, where a bagged product exists, in bags.`
- `IF any quantity depends on a dimension the user has not confirmed, THEN THE SYSTEM SHALL
  display one plain-language notice naming what to check and how, and SHALL NOT annotate every
  line.`
- `IF a quantity cannot be computed because an input is missing, THEN THE SYSTEM SHALL show the
  line with the missing input named and a direct way to supply it.`
- `THE SYSTEM SHALL allow export as PDF and CSV.`

Edge cases:
- **Empty:** nothing sized yet → name what has to exist first, link to the Plan view.
- **Error:** stale figures after an edit are marked stale, never shown as current.
- **Loading:** incremental recompute.

---

**S7 — Check the few things that matter**
> As an owner, I want to be told which two or three measurements actually change the numbers, so
> that I check those and not my whole lot.

- `THE SYSTEM SHALL identify the dimensions to which the takeoff totals are most sensitive.`
- `THE SYSTEM SHALL NOT ask the user to verify a dimension that does not change a quantity.`
- `THE SYSTEM SHALL explain how to check each one in the physical world.`
- `WHEN the user enters a confirmed measurement, THE SYSTEM SHALL recompute dependent quantities.`
- `IF a confirmed measurement differs from the derived value by more than 10%, THEN THE SYSTEM
  SHALL display what changed as a result.`

Edge cases:
- **Empty:** nothing to check → say the numbers rest on confirmed values.
- **Error:** implausible entry (an order of magnitude out) → ask for confirmation before applying.
- **Loading:** local, none.

---

**S8 — Build it** *(the Build view)*
> As an owner, I want the tools, the steps and the checks, so that I can do the work and know
> when a stage is right.

- `THE SYSTEM SHALL display, before the first step: the tool and equipment list, an estimated
  time as a range, and a difficulty rating.`
- `THE SYSTEM SHALL distinguish tools to buy from tools to rent.`
- `THE SYSTEM SHALL present numbered steps, each stating its reason as well as its instruction.`
- `THE SYSTEM SHALL attach a warning to the step it applies to.`
- `THE SYSTEM SHALL substitute this project's own quantities and dimensions into the guide text.`
- `WHERE a stage has a stop-work check, THE SYSTEM SHALL present it as a gate the user marks
  complete before continuing.`
- `WHERE hiring a professional is the right call, THE SYSTEM SHALL say so and say why.`
- `THE SYSTEM SHALL cite the source of the guide and the date it was last reviewed.`
- `THE SYSTEM SHALL serve guides from a reviewed library and SHALL NOT generate construction
  steps per request.`
- `IF no guide exists for this project type, THEN THE SYSTEM SHALL say so and SHALL still produce
  the takeoff.`

Edge cases:
- **Empty:** no guide → stated plainly, takeoff unaffected.
- **Error:** guide fails to load → takeoff remains usable independently.
- **Loading:** tool list first, because it is needed first.

---

**S9 — The project becomes part of the property**
> As an owner, I want a finished project to stay on the record, so that next year starts from
> what's already there.

- `WHEN the user marks a project complete, THE SYSTEM SHALL merge its geometry into the property's
  existing conditions with the completion date.`
- `THE SYSTEM SHALL display existing conditions beneath the drawing of every later project.`
- `THE SYSTEM SHALL retain the completed project as a reopenable record.`
- `WHEN a plant would conflict with previously completed work, THE SYSTEM SHALL warn as in S5.`

Edge cases:
- **Empty:** first project → say there is nothing beneath yet rather than showing an empty control.
- **Error:** geometry overlap → show the overlap, ask which wins.
- **Loading:** merge is atomic; failure leaves the project un-completed.

---

### Supporting

**S10 — Saved looks**
> As an owner, I want to reuse a look across projects so my yard reads as one place.

- `THE SYSTEM SHALL allow a set of materials and planting character to be saved as a named look.`
- `THE SYSTEM SHALL allow a saved look to be applied to any project on the property.`

**S11 — Property home**
- `THE SYSTEM SHALL display the base plan, all projects with status, and the confirmed site
  conditions on one screen.`

**S12 — Photos on the property**
- `THE SYSTEM SHALL store uploaded photos against a property with capture date where available.`

**S13 — Reopen and continue**
- `THE SYSTEM SHALL restore the last-viewed project and view on reopening.`

**S14 — Export and print**
- `THE SYSTEM SHALL produce a printable takeoff and build guide legible without the app.`

**S15 — Account**
- `THE SYSTEM SHALL require authentication before a property is created.`
- `THE SYSTEM SHALL scope every property, project and asset to its owning account on the server.`

**S16 — Sample property**
- `THE SYSTEM SHALL provide a read-only sample property with one completed project.`

---

## 4. NOT IN V1

- **3D view** — the pro loop is 2D-authoritative. Biggest single scope saving in the document.
- **Full typed-event journal** (planting / watering / tending / photos) — v2.
- **Automatic weather capture against the record** — depends on the journal.
- **Year-over-year comparison** — cannot be proven in v1.
- **Grade and contour modelling, cut/fill, drainage calculation** — v1 derives slope and aspect
  and takes water as a marked area. Surface modelling is its own project.
- **Deriving water flow from contours** — possible with 3DEP, not v1.
- **Irrigation design** · **lighting design** — later.
- **Seasonal timeline scrubber** — needs in-ground dates on every plant.
- **A plant database at professional depth** — v1 ships a curated palette.
- **Companion planting and plant combinations** — later.
- **Live regional pricing** — v1 gives quantities, not dollars.
- **A content library at Garden Guru scale** — v1 ships guides only for supported project types.
- **Community comments on steps** — a moderation product.
- **Troubleshooting entry points** ("my patio is sinking") — later, genuinely interesting.
- **Existing-plant inventory** — later.
- **Tool inventory** ("you already own this") — later, pairs with S8.
- **Reminders and notifications** — later.
- **Photos pinned to a point on the plan** — v1 attaches to the property.
- **Phone LiDAR capture** — future, per Luke. Tape is the v1 answer.
- **Video generation** — no.
- **Multiple properties per account** — one property per owner in v1.
- **Collaboration or sharing with another person** — later.
- **Contractor handoff** — later, and never as a referral fee.
- **Permit lookup and code checking** — see open decisions; leaning in, not committed.
- **CAD import/export** — a professional interchange need.
- **Sheet sets, title blocks, paper sizes, plotter output** — artifacts of handing work to a crew.
- **Proposals, bids, estimates, invoices** — never.
- **Lead generation or contractor referrals** — never. This is the incentive that ruined the
  incumbents.
- **A native mobile app** — the web app must work on a phone outdoors; that is not the same thing.

**Explicitly deferred, revisit when:** a real owner completes a real project end-to-end and
returns to start a second one.

---

## 5. Wireframes

**`/properties/new`**
```
+--------------------------------------------------+
|  Where is your property?                         |
|  [ 123 Main St, Portage WI            ] [ Find ] |
|  We'll pull your lot lines and house from        |
|  public records. You can correct anything.       |
|  [ or look at a sample property ]                |
+--------------------------------------------------+
```

**`/properties/[id]/site`**
```
+---------------------------+----------------------+
|                           | What we worked out   |
|   [ aerial + parcel       |  Lot     0.72 ac     |
|     boundary + house ]    |          county: 0.72|
|                           |  Zone    5a  (?)     |
|                           |  Slope   1 deg, S    |
|   |----| 20 ft            |  Sun     [Jul ~~~~]  |
|                           |          modelled    |
|                           |----------------------|
|                           | Only you know this   |
|                           |  Water   [ mark it ] |
|                           |----------------------|
|                           | [   Looks right   ]  |
+---------------------------+----------------------+
```

**`/projects/[id]` — Look**
```
+---+----------------------------------------------+
| ▷ |                                              |
| ✋|        [ your photo of the back corner ]      |
| ⬡ |        [ a rough shape drawn on it ]         |
| ⌫ |                                              |
| ⬆ |                                              |
+---+----------------------------------------------+
|  Look | Plan | Takeoff | Build                   |
+--------------------------------------------------+
|  [ flagstone, warmer tone, low plants left  ] ⬆  |
|  [Material][Look][Season]        3 left today    |
+--------------------------------------------------+
   Generated images are illustrations, not plans.
```

**`/projects/[id]` — Plan**
```
+--------------------------------------------------+
|  Look | Plan | Takeoff | Build                   |
+---+----------------------------------------------+
|   |   [ overhead: house, boundary, your shape ]  |
| ⬡ |            12' 4"                            |
| ⌫ |   [ shape carried over from Look ]           |
|   |   surface: flagstone   depth: [    ]         |
|   |   |----| 10 ft                               |
+---+----------------------------------------------+
| 12' x 14' · 168 sq ft · 52 ft around             |
| ! Downhill of the wet spot you marked.           |
+--------------------------------------------------+
```

**`/projects/[id]` — Takeoff**
```
+--------------------------------------------------+
|  Look | Plan | Takeoff | Build                   |
+--------------------------------------------------+
|  Buy this                                        |
|                                                  |
|  Base gravel      2.3 cu yd                      |
|      2.1 plus 10% — you can't blend a 2nd batch  |
|  Bedding sand     0.6 cu yd                      |
|  Flagstone        177 sq ft                      |
|      168 plus 5% for cuts                        |
|  Edging           57 ft                          |
|  Shrubs           3                              |
|                                                  |
|  i  Three of these depend on how deep you dig.   |
|     Dig one test hole first.  [ how ]            |
|                                                  |
|  [ Print ]  [ Send to phone ]                    |
+--------------------------------------------------+
```

**`/projects/[id]` — Build**
```
+--------------------------------------------------+
|  Look | Plan | Takeoff | Build                   |
+--------------------------------------------------+
|  Flagstone patio · 2 weekends · Hard             |
|  Reviewed Aug 2026 · source: UW-Extension        |
+--------------------------------------------------+
|  Tools                                           |
|   Plate compactor   RENT                         |
|   Wet saw           RENT                         |
|   Rubber mallet     BUY                          |
+--------------------------------------------------+
|  1. Call 811 before you dig                      |
|     Struck utilities are your liability, and     |
|     the marks change where a machine can go.     |
|     ( ) Marked and cleared      <- gate          |
|                                                  |
|  2. Excavate to 8 in                             |
|     4 base + 1 sand + 2 3/8 stone + your extra   |
|     inch of topsoil. That's 3.6 cu yd out.       |
+--------------------------------------------------+
```

---

## 6. Open decisions

| Question | Options | Decide by | Decided |
|---|---|---|---|
| Parcel source | — | — | **WI Statewide Parcel DB** (ArcGIS, free, no key, 72 counties). WI-only; returns nothing outside rather than guessing. Proven in `modryn-builds/yard`. |
| Aerial source | — | — | **Google Static Maps satellite**, z18–21, north-up Web Mercator, m/px computed in closed form. Proven in yard. |
| Sun | — | — | **Google Solar API `monthlyFlux`** — 12 bands, 0.5 m grid. Modelled confidence, never presented as measured. Proven in yard. |
| Slope + aspect | — | — | **USGS 3DEP ImageServer**, `Slope Degrees` / `Aspect Degrees`, 1 m, no key, national. Verified live 2026-08-17 at Portage: 1°, 180°. |
| Image generation | — | — | **Replicate** (standing studio rule: check Replicate before adding any image provider). |
| Which generation model | flux-kontext · nano-banana-pro · SDXL inpaint | before S3 | — |
| How the render stays faithful to the drawn region | mask inpaint · control image · both | before S3 | — |
| Plant palette size and source | curated ~150 · licensed dataset | before S5 | — |
| Guide library: how many project types at launch | 3 · 8 · 20 | before S8 | — |
| Guide grounding source | university extension publications *(leaning: free, regional, citable)* | before S8 | — |
| Permits and easements | out · surface as a warning · full lookup | before phase 4 | — leaning **surface as a warning**, since `yard/docs/discovery.md` names easements as one of the four things that sink amateur projects, and we already hold the parcel boundary |
| Does signup gate the base plan | before · after | before slice 1 | — |
| Geography at launch | Wisconsin only *(parcel constraint)* · national with degraded boundaries | before slice 1 | — |

---

## Phase 2 gate

- [x] **Can describe v1 in 60 seconds with no "and also"**
  > *You type your address and it pulls your lot lines, your house, and a scaled aerial from
  > public records — plus your sun, your slope and which way it faces, all worked out for you.
  > You confirm it. Then you walk out back, photograph the corner you're thinking about, draw a
  > rough shape on the photo and say what you want it to look like — and it renders that into
  > your actual photo. When you like it, you flip to the overhead plan and give the shape a real
  > size. That produces a shopping list with waste already in it, and a build guide with the
  > tools, the steps, and the checks between them — using your numbers. When you finish, it stays
  > on the property, so next year starts from what's already built.*
- [x] Every critical-path story has testable acceptance criteria
- [x] Every critical-path story has empty / error / loading defined
- [x] NOT IN V1 is longer than the story list — 16 stories, 30 exclusions
- [x] **No open decisions block the first slice** — parcel, aerial, sun and slope are all settled
      and proven. Geography at launch should be confirmed before slice 1 but does not block
      building it.
