import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        /* text-body0 for the same iOS-zoom reason as Input. No stated height here: that rule is for
           SINGLE-LINE controls which have to sit level with a button. A textarea is sized by rows,
           so padding plus line-height is the correct mechanism; what must not vary is the
           horizontal padding, which matches Input so the two align in a stacked form. */
        /* `bg-elevated`, NOT `bg-transparent` (2026-08-20). This was the one control in the system with
         no ground of its own, so it showed whatever was behind it: on the kitchen sink's own page a
         Textarea rendered grey while the Input directly above it rendered white, and the two read as
         two different KINDS of control rather than as one class in two shapes. Found by adjacency in
         the rack, which is the only way this is ever found - alone on a white card it looked fine.
         `elevated` is the same ground Input, Card and the secondary Button already take, so a
         stacked form now agrees with itself. */
        'border-border bg-elevated placeholder:text-muted focus:border-accent aria-invalid:border-danger w-full resize-none rounded-md border px-4 py-3 text-body0 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
