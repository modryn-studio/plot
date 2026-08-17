'use client';

/* THE RACK. Every primitive, every state, both modes, one route.
 *
 * IT IS THE ENFORCEMENT MECHANISM for the system's central rule — if a screen needs a value that
 * isn't in the system, add it to the system first — because a rack of everything makes a new
 * one-off visible immediately: it will not have a home here.
 *
 * IT IS WHERE YOU SEE THE SYSTEM, NOT WHERE YOU DESIGN IT. When something looks wrong here the fix
 * is a token in globals.css, never a patch on this page. This file is a mirror.
 *
 * WHY IT MUST EXIST BEFORE YOU CAN JUDGE: a design system cannot be evaluated one component at a
 * time. A button alone always looks fine; four side by side is what reveals that two of them
 * disagree about a radius, or that `muted` vanishes on `surface`.
 *
 * THE STATES ARE THE POINT, AND SPECIFICALLY THE BAD ONES. Default and hover are what you see
 * every day and are therefore already right. Empty, error, loading, long-text and the overlong
 * list are the bad-day path, and the bad day is the day the user shows up. The Bad days group
 * below is the list from docs/design-system.md §9, rendered rather than described.
 *
 * NO FIXTURE THAT COULD BE MISTAKEN FOR REAL DATA — but note the deliberate exception: the
 * quantities here are the walkthrough's patio, because a takeoff whose numbers are nonsense cannot
 * show whether the tabular-nums alignment works.
 */

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { Card, Row as CardRow } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
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
import {
  EmptyState,
  ErrorState,
  NarratedProgress,
  Skeleton,
} from '@/components/ui/feedback';

// ── the bad-day fixtures ─────────────────────────────────────────────────────────────────────
// Deliberately hostile, because the friendly version of each is what every demo already shows.
const SHORT_PLANT = 'Echinacea';
const LONG_PLANT =
  'Hydrangea paniculata ‘Limelight’: panicle hydrangea, the tall one nobody measured before planting it under the kitchen window';
const SHORT_ERR = 'That address could not be found.';
const LONG_ERR =
  'We found your address but Columbia County returned no parcel for it, so there is no property line to measure from. You can still design on the aerial photo, and you can trace the boundary yourself: but every quantity will rest on that tracing until you do.';

type Density = 'normal' | 'long';
type ThemeMode = 'light' | 'dark' | 'both';
const WIDTHS = [375, 768, 1280, 1920] as const;
type Width = (typeof WIDTHS)[number];

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
    titles: ['Type ramp', 'Spacing ramp', 'Ground stack', 'Ink roles', 'Contrast'],
  },
];

/* ONLY THE FIRST PANE CARRIES THE ANCHOR IDS. In `both` mode every section renders twice, and two
 * elements with one id is a broken document. The panes scroll together at the same offsets, so
 * anchoring the first also aligns the second. */
const AnchorCtx = createContext(true);

function SectionNav({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
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
    <nav
      aria-label="Sections"
      className="scroll-thin border-border hidden w-56 shrink-0 overflow-y-auto border-r py-6 pr-4 pl-3 lg:block"
    >
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
    </nav>
  );
}

function Rack() {
  const [theme, setTheme] = useState<ThemeMode>('both');
  const [width, setWidth] = useState<Width>(1280);
  const [density, setDensity] = useState<Density>('normal');
  const scrollRef = useRef<HTMLDivElement>(null);

  const plant = density === 'long' ? LONG_PLANT : SHORT_PLANT;
  const err = density === 'long' ? LONG_ERR : SHORT_ERR;

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="border-border bg-bg shrink-0 border-b">
        {/* `pr-16` clears the app-wide ThemeToggle, which the root layout pins at `fixed top-4
            right-4` and which therefore lands on top of these controls. Found by looking at the
            rendered page rather than by reading it: the Density chips were sitting underneath it
            and "long text" was clipped. */}
        <div className="flex w-full flex-wrap items-center gap-6 px-4 py-3 pr-16">
          <h1 className="text-h3 mr-auto">Kitchen sink</h1>

          <Field label="Theme">
            {(['light', 'dark', 'both'] as const).map((t) => (
              <Chip key={t} on={theme === t} onClick={() => setTheme(t)}>
                {t}
              </Chip>
            ))}
          </Field>

          <Field label="Width">
            {WIDTHS.map((w) => (
              <Chip key={w} on={width === w} onClick={() => setWidth(w)}>
                {w}
              </Chip>
            ))}
          </Field>

          {/* The control that finds truncation bugs. Every string swaps for ~4x the length. */}
          <Field label="Density">
            {(['normal', 'long'] as const).map((d) => (
              <Chip key={d} on={density === d} onClick={() => setDensity(d)}>
                {d === 'long' ? 'long text' : 'normal'}
              </Chip>
            ))}
          </Field>
        </div>
      </header>

      {/* SIDE BY SIDE IS THE MODE THAT FINDS BUGS. Dark values here are per-mode literals rather
          than inversions, so each one can be wrong in exactly one mode. Nobody finds that by
          using the app. */}
      <div className="flex min-h-0 flex-1">
        <SectionNav scrollRef={scrollRef} />
        <div
          ref={scrollRef}
          className={cn(
            'scroll-thin flex min-h-0 flex-1 overflow-y-auto pl-8',
            theme === 'both' && 'divide-border divide-x'
          )}
        >
          {(theme === 'both' ? (['light', 'dark'] as const) : ([theme] as const)).map(
            (mode, paneIndex) => (
              <AnchorCtx.Provider key={mode} value={paneIndex === 0}>
                <div className={cn('min-w-0 flex-1', mode === 'dark' && 'dark')}>
                  <div className="bg-bg text-text min-h-full">
                    <div
                      className="scroll-thin mx-auto overflow-x-auto"
                      style={{ maxWidth: width }}
                    >
                      <div className="space-y-12 px-4 py-10" style={{ width }}>
                        <p className="text-caption text-muted">
                          {mode} · {width}px · {density}
                        </p>
                        <Sections plant={plant} err={err} />
                      </div>
                    </div>
                  </div>
                </div>
              </AnchorCtx.Provider>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ── the sections ─────────────────────────────────────────────────────────────────────────────

function Sections({ plant, err }: { plant: string; err: string }) {
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
          <Button>{plant}</Button>
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

      <Section title="ThemeToggle" note="One control, both modes. Also drives `color-scheme`, so native scrollbars and date pickers follow.">
        <Line label="default">
          <ThemeToggle />
        </Line>
      </Section>

      {/* ── Inputs ───────────────────────────────────────────────────────────────────────── */}
      <Section title="Input" note="Empty, filled, disabled, error. The error state must survive text longer than the field.">
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
            <p className="text-small text-danger mt-1.5">{err}</p>
          </div>
        </Line>
      </Section>

      <Section title="Textarea" note="Same states as Input, because these are one object at two heights.">
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
          <QuantityRow
            item="Flagstone"
            amount="177 sq ft"
            reason="168 plus 5% for cuts"
          />
          <QuantityRow item="Steel edging" amount="57 ft" />
          <QuantityRow item={plant} amount="3" />
        </Card>
      </Section>

      <Section
        title="CallOut"
        note="Peterson's arrow: one pointer at the single thing that decides the outcome. Discipline is ONE per screen: three of these and none of them is an arrow. Every tone ships an icon and a word, never colour alone."
      >
        <Line label="tones">
          <div className="w-full max-w-xl space-y-3">
            <CallOut tone="note">
              Imagery for this property was captured in April 2026.
            </CallOut>
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
            <CallOut tone="stop">
              Call 811 before any digging. Wait for the marks.
            </CallOut>
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

      <Section title="Card" note="Bordered, not shadowed. A field guide has no drop shadows: shadow is reserved for things genuinely floating over the canvas.">
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
      <Section title="EmptyState" note="Names what is missing and offers exactly one action. 'No data' is not an empty state.">
        <EmptyState
          icon="place"
          title="No property yet"
          action={<Button>Add your address</Button>}
        >
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
          {err}
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

      <Section title="Skeleton" note="The parts that HAVE loaded stay usable. Never a blocking spinner over a whole screen.">
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
          <ErrorState
            title="That render didn't finish"
            action={
              <Button size="sm">Try again</Button>
            }
          >
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
        note="Forty rows at the density a real property reaches after a few seasons. Checks that the row rhythm survives repetition and that nothing depends on a short list."
      >
        <Card className="p-0 px-6">
          <div className="scroll-thin max-h-80 overflow-y-auto">
            {Array.from({ length: 40 }, (_, i) => (
              <QuantityRow
                key={i}
                item={i % 7 === 0 ? plant : `Fixture item ${i + 1}`}
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
        note="EVERY NAME IN THE MAP, generated from ICON_NAMES rather than listed by hand: so a mark added to the wrapper and never shown here is impossible. All at stroke 1.5; lucide ships 2, which reads chunky against a 16px body face and a hairline border."
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
      <Section title="Type ramp" note="Every piece of text in the product is one of these. If a string is not, either the string is wrong or this table is.">
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

      <Section title="Spacing ramp" note="8 is the base rhythm; 4 only for tight internals. Everything is one of these steps: never an arbitrary value, never a half step.">
        <div className="space-y-2">
          {([1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24] as const).map((step) => (
            <div key={step} className="flex items-center gap-4">
              <code className="text-caption text-muted w-12 shrink-0">{step}</code>
              <div className="bg-accent h-3" style={{ width: step * 4 }} />
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

      <Section title="Ink roles" note="Colour is reserved for meaning. The photo and the plan are the coloured things; the interface is paper and ink.">
        <div className="space-y-2">
          {(
            [
              ['text', 'text-text', 'body'],
              ['muted', 'text-muted', 'secondary'],
              ['accent', 'text-accent', 'action'],
              ['confirmed', 'text-confirmed', 'the user checked it'],
              ['derived', 'text-derived', 'the app worked it out'],
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
        note="Body ≥ 4.5:1, large ≥ 3:1, both modes. The row that matters most is the last one: chrome over a photograph, where the ground is arbitrary and the token that passes against `bg` can vanish."
      >
        <div className="space-y-3">
          <div className="bg-surface rounded-md p-4">
            <p className="text-body text-text">text on surface</p>
            <p className="text-small text-muted">muted on surface</p>
          </div>
          <div className="bg-accent rounded-md p-4">
            <p className="text-body text-accent-foreground">accent-foreground on accent</p>
          </div>
          {/* The hard case. A stand-in for a sunlit driveway: near-white, which is where muted ink
              and a hairline border both disappear. Chrome over the canvas therefore always carries
              its own ground rather than sitting as bare ink on the image. */}
          <div className="rounded-md bg-[#e8e4dc] p-4">
            <p className="text-caption mb-2 text-[#4a453d]">
              stand-in for a sunlit photograph: chrome must carry its own ground
            </p>
            <div className="flex gap-2">
              <ScaleBar feet={20} widthPx={80} />
              <DimensionReadout value={'12′ 0″'} confirmed />
            </div>
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

/** A labelled row of variants. The label is what makes an adjacency legible as a comparison. */
function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-caption text-muted mb-2 uppercase">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-caption text-muted">{label}</span>
      <div className="flex gap-1">{children}</div>
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        'text-caption rounded-sm px-2 py-1 transition-colors',
        on ? 'bg-accent text-accent-foreground' : 'text-muted hover:text-text'
      )}
    >
      {children}
    </button>
  );
}
