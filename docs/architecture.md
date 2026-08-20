# Architecture — plot

> Phase 4 artifact. Where every piece of state lives, and why.
> The reasoning matters more than the choice — future-you needs to know whether a constraint still
> applies before overturning a decision.

**Status:** draft
**Last amended:** 2026-08-20 — first draft, written against [`spec.md`](spec.md) and the working
implementation in `modryn-builds/yard`.

---

## 0. The one idea

**The drawing is the truth. Everything else is derived from it or attached to it.**

A takeoff is a *report* on geometry, not a stored document. A render is an *illustration* of
geometry, not a source. The moment a quantity is stored rather than computed, it can disagree with
the shape it describes — and this product's entire claim is that its numbers are trustworthy.

So: **quantities are never persisted.** They are computed on read from the drawing plus the
material rules. Nothing can go stale because nothing is kept.

---

## 1. Data model

### Entities

**`property`** — one piece of ground, owned by one account. The durable thing the product is about.

| Field | Type | Null? | Notes |
|---|---|---|---|
| `id` | text | no | PK |
| `user_id` | text | no | FK → `auth_user.id`, cascade. **UNIQUE** |
| `address` | text | no | as entered, for display |
| `lat` / `lng` | double precision | no | the geocode; every external lookup keys off this |
| `derived` | jsonb | no | what the sources returned: parcel rings, house footprint, imagery manifest, zone, slope, aspect, sun flux manifest. **Never edited by the user.** |
| `confirmed` | jsonb | no | what the owner corrected or supplied: sun override, slope override, marked water areas. Defaults `{}` |
| `existing` | jsonb | no | geometry merged in from completed projects (S9). Defaults `{ shapes: [] }` |
| `captured_at` | timestamptz | no | when the sources were last read |
| `created_at` / `updated_at` | timestamptz | no | |

Indexes: `user_id` (unique, and it is the only way a property is ever looked up).
Owned by: `user_id`.

**`derived` and `confirmed` are two columns, not one merged blob, and that is the schema carrying
the product's central distinction.** A derived value and a value the owner checked with a tape are
different kinds of fact — one is a starting assumption, the other is what a purchase rests on.
Merging them would make "who said this" a per-field convention that drifts; two columns make it
structural. The read layer overlays `confirmed` on `derived`; nothing overwrites `derived`, ever,
so a bad correction is always recoverable and a re-capture never silently discards a measurement.

---

**`property_asset`** — bytes: satellite imagery, sun-flux layers, owner photos, AI renders.

| Field | Type | Null? | Notes |
|---|---|---|---|
| `property_id` | text | no | FK → `property.id`, cascade. **Part of the PK** |
| `name` | text | no | e.g. `z18.png`, `flux-07.png`, `photo-<uuid>.jpg`. **Part of the PK** |
| `kind` | text | no | `imagery` · `flux` · `photo` · `render` |
| `bytes` | bytea | no | |
| `content_type` | text | no | |
| `etag` | text | no | content hash — the URL carries it, so a re-capture is a new URL |
| `captured_at` | timestamptz | yes | EXIF or source date where known |
| `created_at` | timestamptz | no | |

PK: **`(property_id, name)`**. Index: `(property_id, kind)`.
Owned by: through `property.user_id`.

> **Keyed on the pair, not on `name`, and yard already paid for this.** With `name` alone as the
> key, every capture produces a `z18.png`, so the second account's upsert overwrites the first
> account's imagery in place — silently, with a successful exit. The matching read bug was worse:
> a lookup by name resolved globally, so any signed-in account could fetch another account's
> satellite imagery by guessing a filename that is identical for everybody. Both were invisible
> while the allowlist held one address.

---

**`project`** — one piece of work on the ground. The four views are views of this row.

| Field | Type | Null? | Notes |
|---|---|---|---|
| `id` | text | no | PK |
| `property_id` | text | no | FK → `property.id`, cascade |
| `slug` | text | no | URL segment, unique per property |
| `title` | text | no | the owner's words |
| `kind` | text | no | `patio` · `path` · `bed` — selects the guide and the material rules |
| `status` | text | no | `draft` · `sized` · `building` · `complete` |
| `look` | jsonb | no | source photo name, drawn regions on the photo, prompt history. Defaults `{}` |
| `drawing` | jsonb | no | **the truth.** Shapes with dimensions, each dimension carrying its own `{ value, source: 'derived' \| 'measured', at }`. Materials and depths. Plant placements. Defaults `{ shapes: [] }` |
| `completed_at` | timestamptz | yes | set when merged into `property.existing` |
| `created_at` / `updated_at` | timestamptz | no | |

Indexes: **unique `(property_id, slug)`** · `(property_id, status)`.
Owned by: through `property.user_id`. **Never resolved by slug alone** — a slug is guessable and
half of these will be called `patio`.

> **Why `drawing` is jsonb rather than normalised shape/vertex tables.** Nothing queries *across*
> shapes. Every read is "this project's drawing, whole" — the takeoff computes from all of it at
> once, and the crowding check (S5) runs within one project plus `property.existing`. Normalising
> would buy query shapes nobody needs and cost a migration per geometry change while the shape is
> still moving. Yard reached the same conclusion for the same reason. **Revisit if a query ever
> needs to filter shapes across projects**, which would mean the model outgrew this.

---

**`generation`** — one AI render request, and what it produced. Kept because §S10 requires the
prompt and parameters to survive, and because a failed one must not cost the owner their work.

| Field | Type | Null? | Notes |
|---|---|---|---|
| `id` | text | no | PK |
| `project_id` | text | no | FK → `project.id`, cascade |
| `asset_name` | text | yes | → `property_asset.name`. Null while pending or after a failure |
| `prompt` | text | no | |
| `params` | jsonb | no | material, look, season, the model id |
| `status` | text | no | `pending` · `ready` · `failed` |
| `created_at` | timestamptz | no | |

Index: `(project_id, created_at)`.
Owned by: through `project` → `property.user_id`.

---

**`build_gate`** — a stop-work check the owner ticked. The only place the build guide writes.

| Field | Type | Null? | Notes |
|---|---|---|---|
| `project_id` | text | no | FK → `project.id`, cascade. **Part of the PK** |
| `step_key` | text | no | stable key from the guide, e.g. `811-marked`. **Part of the PK** |
| `checked_at` | timestamptz | no | |

PK: `(project_id, step_key)`.
Owned by: through `project` → `property.user_id`.

> A table rather than a field on `drawing`, because it is written independently of the geometry
> and read to gate the next step. Keyed on the guide's own step key so re-ordering a guide's steps
> does not silently un-tick a gate the owner really passed.

---

### What is deliberately NOT in the database

- **The build guides.** A finite reviewed library of ~15–25 project types, versioned in the repo
  as content. Rows would imply they are edited at runtime by someone; they are not, they are
  reviewed and shipped. Also puts them in code review, which is where reviewed content belongs.
- **The plant palette.** ~150 curated entries with mature width/height, zone and sun. Filtering
  150 records in memory is free, and a table would invite a CMS nobody asked for. See debt.
- **Takeoffs.** Computed on read. See §0.

### Relationships

```
auth_user ──1:1──> property ──1:many──> project ──1:many──> generation
                        │                    └──1:many──> build_gate
                        └──1:many──> property_asset
```

### Deletion policy

| Relationship | On delete |
|---|---|
| `auth_user` → `property` | **cascade.** The property is only meaningful to its owner, and leaving orphaned satellite imagery of a stranger's house is the wrong default. |
| `property` → `property_asset` | **cascade.** Bytes with no property are unreachable and unattributable. |
| `property` → `project` | **cascade.** |
| `project` → `generation` | **cascade.** |
| `project` → `build_gate` | **cascade.** |
| `project` → `property.existing` | **no FK.** Completing a project *copies* geometry into `property.existing`; deleting the project afterwards does not un-build the patio. The record of the ground is not a foreign key to the paperwork. |

**No soft deletes in v1.** Nothing here is a financial or legal record, and a `deleted_at` on every
table is a filter every future query must remember — one forgotten `WHERE` and deleted data is
back on screen.

---

## 2. System map

```
[browser] ──> [Next.js route handlers / server components] ──> [Neon Postgres]
                          │
                          ├──> Better Auth ............ session, emailed code + Google
                          ├──> Gmail SMTP ............. the sign-in code
                          ├──> Google Geocoding ....... address → lat/lng
                          ├──> Google Static Maps ..... satellite tiles, z18–21
                          ├──> Google Solar API ....... monthlyFlux GeoTIFF
                          ├──> WI Parcel (ArcGIS) ..... boundary rings + recorded acres
                          ├──> USGS 3DEP .............. slope degrees, aspect degrees
                          ├──> USDA SDA ............... soil map unit
                          ├──> USDA PHZM .............. hardiness zone
                          └──> Replicate .............. render the drawn region into the photo
```

| Service | What we send | Failure mode | Critical? |
|---|---|---|---|
| Neon | everything | app is down | **yes** |
| Better Auth | session cookie | nobody signs in | **yes** |
| Gmail SMTP | the code, to one address | no new sign-ins; existing sessions fine (90-day) | no |
| Google Geocoding | the typed address | cannot start a property | **yes, at S1 only** |
| Google Static Maps | lat/lng | no base imagery; property cannot be drawn on | **yes, at S1 only** |
| Google Solar | lat/lng, radius | no sun map. Zone still works. Degrade, say so | no |
| WI Parcel | lat/lng | no boundary. Imagery-only, user traces. Degrade, say so | no |
| USGS 3DEP | lat/lng | no slope/aspect. Ask instead of derive | no |
| USDA SDA / PHZM | lat/lng, postal | no soil / no zone. Planting advice degrades to unfiltered | no |
| Replicate | photo + mask + prompt | no render. **The takeoff is unaffected** | no |

**Graceful degradation is the rule, and every non-critical source returns `null` rather than
throwing.** The capture route fans them out with `Promise.allSettled`, so one outage degrades one
panel instead of failing the whole capture — proven in yard. Two are critical and only at the
first step: without a geocode and an aerial there is nothing to draw on.

**Every one of these is a per-property, one-time read**, cached in `property.derived`. None is on
a hot path. That is what makes a keyless national dataset with an unknown SLA an acceptable
dependency.

---

## 3. Trust boundary

```
             ┌──── TRUST BOUNDARY ────┐
  browser ───┤  session resolved      ├────> stores (every fn takes userId)
  AI tools ──┤  input parsed (zod)    │
  3rd-party ─┤  ownership re-checked  │
             └────────────────────────┘
```

| Entry point | Validated by | Authorized by |
|---|---|---|
| `POST /api/properties` (address) | zod: non-empty, length-capped | session |
| `PATCH /api/properties/:id` (confirm/correct) | zod per field; geometry closed and non-self-intersecting | `property.user_id === session.user.id` |
| `POST /api/projects` | zod on title/kind | `propertyIdForUser(session.user.id)` |
| `PATCH /api/projects/:slug` (drawing) | zod on the shape schema; dimensions positive and finite | property ownership, **never slug alone** |
| `POST /api/projects/:slug/render` | zod on prompt + params; prompt length-capped | property ownership |
| `POST /api/projects/:slug/gates` | step key must exist in that project's guide | property ownership |
| `GET /api/assets/:name` | filename regex | **`(property_id, name)` lookup, never name alone** |
| Replicate callback | signature check, if used; otherwise poll rather than accept a push | n/a |

**Three rules, and they are the ones that get skipped:**

1. **No store function takes a bare id or slug without the user it must belong to.** Enforced by
   signature, so a missed check is a type error and not a code review someone has to remember.
   Yard's `project-store.ts` is the working example.
2. **A model's tool arguments are untrusted input.** When a tool creates or edits a record, the
   owner is closed over from the session and is **never** a field in the tool's input schema. A
   tool argument the model controls is one a crafted conversation could try to control.
3. **404, not 403**, for a record that exists but is not yours. A 403 confirms it exists.

---

## 4. Decisions

| Decision | Choice | Why | Rejected |
|---|---|---|---|
| Auth | Better Auth, emailed 6-digit code + Google | Ships in the boilerplate, works. A code not a link: a link signs in whichever device opens it. | Passwords — one more secret to hold for a single-user-per-property app |
| Session | 90 days | The field cost is real: sun, weak signal, a login screen. This makes it one sign-in at the desk rather than a login in the yard | Short sessions — correct for a bank, wrong here |
| Gating | Whole app behind a session | The repo is public; the alternative is a street address on the open web | Public reads + gated writes — considered, and lost to the address being the data |
| Secrets | `src/lib/env.ts`, zod, fail-fast | A missing key fails at boot, not deep inside a request | |
| Errors | `createRouteLogger` + a named user-facing message per failure | "Something went wrong" is unactionable outdoors | |
| Background jobs | **None.** Renders are polled from the client | A queue is a whole subsystem; one render per project per few minutes does not need one | A worker — revisit if renders batch |
| File storage | **Postgres `bytea`**, served through a gated route | Proven in yard. Bytes are small, per-property, and must be access-controlled. Object storage means a second access-control model | S3/R2 — revisit at multi-property or video |
| Caching | `Cache-Control: private, immutable` on assets, keyed by content hash | A re-capture changes the hash, so it is a new URL and the stale copy is never requested | |
| Dev DB | `drizzle-kit generate` + `migrate`, never `push` | House rule; one push makes migrate skip older migrations forever | |
| Hosting | Vercel + Neon | | |
| Geography | **Wisconsin at launch** | The parcel DB is WI-only and returns nothing elsewhere rather than guessing. A wrong property line is worse than none: it would be measured off | National with degraded boundaries — the degraded case *is* the product's core claim failing |

---

## 5. Screen → data map

| Screen | Reads | Writes |
|---|---|---|
| `/properties/new` | — | `property`, `property_asset` (imagery, flux) |
| `/properties/[id]/site` | `property` | `property.confirmed` |
| `/properties/[id]` (home) | `property`, `project` | — |
| `/projects/[slug]` · **Look** | `project.look`, `property_asset` (photo, render), `generation` | `project.look`, `generation`, `property_asset` (photo, render) |
| `/projects/[slug]` · **Plan** | `project.drawing`, `property.derived`, `property.confirmed`, `property.existing` | `project.drawing` |
| `/projects/[slug]` · **Takeoff** | `project.drawing` (+ material rules in code) | `project.drawing` (a confirmed measurement) |
| `/projects/[slug]` · **Build** | `project.drawing`, `build_gate` (+ guide library in code) | `build_gate`, `project.status`, `property.existing` on complete |
| `/login` | `auth_*` | `auth_*` |

---

## 6. Known debt

| Shortcut | Why it is acceptable | What forces a fix |
|---|---|---|
| Plant palette as a repo module | ~150 entries, filtered in memory, read-only, ships with the app | It needs per-user favourites, or it passes ~1,000 entries |
| Guides as repo content | Reviewed, not user-edited; code review is the right gate | Non-engineers need to edit them |
| Assets in Postgres `bytea` | Small, per-property, must be access-controlled | Video, or a property big enough that row size hurts |
| `drawing` as jsonb | Nothing queries across shapes | A query needs to filter shapes across projects |
| One property per account | `NOT IN V1`, and the unique constraint states it rather than implying it | The second property. Dropping a unique constraint is a one-line migration |
| Renders polled, not queued | One render per project per few minutes | Batch rendering, or a render that outlives a request |
| No soft delete | Nothing here is a legal record | Anything a user could need un-deleted |

---

## Phase 4 gate

- [x] Every screen in the spec maps to specific tables — §5, all eight
- [x] Every field filtered/sorted/joined on is indexed — `property.user_id` unique;
      `project (property_id, slug)` unique and `(property_id, status)`;
      `property_asset (property_id, name)` PK and `(property_id, kind)`;
      `generation (project_id, created_at)`; `build_gate (project_id, step_key)` PK
- [x] Deletion policy decided for every relationship — §1, including the one that is deliberately
      *not* a foreign key
- [x] Trust boundary drawn; every entry point has server-side validation and an ownership check — §3
- [x] Every external service has a named failure mode and a critical/non-critical verdict — §2
- [x] **Schema written** — `src/lib/db/schema.ts`, and the migration generated as
      `drizzle/0001_harsh_demogoblin.sql` (`generate`, never `push`).
- [ ] **Migration applied.** Blocked, honestly rather than forgotten: **plot has no `.env.local`
      and has never been connected to a database.** Provisioning a Neon project and filling
      `DATABASE_URL`, `BETTER_AUTH_SECRET`, `ANTHROPIC_API_KEY`, `GOOGLE_MAPS_API_KEY` and
      `REPLICATE_API_TOKEN` is the first thing phase 5 needs, before the walking skeleton can
      touch anything.

---

## 7. What phase 5 needs before it can start

1. **A Neon project and a filled `.env.local`.** Then `npx drizzle-kit migrate`.
2. ~~**Two open decisions from [`spec.md`](spec.md) §6 that block slice 1**~~ — both closed
   2026-08-20: **Wisconsin only**, and **signup comes first**. Reasoning in
   [`build-plan.md`](build-plan.md) §2. Five decisions remain open; none block slice 0 or 1, and
   the wave table names which wave each one blocks.
3. **The walking skeleton**, per the blueprint: address in → parcel + aerial out → one rendered
   value → deployed. Read `modryn-builds/yard`'s `src/lib/{parcel,site-imagery,geo}.ts` first;
   they already do the hard half and the projection maths is the part most likely to be got
   subtly wrong twice.

4. **The slicing itself — [`build-plan.md`](build-plan.md)**, written 2026-08-20. Sixteen slices,
   seven waves, three in flight at most. It is the document phase 5 is run from.
