import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        /* bg-ELEVATED, the same raised ground as Card and the secondary Button, rather than
           transparent. Transparent means a field inherits whatever it is dropped on, so the
           same control reads as three different objects across three screens. Stating the
           ground is what makes a field and the button under it look like one system.

           rounded-md, THE SAME RADIUS AS BUTTON. A field and a submit button are both labelled
           rectangles and a form stacks them directly on top of each other, so they share a
           corner. This was rounded-sm for one release and it showed instantly on /login: three
           full-width controls of identical size and two different corner radii, which reads as
           carelessness even when nobody can name it. radius-sm is for smaller insets (chips,
           the code-input boxes), not for anything sitting in a form beside a button.

           h-12 IS STATED, not derived from padding plus line-height. See button.tsx: a derived
           height only happens to agree with the button beside it, and on /login it did not, 46
           against 56. 48 is on the allowed spacing scale and matches Button size="lg" exactly.

           text-body0 IS A HARD FLOOR, NOT A PREFERENCE. Below 16px, iOS Safari zooms the viewport
           when a text field takes focus, and it does not zoom back out. This field was 14px, so
           every project built from this boilerplate shipped that. Two unrelated Modryn projects
           found the same threshold independently before it was ever written down here.

           A FIELD STATES FOCUS THROUGH ITS OWN BORDER, not an added ring. The global outline is
           suppressed for text fields centrally in globals.css, so this cannot wear two
           indicators at once and no future field has to remember to opt out. accent measures
           3.52:1 on the page in light and 5.38:1 in dark, clearing the 3:1 WCAG 2.2 asks of a
           non-text indicator: re-check on /kitchen-sink if the accent is recoloured, because this
           is the only focus affordance the control has.
           aria-invalid comes last so an invalid field reads as invalid even while focused. */
        'border-border bg-elevated placeholder:text-muted focus:border-accent aria-invalid:border-danger h-12 w-full rounded-md border px-4 text-body0 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
