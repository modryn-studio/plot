# Blueprint instrumentation — plot

> **The blueprint is the product. This build is the beta. The friction log is the analytics.**
>
> This file exists to stop the most common failure in process work: finishing a build,
> saying "that went fine," and learning nothing. You cannot evaluate a process
> retroactively — at the end you'll remember the last 10% and rationalize the rest.
> So instrument it the same way phase 8 instruments a product.

**Build:** plot — a measured property model for a DIY homeowner
**Blueprint version being tested:** `modryn-hq@v4:playbooks/web-app-blueprint.md` @ `ad4b063`
**Started:** 2026-08-17 · **This file filled in:** 2026-08-20, late — see Q7
**Retro due:** at phase 7 gate — before the next build starts, not "sometime"

---

## Part 1 — Open questions (write these BEFORE you start)

Questions written *after* a build are answers in disguise. Commit these first.

| # | Question | Why it matters | Answer (fill at retro) |
|---|---|---|---|
| Q1 | Is design system (phase 3) before architecture (phase 4) actually the right order? | The order is asserted, not proven | |
| Q2 | Did the NOT IN V1 list hold, or did scope creep back in? | If the scope cut doesn't hold, phase 2 is theater | |
| Q3 | Did the EARS acceptance criteria survive contact with real code? | They're the anti-drift mechanism; if they're ignored they're overhead | |
| Q4 | How long did each phase actually take vs. expectation? | Wrong weighting is why people skip phases | |
| Q5 | Which gate did I most want to skip, and what happened? | The gate you want to skip is the one carrying the most weight | |
| Q6 | Did the design system survive first contact with a house-rules update mid-build? | Locked on 08-17 against the template, reset on 08-20 against `design-rules.md` which did not exist at phase 3. The blueprint assumes house style is stable across a build. It was not. | |
| Q7 | **What did filling this file in at phase 4 instead of phase 1 cost?** | The blueprint says write these first and this one was written three phases late, which makes Q1-Q5 partly retrospective. That is itself a finding about whether the instruction is followable. | |
| Q8 | Did a three-day gap mid-build lose more than the docs could restore? | Work stopped 08-17 and resumed 08-20 having forgotten most of it. The docs are supposed to be the anchor; measure whether they actually were. | |
| Q9 | Was phase 4 cheaper because another repo had already built the same data layer? | `yard` shipped parcel/imagery/solar/soil/climate first. If prior art is what made architecture fast, the blueprint should say so rather than assuming a blank page. | |

**Rule:** do not add questions after phase 5. Late questions are conclusions looking for support.

---

## Part 2 — Friction log (append in the moment)

One line, every time you think *"I don't know what to do here"* or *"the blueprint didn't
cover this"* or *"I'm doing this out of order."* Ten seconds each.

**Do not batch this.** In-the-moment friction is the only real data here; everything
written later is memory, and memory is exactly what this file exists to replace.

**Capture it where the work is**, not in a second document — opening another file mid-thought
is the friction that stops you logging friction:

- **In code:** `// FRICTION 2026-08-14: <what happened>`
- **In docs:** `<!-- FRICTION 2026-08-14: <what happened> -->`
- **At retro:** `grep -rn "FRICTION" .` assembles the log.

The fragile part of instrumentation is *recall*, not *assembly*. Notes written in the moment
and collected later are still in-the-moment data.

**Phase timing comes from git tags**, not hand-logged dates: `git tag p2-gate` at every gate.
Part 3 is then filled from `git log` at retro. Zero recall, zero discipline cost, works for
the document phases too.

Format, if writing free-form entries here instead: `<date> · <phase> · <what happened> · <what I did instead>`

```
2026-08-11 · P2 · example: couldn't tell if X was a story or an edge case · filed as edge case, felt arbitrary
```

<!-- append below -->

---

## Part 3 — Phase log

Fill in as each phase closes. Takes two minutes.

**Backfilled from git on 2026-08-20, not from memory.** No tags were cut at the time, which is
its own friction entry: the template says tag every gate and nothing in the working session
prompted it. Dates are commit dates.

| Phase | Started | Closed | Felt like | Gate passed cleanly? |
|---|---|---|---|---|
| 1 Discovery | 2026-08-17 | 2026-08-17 | Fast, because the recon did the work. Driving three live competitors and reading the professional tools produced the spin rather than a brainstorm producing it. | Yes, but the FIRST spin was wrong and got replaced same day: "add build sequencing to the picture" was a real answer on a fake foundation. |
| 2 Definition | 2026-08-17 | 2026-08-17 | The longest thinking, the least typing. Rewritten once mid-phase when the direction changed from project-rooted to property-rooted. | Yes, 5/5, after the data-source decisions moved from open to proven. |
| 3 Design system | 2026-08-17 | **2026-08-20** | The one that went wrong. Locked once against the template, found to violate house rules that appeared three days later, deleted, and re-locked against `design-rules.md`. | Eventually. Not on the first attempt, and the first attempt LOOKED clean: lint green, typecheck green, contrast gate ticked against a check that had never run. |
| 4 Architecture | 2026-08-20 | 2026-08-20 | Cheap, and suspiciously so. `yard` had already built the data layer, so most decisions were "read the working one" rather than "decide". | 5/6. Migration generated, not applied: no database provisioned yet. |
| 5 Build | 2026-08-20 | | Started by writing a document the blueprint does not have. Phase 5 assumes a wave table exists and never says to produce one, so `docs/build-plan.md` is the first artifact — sixteen slices, seven waves. Writing it forced three decisions the earlier phases had left open. | |
| 6 Hardening | | | | |
| 7 Launch | | | | |

---

## Part 4 — Retro (required output)

**This is not a "lessons learned" essay.** Every friction line resolves to exactly one of
three verdicts. If the retro produces zero edits to the blueprint, the retro failed —
either you didn't log honestly or the blueprint is already perfect, and it isn't.

### Friction resolutions

| Friction line | Verdict | Action |
|---|---|---|
| | `AMEND` / `BUILD-SPECIFIC` / `STILL OPEN` | |

- **AMEND** — the blueprint is wrong or silent. Edit it. Name the section.
- **BUILD-SPECIFIC** — real friction, but a quirk of this product. Ignore, don't generalize.
- **STILL OPEN** — needs another build's evidence. Carries forward to the next
  instrumentation file's open questions.

### Blueprint edits made

| Section | Change | Driven by |
|---|---|---|
| | | |

### Carried forward to next build

- <question that's still open>

---

## Why this doesn't get forgotten

Three things hold it in place. Any one alone fails.

1. **It's a file in the repo, created at phase 1** — not a calendar reminder, not an
   intention. It sits next to `spec.md` and is visible every time you open the project.
2. **The retro is a gate, not a task.** It's attached to the phase 7 gate. The build isn't
   done until the retro is written — same status as "rollback tested."
3. **It has a required output.** "We reflected" is unfalsifiable. "Three sections of the
   blueprint were edited" is checkable. A retro that changes nothing is a failed retro.

The failure mode to watch for: logging friction *after* the fact because it felt too small
to write down at the time. Small friction repeated ten times is the most valuable signal in
this whole file — it's the difference between a process that works and one you tolerate.
