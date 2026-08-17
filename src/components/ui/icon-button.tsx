import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from './icon';

/* A SQUARE THAT ACTS ON THE CANVAS RATHER THAN NAVIGATING IT. Tool rail, canvas chrome, the close
 * on a sheet.
 *
 * `label` IS REQUIRED, AND THAT IS THE WHOLE POINT OF THIS COMPONENT EXISTING. An icon-only
 * control with no accessible name is invisible to a screen reader and unlabelled to a hover. The
 * recon found exactly this in both GrowVeg and Arcadium — long runs of `button` with no text and
 * no aria-label, which is why driving Arcadium's editor programmatically was unreliable and why a
 * screen-reader user cannot operate either. Making the prop required means the failure is a type
 * error rather than a review someone has to remember to do.
 *
 * The label doubles as the native tooltip, so hover explains the mark without a tooltip component.
 *
 * TARGETS ARE 40px, NOT 32. This app is used outdoors, one-handed, possibly with gloves. The WCAG
 * 2.2 target minimum is 24 and the comfortable mobile figure is 44; 40 with an 8px gap clears the
 * spirit of both while keeping a rail slim enough to sit over a photograph.
 */
interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  name: IconName;
  /** Required. Becomes the accessible name and the hover tooltip. */
  label: string;
  /** Pressed state for a tool that stays selected — the rail's current tool. */
  active?: boolean;
}

export function IconButton({ name, label, active, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-sm',
        // 100ms, and it animates the press properties only. See button.tsx for why press is an
        // inset rather than a fill flash or a scale.
        'transition duration-100 ease-out',
        'active:bg-pressed active:shadow-press',
        'disabled:pointer-events-none disabled:opacity-40',
        active
          ? // A filled ink chip. This is the active tool in the rail, and with no accent hue in
            // the system a fill is a stronger scan cue than a colour would have been.
            'bg-text text-bg shadow-sm'
          : // Bare at rest: a glyph in a rail is not a raised object until you reach for it.
            'text-muted hover:bg-elevated hover:text-text hover:shadow-sm',
        className
      )}
      {...props}
    >
      <Icon name={name} size={18} />
    </button>
  );
}
