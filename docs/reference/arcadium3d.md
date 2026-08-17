# Teardown — Arcadium 3D

**Read live 2026-08-17** via `chrome-devtools` CLI, logged in as Luke, free plan.
Created a project and opened the 3D editor. `arcadium3d.com`.

**Threat rank: #4 as a competitor, #1 as a teacher.** It is not a landscape product and will not
take our user. But it is the only tool read this session with real spatial rigor in a browser,
so it is where the *measurement* half of the answer gets studied.

---

## Information architecture

**Workspace-scoped**, like SimplyScapes but with the workspace actually exposed:

```
/workspace/[workspaceId]        — Projects · Items · Images · Members · Billing · Upgrade
/projects/[projectId]?createType=3d
/how-to-use-arcadium
```

Workspace nav: **Projects · Items · Images · Members · Billing**. Luke's is "hannerluke's
Workspace". `Items` and `Images` being workspace-level means **assets are owned by the workspace
and shared across projects** — a reusable-library model neither AI-photo tool has.

**Two project types on creation:** `3D/2D Design` and `AI Images`. The AI path is a separate
project type, not a mode inside the editor. They bolted generative AI *beside* the CAD tool
rather than into it.

Landing screen for a new user: Start a new project · **Example projects** (5) · **Guides and
tutorials** (Key view controls, Positioning objects, Adding walls, Creating floor plans,
Creating multiple floors, **Garden design**, Painting walls).

## The editor — the pro lineage intact

**Left toolbar:**

| Group | Contents |
|---|---|
| Structures | Walls · Doors · Windows · Roofs · Stairs · Floors |
| Items | Living room · Kitchen & dining · Bedroom · Bathroom · **Garden** · Lighting · People · Art & mirrors · Miscellaneous · My items |
| Shapes | — |
| Labels | — |
| Draw | Shape · Line · **Area** |
| Measure | — |
| Paint | — |
| Terrain | — |
| Import | .pdf .jpg .glb |

**Garden is one drawer out of nine.** This is a house-design tool that happens to do gardens.
That single fact is the clearest statement of the market gap available: the tools with real
spatial rigor treat landscape as a side category.

**View model — genuine drawing convention:**
Top-down elevation · Front elevation · Left elevation · Back elevation · Right elevation ·
Flat orthographic view · Perspective view · Floor plan view · **First person view** ·
**Cross section** · Add plane · Reset view · Environment settings

**Object operations:** Move · **Surface snap** · Resize · Rotate · Mirror · Hide · Lock · Delete ·
`Size (ft in)`. Undo/redo with standard shortcuts.

**Units are `Ft & in` and explicit.** Export: `.glb .stl .obj`. Print. Share.

Elevations, cross-sections, orthographic projection, surface snapping, real units and a mesh
export — this is CAD vocabulary, delivered in a browser tab, on a free plan.

## What it costs to have that rigor

**The learning curve is the price, and it is steep.** Navigation is a video-game control scheme:
`W,A,S,D` to move, `E`/`Q` for up and down, `Ctrl+click` or right-click to rotate, scroll to zoom.
First run is a mandatory-feeling welcome modal offering a tutorial plus linked training videos
("Object positioning 1:22", "3D view controls 1:18") and a full guide.

**A product that needs training videos to move the camera has already lost the one-project
homeowner.** Neighborbrite asked for one photo and gave a result in ninety seconds.

## UX and a11y findings (from markup, not pixels)

1. **Most editor chrome is unlabeled.** A large run of toolbar buttons expose no accessible name
   at all — `button` with no text and no `aria-label`. Screen-reader users cannot operate the
   editor, and it made automated driving unreliable.
2. **The left toolbar renders off-viewport while the welcome modal is up.** Measured rather than
   guessed: the `Items` button sat at `x = -384` with the modal open, and at `x = 16` after a
   reload. So the primary toolbar is genuinely outside the viewport during onboarding, not merely
   covered — a first-run user pressing toward the tools finds nothing there.
3. **Dismiss controls didn't take.** "Maybe later" and "Skip" both reported successful clicks
   without clearing the overlay; only a reload cleared it.
4. **Viewport was 1280×529** during the read — short, and the app did not adapt gracefully.

## Gaps and openings

1. **Interior-first.** Garden is a drawer. Plant modelling is object placement, not planting
   design — no mature size, no zone, no sun, no water, no seasonality.
2. **Rigor without guidance.** It will happily let you measure an area to the inch and tells you
   nothing about what to do with the number. No materials, no quantities, no cost, no sequence.
3. **AI is a separate project type**, so the fast path and the precise path never meet. The whole
   opportunity in this category is putting them on one surface.
4. **Onboarding assumes a hobbyist with time.** Tutorials and training videos are the first-run
   experience.

## What to take

- **Named orthographic views and a cross-section** as first-class, not a pro-mode toggle.
- **Explicit units in the UI chrome** (`Ft & in` sits in the toolbar, always visible).
- **Draw → Area** as a primitive: the user outlines a region and gets a number. This is the
  bridge between a picture and a materials list, and it is one control.
- **Surface snap** — the small thing that makes direct manipulation feel accurate instead of
  approximate.
- **Workspace-level asset library** reused across projects.

## What to avoid

- WASD/first-person navigation as the primary camera model.
- An onboarding that opens with a tutorial offer.
- Unlabeled icon-only toolbars.

## Visual signature (5 lines)

Dark editor chrome around a bright 3D viewport, dense icon rails on left and right, near-zero
text. Classic CAD/game-engine shell — capable-looking and unwelcoming. Reads as a tool for
someone who has already decided to learn it, which is precisely the posture our user cannot
afford.
