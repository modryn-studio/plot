'use client';

// Client so the icons here read the same LucideProvider context the rest of the app does, and the
// measured stroke below is the real one rather than a copy of the intent.

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Inbox, Search, Settings, Trash2, X } from 'lucide-react';
import { Note, Row, Section } from '../_components/section';

const SET = [Settings, Search, Check, X, Trash2, Inbox, ArrowRight];

export function IconsSection() {
  const host = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<{ sizes: string[]; strokes: string[] } | null>(null);

  // The point of a shared provider is that every mark agrees. Reading it back off the rendered
  // SVGs is the only way to know that it did, rather than that it was supposed to.
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const svgs = Array.from(node.querySelectorAll('svg'));
    setMeasured({
      sizes: [...new Set(svgs.map((s) => String(Math.round(s.getBoundingClientRect().width))))],
      strokes: [...new Set(svgs.map((s) => getComputedStyle(s).strokeWidth))],
    });
  }, []);

  return (
    <Section
      id="icons"
      title="Icons"
      intro="One set, one size, one stroke, and all three are the default rather than a convention. Every icon below is written as a bare component with no size and no strokeWidth: the values come from the provider in the root layout, so a call site cannot drift from the system by forgetting something."
    >
      <Row label="The set at rest" note="no props at any call site">
        <div ref={host} className="flex flex-wrap items-center gap-6">
          {SET.map((Mark, i) => (
            <Mark key={i} />
          ))}
        </div>
        {measured && (
          <Note tone={measured.sizes.length === 1 && measured.strokes.length === 1 ? 'muted' : 'danger'}>
            {measured.sizes.length === 1 && measured.strokes.length === 1
              ? `Every mark renders at ${measured.sizes[0]}px with a ${measured.strokes[0]} stroke.`
              : `Drift: ${measured.sizes.length} sizes (${measured.sizes.join(', ')}) and ${measured.strokes.length} stroke widths (${measured.strokes.join(', ')}) in one row. They should all agree.`}
          </Note>
        )}
      </Row>

      <Row label="Why the number is declared once" note="the failure this prevents">
        <div className="flex flex-wrap items-center gap-6">
          <Settings strokeWidth={1.3} />
          <Settings strokeWidth={1.6} />
          <Settings strokeWidth={1.8} />
          <Settings strokeWidth={2} />
        </div>
        <Note>
          The same mark at four stroke weights, which is roughly the spread a real sidebar shipped
          with before its icons were consolidated: a 50% variance in painted pixels. Individually
          each looks fine. Side by side they look like drawings by four different people, and that
          is what an inconsistent set actually reads as. Never pass strokeWidth at a call site;
          change it in ui/icon.tsx and the whole app moves together.
        </Note>
      </Row>

      <Row label="One size per CONTEXT, not one size everywhere" note="deliberate overrides">
        <div className="flex flex-wrap items-end gap-6">
          <Inbox />
          <Inbox size={24} />
          <Inbox size={32} />
        </div>
        <Note>
          The default pairs with body text. An empty state&apos;s mark or a hero glyph is a different
          context and may override the size, but never the stroke: size is what a context legitimately
          changes, weight is what has to hold across the set.
        </Note>
      </Row>
    </Section>
  );
}
