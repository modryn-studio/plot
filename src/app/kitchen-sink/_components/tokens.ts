/* The token inventory the sink renders.
 *
 * PLAIN MODULE, NO 'use client' AT THE TOP — both server sections and client islands import
 * these. An export of a 'use client' module becomes a client reference when a Server Component
 * imports it, and a plain string arrives as an opaque object (see CLAUDE.md).
 *
 * EVERY CLASS BELOW IS A LITERAL STRING ON PURPOSE. Tailwind finds classes by scanning source
 * text, so a composed `bg-${role}` generates no CSS and the swatch renders empty — which would
 * make this page lie about the exact thing it exists to prove. Writing them out also puts them
 * in front of `tailwindcss/no-custom-classname`, so a role listed here whose token does not
 * exist is a lint error rather than a blank square nobody notices.
 *
 * Keep in sync with the @theme block in src/app/globals.css. Adding a token there and not here
 * means the sink stops being the full inventory, which is the one way this page can go wrong.
 */

export type ColorRole = { name: string; swatch: string; use: string };

export const COLOR_ROLES: ColorRole[] = [
  { name: 'bg', swatch: 'bg-bg', use: 'page background' },
  { name: 'surface', swatch: 'bg-surface', use: 'panels, cards' },
  { name: 'elevated', swatch: 'bg-elevated', use: 'raised cards, popovers, modals' },
  { name: 'border', swatch: 'bg-border', use: 'the edge of a control that carries a label or placeholder' },
  { name: 'field', swatch: 'bg-field', use: 'the edge of a control with nothing inside it to identify it (CodeInput) - the only border held to 3:1' },
  { name: 'text', swatch: 'bg-text', use: 'body text' },
  { name: 'muted', swatch: 'bg-muted', use: 'secondary text, placeholders' },
  { name: 'accent', swatch: 'bg-accent', use: 'brand, primary CTA' },
  { name: 'accent-foreground', swatch: 'bg-accent-foreground', use: 'text on accent' },
  { name: 'accent-hover', swatch: 'bg-accent-hover', use: 'primary button hover (derived)' },
  { name: 'accent-active', swatch: 'bg-accent-active', use: 'primary button press, one step beyond hover (derived)' },
  { name: 'border-strong', swatch: 'bg-border-strong', use: 'the border a hover moves to (derived)' },
  { name: 'selected', swatch: 'bg-selected', use: 'a nav row that is active OR hovered - one ground for both (derived, per-mode %)' },
  { name: 'pressed', swatch: 'bg-pressed', use: 'any button-class control pushed in (derived)' },
  { name: 'rule', swatch: 'bg-rule', use: 'a line between two rows - quieter than border on purpose' },
  { name: 'success', swatch: 'bg-success', use: 'confirmation' },
  { name: 'warning', swatch: 'bg-warning', use: 'caution' },
  { name: 'danger', swatch: 'bg-danger', use: 'destructive, error' },
];

/* Pairs that have to survive a recolour, with the WCAG 2.2 AA threshold each one is judged
 * against: 4.5 for body text, 3 for large text and for non-text UI boundaries.
 *
 * Measured on a RENDERED probe rather than on the custom property, for two reasons. A custom
 * property is an unparsed token stream, so `--color-accent-foreground` reads back as the literal
 * text `contrast-color(var(--color-accent))` and cannot be measured. And a probe proves the
 * utility class exists at all, which reading the variable does not.
 */
export type ContrastPair = { label: string; probe: string; threshold: number; note?: string };

export const CONTRAST_PAIRS: ContrastPair[] = [
  { label: 'text on bg', probe: 'text-text bg-bg', threshold: 4.5 },
  { label: 'text on surface', probe: 'text-text bg-surface', threshold: 4.5 },
  { label: 'text on elevated', probe: 'text-text bg-elevated', threshold: 4.5 },
  { label: 'muted on bg', probe: 'text-muted bg-bg', threshold: 4.5, note: 'the one that usually fails' },
  { label: 'muted on surface', probe: 'text-muted bg-surface', threshold: 4.5 },
  { label: 'accent-foreground on accent', probe: 'text-accent-foreground bg-accent', threshold: 4.5, note: 'the label on every primary button - this token IS --color-elevated, so it reverses by mode for free' },
  { label: 'accent on bg', probe: 'text-accent bg-bg', threshold: 4.5, note: 'links and inline accent text' },
  { label: 'accent-foreground on accent-hover', probe: 'text-accent-foreground bg-accent-hover', threshold: 4.5, note: 'the label must survive the hover' },
  { label: 'accent-foreground on accent-active', probe: 'text-accent-foreground bg-accent-active', threshold: 4.5, note: 'the tightest pair in the system - a dark-mode label reading elevated is itself dark, so darkening the fill further COSTS contrast' },
  { label: 'border-strong on bg', probe: 'text-border-strong bg-bg', threshold: 3, note: 'a hovered edge has to be findable' },
  { label: 'border-strong on elevated', probe: 'text-border-strong bg-elevated', threshold: 3, note: 'the ground a hovered button or card actually sits on' },
  { label: 'muted on pressed', probe: 'text-muted bg-pressed', threshold: 4.5, note: 'a pressed icon glyph on touch, where :hover never applied' },
  { label: 'rule on elevated', probe: 'text-rule bg-elevated', threshold: 3, note: 'deliberately quieter than border - not held to the 3:1 non-text bar, it only separates' },
  { label: 'success on bg', probe: 'text-success bg-bg', threshold: 4.5 },
  { label: 'warning on bg', probe: 'text-warning bg-bg', threshold: 4.5, note: 'amber on light is the usual miss' },
  { label: 'danger on bg', probe: 'text-danger bg-bg', threshold: 4.5 },
  { label: 'border on bg', probe: 'text-border bg-bg', threshold: 3, note: 'non-text boundary, 3:1' },
  { label: 'border on elevated', probe: 'text-border bg-elevated', threshold: 3, note: 'a labelled field or a card sits HERE, not on bg. Reads BELOW the line and that is accepted, not missed: something inside these controls already identifies them, so the edge is free to be faint at rest and jump on focus' },
  { label: 'field on elevated', probe: 'text-field bg-elevated', threshold: 3, note: 'the pair above, held to the bar instead of exempted from it. A CodeInput box has no label and no placeholder, so the outline IS the control - the case SC 1.4.11 names, and the one border in the system that must clear 3:1' },
  { label: 'field on bg', probe: 'text-field bg-bg', threshold: 3, note: 'the same box on the page rather than on a card' },
];

/* THE TYPE SCALE, AS A MATRIX. `sample` is deliberately a real phrase: a step is wrong in a way
 * you can see in language and cannot see in the word "Aa".
 *
 * `name` MUST be the token suffix, not a friendly label. TypeMetrics looks up
 * `--text-${name}` on :root to compare what the token DECLARES against what the browser
 * RENDERED, so a display name here would report every row as a missing token.
 *
 * `group` bands the rows by role. With 27 roles across 8 sizes, an undifferentiated list is
 * unreadable, and the bands are the thing being documented: the point of this scale is that a
 * size and a role are separate choices. */
export type TypeStep = { name: string; cls: string; sample: string; group: string };

export const TYPE_STEPS: TypeStep[] = [
  // Titles - always 700. The weight is not in the name because it never varies.
  { name: 'title0', cls: 'text-title0', sample: 'Know your property', group: 'Titles' },
  { name: 'title1', cls: 'text-title1', sample: 'Before you build on it', group: 'Titles' },
  { name: 'title2', cls: 'text-title2', sample: 'What this section covers', group: 'Titles' },
  { name: 'title3', cls: 'text-title3', sample: 'A smaller heading, still a heading', group: 'Titles' },
  { name: 'title4', cls: 'text-title4', sample: 'The heading on a card', group: 'Titles' },
  { name: 'title5', cls: 'text-title5', sample: 'A heading at body size', group: 'Titles' },
  { name: 'title6', cls: 'text-title6', sample: 'The smallest heading', group: 'Titles' },

  // Numeric - readouts. Always paired with tabular-nums at the call site.
  { name: 'numeric1', cls: 'text-numeric1', sample: '1,240 sq ft', group: 'Numeric' },
  { name: 'numeric2', cls: 'text-numeric2', sample: '14 bags, 2 pallets', group: 'Numeric' },

  // Subtitles - the middle ramp. Heavier than body, not a heading.
  { name: 'subtitle1', cls: 'text-subtitle1', sample: 'The lead paragraph under a title, one step above body.', group: 'Subtitles' },
  { name: 'subtitle2', cls: 'text-subtitle2', sample: 'A picked-out row title', group: 'Subtitles' },
  { name: 'subtitle3', cls: 'text-subtitle3', sample: 'The label above a field', group: 'Subtitles' },
  { name: 'subtitle4', cls: 'text-subtitle4', sample: 'A table header, or the smallest thing allowed to carry meaning', group: 'Subtitles' },

  // Body - prose, three sizes, each with medium and bold.
  { name: 'body0', cls: 'text-body0', sample: 'The default. Everything that is not a heading, a control or metadata is set at this size.', group: 'Body' },
  { name: 'body0-medium', cls: 'text-body0-medium', sample: 'The same size, picked out without becoming a heading.', group: 'Body' },
  { name: 'body0-bold', cls: 'text-body0-bold', sample: 'The same size again, at full weight.', group: 'Body' },
  { name: 'body1', cls: 'text-body1', sample: 'Help text under a field, secondary detail, a timestamp.', group: 'Body' },
  { name: 'body1-medium', cls: 'text-body1-medium', sample: 'Help text, picked out.', group: 'Body' },
  { name: 'body1-bold', cls: 'text-body1-bold', sample: 'Help text, at full weight.', group: 'Body' },
  { name: 'body2', cls: 'text-body2', sample: 'The dense tier: a legend, a footnote, a value in a packed table.', group: 'Body' },
  { name: 'body2-bold', cls: 'text-body2-bold', sample: 'The dense tier, at full weight.', group: 'Body' },

  // Buttons - 900. The signature ported from onX. Never used outside a control's label.
  { name: 'button1', cls: 'text-button1', sample: 'Continue with email', group: 'Buttons (900)' },
  { name: 'button2', cls: 'text-button2', sample: 'Save this project', group: 'Buttons (900)' },
  { name: 'button3', cls: 'text-button3', sample: 'Undo', group: 'Buttons (900)' },

  // Metadata - 11px. A word that labels something already visible, never a sentence.
  { name: 'metadata1', cls: 'text-metadata1', sample: 'Modelled, not measured', group: 'Metadata (11px)' },
  { name: 'metadata1-medium', cls: 'text-metadata1-medium', sample: 'Zone 5b', group: 'Metadata (11px)' },
  { name: 'metadata1-bold', cls: 'text-metadata1-bold', sample: 'North', group: 'Metadata (11px)' },
];

export const RADIUS_STEPS = [
  { name: 'sm', cls: 'rounded-sm', use: 'inputs, small chips' },
  { name: 'md', cls: 'rounded-md', use: 'the default: buttons, fields, dropdowns' },
  { name: 'lg', cls: 'rounded-lg', use: 'cards, modals, large panels' },
  { name: 'full', cls: 'rounded-full', use: 'avatars and toggles ONLY, never pill-everything' },
];

/* The allowed spacing steps and no others: 4 8 12 16 24 32 40 48 64 80 96px. Rendering them as
 * bars makes the gaps in the scale visible — you can see that there is no 5, no 7, no 9. */
export const SPACING_STEPS = [
  { step: '1', px: 4, cls: 'w-1' },
  { step: '2', px: 8, cls: 'w-2' },
  { step: '3', px: 12, cls: 'w-3' },
  { step: '4', px: 16, cls: 'w-4' },
  { step: '6', px: 24, cls: 'w-6' },
  { step: '8', px: 32, cls: 'w-8' },
  { step: '10', px: 40, cls: 'w-10' },
  { step: '12', px: 48, cls: 'w-12' },
  { step: '16', px: 64, cls: 'w-16' },
  { step: '20', px: 80, cls: 'w-20' },
  { step: '24', px: 96, cls: 'w-24' },
];
