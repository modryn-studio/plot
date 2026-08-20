'use client';

import { LucideProvider } from 'lucide-react';

/* ONE ICON SET, ONE SIZE, ONE STROKE — AND THEY ARE THE DEFAULT, NOT A CONVENTION.
 *
 * Mounted once in the root layout. Every `<Settings />`, `<Inbox />`, `<PanelLeft />` anywhere in
 * the app inherits these, so a call site writes the icon and nothing else. That is the whole point:
 * a rule that lives in a doc and not in the code is a suggestion, and stroke weight is the single
 * most reliable way for a set to drift. Measured on a real project before it was consolidated: one
 * sidebar carried seven inline icons at strokeWidth 1.3 / 1.6 / 1.8 across two viewBoxes, a
 * 1.00px-to-1.50px painted spread. A 50% variance is exactly what makes a set look like unrelated
 * drawings, and no amount of review catches it.
 *
 * WHY A PROVIDER RATHER THAN A WRAPPER COMPONENT. A `<Icon as={Settings} />` wrapper only governs
 * the call sites that remember to use it, which is the same failure one layer up. This governs all
 * of them, including icons rendered from Server Components: lucide marks its base Icon module
 * 'use client', so every icon is a Client Component and renders inside this provider even when a
 * Server Component wrote the element.
 *
 * WHY NO CUSTOM MARKS SHIP HERE. Drawn side by side, a library's shapes and a hand-drawn set's are
 * nearly identical, because a checkmark has one correct form. Owning a set earns itself only when a
 * product needs marks no library ships, and that is unknowable at boilerplate time. A seeded
 * generic set would rot into a second source of truth beside lucide, and half-library/half-custom
 * always reads mismatched. When this project needs its own marks, add them here beside the
 * provider so they inherit the same two numbers.
 *
 * SIZE 18 is the body-text pairing: beside a 16px label a 24px mark reads as an object hung off the
 * left rather than part of the word. A context that genuinely differs (an empty state's mark, a
 * dense table row) overrides at the call site — "one size per CONTEXT", not one size everywhere.
 *
 * STROKE 1.75, one step finer than lucide's 2. Do NOT copy another project's number: 1.5 is right
 * against a 13-14px body face and a hairline border, and reads spindly against this repo's 16px
 * body. Judge it on /kitchen-sink against the real type, and change it HERE when you do.
 */
export function IconProvider({ children }: { children: React.ReactNode }) {
  return (
    <LucideProvider size={18} strokeWidth={1.75}>
      {children}
    </LucideProvider>
  );
}
