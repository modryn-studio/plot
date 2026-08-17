/* THE ONE PLACE AN ICON'S WEIGHT AND SIZE ARE DECIDED.
 *
 * WHY A WRAPPER AT ALL. Without one, icons arrive from wherever they were needed and each carries
 * its own stroke width and viewBox. A previous Modryn build measured the result: seven inline
 * icons in one sidebar at strokeWidth 1.3 / 1.6 / 1.8 across two viewBoxes, a painted spread of
 * 1.00px to 1.50px. That 50% variance is exactly what makes a set look like a collection of
 * unrelated drawings rather than a family, and no review catches it because each icon is fine on
 * its own.
 *
 * STROKE IS 1.5, NOT LUCIDE'S DEFAULT 2. At a 14px body face with a hairline border, 2 reads
 * chunky and fights the type. Everything here renders through one wrapper so that number is
 * changed in one place, forever.
 *
 * SIZE SCALES THE BOX, NOT THE STROKE, and that is intended: a 24-unit mark drawn at 16px paints
 * a 1.0px stroke. What matters is that two icons at the SAME size agree, which they do because
 * they share a viewBox.
 *
 * ADDING AN ICON: one new entry in MARKS. Never inline an <svg> anywhere else in the app — the
 * moment a second place draws one, the spread starts again.
 *
 * ACCESSIBILITY: an icon alone is decorative and hidden from screen readers. If it is the only
 * content of a control, the CONTROL carries the label — see IconButton, which requires one. The
 * recon found both GrowVeg and Arcadium shipping toolbars of unlabelled icon buttons, which makes
 * the editor unusable by screen reader and was a real defect rather than a style choice.
 */
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  Compass,
  Crosshair,
  Eraser,
  Hand,
  Image as ImageIcon,
  Info,
  Layers,
  MapPin,
  Menu,
  Moon,
  MousePointer2,
  Paperclip,
  Pencil,
  Plus,
  Ruler,
  Send,
  Shovel,
  Sprout,
  Sun,
  TriangleAlert,
  Undo2,
  Upload,
  X,
  ZoomIn,
  type LucideIcon,
} from 'lucide-react';

/* Named for the JOB, not the picture. `warn` rather than `triangle-alert`, so the day the drawing
 * changes, nothing that uses it has to. */
const MARKS = {
  // shell and navigation
  back: ArrowLeft,
  menu: Menu,
  close: X,
  check: Check,
  chevron: ChevronDown,
  next: ChevronRight,
  add: Plus,
  help: CircleHelp,
  moon: Moon,
  sun: Sun,

  // canvas tools
  select: MousePointer2,
  pan: Hand,
  draw: Pencil,
  erase: Eraser,
  upload: Upload,
  camera: Camera,
  zoom: ZoomIn,
  undo: Undo2,
  layers: Layers,
  attach: Paperclip,
  send: Send,
  image: ImageIcon,

  // the property, and the things it knows
  measure: Ruler,
  place: MapPin,
  aspect: Compass,
  sunlight: Sun,
  plant: Sprout,
  dig: Shovel,
  verify: Crosshair,

  // meaning
  info: Info,
  warn: TriangleAlert,
  danger: CircleAlert,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof MARKS;
export const ICON_NAMES = Object.keys(MARKS) as IconName[];

export function Icon({
  name,
  size = 16,
  className,
}: {
  name: IconName;
  /** Paints the box. Stroke stays 1.5 in the 24-unit space, so two icons at one size agree. */
  size?: number;
  className?: string;
}) {
  const Mark = MARKS[name];
  return (
    <Mark
      width={size}
      height={size}
      strokeWidth={1.5}
      className={className}
      // Decorative by default. A control that is icon-only labels itself — see IconButton.
      aria-hidden="true"
      focusable="false"
    />
  );
}
