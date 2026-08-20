'use client';

// Client for the whole section: Tooltip clones its child to attach aria-describedby, so the
// trigger has to be a real element in the same graph rather than an already-rendered server payload.

import { Bold, Copy, Italic, Plus, Settings, Strikethrough, Trash2, Underline } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { Tooltip } from '@/components/ui/tooltip';
import { Note, Row, Section } from '../_components/section';

export function ControlsSection() {
  return (
    <Section
      id="controls"
      title="Icon button and tooltip"
      intro="The second hit shape. A labelled control is a rounded rectangle and is a place to go; an icon-only control is a circle and acts on the surface it sits in. Keeping the two visually distinct is why the sidebar's collapse control never reads as another destination in the nav below it."
    >
      <Row
        label="Icon button"
        note="hover to find the border, hold the mouse down to see it push in"
      >
        <div className="flex flex-wrap items-center gap-4">
          <IconButton aria-label="Settings">
            <Settings />
          </IconButton>
          <IconButton aria-label="Copy">
            <Copy />
          </IconButton>
          <IconButton aria-label="Add">
            <Plus />
          </IconButton>
          <IconButton aria-label="Delete" disabled>
            <Trash2 />
          </IconButton>
        </div>
        <Note>
          Rest is bare: no border, no ground, no shadow. Hover gains the exact border a secondary
          Button shows at rest (border-border) plus the elevated ground - never a DROP shadow,
          because only Card floats in this system. Press drops the ground toward the page and adds
          the INSET shadow, the same press every other button makes. The last one is disabled. Tab
          through them to see the one focus ring the whole app uses.
        </Note>
      </Row>

      <Row label="Tooltip" note="hover it, then tab to it: both must work">
        <div className="flex flex-wrap items-center gap-8">
          <Tooltip label="Settings">
            <IconButton aria-label="Settings">
              <Settings />
            </IconButton>
          </Tooltip>
          <Tooltip label="Collapse sidebar" shortcut="[">
            <IconButton aria-label="Collapse sidebar">
              <Copy />
            </IconButton>
          </Tooltip>
        </div>
        <Note>
          A shortcut is taught here and never by the native title attribute, which waits about a
          second, never fires on keyboard focus at all, and cannot be styled. The people most likely
          to want a shortcut are the ones driving by keyboard, and title is the one way to guarantee
          they never see it.
        </Note>
      </Row>

      <Row
        label="Tooltip timing"
        note="sweep the cursor across all four without stopping, then pause on one"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Tooltip label="Bold" shortcut="B">
            <IconButton aria-label="Bold">
              <Bold />
            </IconButton>
          </Tooltip>
          <Tooltip label="Italic" shortcut="I">
            <IconButton aria-label="Italic">
              <Italic />
            </IconButton>
          </Tooltip>
          <Tooltip label="Underline" shortcut="U">
            <IconButton aria-label="Underline">
              <Underline />
            </IconButton>
          </Tooltip>
          <Tooltip label="Strikethrough" shortcut="S">
            <IconButton aria-label="Strikethrough">
              <Strikethrough />
            </IconButton>
          </Tooltip>
        </div>
        <Note>
          Three timings, one component. A sweep across the row stays silent, because a cursor in
          transit is not a question and hover alone should not answer one. A pause opens after a
          beat. Then the row goes live: with one already seen, the next opens instantly and without
          the fade, since re-imposing the wait at every stop reads as the interface lagging. Tab
          into the row instead and there is no wait at any point, because nobody focuses a control
          by accident, so the noise the delay exists to suppress cannot happen from a keyboard.
        </Note>
      </Row>

      <Row label="Tooltip at the edges" note="the bad-day case: clipping and overflow">
        <div className="flex items-center justify-between">
          <Tooltip label="Hard against the left edge" shortcut="[">
            <IconButton aria-label="Left edge">
              <Plus />
            </IconButton>
          </Tooltip>
          <Tooltip label="Hard against the right edge" shortcut="]">
            <IconButton aria-label="Right edge">
              <Plus />
            </IconButton>
          </Tooltip>
        </div>
        <Note>
          Both stay on screen. The tooltip clamps itself to the viewport rather than exposing an
          alignment prop, because a prop pushes the decision onto whoever adds the next control near
          an edge, and they will not notice. It also renders in a portal, so a clipping ancestor
          (the sidebar has one, by necessity) cannot cut it in half.
        </Note>
      </Row>
    </Section>
  );
}
