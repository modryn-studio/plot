# Teardown — Recraft.ai

**Read 2026-08-17 from screenshots supplied by Luke** (`reference/recraft.ai/*.png`). Recraft is
behind Cloudflare, so the standalone chrome CLI cannot drive it — this is a pixel read, not a
markup read, and is labelled as such.

**Status: the interaction model for the design surface (Luke, 2026-08-17)** — *"basically the same
as Recraft through and through. IA and UI/UX."*

---

## App shell IA

Persistent left sidebar, with `Create new project` as the primary action pinned above it:

```
Get started        — prompt box + galleries
Projects           — your work
Editing templates  — one-click transforms, no prompt
Community          — public feed
Styles             — named, reusable looks
Favorites
History
Profile
What's new
```

Bottom of the sidebar: `Upgrade subscription`, then the user with a **live credit balance** (◆60).
Credits are also shown in the editor top bar. The cost of the next action is never more than a
glance away.

## Get started — the prompt is the front door

Centred, above everything: **"What are you going to create today?"** and a single input,
*"Describe your idea."*

The input is a **compound control**. Under the text field sits a row of inline parameter chips:

```
[Image] [Model] [Style] [Ratio] [Count] [🎨]        📎  ⬆
```

Not a settings panel, not a sidebar of options — the parameters live *in* the prompt bar, each one
a chip that opens its own picker. This is the single most transferable pattern in the product.

Below the prompt: **Mockups** (Apparel, Packaging & products, Devices, Outdoor ads),
**Inspiration collections** (Lifestyle photo, Cinematic photo, Fashion photo, Vector illustration),
and **Editing templates**.

## Editing templates — the no-prompt path

> *"Transform your photos in one click. Start with a template and no prompt."*

Named, thumbnailed transforms: Hero packshot · Product photoshoot · Brand world generator ·
Creative snaps · Angles · **Sketch to photo** · Apply texture · Cyber fairy editorial · Creator
shots · Ghost mannequin.

Each thumbnail is a **before/after grid**, so the template's effect is legible without reading a
word. **`Sketch to photo` is literally the mechanic Luke described** — a drawn concept on the
left, a photoreal render on the right.

This is the "or they can just pick options" path, and it exists *beside* the prompt rather than
inside it.

## Projects

Card grid, thumbnail + name + `modified 27 days ago`. First card is always
`+ Create new project`. Tabs: **My projects · Shared by me · Shared with me · Featured projects**.
Sort control: `Last opened`. Projects with no output render a plain `No images` placeholder rather
than a broken thumbnail.

## Styles — a look is a first-class object

Tabs: **AI Generated · My styles · Saved · Shared**, plus a style-family dropdown and a search box.

The grid is named styles, each with one representative image: *Whimsical Narrative Illustration ·
Nightly Scholars · Introspective Chiaroscuro · Heroic Triad · Gloomy Aesthetic · Ethereal
Florance · Urban Nocturne Vignette · Micro Floral Minimalism · Rustic Vitality · Theatrical
Grotesque.*

**A style is a saved, named, browsable, shareable thing** — not a dropdown value. You can make
your own and reuse it. For a landscape product the equivalent is obvious and valuable: a saved
look (materials, palette, planting character) reusable across every project on the property, so
the patio and the beds and the fence read as one composition rather than seven decisions.

## The editor — infinite canvas, floating prompt

```
[logo▾] [AI chat] [Create] [Get started] [↺] [?]     Untitled ▾     [50%] [Share] [◆60] [Upgrade] [avatar]
┌──┐
│▷ │  select
│✋│  hand / pan
│⬡ │  shapes
│👕│  mockup
│⬚ │  frame
│T │  text                    ·  ·  ·  ·  infinite dotted canvas  ·  ·  ·  ·
│⬆ │  upload
│↺ │  undo
│↻ │  redo
└──┘
                    ┌─────────────────────────────────────────────┐
                    │  Describe what you want to generate      ≡ ⤢ │
                    │  [Image][Model][Style][1:1][2 images][🎨] 📎⬆│
                    └─────────────────────────────────────────────┘
                         Recraft can make mistakes. Check important info.
```

**The two-input model is the thing to take.** A **left rail of manual tools** and a **bottom-centre
prompt bar**, both acting on the same canvas. Draw it yourself, or describe it — same surface,
same result, no mode switch between "designer" and "AI user". That is exactly Luke's *"they can
draw over the top of the image… or they can type in prompts to help agents do it for them."*

Other details worth keeping:

- **Zoom is a top-bar readout** (`50%`), not a hidden gesture.
- **`Untitled ▾`** — the document name is a dropdown in the centre of the top bar, and it is also
  the project menu.
- The logo dropdown carries the whole sidebar again plus **Create / Duplicate / Delete project**
  and **Undo / Redo / Duplicate selection with keyboard shortcuts shown**.
- A standing honesty line under the prompt: *"Recraft can make mistakes. Check important info."*

## AI chat — a mode that splits, never replaces

Toggling `AI chat` splits the window: **conversation on the left, canvas stays on the right.**

The empty chat state is a prompt plus **starting-point chips**:
`Video` · `Photorealistic image` · `Illustration` · `Poster` · `Vector logo` · **`Edit image with AI`**

> *"What would you create today? Start with a prompt — or use a starting point below."*

Input is `Ask anything`, with its own compact chip row (image/video toggle, Model, Style, palette,
settings).

**The canvas never disappears.** The user is never taken away from their work to talk to the
assistant — which is what makes the assistant feel like a tool rather than a destination.

---

## What to take

1. **The compound prompt bar** — text plus inline parameter chips (`Image · Model · Style · Ratio ·
   Count · Colour`). Landscape equivalent: `Photo · Style · Materials · Season · Count`.
2. **Left rail = manual, bottom bar = AI, one canvas.** Draw it or describe it; same surface.
3. **Editing templates** — one-click, no-prompt transforms with before/after thumbnails.
   `Sketch to photo` is the exact mechanic for turning a drawn patio into a rendered one.
4. **Styles as saved, named, reusable objects**, not dropdown values. Property-wide look
   consistency falls out of this for free.
5. **AI chat splits the screen; the canvas stays visible.**
6. **Credits always visible**, in the sidebar and the editor top bar.
7. **A standing "this can be wrong" line** under the generative control.
8. **Projects grid with modified-time and honest empty thumbnails.**

## What does not transfer, and it matters

Recraft has **no measurement anywhere**. It is image-in, image-out. Nothing on that canvas has a
dimension, and nothing needs one.

`plot` needs both: a surface where a thing has a *look*, and a surface where the same thing has a
*size*. Adopting Recraft's model wholesale would deliver a beautiful render and no takeoff — which
is the exact failure mode of the two consumer competitors already rejected. **See the open
question in [`spec.md`](../spec.md) §6 about the plan/photo split.**
