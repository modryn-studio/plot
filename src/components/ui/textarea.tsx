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
        // Same contract as Input — these are one object at two heights, so any state Input has
        // and this does not is a place the pair can drift unnoticed. See input.tsx for why the
        // edge is `border-strong` and why the local focus ring was removed.
        'border-border-strong placeholder:text-muted text-body w-full resize-none rounded-sm border bg-transparent px-4 py-3',
        'transition-colors duration-100 ease-out focus:border-text',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
