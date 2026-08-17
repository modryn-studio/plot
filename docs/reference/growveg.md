# Teardown — GrowVeg Garden Planner

**Read live 2026-08-17** via `chrome-devtools` CLI, logged into Luke's account (free trial, 6 days
remaining). Drove the app shell, Overview, Garden Planner with a real plan, Plant List, Parts
List, Garden Journal, Seed Inventory and Garden Guru.

**Status: THE COPY TARGET (Luke, 2026-08-17)** — for **IA and UX**. Luke's verdict on the visual
layer: *"not a huge fan of the UI, looks outdated."* So: take the structure, leave the skin.

App is `growveg.com/app`, v3.44.0, renderer reports **Mode: WebGL2**. Vendor is Growing
Interactive Ltd, running since 2007. 1,034,104 plans created by 869,812 gardeners.

---

## Why this is the right target despite being about vegetables

It is the only product found in this entire recon that does **all three of Luke's layers at
once**, on a *measured spatial model*, with *memory across years*:

| Luke's layer | GrowVeg's answer |
|---|---|
| **The record** | Garden Journal + Seed Inventory |
| **The design** | Garden Planner (2D, to scale) → Plant List + Parts List |
| **The build / guidance** | Garden Guru + in-app tutorial checklist + Live Chat with real experts |

And the loop that makes it durable: **this year's plan constrains next year's plan.** Their crop
rotation feature reads the previous 5 years of plans and warns you where not to place things.
That is the "property remembers" mechanic, shipped, with a million plans behind it.

---

## Top-level IA — five destinations

```
/app/overview            Overview      — dashboard
/app/garden-planner      Garden Planner — the spatial model
/app/journal             Garden Journal — the record (iframe: /journal-embed/)
/app/seed-inventory/…    Seed Inventory — what you own
/app/garden-guru/home    Garden Guru    — content, filtered by your plan
                         Help & Support
                         Account
```

**Five product destinations, no more.** Compare Arcadium's nine equal drawers. Each of these is a
different *mode of engagement* with the same garden — plan it, record it, stock it, learn about
it — not a different bin of objects. **This is the IA lesson.**

---

## 1 · Overview — the dashboard

Card-based, and it leads with **two verbs**:

- **Garden Planner — "Plan Your Garden"** → Open Plan / Create New Plan, plus **Recent Plans**
  with relative timestamps ("Pollinator Paradise Garden 2026 · Updated: 14 minutes ago"), an
  Introduction Video, Help & FAQ, Live Chat.
- **Garden Journal — "Track Your Garden"** → Open Your Journal / Create A Reminder, plus
  **Upcoming Reminders** on a 14-day horizon with a `Show Dismissed` checkbox.
- **Weather** — 7-day forecast, high/low, condition text and icon. First-class, not a widget in a
  corner.
- **Articles** — a dated, bylined feed *inside the app*.
- **Support** — live chat with real gardeners, 7 days a week.
- **Account** — subscription state stated plainly ("Free Trial · 6 days · Aug 24 2026").

**Take:** *Plan* and *Track* as the two verbs of the dashboard. Weather as a first-class card —
even more obviously right for landscaping, where you work outside and the ground has to be
workable. Reminders with a short, honest horizon rather than an infinite task list.

---

## 2 · Garden Planner — the spatial model

### Chrome

```
[Plan name ▾] [Settings] [Save]        ← plan identity
Plan | Plant List | Parts List | Notes ← the four views of one model
Edit · Layout · Layers · Edit All      ← mode tabs
Timeline: [All Months ▾]               ← the time scrubber
Seed Inventory | New Seed Planner
Help: Learn to Use · Chat · Help Pages
Left panel: Drawing Tools | Plants | SFG Mode
```

**The four tabs are the whole thesis in one row.** `Plan` is the drawing. `Plant List` and
`Parts List` are *reports generated from the drawing*. `Notes` is attached to it. One model, four
views — exactly the professional 2D-authoritative pattern, delivered to a consumer.

**The Timeline scrubber** (`All Months` → a specific month) is how seasonality is handled: you
view the *same plan* at a different time of year. This is the honest version of Neighborbrite's
"View by season", because it reads the model's real in-ground dates instead of restyling a photo.

### Plant filters

Name · Type · Show Companions · Favorites · Include Perennials · **Available in Seed Inventory**.

That last one is the record feeding back into the design: filter the palette down to *what you
already own*. Cheap, and it is the kind of thing only a product with a record layer can offer.

### Learn to Use — onboarding as a progress checklist

Not a modal. A persistent, resumable checklist with completion counters, split in two tiers:

**Garden Planner Basics (0/7):** Overview tour · Add a Plant · View your Plant List · View
Planting Suggestions · Set a Variety · Add a Garden Object · View our Help Centre

**Master the Garden Planner (0/8):** Add & Edit Varieties · **Set up Succession Planting** (set
in-ground dates and view your plan by month) · **Add a Season Extender** *(add an object and see
how this affects the Plant List)* · View Layers · **Crop Rotation** *(create next year's plan and
rotate plants to avoid pests and diseases)* · Add Notes & Text · Plan Settings · Printing &
Sharing

Plus a combined **"1/15 Overall Progress"**.

**Take, and this is a strong one:** the tutorial list doubles as the **feature map**. A new user
reading it learns what the product can do without touching anything. And note the framing of
"Add a Season Extender" — *see how this affects the Plant List*. The onboarding teaches the
central principle (**objects change the derived outputs**) rather than teaching a button.

---

## 3 · Plant List — the planting takeoff

The single best artifact found in the entire recon. Columns:

| Plant Spacings | Quantity | Planting Calendar | Plant Notes |
|---|---|---|---|
| Single: 1'0" · In-Row: 1'0", row gap 1'0" | 7 | Jan…Dec bands for **Sow Indoors / Sow-Plant Outdoors / Harvest** | per-plant, `Add` |

Real rows from Luke's plan: Agastache 7 · Alyssum 4 · Black-Eyed Susan 7 · Crocus 17 · Echinacea
5 · Helenium 8 · Joe Pye Weed 3.

- **Quantity is computed from the drawing.** Draw the bed, place the planting, the count falls out.
- **Spacing is given three ways** — single, in-row, and row gap — because those are the three
  numbers you actually need standing in the dirt.
- **The calendar is localised.** Tailored to local climate from ~5,000 weather stations.
- Display: Default / **Individual Plantings**. Sort, Filter, **Export**, Reset All Options.

**And the honesty pattern, which is the best copy in the product:**

> *"No planting data available for this plant in your location."*

It states what it does not know rather than guessing. Directly applicable to the
derived-vs-measured distinction in [`problem-brief.md`](../problem-brief.md).

---

## 4 · Parts List — the materials takeoff

> *"The Parts List provides a summary of the Garden Object items on your plan to make it easy to
> work out what you need to make or buy for your garden."*

| Part | Quantity |
|---|---|
| Path (Brick) | **17' 8"** |
| Pond | 1 |

> *"It is usual to add approximately 10% to the quantity shown above when ordering items which
> are cut to length or purchased by area."*

**This is the hardscape takeoff pattern, in miniature and already solved.** Lengths come out of
drawn geometry. Counts come out of placed objects. And the **waste factor is surfaced as plain
advice** rather than silently applied — the user learns a professional habit instead of being
handed a padded number.

For Luke: this is exactly the pattern for pavers, edging, wall block, mulch and base material.
Scale it up, add area and volume, and it is the build layer's shopping list.

---

## 5 · Garden Journal — the record

At `/app/journal`, embedding `/journal-embed/` **in an iframe** — visibly an older codebase than
the rest of the app.

**A week view.** "My Journal | August 15 to 21", labelled **WEEK 34**. Each day is a row carrying:

- Date, anchored as a deep link (`#2026-08-17`)
- **High / low temperature, precipitation %, condition text** — captured automatically
- **Moon phase** (there is an `icon-moon`)
- A `+` to add an entry
- Per-day, per-type **count badges** (`harvesting numberCircle ymd2026-08-15`)
- A per-day **summary doughnut chart**

### The entry taxonomy — recovered from the DOM

Five typed entries, one with sub-types:

1. **Planting**
2. **Watering**
3. **Tending** → *weeding · fertilizing · pest control · transplanting*
4. **Harvesting**
5. **Photos**

**This is the most important finding for Luke's record layer.** The journal is **not a notes
field**. It is a set of **typed, dated, countable events** — which is why it can render count
badges, a summary chart, and feed year-over-year analysis. Free text alone could never do that.

**The weather is captured for free.** The user never types it, but a year later the record can
answer *why did that fail* — it rained 99% that week, or it hit 57°F. For landscaping this is
even more valuable: whether the ground was workable, whether the concrete cured, whether new sod
got water.

**Landscape translation of the taxonomy:** planted · watered · pruned/cut back · mulched ·
fertilized/amended · treated (pest/disease) · **built** (a hardscape work session) · photo.

---

## 6 · Seed Inventory — what you own

Sub-nav: **Home · List · Packets · Schedule**. `Add Packet`, filters, plants-per-page.

Empty state, and it is a good one:

> *"Add a packet type and keep a log of the packets you own, make notes about the varieties that
> work well for your garden and get reminders when you're running low."*

Three jobs in one sentence: **track what you have · learn what works here · get told when to
restock.** Note *"varieties that work well **for your garden**"* — the record is explicitly
framed as local knowledge, not general knowledge.

Landscape translation: what is already planted, what materials are on hand, what tools you own —
which feeds the build layer's tool list ("you already have a plate compactor; rent the wet saw").

---

## 7 · Garden Guru — content wired to the model

Tabs: **Videos · Articles · Garden Guru · Plants · Pests**.

Search promises: *"Videos, Guides and Articles Specific to Your Garden, Location and Season."*

Sections: **At This Time of Year…** · **From your 2026 Plans** · Inspirational Gardens · Latest
Videos · Featured Articles · **Based on your plan: Pollinator Paradise Garden** · Your Bookmarked
Content · Recently Viewed · Currently Trending · **Plant Now**

**This is the answer to Luke's tutorials/tips/how-to layer, and the answer is not "build a
library."** It is: take a content library and **filter it by the model and the calendar**. "Based
on your plan." "At this time of year." "Plant now." The same article is useful or noise depending
on what you own and what month it is, and the product already knows both.

---

## UI — what NOT to copy

Luke's read ("outdated") is confirmed by the markup, and the causes are specific:

1. **Icon-only buttons with no accessible names.** The planner toolbar exposes long runs of
   `button ""` — same defect found in Arcadium. Unusable by screen reader and a smell of a UI
   grown by accretion.
2. **The Journal is an iframe into a separate legacy app** (`/journal-embed/`), with the full
   marketing site chrome loaded inside it. Two apps wearing one shell.
3. **`+` rendered as a StaticText, not a button** — not focusable, not keyboard operable.
4. **Three visual generations coexist**: the modern React shell, the WebGL2 canvas planner, and
   the iframe journal.
5. Copyright line reads 2007–2026 — the age shows in the seams, not in the thinking.

**The structure is excellent and the surface is tired.** That split is exactly why this is an
IA/UX target and not a UI target — and it is also the opening: the same IA, drawn properly, with
labelled controls and one coherent visual system, is a straightforwardly better product.

---

## What to take — ranked

1. **Four views of one model:** `Plan · Plant List · Parts List · Notes`. Drawing is truth;
   lists are reports.
2. **The typed-event journal** with automatic weather capture and per-day counts.
3. **Last year constrains this year** — the crop-rotation mechanic, generalised to "the property
   remembers."
4. **Content filtered by model + location + season**, not a generic library.
5. **Quantities and lengths derived from geometry, with the waste factor taught, not hidden.**
6. **Onboarding as a persistent progress checklist that doubles as the feature map.**
7. **Say what you don't know** — "No planting data available for this plant in your location."
8. **Inventory feeding the design** — filter the palette to what you already own.
9. **Weather as a first-class dashboard card.**
10. **Five destinations, each a mode of engagement**, not nine bins of objects.

## What to leave

- The visual system, entirely.
- The iframe/legacy split.
- Square-foot-gardening mode and other vegetable-specific mechanics.
- Seed packets as a first-class object (the landscape analogue is materials and existing plants).
