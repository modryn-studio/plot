# Walkthrough — what using `plot` actually feels like

Rewritten 2026-08-17 after Luke's review. Photo-first. Sun and slope are derived, not asked.
Narrated in second person, one real project, real numbers. Matches [`spec.md`](spec.md) §2.

**Setting:** a house in Portage, Wisconsin. You want a patio off the back door — the grass never
grows there, it's mud half of spring, and you've had a folding chair on it for two summers.

---

## Sunday night, on the couch — 6 minutes

**`/properties/new`**

One field. You type your address. Nothing to draw, no photo, no style quiz.

It narrates what it's collecting as it goes — found the address, pulled the parcel from Columbia
County, fetched the imagery, worked out the sun — and then you're looking at **your lot**, with
**your property line on it**. Not a picture of your house. A boundary. Scale bar reads `|——| 20 ft`.

**`/properties/[id]/site`**

> **What we worked out**
> Lot size — **0.72 acres** · *county records say 0.72 too*
> Hardiness zone — **5a** · *which plants survive your winters*
> Slope — **1°, facing south** · *nearly flat*
> Sun — *a shade map, month by month* `[Jan ▁▁▁ … Jul ███ … Dec ▁▁]`
> *modelled from building and tree shadows, not measured*
>
> **Only you know this**
> Where water collects — `[ mark it ]`
>
> `[ Looks right ]`

You didn't answer a single question. It **told you** your slope, which way it faces, and how much
light each part of the yard gets in each month. The one thing it asks for is where water pools —
so you scribble a blob near the downspout. Ten seconds, deliberately rough.

**Session over. You have a measured model of your property and you drew one blob.**

---

## Saturday morning, standing at the back door — 10 minutes

**`/projects/[id]` — the `Look` view**

New project. It asks for a photo, with one line of advice: *stand where you'd stand, get the whole
area in frame.* You take the picture right there on your phone.

Now the canvas is **your photo**. Down the left is a small rail of tools — select, pan, shape,
erase. Along the bottom is one input:

```
[ flagstone patio here, warmer tone, low plants along the left ]   ⬆
[Material ▾] [Look ▾] [Season ▾]                    3 left today
```

You do both things. You rough out the patio area with the shape tool — a sloppy quadrilateral over
the dead grass, took four seconds — and you type what you want. Or you skip typing entirely and
tap one of the named treatments.

You hit send. It renders **into your actual photo**: flagstone where you drew, warm grey, a low
planting run down the left, your house and your fence and your maple all still there.

*Generated images are illustrations, not plans.* — sitting quietly under the canvas.

**This is the moment you find out you want it.** Not a plan, not a number. A picture of your own
back door with the thing in it. You generate twice more, settle on the second one.

---

## Still Saturday morning — 8 minutes

**The `Plan` tab**

Same project, different surface. Now you're overhead: your house, your boundary — and **the shape
you drew on the photo is already here**, sitting roughly where it belongs, waiting to be given a
real size.

You drag a corner. The edge reads **`12' 4"`** live. You want 12 even, so you type `12`. Four
corners later:

**`12' × 14'` · 168 sq ft · 52 ft around.**

Then the question a render app can never ask: **surface and depth.** Flagstone, and it sets a
default depth it's honest about not knowing yet.

And a warning that no competitor can produce:

> ⚠ This sits downhill of the wet spot you marked. Water will run onto it.
> Grade away from the house, or run a drain along the top edge.

It can say that because it knows where your patio is *relative to your downspout*, in real space.

---

## The `Takeoff` tab

```
Buy this

  Base gravel        2.3 cu yd
     2.1 plus 10% — you can't blend a second batch

  Bedding sand       0.6 cu yd

  Flagstone          177 sq ft
     168 plus 5% for cuts

  Edging             57 ft
  Shrubs             3

  ⓘ Three of these depend on how deep you have to dig.
    Dig one test hole first.  [ how ]

  [ Print ]   [ Send to phone ]
```

No columns of provenance. No spreadsheet. **A shopping list**, with the waste already in the
number and the reason said in a half-sentence underneath the lines that need one.

You dig the test hole after lunch. Topsoil's deeper than assumed — 8 inches, not 7. You type it in
and three numbers move. The notice disappears, because there's nothing left to check.

---

## The `Build` tab

> **Flagstone patio** · 2 weekends · **Hard**
> Reviewed Aug 2026 · adapted from UW-Extension
>
> **Tools**
> ☐ Plate compactor — **rent** ☐ Wet saw — **rent** ☐ Rubber mallet — buy
> ☐ Screed board, level, string line, wheelbarrow
>
> **1 · Call 811 before you dig**
> Struck utilities are your liability, and the marks change where a machine can go.
> ☐ **Marked and cleared** ← step 2 stays locked until this is ticked
>
> **2 · Excavate to 8 in**
> 4 base + 1 sand + 2⅜ stone, plus the extra inch of topsoil you found.
> That's **168 sq ft** and about **3.6 cu yd** of spoil to move.
>
> **3 · Compact the base in 2-inch lifts**
> One thick lift compacts on top and stays loose underneath. That's the patio that sinks in
> year two.
> ☐ **No footprint when you walk it**
>
> ⓘ **Stop and hire out if:** the patio has to tie into a step at the door, or you're cutting more
> than a foot into slope. Getting the elevations wrong sends water at your foundation.

Your numbers are inside the guide text. The guide itself came from a reviewed library, cites its
source, and shows when it was last checked.

---

## Three weekends later

You tick the last gate. **Mark project complete.**

The patio merges into your property's existing conditions. It isn't a saved file in a list — it's
part of the yard now. The project stays reopenable, with its date.

---

## Next April — the point of all of it

You want a bed along the fence. New project, and your lot comes up **with the patio on it**, greyed
beneath your new work.

You don't re-enter your address. You don't re-confirm the boundary. You don't re-derive sun,
slope, or aspect. The wet spot you marked last year is still marked.

You photograph the fence line, draw a bed, describe it, and see it. Then you size it. And when you
drop a shrub near the patio edge, it knows the patio is there — and knows that shrub's **mature
width** would overhang the flagstone in four years. It tells you before you buy it.

**Year one cost you about 25 minutes of setup. Year two costs none.**

That's the thesis, and it's not a feature anyone can ship to catch up. It's an accrued record of
your specific piece of ground.

---

## What changed from the first draft, and why

| Was | Now | Why |
|---|---|---|
| Sun asked as full/partial/shade | **Derived**, 12 monthly bands at 0.5 m | Google Solar API, already built in `yard`. Real shade map beats a three-way guess. |
| Slope asked as direction + 3 grades | **Derived**, degrees and aspect | USGS 3DEP, 1 m, no key, national. Verified live: 1°, 180°. |
| Drawing on an overhead plan first | **Photo first**, plan second | Luke: the user photographs where they want it and draws over the image. The render is what tells them they want it. |
| One drawing surface | **Two surfaces, one project** — Look and Plan | A phone photo has no scale, so quantities can't come from it. The plan carries size; the photo carries look. |
| Takeoff with Overage + Basis columns | **A shopping list** with waste included and reasons in half-sentences | Luke: the columns read as contractor info, not homeowner DIY. Correct — provenance is a developer's concern. |
| Build guide source unstated | **Finite reviewed library**, extension-grounded, personalised at render | ~15–25 project types exist. Build once, review once, personalise per user. Never generate steps per request. |

## Still guessing

1. **Does the shape drawn on a photo transfer usefully to the plan?** The spec says it does. In
   practice a quadrilateral scribbled on a perspective photo maps to an overhead plan only
   approximately — enough to seed the shape, not to place it exactly. May need the user to nudge
   it onto the right spot, which is fine, or may need a smarter approach.
2. **How many generations before it feels expensive?** "3 left today" appears in the wireframe as
   a placeholder. The real number is a pricing decision.
3. **Whether the Look → Plan handoff feels like one project or two apps.** This is the main risk
   in the whole design and it is a craft problem, not an architecture one.
4. **Permits and easements** — still leaning toward surfacing them as a warning, since we hold the
   parcel boundary and `yard/docs/discovery.md` calls easements one of the four project-killers.
