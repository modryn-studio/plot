'use client';

/* THE RACK. Every primitive, every state, one route.
 *
 * IT IS THE ENFORCEMENT MECHANISM for the system's central rule — if a screen needs a value that
 * isn't in the system, add it to the system first — because a rack of everything makes a new
 * one-off visible immediately: it will not have a home here.
 *
 * IT IS WHERE YOU SEE THE SYSTEM, NOT WHERE YOU DESIGN IT. When something looks wrong here the fix
 * is a token in globals.css, never a patch on this page. This file is a mirror.
 *
 * DEFAULT VIEW IS ONE PANE, driven by the app's real ThemeToggle sitting in this page's own
 * header — not a light/dark/both chip row, and not a button floating over the corner. The first
 * draft of this rack simulated width with a 375/768/1280/1920 control and swapped every string for
 * a long-text fixture behind a Density toggle. Both are gone (Luke, 2026-08-17): the browser's own
 * devtools already resize a window, and a control whose job needs explaining has failed at being a
 * control. Long-text coverage did not go with it — see the note at LONG_PLANT.
 *
 * COMPARE MODE is the one thing kept from the old three-way toggle, because it is not decoration:
 * side by side is what catches a value that is right in one theme and wrong in the other, the kind
 * of bug nobody finds by using the app one mode at a time (a real instance: a hover ground that
 * measured 2.85:1 in light and 1.09:1 in dark, invisible on the right). It is opt-in and off by
 * default rather than the resting state, which is the balance Luke asked for.
 */

import { useCallback, useEffect, useRef, useState, createContext, useContext } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { Card, Row as CardRow } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Icon, ICON_NAMES, type IconName } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { CallOut } from '@/components/ui/call-out';
import { QuantityRow } from '@/components/ui/quantity-row';
import { FactRow } from '@/components/ui/fact-row';
import { StepCard, GateCheck } from '@/components/ui/step-card';
import { PromptBar, PromptChip } from '@/components/ui/prompt-bar';
import { ToolRail, ScaleBar, DimensionReadout } from '@/components/ui/canvas-chrome';
import { ViewTabs, type ProjectView } from '@/components/ui/view-tabs';
import { EmptyState, ErrorState, NarratedProgress, Skeleton } from '@/components/ui/feedback';

/* SHIPS TO PRODUCTION, deliberately. The rack's whole job is review, and "works on mobile" means a
 * DEPLOYED build on a real phone — which matters more here than in most products, because this one
 * is used outdoors on a phone. A route that only exists on localhost cannot be opened on the
 * device it is meant to be judged on. Unlinked and noindex like the rest of the app. */
export default function KitchenSinkPage() {
  return <Rack />;
}

const slug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/* GROUPED BY WHAT A THING IS, not by which file it lives in — and the two mode groups are named
 * after the two standards in docs/design-system.md §0, because that is the distinction the whole
 * system turns on. */
const GROUPS: { group: string; titles: string[] }[] = [
  { group: 'Controls', titles: ['Button', 'IconButton', 'ThemeToggle'] },
  { group: 'Inputs', titles: ['Input', 'Textarea'] },
  { group: 'Canvas mode', titles: ['PromptBar', 'ToolRail', 'ScaleBar · DimensionReadout'] },
  {
    group: 'Document mode',
    titles: ['FactRow', 'QuantityRow', 'CallOut', 'StepCard · GateCheck'],
  },
  { group: 'Structure', titles: ['ViewTabs', 'Card'] },
  { group: 'States', titles: ['EmptyState', 'ErrorState', 'NarratedProgress', 'Skeleton'] },
  {
    group: 'Bad days',
    titles: [
      'A takeoff missing an input',
      'A guide that failed while the takeoff works',
      'A generation that failed with the drawing kept',
      'A property with no parcel',
      'The overlong list',
    ],
  },
  { group: 'Marks', titles: ['Icon'] },
  {
    group: 'Tokens and proofs',
    titles: ['Type ramp', 'Spacing ramp', 'Ground stack', 'Ink roles', 'Contrast', 'Chrome over a photograph'],
  },
];

/* ONLY THE FIRST PANE CARRIES THE ANCHOR IDS. In compare mode every section renders twice, and two
 * elements sharing one id is a broken document. Both panes scroll together at the same offsets, so
 * anchoring the first also aligns the second. In single-pane mode this is always true. */
const AnchorCtx = createContext(true);

// ── the collapsible nav, ported from run-trading's AppShell (v2 branch) ─────────────────────────
//
// Two behaviours, split at md, not one — copied faithfully because the split is the point:
//   - Desktop: the rail sits in normal flow and PUSHES the content. Collapsing animates its width
//     to 0 and hides it completely rather than leaving an icon strip, which would keep taking
//     horizontal space and pop open on an accidental hover.
//   - Mobile (< md): the rail never pushes. It is fixed, slides in over the content as an overlay
//     with a scrim behind it, and closes on scrim tap, Escape, or picking a section.
//
// Simplified from the original in one respect: run-trading's version is a real app shell guarding
// routes with a signed-in account menu at the bottom. This is a page-local review tool with
// nothing behind the rail but anchors, so there is no account menu and the storage key is scoped
// to this page rather than the whole product.
/* ONE header height for the whole rack, published so nothing has to guess. Three things sit in
 * that band across the top and any disagreement between them shows as a step in the top edge: the
 * rail's own header row, the content header, and the reopen control that appears where the rail
 * was. run-trading shipped exactly that bug — its constant said 3.25rem while the sidebar row was
 * `h-16`, 12px out — which is the reason this is a constant rather than three literals. */
const RACK_HEADER_H = '4rem';

const NAV_COLLAPSE_KEY = 'plot_kitchen_sink_nav_collapsed';
const MOBILE_QUERY = '(max-width: 767px)';
const isOverlay = () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;

function useCollapsibleNav() {
  const [collapsed, setCollapsed] = useState(true);
  // Transitions stay off until the stored preference is known, so the panel doesn't visibly
  // swing into place on first paint.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored = false;
    try {
      stored = localStorage.getItem(NAV_COLLAPSE_KEY) === '1';
    } catch {
      // Private mode / blocked storage.
    }
    // The stored value is a desktop preference. On mobile the rail is an overlay, so honouring
    // "open" would cover the whole page the instant it loads. Always start closed there.
    setCollapsed(isOverlay() ? true : stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (collapsed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOverlay()) setCollapsed(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [collapsed]);

  const toggle = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(NAV_COLLAPSE_KEY, next ? '1' : '0');
      } catch {}
      return next;
    });
  }, []);

  const closeIfOverlay = useCallback(() => {
    if (isOverlay()) setCollapsed(true);
  }, []);

  return { collapsed, ready, toggle, closeIfOverlay };
}

function SectionNav({
  scrollRef,
  collapsed,
  ready,
  onToggle,
  onNavigate,
}: {
  scrollRef: React.RefObject<HTMLElement | null>;
  collapsed: boolean;
  ready: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);

  /* SCROLL-SPY ON THE CONTAINER, not the window: the rack scrolls an inner element, and an
     observer with no `root` would watch the viewport and never fire. */
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const targets = [...root.querySelectorAll('section[id]')];
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { root, rootMargin: '0px 0px -66% 0px', threshold: 0 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [scrollRef]);

  return (
    <aside
      id="rack-nav"
      aria-label="Sections"
      // w-56, fixed on mobile and translated fully off-canvas, in normal flow and width-collapsed
      // on desktop. `overflow-hidden` on the outer element stops the fixed-width inner column from
      // reflowing while the desktop panel animates shut.
      className={cn(
        'bg-bg fixed inset-y-0 left-0 z-40 w-56 shrink-0 overflow-hidden md:relative md:z-auto md:translate-x-0',
        // `ease-out` reads `--ease-out` from globals.css — the system's own curve, not a one-off.
        ready && 'transition-all duration-300 ease-out',
        collapsed ? '-translate-x-full md:w-0' : 'translate-x-0 md:w-56'
      )}
    >
      {/* Fixed inner width so the contents don't reflow while the desktop panel animates shut. */}
      <div className="border-border flex h-full w-56 flex-col border-r">
        {/* THE RAIL'S OWN TOP ROW IS EXACTLY RACK_HEADER_H, matching the content header opposite
            it. Three things live in that band across the top of the shell — this row, the content
            header, and the reopen control that appears where the rail was — and any disagreement
            between them shows as a step in the top edge. run-trading hit precisely that (its
            constant said 3.25rem while the sidebar row was h-16, 12px out) which is why the height
            is one shared value here rather than three hand-typed ones. */}
        <div
          className="flex shrink-0 items-center justify-between pr-2 pl-4"
          style={{ height: RACK_HEADER_H }}
        >
          <span className="text-caption text-muted uppercase">Sections</span>
          <IconButton name="collapse" label="Collapse sections" onClick={onToggle} />
        </div>

        <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-3 pb-6">
        {GROUPS.map(({ group, titles }) => (
          <div key={group} className="mb-6">
            <p className="text-caption text-muted px-2 pb-1.5 uppercase">{group}</p>
            <ul>
              {titles.map((t) => {
                const id = slug(t);
                const on = active === id;
                return (
                  <li key={t}>
                    <button
                      onClick={() => {
                        scrollRef.current
                          ?.querySelector(`#${id}`)
                          ?.scrollIntoView({ block: 'start' });
                        onNavigate();
                      }}
                      aria-current={on ? 'true' : undefined}
                      className={cn(
                        'text-small w-full truncate rounded-sm px-2 py-1 text-left transition-colors',
                        on ? 'bg-surface text-text font-medium' : 'text-muted hover:text-text'
                      )}
                    >
                      {t}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        </div>
      </div>
    </aside>
  );
}

function Rack() {
  const [compare, setCompare] = useState(false);
  const { collapsed, ready, toggle, closeIfOverlay } = useCollapsibleNav();
  const scrollRef = useRef<HTMLElement>(null);

  return (
    /* THE RAIL IS A SIBLING OF THE CONTENT COLUMN, NOT A CHILD BELOW A FULL-WIDTH HEADER.
     *
     * This is the structure of run-trading's AppShell, read off the running /sessions page rather
     * than guessed, and it is what makes the rail reach the top of the window:
     *
     *   div.flex.h-dvh.overflow-hidden
     *     aside                       t:0  l:0    h:full     ← starts at the very top
     *     div.flex-col                t:0  l:224
     *       header                    t:0         h:64       ← lives INSIDE the content column
     *       main.overflow-y-auto      t:64                   ← the only scroller
     *
     * The previous version put the header above the whole row, which pushed the rail down by its
     * height and ran the header across the top of it. Two consequences beyond the look: the header
     * spanned the rail it was supposed to sit beside, and the scroll container started at the top
     * of the window, so the scrollbar travelled across the title band instead of beginning under
     * it. */
    <div className="flex h-dvh overflow-hidden">
      {/* Scrim: mobile only, while the rail is open. Always mounted rather than conditionally
          rendered, so it fades in step with the panel's slide instead of popping on close once
          the slide itself is smooth. Ported from run-trading's identical control. */}
      <div
        aria-hidden
        onClick={toggle}
        className={cn(
          'bg-text/40 fixed inset-0 z-30 transition-opacity duration-300 md:hidden',
          collapsed ? 'pointer-events-none opacity-0' : 'opacity-100'
        )}
      />

      <SectionNav
        scrollRef={scrollRef}
        collapsed={collapsed}
        ready={ready}
        onToggle={toggle}
        onNavigate={closeIfOverlay}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <header
          className="border-border bg-bg relative z-20 flex shrink-0 items-center gap-3 border-b px-4"
          style={{ height: RACK_HEADER_H }}
        >
          {/* Reopen control: only while the rail is hidden, and only once we know whether we are
              on mobile or desktop (see `ready`), so it does not flash in ahead of the rail's own
              resolved state. Sits in the same band as the rail's header row opposite it. */}
          {collapsed && ready ? (
            <IconButton name="menu" label="Open sections" onClick={toggle} />
          ) : null}

          <h1 className="text-h3">Kitchen sink</h1>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Button
              size="sm"
              variant={compare ? 'primary' : 'secondary'}
              onClick={() => setCompare((c) => !c)}
            >
              Compare light / dark
            </Button>
            {/* The app's real toggle, rendered here rather than floating over the corner. In
                compare mode it is hidden: with both themes on screen at once there is no single
                current theme for it to represent, and the two panes force their own class locally
                and would ignore it anyway. */}
            {!compare ? <ThemeToggle /> : null}
          </div>
        </header>

        {/* THE SCROLLER, and it is a SIBLING BELOW THE HEADER rather than the whole pane. That is
            the difference between a scrollbar running the full height of the window and one that
            starts under the title band — the latter being right, because the header is not part
            of what scrolls. */}
        <main
          ref={scrollRef}
          className={cn(
            'scroll-thin flex min-h-0 flex-1 overflow-y-auto',
            compare && 'divide-border divide-x'
          )}
        >
          {(compare ? (['light', 'dark'] as const) : (['ambient'] as const)).map(
            (mode, paneIndex) => (
              <AnchorCtx.Provider key={mode} value={paneIndex === 0}>
                {/* `ambient` takes no class of its own: it inherits whatever `.dark` state is on
                    <html> from the header's ThemeToggle. `light` / `dark` in compare mode force
                    the class locally, independent of the document root, which is the only way to
                    show both at once. */}
                <div className={cn('min-w-0 flex-1', mode === 'dark' && 'dark')}>
                  <div className="bg-bg text-text min-h-full">
                    <div className="space-y-12 px-6 py-10 md:px-10">
                      {compare ? <p className="text-caption text-muted">{mode}</p> : null}
                      <Sections />
                    </div>
                  </div>
                </div>
              </AnchorCtx.Provider>
            )
          )}
        </main>
      </div>
    </div>
  );
}

// ── the bad-day fixtures ─────────────────────────────────────────────────────────────────────
// Deliberately hostile, because the friendly version of each is what every demo already shows.
// These used to be behind a Density toggle Luke didn't want; the coverage stays, just not as a
// control someone has to understand first — a genuinely long name is simply one of the fixed rows.
const LONG_PLANT =
  'Hydrangea paniculata ‘Limelight’: panicle hydrangea, the tall one nobody measured before planting it under the kitchen window';
const LONG_ERR =
  'We found your address but Columbia County returned no parcel for it, so there is no property line to measure from. You can still design on the aerial photo, and you can trace the boundary yourself: but every quantity will rest on that tracing until you do.';

function Sections() {
  const [view, setView] = useState<ProjectView>('Plan');
  const [tool, setTool] = useState<IconName>('draw');
  const [gate, setGate] = useState(false);

  return (
    <>
      {/* ── Controls ─────────────────────────────────────────────────────────────────────── */}
      <Section
        title="Button"
        note="Three variants, three sizes. `loading` disables and swaps the label, so no async action fires twice from a double click."
      >
        <Line label="variants">
          <Button variant="primary">Get my base plan</Button>
          <Button variant="secondary">Looks right</Button>
          <Button variant="ghost">Skip</Button>
        </Line>
        <Line label="sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Line>
        <Line label="disabled">
          <Button disabled>Primary</Button>
          <Button variant="secondary" disabled>
            Secondary
          </Button>
          <Button variant="ghost" disabled>
            Ghost
          </Button>
        </Line>
        <Line label="loading">
          <Button loading>Generating</Button>
          <Button variant="secondary" loading>
            Fetching parcel
          </Button>
        </Line>
        <Line label="long label">
          <Button>{LONG_PLANT}</Button>
        </Line>
      </Section>

      <Section
        title="IconButton"
        note="`label` is a REQUIRED prop, which is the whole reason this component exists. The recon found unlabelled icon toolbars in both GrowVeg and Arcadium: unusable by screen reader, and a real defect rather than a style. Targets are 40px because this runs outdoors, one-handed."
      >
        <Line label="default">
          <IconButton name="select" label="Select" />
          <IconButton name="pan" label="Pan" />
          <IconButton name="draw" label="Draw" />
          <IconButton name="erase" label="Erase" />
        </Line>
        <Line label="active">
          <IconButton name="draw" label="Draw" active />
        </Line>
        <Line label="disabled">
          <IconButton name="undo" label="Undo" disabled />
        </Line>
      </Section>

      <Section
        title="ThemeToggle"
        note="The real control, used above in single-pane mode. Also drives `color-scheme`, so native scrollbars and date pickers follow."
      >
        <Line label="default">
          <ThemeToggle />
        </Line>
      </Section>

      {/* ── Inputs ───────────────────────────────────────────────────────────────────────── */}
      <Section
        title="Input"
        note="Empty, filled, disabled, error. The error state must survive text longer than the field."
      >
        <Line label="empty">
          <Input placeholder="123 Main St, Portage WI" />
        </Line>
        <Line label="filled">
          <Input defaultValue="1042 Cook St, Portage WI 53901" />
        </Line>
        <Line label="disabled">
          <Input defaultValue="Locked while fetching" disabled />
        </Line>
        <Line label="error">
          <div className="w-full max-w-md">
            <Input defaultValue="not an address" aria-invalid />
            <p className="text-small text-danger mt-1.5">That address could not be found.</p>
          </div>
        </Line>
      </Section>

      <Section
        title="Textarea"
        note="Same states as Input, because these are one object at two heights."
      >
        <Line label="empty">
          <Textarea placeholder="What should this area feel like?" />
        </Line>
        <Line label="filled">
          <Textarea defaultValue="Flagstone patio, warmer tone, low plantings along the left edge." />
        </Line>
        <Line label="disabled">
          <Textarea defaultValue="Locked while generating" disabled />
        </Line>
      </Section>

      {/* ── Canvas mode ──────────────────────────────────────────────────────────────────── */}
      <Section
        title="PromptBar"
        note="Adapted from Recraft: a floating compound input carrying its parameters as inline chips rather than in a settings panel. Two changes: the allowance sits on the bar before you spend, and the standing notice is part of the component because 'illustration, not a plan' is the reason this product is not a render app."
      >
        <Line label="default">
          <PromptBar
            remaining={3}
            chips={
              <>
                <PromptChip label="Material" value="Flagstone" />
                <PromptChip label="Look" value="Warm" />
                <PromptChip label="Season" value="Summer" />
              </>
            }
          />
        </Line>
        <Line label="busy">
          <PromptBar busy remaining={2} chips={<PromptChip label="Material" value="Pavers" />} />
        </Line>
        <Line label="allowance spent">
          <PromptBar remaining={0} chips={<PromptChip label="Material" />} />
        </Line>
      </Section>

      <Section
        title="ToolRail"
        note="Slim, vertical, over a photograph. Carries its own ground rather than floating as bare ink on the image: the contrast case that is easy to miss, because it looks fine over whatever screenshot you developed against."
      >
        <Line label="default">
          <ToolRail
            active={tool}
            onSelect={setTool}
            tools={[
              { name: 'select', label: 'Select' },
              { name: 'pan', label: 'Pan' },
              { name: 'draw', label: 'Draw an area' },
              { name: 'erase', label: 'Erase' },
              { name: 'measure', label: 'Measure' },
              { name: 'upload', label: 'Add a photo' },
            ]}
          />
        </Line>
      </Section>

      <Section
        title="ScaleBar · DimensionReadout"
        note="The scale bar is the single mark separating a base plan from a picture of a house. The readout distinguishes a dragged estimate from a typed measurement, because one of those is what you buy materials against."
      >
        <Line label="scale">
          <ScaleBar feet={20} widthPx={96} />
          <ScaleBar feet={10} widthPx={64} />
        </Line>
        <Line label="dimension">
          <DimensionReadout value={'12′ 4″'} />
          <DimensionReadout value={'12′ 0″'} confirmed />
        </Line>
      </Section>

      {/* ── Document mode ────────────────────────────────────────────────────────────────── */}
      <Section
        title="FactRow"
        note="The site screen is made of these. Merlin's authority comes from being checkable, so every derived fact names its source and its confidence. Three states, and they are genuinely different: modelled, derived, confirmed."
      >
        <Card className="p-0 px-6">
          <FactRow
            label="Lot size"
            value="0.72 acres"
            confidence="derived"
            source="Columbia County"
            hint="County records agree: 0.72"
          />
          <FactRow
            label="Hardiness zone"
            value="5a"
            hint="Which plants survive your winters"
            confidence="derived"
            source="USDA"
          />
          <FactRow
            label="Slope"
            value="1°, facing south"
            hint="Nearly flat"
            confidence="derived"
            source="USGS 3DEP"
          />
          <FactRow
            label="Sun in July"
            value="159 kWh/kW"
            hint="Modelled from building and tree shadows, not a light meter"
            confidence="modelled"
            source="Google Solar"
          />
          <FactRow
            label="Excavation depth"
            value={'8″'}
            confidence="confirmed"
            source="you, from a test hole"
          />
          <FactRow
            label="Where water collects"
            value="Not set"
            hint="Only you know this one"
            confidence="derived"
            action={
              <Button size="sm" variant="secondary">
                Mark it
              </Button>
            }
          />
        </Card>
      </Section>

      <Section
        title="QuantityRow"
        note="The shopping list. Waste is inside the number, not in a column, and the reason is a half-sentence only where the number would otherwise surprise someone. The Overage and Basis columns this replaced read as contractor information rather than homeowner DIY."
      >
        <Card className="p-0 px-6">
          <QuantityRow
            item="Base gravel"
            amount="2.3 cu yd"
            reason={'2.1 plus 10%: you can’t blend a second batch'}
            unconfirmed
          />
          <QuantityRow item="Bedding sand" amount="0.6 cu yd" unconfirmed />
          <QuantityRow item="Flagstone" amount="177 sq ft" reason="168 plus 5% for cuts" />
          <QuantityRow item="Steel edging" amount="57 ft" />
          <QuantityRow item="Echinacea" amount="3" />
        </Card>
      </Section>

      <Section
        title="CallOut"
        note="Peterson's arrow: one pointer at the single thing that decides the outcome. Discipline is ONE per screen: three of these and none of them is an arrow. Every tone ships an icon and a word, never colour alone."
      >
        <Line label="tones">
          <div className="w-full max-w-xl space-y-3">
            <CallOut tone="note">Imagery for this property was captured in April 2026.</CallOut>
            <CallOut
              tone="check"
              action={
                <Button size="sm" variant="secondary">
                  How to check
                </Button>
              }
            >
              Three of these depend on how deep you have to dig. Dig one test hole first.
            </CallOut>
            <CallOut tone="warn">
              This sits downhill of the wet spot you marked. Water will run onto it.
            </CallOut>
            <CallOut tone="stop">Call 811 before any digging. Wait for the marks.</CallOut>
          </div>
        </Line>
      </Section>

      <Section
        title="StepCard · GateCheck"
        note="From iFixit. The reason is a required prop, not a nicety: a DIYer who knows why will adapt to a yard the guide never anticipated. Body is text-body-lg because this is read at arm's length outdoors."
      >
        <Card className="p-0 px-6">
          <StepCard
            number={1}
            title="Call 811 before you dig"
            reason="Struck utilities are your liability, and the marks change where a machine can go."
            warning="Do not skip this. Wait for the marks before any excavation."
          >
            <GateCheck label="Marked and cleared" checked={gate} onChange={setGate} />
          </StepCard>
          <StepCard
            number={2}
            title={'Excavate to 8″'}
            reason={'4″ base + 1″ sand + 2⅜″ stone, plus the extra inch of topsoil you found.'}
            fromTakeoff="168 sq ft, about 3.6 cu yd of spoil to move"
          >
            <GateCheck
              label="Excavation complete"
              checked={false}
              onChange={() => {}}
              disabled={!gate}
            />
          </StepCard>
        </Card>
      </Section>

      {/* ── Structure ────────────────────────────────────────────────────────────────────── */}
      <Section
        title="ViewTabs"
        note="Four views of one model, from GrowVeg. The drawing is truth; the lists are reports on it. These must not read as pages: Look and Plan are the same patio seen two ways, and if the switch reads as navigation the user concludes they are using two tools."
      >
        <Line label="default">
          <div className="w-full max-w-lg">
            <ViewTabs active={view} onChange={setView} />
          </div>
        </Line>
        <Line label="gated">
          <div className="w-full max-w-lg">
            <ViewTabs
              active="Look"
              onChange={() => {}}
              disabled={{
                Takeoff: 'Give the shape a size first',
                Build: 'Give the shape a size first',
              }}
            />
          </div>
        </Line>
      </Section>

      <Section
        title="Card"
        note="Bordered, not shadowed. A field guide has no drop shadows: shadow is reserved for things genuinely floating over the canvas."
      >
        <Line label="default">
          <Card className="max-w-sm">
            <p className="text-h3">Back patio</p>
            <p className="text-small text-muted mt-1">Updated 4 minutes ago</p>
          </Card>
        </Line>
        <Line label="rows">
          <Card className="max-w-sm p-0 px-6">
            <CardRow>
              <p className="text-body">Front bed</p>
            </CardRow>
            <CardRow>
              <p className="text-body">Back patio</p>
            </CardRow>
          </Card>
        </Line>
      </Section>

      {/* ── States ───────────────────────────────────────────────────────────────────────── */}
      <Section
        title="EmptyState"
        note="Names what is missing and offers exactly one action. 'No data' is not an empty state."
      >
        <EmptyState icon="place" title="No property yet" action={<Button>Add your address</Button>}>
          Give us your address and we will pull your lot lines, your house and a scaled aerial from
          public records. You can correct anything we get wrong.
        </EmptyState>
      </Section>

      <Section title="ErrorState" note="Says what happened and what to do next. Never a raw exception.">
        <ErrorState
          title="We couldn't reach the parcel service"
          action={
            <div className="flex gap-2">
              <Button size="sm">Try again</Button>
              <Button size="sm" variant="secondary">
                Trace it myself
              </Button>
            </div>
          }
        >
          {LONG_ERR}
        </ErrorState>
      </Section>

      <Section
        title="NarratedProgress"
        note="A minute of spinner is a minute of doubt. A minute of named sources is the product explaining its method and proving it used the inputs it asked for."
      >
        <Line label="running">
          <NarratedProgress
            steps={[
              { label: 'Found your address', state: 'done' },
              { label: 'Fetched the parcel from Columbia County', state: 'done' },
              { label: 'Fetching aerial imagery', state: 'active' },
              { label: 'Modelling your sun', state: 'waiting' },
            ]}
          />
        </Line>
        <Line label="partial failure">
          <NarratedProgress
            steps={[
              { label: 'Found your address', state: 'done' },
              { label: 'No parcel on record for this address', state: 'failed' },
              { label: 'Fetched aerial imagery', state: 'done' },
              { label: 'Modelled your sun', state: 'done' },
            ]}
          />
        </Line>
      </Section>

      <Section
        title="Skeleton"
        note="The parts that HAVE loaded stay usable. Never a blocking spinner over a whole screen."
      >
        <Line label="default">
          <div className="w-full max-w-sm space-y-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Line>
      </Section>

      {/* ── Bad days: the list from docs/design-system.md §9 ─────────────────────────────── */}
      <Section
        title="A takeoff missing an input"
        note="The row is SHOWN with the missing input named and a way to supply it, never omitted. A quantity that silently disappears is worse than one that says it cannot be computed."
      >
        <Card className="p-0 px-6">
          <QuantityRow item="Flagstone" amount="177 sq ft" reason="168 plus 5% for cuts" />
          <div className="border-border flex items-baseline gap-4 border-b py-3">
            <div className="min-w-0 flex-1">
              <p className="text-body text-text">Base gravel</p>
              <p className="text-small text-warning mt-0.5">
                Needs an excavation depth before this can be worked out.
              </p>
            </div>
            <Button size="sm" variant="secondary">
              Set depth
            </Button>
          </div>
          <QuantityRow item="Steel edging" amount="57 ft" />
        </Card>
      </Section>

      <Section
        title="A guide that failed while the takeoff works"
        note="The spec requires these to be independent. A build guide that will not load must not take the shopping list down with it: the user can still go buy materials."
      >
        <div className="space-y-4">
          <ErrorState
            title="The build guide didn't load"
            action={
              <Button size="sm" variant="secondary">
                Retry
              </Button>
            }
          >
            Your takeoff below is unaffected and still accurate.
          </ErrorState>
          <Card className="p-0 px-6">
            <QuantityRow item="Flagstone" amount="177 sq ft" />
            <QuantityRow item="Steel edging" amount="57 ft" />
          </Card>
        </div>
      </Section>

      <Section
        title="A generation that failed with the drawing kept"
        note="The difference between 'this failed and your work is gone' and 'this failed and your work is where you left it'. For an action that costs money that is the whole difference."
      >
        <div className="space-y-4">
          <ErrorState title="That render didn't finish" action={<Button size="sm">Try again</Button>}>
            Your shape and your description are still here, and this one was not counted against
            today&rsquo;s allowance.
          </ErrorState>
          <PromptBar remaining={3} chips={<PromptChip label="Material" value="Flagstone" />} />
        </div>
      </Section>

      <Section
        title="A property with no parcel"
        note="Wisconsin only, and outside it we return nothing rather than guessing a line. A wrong property line is worse than none, because it would be measured off."
      >
        <CallOut tone="warn" title="No lot lines for this address">
          We have imagery but no property boundary on record. You can design on the photo, and
          trace the boundary yourself when you are ready: until then, anything measured to a
          property line is an estimate.
        </CallOut>
      </Section>

      <Section
        title="The overlong list"
        note="Forty rows at the density a real property reaches after a few seasons. Checks that the row rhythm survives repetition and that nothing depends on a short list, including the one genuinely long name in the run."
      >
        <Card className="p-0 px-6">
          <div className="scroll-thin max-h-80 overflow-y-auto">
            {Array.from({ length: 40 }, (_, i) => (
              <QuantityRow
                key={i}
                item={i % 7 === 0 ? LONG_PLANT : `Fixture item ${i + 1}`}
                amount={`${(i + 1) * 3} ea`}
                unconfirmed={i % 5 === 0}
              />
            ))}
          </div>
        </Card>
      </Section>

      {/* ── Marks ────────────────────────────────────────────────────────────────────────── */}
      <Section
        title="Icon"
        note="EVERY NAME IN THE MAP, generated from ICON_NAMES rather than listed by hand: so a mark added to the wrapper and never shown here is impossible. Stroke is 1.5, checked against plot's own type scale rather than assumed. See the comment in icon.tsx."
      >
        <div className="flex flex-wrap gap-4">
          {ICON_NAMES.map((n) => (
            <div key={n} className="flex w-20 flex-col items-center gap-1.5">
              <Icon name={n} size={20} className="text-text" />
              <span className="text-caption text-muted truncate">{n}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Tokens and proofs ────────────────────────────────────────────────────────────── */}
      <Section
        title="Type ramp"
        note="Every piece of text in the product is one of these. If a string is not, either the string is wrong or this table is."
      >
        <div className="space-y-3">
          {(
            [
              ['text-display', 'Plot'],
              ['text-h1', 'Your property'],
              ['text-h2', 'Back patio'],
              ['text-h3', 'What we worked out'],
              ['text-body-lg', 'Excavate to 8 inches. This is the build-guide size.'],
              ['text-body', 'Default body text, at the size most of the app reads.'],
              ['text-small', 'Secondary: the reason under a quantity.'],
              ['text-caption', 'Source lines, review dates, units.'],
            ] as const
          ).map(([token, sample]) => (
            <div key={token} className="border-border flex items-baseline gap-6 border-b pb-3">
              <code className="text-caption text-muted w-28 shrink-0">{token}</code>
              <span className={token}>{sample}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Spacing ramp"
        note="8 is the base rhythm; 4 only for tight internals. Everything is one of these steps: never an arbitrary value, never a half step."
      >
        <div className="space-y-2">
          {([1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24] as const).map((step) => (
            <div key={step} className="flex items-center gap-4">
              <code className="text-caption text-muted w-12 shrink-0">{step}</code>
              <div className="bg-text h-3" style={{ width: step * 4 }} />
              <span className="text-caption text-muted tabular-nums">{step * 4}px</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Ground stack"
        note="Four grounds, warm rather than cool. The stack has to stay legible in both modes: this is where a dark value that was inverted rather than chosen shows up."
      >
        <div className="flex flex-wrap gap-3">
          {(
            [
              ['bg', 'bg-bg'],
              ['surface', 'bg-surface'],
              ['elevated', 'bg-elevated'],
            ] as const
          ).map(([name, cls]) => (
            <div key={name} className={cn('border-border w-40 rounded-md border p-4', cls)}>
              <p className="text-small text-text">{name}</p>
              <p className="text-caption text-muted mt-1">muted on {name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Ink roles"
        note="TWO TIERS, and no more. Metadata attached to an object (a date, a count, a unit, a source) is muted, because nobody reads it as prose. Prose meant to be READ is full-strength ink. Hierarchy below body is carried by size and weight, not by a third grey. With the accent deleted, success/warning/danger are the only chromatic things left."
      >
        <div className="space-y-2">
          {(
            [
              ['text', 'text-text', 'prose, and the primary action'],
              ['muted', 'text-muted', 'metadata: dates, counts, units, labels, sources'],
              ['success', 'text-success', 'a gate passed'],
              ['warning', 'text-warning', 'drainage, crowding, out of zone'],
              ['danger', 'text-danger', 'destructive, and hard stops'],
            ] as const
          ).map(([name, cls, meaning]) => (
            <div key={name} className="flex items-baseline gap-4">
              <code className="text-caption text-muted w-24 shrink-0">{name}</code>
              <span className={cn('text-body', cls)}>The patio is 168 square feet</span>
              <span className="text-caption text-muted">{meaning}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Contrast"
        note="COMPUTED FROM THE LIVE TOKENS, not printed. A displayed table is a claim; this reads getComputedStyle at render and does the WCAG maths, so it cannot say PASS about a value that has since changed. It found three real failures the moment it was written: derived at 3.44, success at 4.34, warning at 4.38, while the phase 3 gate already claimed contrast had been checked."
      >
        <ContrastProof />
      </Section>

      <Section
        title="Chrome over a photograph"
        note="The one ground the system does not choose. Every other surface is a token, so its contrast is a fixed checkable number; this one is whatever the camera saw. It is why chrome over the canvas always carries its own ground rather than sitting as bare ink on the image."
      >
        {/* Arbitrary values, deliberately and allowlisted: this stands in for a PHOTOGRAPH, not a
            design surface. Tokenising it would claim the system owns a colour it does not. */}
        <div className="rounded-md bg-[#e8e4dc] p-4">
          <p className="text-caption mb-2 text-[#4a453d]">
            a sunlit driveway: near-white, where muted ink and a hairline border both disappear
          </p>
          <div className="flex flex-wrap gap-2">
            <ScaleBar feet={20} widthPx={80} />
            <DimensionReadout value={'12′ 0″'} confirmed />
            <ToolRail
              tools={[
                { name: 'select', label: 'Select' },
                { name: 'draw', label: 'Draw an area' },
              ]}
            />
          </div>
        </div>
      </Section>
    </>
  );
}

// ── harness pieces ───────────────────────────────────────────────────────────────────────────

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  const anchored = useContext(AnchorCtx);
  return (
    <section id={anchored ? slug(title) : undefined} className="scroll-mt-6">
      <h2 className="text-h2 text-text">{title}</h2>
      {note ? <p className="text-small text-muted mt-2 max-w-2xl">{note}</p> : null}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

/* THE CONTRAST PROOF, AND IT COMPUTES RATHER THAN PRINTS.
 *
 * A hand-written table saying "muted on surface: 4.95 PASS" is a claim about a value, maintained
 * beside the value, and it drifts the moment either moves. This reads the live custom properties
 * off the pane it is rendered in and does the WCAG 2.x relative-luminance maths, so it reports
 * what is actually on screen — in whichever theme that pane is showing.
 *
 * It earned itself immediately: `derived` was 3.44 on `surface`, `success` 4.34 and `warning` 4.38,
 * all below the 4.5 body floor, at a moment when this file's own phase 3 gate was ticked as
 * "light and dark both defined and contrast-checked". The check had never been run.
 *
 * Reads from a probe element inside this pane, NOT from documentElement: in compare mode the two
 * panes force `.dark` locally, so the root's values would report the same numbers twice.
 */
function ContrastProof() {
  const probeRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<
    { ink: string; onBg: number; onSurface: number; onElevated: number }[]
  >([]);

  useEffect(() => {
    const el = probeRef.current;
    if (!el) return;
    const cs = getComputedStyle(el);
    const read = (name: string) => cs.getPropertyValue(name).trim();

    /* Only hex is used in this system's palette, so a full CSS colour parser would be scope for
     * nothing. If a token is ever expressed another way this returns null and the row reports
     * `n/a` rather than a wrong number.
     *
     * BOTH LENGTHS, AND THAT IS NOT DEFENSIVE PADDING. `getComputedStyle` hands back what the
     * browser stored, not what was authored: `#ffffff` comes out of a custom property as `#fff`.
     * A six-digit-only regex therefore dropped `--color-elevated` and reported every ink as
     * failing against it. Found by this proof on its first render, which is the argument for
     * computing rather than printing in one line. */
    const rgb = (hex: string): [number, number, number] | null => {
      const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
      if (!m) return null;
      const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
      const n = parseInt(h, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const lum = (c: [number, number, number]) => {
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
    };
    const ratio = (a: string, b: string) => {
      const ca = rgb(a);
      const cb = rgb(b);
      if (!ca || !cb) return NaN;
      const [l1, l2] = [lum(ca), lum(cb)].sort((x, y) => y - x);
      return (l1 + 0.05) / (l2 + 0.05);
    };

    const grounds = ['--color-bg', '--color-surface', '--color-elevated'].map(read);
    const inks = ['text', 'muted', 'success', 'warning', 'danger'];
    setRows(
      inks.map((name) => {
        const ink = read(`--color-${name}`);
        const [onBg, onSurface, onElevated] = grounds.map((g) => ratio(ink, g));
        return { ink: name, onBg, onSurface, onElevated };
      })
    );
  }, []);

  const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : 'n/a');

  return (
    <div ref={probeRef}>
      <table className="text-small w-full max-w-lg">
        <thead>
          <tr className="border-border text-caption text-muted border-b text-left">
            <th className="py-2 font-medium">ink</th>
            <th className="py-2 text-right font-medium">bg</th>
            <th className="py-2 text-right font-medium">surface</th>
            <th className="py-2 text-right font-medium">elevated</th>
            <th className="py-2 pl-4 font-medium">AA body</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const worst = Math.min(r.onBg, r.onSurface, r.onElevated);
            const pass = worst >= 4.5;
            return (
              <tr key={r.ink} className="border-border border-b last:border-b-0">
                <td className="text-text py-2">{r.ink}</td>
                <td className="text-muted py-2 text-right tabular-nums">{fmt(r.onBg)}</td>
                <td className="text-muted py-2 text-right tabular-nums">{fmt(r.onSurface)}</td>
                <td className="text-muted py-2 text-right tabular-nums">{fmt(r.onElevated)}</td>
                <td className={cn('py-2 pl-4', pass ? 'text-success' : 'text-danger')}>
                  {pass ? 'pass' : `FAIL ${fmt(worst)}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-small text-text mt-3 max-w-lg">
        The primary action is ink on paper, so it does not appear as a row: it is{' '}
        <span className="tabular-nums">{fmt(rows.find((r) => r.ink === 'text')?.onBg ?? NaN)}</span>{' '}
        against the page, the same figure as body text, and the most legible object on the screen.
      </p>
    </div>
  );
}

/** A labelled row of variants. The label is what makes an adjacency legible as a comparison. */
function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-caption text-muted mb-2 uppercase">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
