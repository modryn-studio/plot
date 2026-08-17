import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/* A CONTROL (radius-sm, 8px), and the one place a STRONG edge is genuinely required.
 *
 * A button carries a visible text label, so its border is chrome and a subtle edge is right. An
 * input has no label of its own and no fill — the outline IS the control — so it rests on
 * `border-strong` rather than `border`. That is the same split `run-rebuild` arrived at.
 *
 * `outline-none` and the alpha ring are gone: they suppressed the app-wide `:focus-visible`
 * outline, which is the one thing standing between a gloved user in sunlight and a lost caret.
 * A field does not get a rest shadow — it is a well you type into, not an object you push. */
type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        'border-border-strong placeholder:text-muted text-body h-12 w-full rounded-sm border bg-transparent px-4',
        'transition-colors duration-100 ease-out focus:border-text',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';
